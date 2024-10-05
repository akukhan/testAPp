import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const PomodoroTimer = ({ taskTitle, startPomodoro }) => {
  const [time, setTime] = useState(30); // 25 minutes in seconds (25 * 60)
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => setTime((prevTime) => prevTime - 1), 1000);
    } else if (time === 0) {
      clearInterval(timer);
      if (!isBreak) {
        alert('Time for a break!');
        setTime(300); // Set 5 minutes for a break (5 * 60)
        setIsBreak(true);
      } else {
        alert('Break over, time to focus again!');
        setTime(1500); // Reset to 25 minutes for the next Pomodoro session
        setIsBreak(false);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, time, isBreak]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(1500); // Reset to 25 minutes
    setIsBreak(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.taskTitle}>{taskTitle ? `Task: ${taskTitle}` : 'Pomodoro Timer'}</Text>
      <Text style={styles.timerText}>{formatTime(time)}</Text>

      {!isRunning ? (
        <Button title="Start" onPress={startTimer} />
      ) : (
        <Button title="Pause" onPress={pauseTimer} />
      )}

      <Button title="Reset" onPress={resetTimer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  taskTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default PomodoroTimer;
