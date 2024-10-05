
// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, FlatList, StyleSheet, TextInput } from 'react-native';
// import * as SQLite from 'expo-sqlite';

// export default function App() {
//   const [notes, setNotes] = useState([]);
//   const [db, setDb] = useState(null);
//   const [noteInput, setNoteInput] = useState(''); 

//   useEffect(() => {
//     const initializeDatabase = async () => {
//       try {
//         const database = await SQLite.openDatabaseAsync('notes.db');
//         setDb(database);

//         await database.execAsync(`
//           PRAGMA journal_mode = WAL;
//           CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT NOT NULL);
//         `);

//         await fetchNotes(database);
//       } catch (error) {
//         console.error("Error initializing database: ", error);
//       }
//     };
//     initializeDatabase();
//   }, []);

//   const fetchNotes = async (database) => {
//     if (!database) {
//       console.error("Database not initialized.");
//       return;
//     }

//     try {
//       const allRows = await database.getAllAsync('SELECT * FROM notes;');
//       setNotes(allRows);
//     } catch (error) {
//       console.error("Error fetching notes: ", error);
//     }
//   };

//   const addNote = async () => {
//     if (!db) {
//       console.error("Database not initialized.");
//       return;
//     }

//     if (noteInput.trim() === '') {
//       console.error("Note cannot be empty.");
//       return;
//     }

//     try {
//       await db.runAsync('INSERT INTO notes (value) VALUES (?);', [noteInput]);
//       setNoteInput(''); // Clear input field after adding the note
//       await fetchNotes(db); // Fetch updated notes, take the statues and update
//     } catch (error) {
//       console.error("Error adding note: ", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Notes</Text>
      
//       <TextInput
//         style={styles.input}
//         placeholder="Type your note here..."
//         value={noteInput}
//         onChangeText={setNoteInput} // Update state as the user types
//       />
//       <Button title="Add Note" onPress={addNote} />      
//       <FlatList
//         data={notes}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => <Text style={styles.note}>{item.value}</Text>}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingLeft: 8,
//     borderRadius: 5,
//   },
//   note: {
//     fontSize: 18,
//     marginVertical: 5,
//   },
// });

// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createStackNavigator } from '@react-navigation/stack';
// import HomeScreen from './screens/HomeScreen';
// import ToDoList from './screens/ToDoList';
// import ProfileScreen from './screens/ProfileScreen';
// import SingleToDoList from './screens/SingleToDoList';

// const Tab = createBottomTabNavigator();
// const Stack = createStackNavigator();

// function TodosStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="ToDoList" component={ToDoList} />
//       <Stack.Screen name="SingleToDoList" component={SingleToDoList} />
//     </Stack.Navigator>
//   );
// }

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator>
//         <Tab.Screen name="Home" component={HomeScreen} />
//         <Tab.Screen name="Todos" component={TodosStack} />
//         <Tab.Screen name="Profile" component={ProfileScreen} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ToDoList from './screens/ToDoList';
import ProfileScreen from './screens/ProfileScreen';
import SingleToDoList from './screens/SingleToDoList';

// Create a Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Create a Stack Navigator for the ToDo screens
const Stack = createStackNavigator();

function TodosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ToDoList" component={ToDoList} />
      <Stack.Screen name="SingleToDoList" component={SingleToDoList} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ tabBarLabel: 'Home' }} 
        />
        <Tab.Screen 
          name="Todos" 
          component={TodosStack} 
          options={{ tabBarLabel: 'Todos' }} 
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ tabBarLabel: 'Profile' }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
