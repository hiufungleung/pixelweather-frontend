import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface RotateViewProps {
  children: React.ReactNode;
  duration?: number;
  degrees?: number;
  continuous?: boolean;
  style?: ViewStyle;
}

const RotateView: React.FC<RotateViewProps> = ({ 
  children, 
  duration = 2000, 
  degrees = 360,
  continuous = false,
  style 
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotate = () => {
      if (continuous) {
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          })
        ).start();
      } else {
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }).start();
      }
    };

    rotate();
  }, [rotateAnim, duration, continuous]);

  const interpolatedRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${degrees}deg`],
  });

  return (
    <Animated.View
      style={{
        ...style,
        transform: [{ rotate: interpolatedRotation }],
      }}>
      {children}
    </Animated.View>
  );
};

export default RotateView;