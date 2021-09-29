import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, Text, View, Animated, Button } from "react-native";
// import AnimatedColorView from 'react-native-animated-colors';

function ShimmerInView(props) {
	
  const shimmerAnim = useRef(new Animated.Value(0)).current;
	const color = shimmerAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ['#070', '#080']
	})

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(shimmerAnim, {
					toValue: 1,
					duration: 50,
					useNativeDriver: false,
				}),
				Animated.timing(shimmerAnim, {
					toValue: 0,
					duration: 50,
					useNativeDriver: false,
				}),
			])
		).start()
  }, [ shimmerAnim ])

  return (
    <Animated.Text
      style={{
        ...props.style,
				// opacity: shimmerAnim,
				color: color
      }}
    >{props.children}</Animated.Text>
  );
}

export default ShimmerInView;
