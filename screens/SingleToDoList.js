import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

const SingleToDoList = ({ route, navigation }) => {
  const { taskId } = route.params;
  const [task, setTask] = useState(null);
  const [db, setDb] = useState(null);
  const [taskInput, setTaskInput] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      const database = await SQLite.openDatabaseAsync('tasks.db');
      setDb(database);

      const fetchedTask = await database.getFirstAsync('SELECT * FROM tasks WHERE id = ?;', [taskId]);
      setTask(fetchedTask);
      setTaskInput(fetchedTask.title);
      console.log(task)
    };

    fetchTask();
  }, [taskId]);

  const updateTask = async () => {
    if (!db || taskInput.trim() === '') return;

    try {
      await db.runAsync('UPDATE tasks SET title = ? WHERE id = ?;', [taskInput, taskId]);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Task</Text>
      <TextInput
        style={styles.input}
        value={taskInput}
        onChangeText={setTaskInput}
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
