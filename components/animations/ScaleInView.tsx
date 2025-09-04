import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface ScaleInViewProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  initialScale?: number;
  finalScale?: number;
  style?: ViewStyle;
}

const ScaleInView: React.FC<ScaleInViewProps> = ({ 
  children, 
  duration = 600, 
  delay = 0, 
  initialScale = 0,
  finalScale = 1,
  style 
}) => {
  const scaleAnim = useRef(new Animated.Value(initialScale)).current;

  useEffect(() => {
    const scaleIn = () => {
      Animated.spring(scaleAnim, {
        toValue: finalScale,
        delay,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    };

    scaleIn();
  }, [scaleAnim, finalScale, delay]);

  return (
    <Animated.View
      style={{
        ...style,
        transform: [{ scale: scaleAnim }],
      }}>
      {children}
    </Animated.View>
  );
};

export default ScaleInView;