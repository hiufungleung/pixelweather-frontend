import React, { useState, useEffect } from 'react';
import { Platform, View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialIcons';
import GradientTheme from '@/components/GradientTheme';
import * as ColourScheme from '@/constants.ColourScheme'

const API_KEY = '9480d17e216cfcf5b44da6050c7286a4'; // Replace with your weather API key

// Request location permission
const requestLocationPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
};

// Get current location function
const getCurrentLocation = async (setLocation) => {
  const hasPermission = await requestLocationPermission();
  if (hasPermission) {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const { latitude, longitude } = location.coords;
    setLocation({ latitude, longitude });
  } else {
    Alert.alert('Permission denied');
  }
};

// Home page component
const HomeScreen = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [weather, setWeather] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const { latitude, longitude } = location.coords;
        setLocation({ latitude, longitude });
        fetchWeather(latitude, longitude);
      }
    };

    getLocation();
  }, []);

  const fetchWeather = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error(error);
    }
  };

  const searchLocation = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      const { lon, lat } = data.coord;
      setLocation({ latitude: lat, longitude: lon });
      fetchWeather(lat, lon);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <GradientTheme>
      <View style={{ flex: 1, paddingTop: 100, paddingHorizontal: 15 }}>
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 20,
            paddingHorizontal: 10,
            backgroundColor: '#ffffff',
          }}
          placeholder="Search Location"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button title="Search" onPress={searchLocation} />

{/*
        {weather ? (
          <View>
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
              <Text style={styles.textWhite}>
                Location: {weather.name ? `${weather.name}, ${weather.sys?.country || ''}` : ''}
              </Text>
              <Text style={styles.textWhite}>
                Weather: {weather.weather?.[0]?.description || ''}
              </Text>
              <Text style={styles.textWhite}>
                Temp: {weather.main?.temp ? `${weather.main.temp.toFixed(2)}°C` : ''}
              </Text>
              <Text style={styles.textWhite}>
                High: {weather.main?.temp_max ? `${weather.main.temp_max.toFixed(2)}°C` : ''}
                {' | '}Low: {weather.main?.temp_min ? `${weather.main.temp_min.toFixed(2)}°C` : ''}
              </Text>
            </View>

            <MapView
              style={{ height: 400, marginTop: 50, borderStyle: 'solid', borderWidth: 0.2 }}
              provider={PROVIDER_GOOGLE}
              region={{
                latitude: location?.latitude || 0,
                longitude: location?.longitude || 0,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}>
              {location && <Marker coordinate={location} title="Your Location" />}
            </MapView>
          </View>
        ) : null}
*/}

      </View>
    </GradientTheme>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  textWhite: {
    color: '#ffffff',
  },
});

export default HomeScreen;
