import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { FadeInView } from '../animations';

interface GlassMorphismCardProps {
  children: React.ReactNode;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  style?: ViewStyle;
  animationDelay?: number;
  borderRadius?: number;
}

const GlassMorphismCard: React.FC<GlassMorphismCardProps> = ({
  children,
  intensity = 80,
  tint = 'light',
  style,
  animationDelay = 0,
  borderRadius = 20,
}) => {
  const cardStyle: ViewStyle = {
    borderRadius,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...style,
  };

  return (
    <FadeInView delay={animationDelay} style={cardStyle}>
      <BlurView intensity={intensity} tint={tint} style={styles.blurContainer}>
        <View style={[styles.contentContainer, { borderRadius }]}>
          {children}
        </View>
      </BlurView>
    </FadeInView>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    minHeight: 100,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default GlassMorphismCard;