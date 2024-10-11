
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import dataService from '../data';



// Open or create the SQLite database
const initializeDatabase = async (setDb, fetchTasks) => {
  try {
    const database = await SQLite.openDatabaseAsync('tasks.db');
    setDb(database);

    await database.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        title TEXT NOT NULL, 
        description TEXT,
        due_date TEXT, 
        start_time TEXT, 
        end_time TEXT,
        priority TEXT, 
        status TEXT, 
        reminder INTEGER, 
        category TEXT, 
        time_spent INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')), 
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);

    await fetchTasks(database);
  } catch (error) {
    console.error('Error initializing database: ', error);
  }
};

const ToDoList = () => {

  const [showForm, setShowForm] = useState(false); // Control visibility of the form

  const [tasks, setTasks] = useState([]);
  const [db, setDb] = useState(null);
  const [taskInput, setTaskInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');

  const [dueDateInput, setDueDateInput] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [priorityInput, setPriorityInput] = useState('');

  // const [ reminder, setReminder ] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');


  const navigation = useNavigation();

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dueDateInput;
    setShowDatePicker(false);
    setDueDateInput(currentDate.toISOString().split('T')[0]);  // Store the date in YYYY-MM-DD format
  };

  const onChangeStartTime = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setShowStartTimePicker(false);
    setStartTime(currentTime);
  };

  const onChangeEndTime = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    if (currentTime < startTime) {
      alert('End time cannot be earlier than start time');
    } else {
      setEndTime(currentTime);
    }
    setShowEndTimePicker(false);
  };

  useEffect(() => {
    initializeDatabase(setDb, fetchTasks);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const refreshTasks = async () => {
        if (db) {
          await fetchTasks(db);
        }
      };
      refreshTasks();
    }, [db])
  );

  const fetchTasks = async (database) => {
    if (!database) {
      console.error('Database not initialized.');
      return;
    }

    try {
      const allRows = await database.getAllAsync('SELECT * FROM tasks;');
      setTasks(allRows);
    } catch (error) {
      console.error('Error fetching tasks: ', error);
    }
  };

  const addTask = async () => {
    if (!db) {
      console.error('Database not initialized.');
      return;
    }

    if (taskInput.trim() === '') {
      console.error('Task title cannot be empty.');
      return;
    }

    try {
      await db.runAsync(
        'INSERT INTO tasks (title, description, due_date, priority,  start_time, end_time, status, category) VALUES (?, ?, ?, ?,?,?,?,?);',
        [taskInput, descriptionInput, dueDateInput, priorityInput, startTime.toLocaleTimeString('en-US', { hour12: false }), endTime.toLocaleTimeString('en-US', { hour12: false }), status, category]
      );
      setTaskInput('');
      setDescriptionInput('');
      setDueDateInput('');
      setPriorityInput('');
      // setReminder('');
      setStartTime(new Date());
      setEndTime(new Date());
      setStatus('');
      setCategory('');

      await fetchTasks(db);
    } catch (error) {
      console.error('Error adding task: ', error);
    }
  };

  const cancelTask = () => {
    // Reset the form and hide it
    setTaskInput('');
    setDescriptionInput('');
    setDueDateInput('');
    setPriorityInput('');
    setStartTime('');
    setEndTime('');
    setStatus('');
    setCategory('');
    setShowForm(false); // Hide the form when canceling
  };

  const statusOptions = [
    { label: 'Started', value: 'Started', color: '#32cd32' },
    { label: 'Pending', value: 'Pending', color: '#FFA500' },
    { label: 'Cancelled', value: 'Cancelled', color: '#ff6347' },
    { label: 'Ended', value: 'Ended', color: '#1e90ff' },
  ];

  const categoryOptions = [
    { label: 'Work', value: 'Work', color: '#ff6347' },
    { label: 'Home', value: 'Home', color: '#32cd32' },
    { label: 'Personal', value: 'Personal', color: '#1e90ff' },
  ];

  const handleDelete = async (id) => {
    await dataService.deleteTask(id);
    const updatedTasks = await dataService.fetchTasks();
    setTasks(updatedTasks);
  };

  return (
    <View style={styles.container}>

      {/* Button to show the form */}
      {!showForm && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      )}

      {/* Show the form if showForm is true */}

      {showForm && (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Task Title..."
            value={taskInput}
            onChangeText={setTaskInput}
          />

          <TextInput
            style={styles.input}
            placeholder="Task Description..."
            value={descriptionInput}
            onChangeText={setDescriptionInput}
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              style={styles.input}
              placeholder="Due Date (YYYY-MM-DD)..."
              value={dueDateInput}
              // onChangeText={setDueDateInput}
              editable={false}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}

          <RNPickerSelect
            onValueChange={(value) => setPriorityInput(value)}
            items={[
              { label: 'Low', value: 'Low' },
              { label: 'Medium', value: 'Medium' },
              { label: 'High', value: 'High' },
            ]}
            value={priorityInput}
          />


          <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
            <TextInput
              style={styles.input}
              placeholder="Start Time"
              value={startTime instanceof Date ? startTime.toLocaleTimeString('en-US', { hour12: false }) : ''}
              // value={startTime.toLocaleTimeString('en-US', { hour12: false })}
              editable={false}
            />
          </TouchableOpacity>
          {showStartTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display="default"
              is24Hour={true}
              onChange={onChangeStartTime}
            />
          )}

          <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
            <TextInput
              style={styles.input}
              placeholder="End Time"
              value={endTime instanceof Date ? endTime.toLocaleTimeString('en-US', { hour12: false }) : ''}
              // value={endTime.toLocaleTimeString('en-US', { hour12: false })}
              editable={false}
            />
          </TouchableOpacity>
          {showEndTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display="default"
              is24Hour={true}
              onChange={onChangeEndTime}
            />
          )}

          <RNPickerSelect
            onValueChange={(value) => setStatus(value)}
            items={statusOptions}
            value={status} // Explicitly set the value prop to reset
            style={{
              inputAndroid: {
                color: statusOptions.find(option => option.value === status)?.color || 'black',
              },
            }}
          />


          <RNPickerSelect
            onValueChange={(value) => setCategory(value)}
            items={categoryOptions}
            value={category} // Explicitly set the value prop to reset
            style={{
              inputAndroid: {
                color: categoryOptions.find(option => option.value === category)?.color || 'black',
              },
            }}
          />

          <Button title="Add Task" onPress={addTask} />
          <Button title="Cancel" onPress={cancelTask} color="red" />
        </View>
      )}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('SingleToDoList', { taskId: item.id })}>
            <View style={styles.card}>
              {/* Title and Description */}
              <View style={styles.cardHeader}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskDescription}>{item.description}</Text>
              </View>

              {/* Priority in the middle */}
              <View style={styles.middleSection}>
                <Text style={styles.priority}>Priority: {item.priority}</Text>
              </View>

              {/* Created time on the right corner */}
              <Text style={styles.createdTime}>
                Created: {item.created_at}
              </Text>

              {/* Bottom section with Start/End time, Status, and Reminder */}
              <View style={styles.bottomSection}>
                {/* Left side: Start and End time */}
                <View style={styles.timeContainer}>
                  <Text style={styles.startTime}>Start: {item.start_time}</Text>
                  <Text style={styles.endTime}>End: {item.end_time}</Text>
                </View>

                {/* Right side: Status and Reminder */}
                <View style={styles.statusContainer}>
                  <Text style={styles.status}>Status: {item.status}</Text>
                  <Text style={styles.reminder}>
                    Reminder: {item.reminder ? 'On' : 'Off'}
                  </Text>
                </View>
              </View>

              {/* Category */}
              <Text style={styles.category}>Category: {item.category}</Text>
              <Button title="Delete" onPress={() => handleDelete(item.id)} color="#d48e8e" />
            </View>
          </TouchableOpacity>
        )}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addButton: {    
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 0, 
    alignSelf:'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
  },
  task: {
    fontSize: 18,
    marginVertical: 5,
    color: 'blue',
  },
  card: {
    backgroundColor: '#f8f3f3',
    padding: 15,
    marginTop:10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  middleSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  priority: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ff6347', // Example: Red color for priority
  },
  createdTime: {
    position: 'absolute',
    right: 10,
    top: 10,
    fontSize: 12,
    color: '#aaa',
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  timeContainer: {
    flexDirection: 'column',
  },
  startTime: {
    fontSize: 12,
    color: '#333',
  },
  endTime: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
  },
  statusContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
    color: '#32cd32', // Example: Green color for status
  },
  reminder: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
  },
  category: {
    marginTop: 10,
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default ToDoList;
