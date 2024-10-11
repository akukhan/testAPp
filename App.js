
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
