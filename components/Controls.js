import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  AppState,
} from "react-native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign,
  Entypo,
} from "@expo/vector-icons";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { differenceInSeconds } from "date-fns";
import ShimmerInView from "../shared/Shimmer";
import ShimmerOpacityInView from "../shared/ShimmerOpacity";

const DEAFAULT_TIME_STAMP = 1 * 60 * 1000;
const ONE_MINUTE = 60 * 1000;
const ONE_SECOND = 1000;

let timerId = null;
let timeStamp = DEAFAULT_TIME_STAMP

function Controls() {
  const [timerState, setTimerState] = useState(DEAFAULT_TIME_STAMP);
  const [running, setRunning] = useState(false);
  const [sound, setSound] = React.useState();

  const appState = useRef(AppState.currentState);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      _handleAppStateChange
    );

    return () => {
      subscription.remove && subscription.remove();
    };
  }, []);

  const recordStartTime = async () => {
    try {
      const now = new Date();
      await AsyncStorage.setItem("@start_time", now.toISOString());
    } catch (err) {
      // TODO: handle errors from setItem properly
      console.warn(err);
    }
  };

  const getElapsedTime = async () => {
    try {
      const startTime = await AsyncStorage.getItem("@start_time");
      const now = new Date();
      return differenceInSeconds(now, Date.parse(startTime));
    } catch (err) {
      // TODO: handle errors from setItem properly
      console.warn(err);
    }
  };

  const _handleAppStateChange = async (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // const elapsed = await getElapsedTime();
      // setElapsed(elapsed);
      console.log('App has come to the foreground!');
			timerId = setInterval(async () => {
				const elapsed = await getElapsedTime()
				const timerState = timeStamp - elapsed * ONE_SECOND
				setTimerState(timerState)
				if (timerState == 0) {
					setRunning(false)
					playSound()
				}
			})
    }
		if (nextAppState === 'background') {
			console.log('nextAppState background')
			clearInterval(timerId)
		}

    appState.current = nextAppState;
    console.log('AppState', appState.current);
  };

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/alarm.wav")
    );
    setSound(sound);
    await sound.playAsync();
  }

  const formatTimestamp = (time) => {
    const minutes = Math.floor(time / ONE_MINUTE);
    const seconds = Math.round(time % ONE_MINUTE) / ONE_SECOND;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    if (running) {
      recordStartTime();
      timerId = setInterval(async () => {
				const elapsed = await getElapsedTime()
				const timerState = timeStamp - elapsed * ONE_SECOND
				setTimerState(timerState)
				if (timerState == 0) {
					setRunning(false)
					playSound()
				}
				console.log(timerState/ONE_SECOND)
			}, 100);
      
    }
    return () => {
			setTimerState(prevTimerState => {
				timeStamp = prevTimerState;
				return prevTimerState
			})
      clearInterval(timerId);
    };
  }, [running]);

  return (
    <View style={styles.controls}>
      {running ? (
        <TouchableOpacity onPress={() => setRunning(false)}>
          <MaterialCommunityIcons
            name="pause-circle-outline"
            size={50}
            color="#080"
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => setRunning(true)}>
          <MaterialIcons name="play-circle-outline" size={50} color="#080" />
        </TouchableOpacity>
      )}
      {timerState > 0 ? (
        <ShimmerInView style={styles.timer}>
          {formatTimestamp(timerState)}
        </ShimmerInView>
      ) : (
        <ShimmerOpacityInView style={styles.timer}>00:00</ShimmerOpacityInView>
      )}
      {running ? (
        <TouchableOpacity
          onPress={() => setTimerState((prev) => prev + ONE_MINUTE)}
        >
          <Entypo name="time-slot" size={50} color="#080" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => setTimerState(DEAFAULT_TIME_STAMP)}>
          <Entypo name="back-in-time" size={50} color="#080" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  timer: {
    width: 200,
    color: "#080",
    // fontFamily: 'monospace',
    fontSize: 70,
    textAlign: "center",
  },
});

export default Controls;
