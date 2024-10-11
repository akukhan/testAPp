import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import dataService from '../data';


const SingleToDoList = ({ route, navigation }) => {
  const { taskId } = route.params;

 // State for holding task information
 const [task, setTask] = useState(null);
 const [taskInput, setTaskInput] = useState('');
 const [descriptionInput, setDescriptionInput] = useState('');
 const [dueDateInput, setDueDateInput] = useState('');
 const [startTime, setStartTime] = useState(null);
 const [endTime, setEndTime] = useState(null);
 const [priorityInput, setPriorityInput] = useState('');
 const [status, setStatus] = useState('');
 const [category, setCategory] = useState('');

 // For DatePicker
 const [showDatePicker, setShowDatePicker] = useState(false);
 const [showStartTimePicker, setShowStartTimePicker] = useState(false);
 const [showEndTimePicker, setShowEndTimePicker] = useState(false);

 useEffect(() => {
  const fetchTask = async () => {
    await dataService.initializeDatabase();
    const fetchedTask = await dataService.fetchTaskById(taskId); 
    if (fetchedTask) {
      setTask(fetchedTask);
      setTaskInput(fetchedTask.title);
      setDescriptionInput(fetchedTask.description);
      setDueDateInput(fetchedTask.due_date);
      setStartTime(fetchedTask.start_time);
      setEndTime(fetchedTask.end_time);
      setPriorityInput(fetchedTask.priority);
      setStatus(fetchedTask.status);
      setCategory(fetchedTask.category);
    }
  };
  fetchTask();
}, [taskId]);

const updateTask = async () => {
  if (!taskInput.trim()) return;

  const updatedData = {
    title: taskInput,
    description: descriptionInput,
    due_date: dueDateInput,
    start_time: startTime,
    end_time: endTime,
    priority: priorityInput,
    status: status,
    category: category
  };
  try {
    await dataService.updateTask(taskId, updatedData); // Use the updateTask method from data.js
    navigation.goBack();
  } catch (error) {
    console.error('Error updating task: ', error);
  }
};


const onChangeDate = (event, selectedDate) => {
  setShowDatePicker(false);
  if (selectedDate) {
    setDueDateInput(selectedDate.toISOString().split('T')[0]); // Set formatted date
  }
};

const onChangeStartTime = (event, selectedTime) => {
  setShowStartTimePicker(false);
  if (selectedTime) {
    setStartTime(selectedTime.toISOString().split('T')[1].substring(0, 5)); // Format time as HH:MM
  }
};

const onChangeEndTime = (event, selectedTime) => {
  setShowEndTimePicker(false);
  if (selectedTime) {
    setEndTime(selectedTime.toISOString().split('T')[1].substring(0, 5)); // Format time as HH:MM
  }
};

return (
  <View style={styles.container}>
    <Text style={styles.title}>Edit Task</Text>

    <TextInput
      style={styles.input}
      placeholder="Task Title"
      value={taskInput}
      onChangeText={setTaskInput}
    />

    <TextInput
      style={styles.input}
      placeholder="Task Description"
      value={descriptionInput}
      onChangeText={setDescriptionInput}
    />

    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
      <TextInput
        style={styles.input}
        placeholder="Due Date (YYYY-MM-DD)"
        value={dueDateInput}
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

    <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
      <TextInput
        style={styles.input}
        placeholder="Start Time (HH:MM)"
        value={startTime}
        editable={false}
      />
    </TouchableOpacity>
    {showStartTimePicker && (
      <DateTimePicker
        value={new Date()}
        mode="time"
        display="default"
        onChange={onChangeStartTime}
      />
    )}

    <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
      <TextInput
        style={styles.input}
        placeholder="End Time (HH:MM)"
        value={endTime}
        editable={false}
      />
    </TouchableOpacity>
    {showEndTimePicker && (
      <DateTimePicker
        value={new Date()}
        mode="time"
        display="default"
        onChange={onChangeEndTime}
      />
    )}

    <RNPickerSelect
      onValueChange={(value) => setPriorityInput(value)}
      items={[
        { label: 'Low', value: 'Low' },
        { label: 'Medium', value: 'Medium' },
        { label: 'High', value: 'High' }
      ]}
      value={priorityInput}
    />

    <RNPickerSelect
      onValueChange={(value) => setStatus(value)}
      items={[
        { label: 'Started', value: 'Started' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Completed', value: 'Completed' }
      ]}
      value={status}
    />

    <RNPickerSelect
      onValueChange={(value) => setCategory(value)}
      items={[
        { label: 'Home', value: 'Home' },
        { label: 'Work', value: 'Work' },
        { label: 'Personal', value: 'Personal' },
      ]}
      value={category}
    />

    <Button title="Update Task" onPress={updateTask} />
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
  },
});

export default SingleToDoList;
