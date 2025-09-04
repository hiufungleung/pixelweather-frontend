import React from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RotateView } from '../animations';

interface LoadingSpinnerProps {
  size?: number;
  colors?: string[];
  style?: ViewStyle;
  strokeWidth?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  colors = ['#007AFF', '#5AC8FA', '#007AFF'],
  style,
  strokeWidth = 3,
}) => {
  const spinnerSize = size;
  const radius = (spinnerSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={[{ width: spinnerSize, height: spinnerSize }, style]}>
      <RotateView continuous duration={1000}>
        <View
          style={{
            width: spinnerSize,
            height: spinnerSize,
            borderRadius: spinnerSize / 2,
            borderWidth: strokeWidth,
            borderColor: 'transparent',
            borderTopColor: colors[0],
            borderRightColor: colors[1] || colors[0],
          }}
        />
      </RotateView>
    </View>
  );
};

export default LoadingSpinner;