import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import dataService from '../data';
import {Picker} from '@react-native-picker/picker';


const PomodoroTimer = ({ taskTitle, taskId }) => {
  const [time, setTime] = useState(1800); // 30 minutes default (30 * 60 seconds)
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [focusMessage, setFocusMessage] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [focusDuration, setFocusDuration] = useState(1800); // Focus time in seconds
  const [breakDuration, setBreakDuration] = useState(300); // Break time in seconds (5 mins default)

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => setTime((prevTime) => prevTime - 1), 1000);
    } else if (time === 0) {
      clearInterval(timer);
      handleSessionEnd();
    }
    return () => clearInterval(timer);
  }, [isRunning, time, isBreak]);

  const handleSessionEnd = () => {
    setIsRunning(false);
    if (!isBreak) {
      setFocusMessage('Time for a break!');
      setTime(breakDuration); // Set break duration dynamically
      setIsBreak(true);
      updateTaskTimeSpent(taskId);
    } else {
      setFocusMessage('Break over, time to focus again!');
      setTime(focusDuration); // Set focus duration dynamically
      setIsBreak(false);
    }
  };

  const updateTaskTimeSpent = async (taskId) => {
    if (!taskId) return;
    try {
      const task = await dataService.getTaskById(taskId);
      const newTimeSpent = task.time_spent + (focusDuration - time);
      await dataService.updateTaskTime(taskId, newTimeSpent);
      setTimeSpent(newTimeSpent);
    } catch (error) {
      console.error('Error updating task time spent:', error);
    }
  };

  const startTimer = () => {
    setIsRunning(true);
    setFocusMessage(isBreak ? 'Enjoy your break!' : 'Focus on your task!');
  };

  const pauseTimer = () => {
    setIsRunning(false);
    updateTaskTimeSpent(taskId);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(focusDuration); // Reset to the current selected focus duration
    setIsBreak(false);
    setFocusMessage('Timer reset. Ready to focus!');
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.taskTitle}>{taskTitle ? `Task: ${taskTitle}` : 'Pomodoro Timer'}</Text>

      {/* Dynamic focus time picker */}
      <Text>Select Focus Time:</Text>
      <Picker
        selectedValue={focusDuration}
        onValueChange={(itemValue) => {
          setFocusDuration(itemValue);
          if (!isRunning) setTime(itemValue); // Update time only if the timer is not running
        }}
        style={{ height: 50, width: 200 }}
      >
        <Picker.Item label="15 minutes" value={900} />
        <Picker.Item label="30 minutes" value={1800} />
        <Picker.Item label="45 minutes" value={2700} />
        <Picker.Item label="60 minutes" value={3600} />
      </Picker>

      <Text style={styles.timerText}>{formatTime(time)}</Text>
      <Text>Total Time Spent: {formatTime(timeSpent)}</Text>
      <Text>{focusMessage}</Text>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        {!isRunning ? (
          <Button title="Start" onPress={startTimer} />
        ) : (
          <Button title="Pause" onPress={pauseTimer} />
        )}
        <View style={styles.buttonSpacing} />
        <Button title="Reset" onPress={resetTimer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 36,
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  buttonSpacing: {
    width: 10,
  },
});

export default PomodoroTimer;
