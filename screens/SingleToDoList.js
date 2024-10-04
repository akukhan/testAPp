import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

const SingleToDoList = ({ route, navigation }) => {
  const { noteId, updateNoteInList  } = route.params;
  const [note, setNote] = useState(null);
  const [db, setDb] = useState(null);
  const [noteInput, setNoteInput] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      const database = await SQLite.openDatabaseAsync('notes.db');
      setDb(database);
      
      const fetchedNote = await database.getFirstAsync('SELECT * FROM notes WHERE id = ?;', [noteId]);
      setNote(fetchedNote);
      setNoteInput(fetchedNote.value);
    };

    fetchNote();
  }, [noteId]);

  const updateNote = async () => {
    if (!db || noteInput.trim() === '') return;
    
    try {
      await db.runAsync('UPDATE notes SET value = ? WHERE id = ?;', [noteInput, noteId]);
      navigation.goBack({
        updatedNote: { id: noteId, value: noteInput },
      }); // Go back after update
    } catch (error) {
      console.error('Error updating note: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Task</Text>
      <TextInput
        style={styles.input}
        value={noteInput}
        onChangeText={setNoteInput}
      />
      <Button title="Update Task" onPress={updateNote} />
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
