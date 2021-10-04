import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Controls from './components/Controls';
import ShimmerInView from './shared/Shimmer';
import ShimmerOpacityInView from './shared/ShimmerOpacity';


export default function App() {

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
        <Controls />
        <View style = { styles.signature }>
          <ShimmerInView style = { styles.title }>@Dmytro Sekhno</ShimmerInView>
          <ShimmerOpacityInView  style = { styles.cursor }>_</ShimmerOpacityInView>
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
    // fontFamily: 'monospace',
    fontSize: 30,
    textShadowColor: 'rgba(100, 200, 10, 0.8)',
    textShadowRadius: 10
  },
  signature: {
    flexDirection: 'row'
  },
  cursor: {
    // fontFamily: 'monospace',
    fontSize: 30,
    color: '#080'
  },
});
