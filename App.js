import React, {useRef, useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons, AntDesign, Entypo } from '@expo/vector-icons'; 
import { Audio } from 'expo-av';
import { StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native';
import ShimmerInView from './shared/Shimmer';
import ShimmerOpacityInView from './shared/ShimmerOpacity';

const defaultTimeState = 10 * 60 * 1000;
const oneMinute = 60 * 1000;
const oneSecond = 1000;

let timerId = null;

export default function App() {
  const [ timerState, setTimerState ] = useState(defaultTimeState)
  const [ running, setRunning ] = useState(false)
  const [sound, setSound] = React.useState();

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
       require('./assets/alarm.wav')
    );
    setSound(sound);
    await sound.playAsync(); 
  }

  const formatTimestamp = (time) => {
    const minutes = Math.floor(time / oneMinute) 
    const seconds = Math.round(time % oneMinute) / oneSecond
    return (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds)
  }

  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  useEffect(() => {
    if (running) {
      timerId = setInterval(() => {
        setTimerState(prevState => {
          if (prevState == 0) {
            setRunning(false)
            playSound()
          }
          return prevState - oneSecond
          
        })
      }, oneSecond)
    }
    return () => {
      clearInterval(timerId)
    }
    
  }, [ running ])

  return (
    
    <LinearGradient
      colors = {['#020', '#000']}
      style = { styles.wrapper }
    >
      <View style = { styles.container }>
        <View>
          <ShimmerInView style = { styles.title }
          >Timer</ShimmerInView>
        </View>
        <View style = { styles.controls }>
          {
            running ?
            <TouchableOpacity onPress = {() => setRunning(false)}>
              <MaterialCommunityIcons name = 'pause-circle-outline' size = { 50 } color = '#080' />
            </TouchableOpacity> :
            <TouchableOpacity onPress = {() => setRunning(true)}>
              <MaterialIcons name = 'play-circle-outline' size = { 50 } color = '#080' />
            </TouchableOpacity>
          }
          {
            timerState > 0 ?
            <ShimmerInView style = { styles.timer }>
              { formatTimestamp(timerState) }
            </ShimmerInView> :
            <ShimmerOpacityInView  style = { styles.timer }
            >00:00</ShimmerOpacityInView>
          }
          {
            running ? 
            <TouchableOpacity onPress = {() => setTimerState(prev => prev + oneMinute)}>
              <Entypo name = 'time-slot' size = { 50 } color = '#080' />
            </TouchableOpacity> :
            <TouchableOpacity onPress = {() => setTimerState(defaultTimeState)}>
              <Entypo name = 'back-in-time' size = { 50 } color = '#080' />
            </TouchableOpacity>
          }
        </View>
        <View style = { styles.signature }>
          <ShimmerInView
            style = { styles.title }
          >@Dmytro Sekhno</ShimmerInView>
          <ShimmerOpacityInView 
            style = { styles.cursor }
          >_</ShimmerOpacityInView>
        </View>
        
        <StatusBar style = 'auto' />
      </View>
    </LinearGradient>
    
    
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'monospace',
    fontSize: 30,
    textShadowColor: 'rgba(100, 200, 10, 0.8)',
    textShadowRadius: 10
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  timer: {
    color: '#080',
    fontFamily: 'monospace',
    fontSize: 70
  },
  leftControls: {

  },
  rightControls: {

  },
  signature: {
    flexDirection: 'row'
  },
  cursor: {
    fontFamily: 'monospace',
    fontSize: 30,
    color: '#080'
  },
});
