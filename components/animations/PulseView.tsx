import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface PulseViewProps {
  children: React.ReactNode;
  duration?: number;
  minScale?: number;
  maxScale?: number;
  style?: ViewStyle;
}

const PulseView: React.FC<PulseViewProps> = ({ 
  children, 
  duration = 1000, 
  minScale = 0.95,
  maxScale = 1.05,
  style 
}) => {
  const pulseAnim = useRef(new Animated.Value(minScale)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: maxScale,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: minScale,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    pulse();
  }, [pulseAnim, duration, minScale, maxScale]);

  return (
    <Animated.View
      style={{
        ...style,
        transform: [{ scale: pulseAnim }],
      }}>
      {children}
    </Animated.View>
  );
};

export default PulseView;