import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScaleInView, AnimatedButton } from '../animations';

interface EnhancedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradientColors?: string[];
}

const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  gradientColors,
}) => {
  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    };

    const sizeStyles = {
      small: { paddingHorizontal: 16, paddingVertical: 8, minHeight: 36 },
      medium: { paddingHorizontal: 20, paddingVertical: 12, minHeight: 44 },
      large: { paddingHorizontal: 24, paddingVertical: 16, minHeight: 52 },
    };

    const variantStyles = {
      primary: {
        backgroundColor: '#007AFF',
      },
      secondary: {
        backgroundColor: '#34C759',
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#007AFF',
        shadowOpacity: 0,
        elevation: 0,
      },
      ghost: {
        backgroundColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled || loading ? 0.6 : 1,
    };
  };

  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    const sizeStyles = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    const variantStyles = {
      primary: { color: '#FFFFFF' },
      secondary: { color: '#FFFFFF' },
      outline: { color: '#007AFF' },
      ghost: { color: '#007AFF' },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const buttonContent = (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'secondary' ? '#FFFFFF' : '#007AFF'}
          style={{ marginRight: icon || title ? 8 : 0 }}
        />
      )}
      {!loading && icon && (
        <View style={{ marginRight: title ? 8 : 0 }}>
          {icon}
        </View>
      )}
      {title && (
        <Text style={[getTextStyles(), textStyle]}>
          {title}
        </Text>
      )}
    </View>
  );

  const handlePress = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };

  if (variant === 'primary' && gradientColors) {
    return (
      <ScaleInView duration={300}>
        <AnimatedButton
          onPress={handlePress}
          style={[getButtonStyles(), style]}
          disabled={disabled || loading}
        >
          <LinearGradient
            colors={gradientColors}
            style={[
              getButtonStyles(),
              {
                shadowColor: 'transparent',
                shadowOpacity: 0,
                elevation: 0,
                margin: 0,
              },
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {buttonContent}
          </LinearGradient>
        </AnimatedButton>
      </ScaleInView>
    );
  }

  return (
    <ScaleInView duration={300}>
      <AnimatedButton
        onPress={handlePress}
        style={[getButtonStyles(), style]}
        disabled={disabled || loading}
      >
        {buttonContent}
      </AnimatedButton>
    </ScaleInView>
  );
};

export default EnhancedButton;