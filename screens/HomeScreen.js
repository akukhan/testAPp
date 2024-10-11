
import React, { useEffect, useState , useCallback } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

import { useNavigation, useFocusEffect  } from '@react-navigation/native';
import { format, startOfWeek, addDays } from 'date-fns';
import PomodoroTimer from './PomodoroTimer';
import dataService from '../data';

const HomeScreen = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [tasks, setTasks] = useState([]);
  const navigation = useNavigation();
  const currentDate = format(new Date(), 'EEEE, MMMM do, yyyy');

  const fetchData = async () => {
    await dataService.initializeDatabase();
    const fetchedTasks = await dataService.fetchTasks();
    setTasks(fetchedTasks);
    setTotalTasks(fetchedTasks.length);

    // Count completed tasks
    const completed = fetchedTasks.filter((task) => task.status === 'Completed').length;
    setCompletedTasks(completed);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // fetchData();
      const interval = setInterval(() => {
        fetchData(); // Continuously re-fetch data to update task times when switching tabs
      }, 1000);
    }, [])
  );

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.date}>{currentDate}</Text>

        <Text style={styles.title}>Task Summary</Text>

        {/* Summary and stats */}
        <View style={styles.summaryContainer}>
          <Text>Total Tasks: {totalTasks}</Text>
          <Text>Completed: {completedTasks}</Text>
          <Text>Pending: {totalTasks - completedTasks}</Text>
        </View>

        {/* Navigate to ToDo List */}
        <Button title="View Todo List" onPress={() => navigation.navigate('ToDoList')} />

        {/* Pomodoro Timer */}
       
          <PomodoroTimer 
          taskId={selectedTask ? selectedTask.id : null}
          taskTitle={selectedTask ? selectedTask.title : 'No Task Selected'}
           />
      

        <Text style={styles.title}>Your Tasks</Text>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedTask(item)}>
              <View style={styles.card}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskDescription}>{item.description}</Text>
                <Text>Total Time Spent: {formatTime(item.time_spent)}</Text>
              </View>
            </TouchableOpacity>
          )}
          nestedScrollEnabled
          scrollEnabled={false}
        />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button title="Clear Selected Task" onPress={() => setSelectedTask(null)} />
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Soft background color
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginVertical: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    padding: 15,
    backgroundColor: '#f1f1f1',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  button: {
    backgroundColor: '#00BFA6',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  taskDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
});


export default HomeScreen;
