import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { FadeInView, ScaleInView } from '../animations';

interface WeatherCardProps {
  temperature: number;
  condition: string;
  location: string;
  humidity?: number;
  windSpeed?: number;
  icon?: React.ReactNode;
  style?: ViewStyle;
  gradientColors?: string[];
  animationDelay?: number;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  condition,
  location,
  humidity,
  windSpeed,
  icon,
  style,
  gradientColors = ['#4A90E2', '#7B68EE', '#9B59B6'],
  animationDelay = 0,
}) => {
  return (
    <ScaleInView delay={animationDelay} style={[styles.container, style]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <BlurView intensity={20} tint="light" style={styles.blurOverlay}>
          <View style={styles.content}>
            <View style={styles.header}>
              <FadeInView delay={animationDelay + 200}>
                <Text style={styles.location}>{location}</Text>
              </FadeInView>
              {icon && (
                <ScaleInView delay={animationDelay + 300}>
                  <View style={styles.iconContainer}>
                    {icon}
                  </View>
                </ScaleInView>
              )}
            </View>
            
            <FadeInView delay={animationDelay + 400}>
              <View style={styles.temperatureContainer}>
                <Text style={styles.temperature}>{Math.round(temperature)}°</Text>
                <Text style={styles.condition}>{condition}</Text>
              </View>
            </FadeInView>
            
            {(humidity !== undefined || windSpeed !== undefined) && (
              <FadeInView delay={animationDelay + 600}>
                <View style={styles.detailsContainer}>
                  {humidity !== undefined && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Humidity</Text>
                      <Text style={styles.detailValue}>{humidity}%</Text>
                    </View>
                  )}
                  {windSpeed !== undefined && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Wind</Text>
                      <Text style={styles.detailValue}>{windSpeed} km/h</Text>
                    </View>
                  )}
                </View>
              </FadeInView>
            )}
          </View>
        </BlurView>
      </LinearGradient>
    </ScaleInView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  gradient: {
    flex: 1,
    minHeight: 200,
  },
  blurOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
  },
  temperatureContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  temperature: {
    fontSize: 64,
    fontWeight: '300',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 70,
  },
  condition: {
    fontSize: 20,
    fontWeight: '500',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: 12,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default WeatherCard;