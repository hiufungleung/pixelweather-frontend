import React, { useRef } from 'react';
import { Animated, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';

interface AnimatedButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  pressInScale?: number;
  pressOutScale?: number;
  duration?: number;
  disabled?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  onPress,
  children,
  style,
  textStyle,
  pressInScale = 0.95,
  pressOutScale = 1,
  duration = 100,
  disabled = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: pressInScale,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: pressOutScale,
      duration,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          {
            transform: [{ scale: scaleAnim }],
            opacity: disabled ? 0.6 : 1,
          },
          style,
        ]}
      >
        <Animated.Text style={textStyle}>
          {children}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default AnimatedButton;