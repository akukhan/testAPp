
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { format, startOfWeek, addDays } from 'date-fns';
import PomodoroTimer from './PomodoroTimer';


const HomeScreen = () => {

  const [selectedTask, setSelectedTask] = useState(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const navigation = useNavigation();
  const currentDate = format(new Date(), 'EEEE, MMMM do, yyyy');
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Task 1', description: 'Description for Task 1' },
    { id: 2, title: 'Task 2', description: 'Description for Task 2' },
    { id: 3, title: 'Task 3', description: 'Description for Task 3' },
  ]);

  useEffect(() => {
    // Fetch stats, these can come from a real API or DB call
    setTotalTasks(10); // Example: Replace with actual logic to count total tasks
    setCompletedTasks(4); // Example: Replace with actual logic for completed tasks
  }, []);

  // Get the start of the week (Monday) and format the days and dates
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
    const date = format(addDays(weekStart, index), 'MMM do');
    return { day, date };
  });



  return (
    <View style={styles.container}>

      {/* lets add the date from mondy to saturday, in short form, just below the day lets add the date */}

      <Text style={styles.date}>{currentDate}</Text>

      {/* Display the days (Mon-Sat) and corresponding dates */}
      <View style={styles.weekContainer}>
        {weekDays.map((item, index) => (
          <View key={index} style={styles.dayContainer}>
            <Text style={styles.weekDay}>{item.day}</Text>
            <Text style={styles.weekDate}>{item.date}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.title}>Task Summary</Text>

      {/* Summary and stats */}
      <View style={styles.summaryContainer}>
        <Text>Total Tasks: {totalTasks}</Text>
        <Text>Completed: {completedTasks}</Text>
        <Text>Pending: {totalTasks - completedTasks}</Text>
      </View>

      {/* Navigate to ToDo List */}
      <Button
        title="View Todo List"
        onPress={() => navigation.navigate('ToDoList')}
      />

      <PomodoroTimer taskTitle={selectedTask ? selectedTask.title : null} />

      <Text style={styles.title}>Your Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedTask(item)}>
            <View style={styles.card}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Button title="Clear Selected Task" onPress={() => setSelectedTask(null)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  dayContainer: {
    alignItems: 'center',
  },
  weekDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  weekDate: {
    fontSize: 14,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
});

export default HomeScreen;
