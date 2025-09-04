import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, Dimensions } from 'react-native';

interface SlideInViewProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SlideInView: React.FC<SlideInViewProps> = ({ 
  children, 
  direction = 'left',
  duration = 700, 
  delay = 0, 
  style 
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  const getInitialTransform = () => {
    switch (direction) {
      case 'left':
        return { translateX: -SCREEN_WIDTH };
      case 'right':
        return { translateX: SCREEN_WIDTH };
      case 'up':
        return { translateY: -SCREEN_HEIGHT };
      case 'down':
        return { translateY: SCREEN_HEIGHT };
      default:
        return { translateX: -SCREEN_WIDTH };
    }
  };

  const getFinalTransform = () => {
    switch (direction) {
      case 'left':
      case 'right':
        return { translateX: 0 };
      case 'up':
      case 'down':
        return { translateY: 0 };
      default:
        return { translateX: 0 };
    }
  };

  useEffect(() => {
    const slideIn = () => {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }).start();
    };

    slideIn();
  }, [slideAnim, duration, delay]);

  const interpolatedTransform = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      direction === 'left' || direction === 'right' ? -SCREEN_WIDTH * (direction === 'left' ? 1 : -1) : 0,
      0
    ],
  });

  const interpolatedTransformY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      direction === 'up' || direction === 'down' ? SCREEN_HEIGHT * (direction === 'up' ? -1 : 1) : 0,
      0
    ],
  });

  return (
    <Animated.View
      style={{
        ...style,
        transform: [
          { translateX: direction === 'left' || direction === 'right' ? interpolatedTransform : 0 },
          { translateY: direction === 'up' || direction === 'down' ? interpolatedTransformY : 0 }
        ],
      }}>
      {children}
    </Animated.View>
  );
};

export default SlideInView;