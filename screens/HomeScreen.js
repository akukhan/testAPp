// // screens/HomeScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
// import * as SQLite from 'expo-sqlite';

// // Open the database
// const db = SQLite.openDatabaseSync('notes.db');
// console.log(db)

// export default function HomeScreen({ navigation }) {
  
//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={notes}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.note}>
//             <Text style={styles.title}>{item.title}</Text>
//             <Text>{item.content}</Text>
//             <Button title="Delete" onPress={() => deleteNote(item.id)} />
//           </View>
//         )}
//       />
//       <Button title="Add Note" onPress={() => navigation.navigate('AddNote')} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   note: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });


// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, FlatList, StyleSheet, TextInput } from 'react-native';
// import * as SQLite from 'expo-sqlite';
// import { format } from 'date-fns';

// // Open or create the SQLite database
// const initializeDatabase = async (setDb, fetchNotes) => {
//   try {
//     const database = await SQLite.openDatabaseAsync('notes.db');
//     setDb(database);

//     await database.execAsync(`
//       PRAGMA journal_mode = WAL;
//       CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT NOT NULL);
//     `);

//     await fetchNotes(database);
//   } catch (error) {
//     console.error('Error initializing database: ', error);
//   }
// };

// const HomeScreen = () => {
//   const [notes, setNotes] = useState([]);
//   const [db, setDb] = useState(null);
//   const [noteInput, setNoteInput] = useState('');
//   const currentDate = format(new Date(), 'EEEE, MMMM do, yyyy');

//   useEffect(() => {
//     initializeDatabase(setDb, fetchNotes);
//   }, []);

//   const fetchNotes = async (database) => {
//     if (!database) {
//       console.error('Database not initialized.');
//       return;
//     }

//     try {
//       const allRows = await database.getAllAsync('SELECT * FROM notes;');
//       setNotes(allRows);
//     } catch (error) {
//       console.error('Error fetching notes: ', error);
//     }
//   };

//   const addNote = async () => {
//     if (!db) {
//       console.error('Database not initialized.');
//       return;
//     }

//     if (noteInput.trim() === '') {
//       console.error('Note cannot be empty.');
//       return;
//     }

//     try {
//       await db.runAsync('INSERT INTO notes (value) VALUES (?);', [noteInput]);
//       setNoteInput('');
//       await fetchNotes(db);
//     } catch (error) {
//       console.error('Error adding note: ', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.date}>{currentDate}</Text>
//       <Text style={styles.title}>Notes</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Type your note here..."
//         value={noteInput}
//         onChangeText={setNoteInput}
//       />
//       <Button title="Add Note" onPress={addNote} />

//       <FlatList
//         data={notes}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => <Text style={styles.note}>{item.value}</Text>}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   date: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
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

// export default HomeScreen;


import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { format, startOfWeek, addDays } from 'date-fns';

const HomeScreen = () => {
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const navigation = useNavigation();
  const currentDate = format(new Date(), 'EEEE, MMMM do, yyyy');

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

      {/* lets add the date from monda to saturday, in short form, just below the day lets add the date */}

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
});

export default HomeScreen;
