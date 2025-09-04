import React, { useState, useRef } from 'react';
import { 
  TextInput, 
  View, 
  Text, 
  Animated, 
  TextInputProps, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { FadeInView } from '../animations';

interface EnhancedTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

const EnhancedTextInput: React.FC<EnhancedTextInputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  value,
  onFocus,
  onBlur,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderColorAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(animatedLabel, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderColorAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
    onFocus && onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(animatedLabel, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    Animated.timing(borderColorAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur && onBlur(e);
  };

  const labelTranslateY = animatedLabel.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -24],
  });

  const labelScale = animatedLabel.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.85],
  });

  const borderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 0, 0, 0.1)', '#007AFF'],
  });

  const containerStyles: ViewStyle = {
    marginVertical: 8,
    position: 'relative',
    ...containerStyle,
  };

  const inputContainerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    minHeight: 52,
  };

  const defaultInputStyles: TextStyle = {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    paddingVertical: 4,
    ...inputStyle,
  };

  const defaultLabelStyles: TextStyle = {
    position: 'absolute',
    left: leftIcon ? 48 : 16,
    fontSize: 16,
    color: isFocused ? '#007AFF' : '#8E8E93',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 4,
    zIndex: 1,
    ...labelStyle,
  };

  const errorStyles: TextStyle = {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
    marginLeft: 16,
    ...errorStyle,
  };

  return (
    <FadeInView style={containerStyles}>
      {label && (
        <Animated.Text
          style={[
            defaultLabelStyles,
            {
              transform: [
                { translateY: labelTranslateY },
                { scale: labelScale },
              ],
            },
          ]}
        >
          {label}
        </Animated.Text>
      )}
      
      <Animated.View
        style={[
          inputContainerStyles,
          {
            borderColor,
            shadowColor: isFocused ? '#007AFF' : 'transparent',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: isFocused ? 0.15 : 0,
            shadowRadius: 8,
            elevation: isFocused ? 4 : 0,
          },
        ]}
      >
        {leftIcon && (
          <View style={{ marginRight: 12 }}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          {...textInputProps}
          style={defaultInputStyles}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor="#8E8E93"
        />
        
        {rightIcon && (
          <View style={{ marginLeft: 12 }}>
            {rightIcon}
          </View>
        )}
      </Animated.View>
      
      {error && (
        <FadeInView>
          <Text style={errorStyles}>{error}</Text>
        </FadeInView>
      )}
    </FadeInView>
  );
};

export default EnhancedTextInput;