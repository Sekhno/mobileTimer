import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, Text, View, Animated, Button } from "react-native";
// import AnimatedColorView from 'react-native-animated-colors';

function ShimmerOpacityInView(props) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  return (
    <Animated.Text
      style={{
        ...props.style,
        opacity: shimmerAnim,
      }}
    >
      {props.children}
    </Animated.Text>
  );
}

export default ShimmerOpacityInView;
