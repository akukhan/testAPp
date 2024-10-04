// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// const TodosScreen = () => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Todos</Text>
//       {/* Add your to-do list functionality here */}
//     </View>
//   );
// };

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
// });

// export default TodosScreen;

// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, FlatList, StyleSheet, TextInput } from 'react-native';
// import * as SQLite from 'expo-sqlite';
// import { useNavigation, useFocusEffect  } from '@react-navigation/native';

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

// const ToDoList = () => {
//   const [notes, setNotes] = useState([]);
//   const [db, setDb] = useState(null);
//   const [noteInput, setNoteInput] = useState('');
//   const navigation = useNavigation();

//   useEffect(() => {
//     initializeDatabase(setDb, fetchNotes);
//   }, []);

//   useFocusEffect(
//     React.useCallback(() => {
//       const refreshNotes = async () => {
//         if (db) {
//           await fetchNotes(db);
//         }
//       };
//       refreshNotes();
//     }, [db])
//   );

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
//       <Text style={styles.title}>Todo List</Text>
      
//       <TextInput
//         style={styles.input}
//         placeholder="Add a new task..."
//         value={noteInput}
//         onChangeText={setNoteInput}
//       />
//       <Button title="Add Task" onPress={addNote} />

//       <FlatList
//         data={notes}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <Text
//             style={styles.note}
//             onPress={() => navigation.navigate('SingleToDoList', { noteId: item.id })}
//           >
//             {item.value}
//           </Text>
//         )}
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
//     color: 'blue',
//   },
// });

// export default ToDoList;

//


// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
// import * as SQLite from 'expo-sqlite';
// import { useFocusEffect, useNavigation } from '@react-navigation/native';

// const initializeDatabase = async (setDb, fetchTasks) => {
//   try {
//     const database = await SQLite.openDatabaseAsync('notes.db');
//     setDb(database);

//     await database.execAsync(`
//       PRAGMA journal_mode = WAL;
//       CREATE TABLE IF NOT EXISTS tasks (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         title TEXT NOT NULL,
//         description TEXT,
//         due_date TEXT,
//         start_time TEXT,
//         end_time TEXT,
//         priority TEXT,
//         status TEXT,
//         reminder TEXT,
//         category TEXT,
//         created_at TEXT DEFAULT (datetime('now')),
//         updated_at TEXT DEFAULT (datetime('now'))
//       );
//     `);

//     await fetchTasks(database);
//   } catch (error) {
//     console.error('Error initializing database: ', error);
//   }
// };

// const ToDoList = () => {
//   const [tasks, setTasks] = useState([]);
//   const [db, setDb] = useState(null);
//   const [taskInput, setTaskInput] = useState('');
//   const [descriptionInput, setDescriptionInput] = useState('');
//   const navigation = useNavigation();

//   useEffect(() => {
//     initializeDatabase(setDb, fetchTasks);
//   }, []);

//   useFocusEffect(
//     React.useCallback(() => {
//       const refreshTasks = async () => {
//         if (db) {
//           await fetchTasks(db);
//         }
//       };
//       refreshTasks();
//     }, [db])
//   );

//   const fetchTasks = async (database) => {
//     if (!database) {
//       console.error('Database not initialized.');
//       return;
//     }

//     try {
//       const allRows = await database.getAllAsync('SELECT * FROM tasks;');
//       setTasks(allRows);
//     } catch (error) {
//       console.error('Error fetching tasks: ', error);
//     }
//   };

//   const addTask = async () => {
//     if (!db) {
//       console.error('Database not initialized.');
//       return;
//     }

//     if (taskInput.trim() === '') {
//       console.error('Task title cannot be empty.');
//       return;
//     }

//     try {
//       await db.runAsync('INSERT INTO tasks (title, description) VALUES (?, ?);', [taskInput, descriptionInput]);
//       setTaskInput(''); // Clear title input
//       setDescriptionInput(''); // Clear description input
//       await fetchTasks(db); // Fetch updated tasks
//     } catch (error) {
//       console.error('Error adding task: ', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
            
//       <TextInput
//         style={styles.input}
//         placeholder="Task Title..."
//         value={taskInput}
//         onChangeText={setTaskInput}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Task Description..."
//         value={descriptionInput}
//         onChangeText={setDescriptionInput}
//       />
//       <Button title="Add Task" onPress={addTask} />

//       <FlatList
//         data={tasks}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <Text
//             style={styles.note}
//             onPress={() => navigation.navigate('SingleToDoList', { noteId: item.id })}
//           >
//             {item.title} - {item.description}
//           </Text>
//         )}
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
//     color: 'blue',
//   },
// });

// export default ToDoList;


import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

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
        reminder TEXT, 
        category TEXT, 
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
  const [tasks, setTasks] = useState([]);
  const [db, setDb] = useState(null);
  const [taskInput, setTaskInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [dueDateInput, setDueDateInput] = useState('');
  const [priorityInput, setPriorityInput] = useState('');
  const navigation = useNavigation();

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
        'INSERT INTO tasks (title, description, due_date, priority) VALUES (?, ?, ?, ?);', 
        [taskInput, descriptionInput, dueDateInput, priorityInput]
      );
      setTaskInput('');
      setDescriptionInput('');
      setDueDateInput('');
      setPriorityInput('');
      await fetchTasks(db);
    } catch (error) {
      console.error('Error adding task: ', error);
    }
  };

  return (
    <View style={styles.container}>
          
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
      <TextInput
        style={styles.input}
        placeholder="Due Date (YYYY-MM-DD)..."
        value={dueDateInput}
        onChangeText={setDueDateInput}
      />
      <TextInput
        style={styles.input}
        placeholder="Priority (Low, Medium, High)..."
        value={priorityInput}
        onChangeText={setPriorityInput}
      />

      <Button title="Add Task" onPress={addTask} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
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
          </View>
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
