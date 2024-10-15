import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { API_LINK } from "@/constants/API_link";

export default function UserLocationMap() {
  const [region, setRegion] = useState(null);
  const [suburbs, setSuburbs] = useState([]); // Store all suburbs
  const [visibleSuburbs, setVisibleSuburbs] = useState([]); // Store filtered suburbs
  const [loading, setLoading] = useState(true);
  const previousRegion = useRef(null); // Track the previous region

  // Fetch suburbs from the API
  const fetchSuburbs = async () => {
    try {
      const response = await fetch(`${API_LINK}/suburbs`);
      if (response.ok) {
        const result = await response.json();
        console.log('Suburbs data retrieved:', result.data);
        setSuburbs(result.data); // Store all suburbs in state
      } else {
        console.error('Failed to fetch suburbs:', response.statusText);
        Alert.alert('Error', 'Failed to retrieve suburbs. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching suburbs:', error);
      Alert.alert('Error', 'An error occurred while fetching suburbs.');
    }
  };

  // Get the user's current location
  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to show your location.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Set the region centered on the user's location
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05, // Zoom level
        longitudeDelta: 0.05,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error getting user location:', error);
      setLoading(false);
    }
  };

  // Calculate the lat-long range of the map view
  const calculateLatLongRange = (region) => {
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

    const northEast = {
      latitude: latitude + latitudeDelta / 2,
      longitude: longitude + longitudeDelta / 2,
    };

    const southWest = {
      latitude: latitude - latitudeDelta / 2,
      longitude: longitude - longitudeDelta / 2,
    };

    return { northEast, southWest };
  };

  // Filter suburbs within the visible map range
  const filterSuburbs = (region) => {
    const { northEast, southWest } = calculateLatLongRange(region);

    const filtered = suburbs.filter((suburb) => {
      return (
        suburb.latitude >= southWest.latitude &&
        suburb.latitude <= northEast.latitude &&
        suburb.longitude >= southWest.longitude &&
        suburb.longitude <= northEast.longitude
      );
    });

    // console.log('Visible Suburbs:', filtered); // Print suburbs for checking
    setVisibleSuburbs(filtered); // Store filtered suburbs in state
    fetchPostCounts(filtered); // Fetch post counts for the visible suburbs
  };

  // Fetch the number of posts for each visible suburb
  const fetchPostCounts = async (filteredSuburbs) => {
    try {
      const suburbPostCounts = await Promise.all(
        filteredSuburbs.map(async (suburb) => {
          const response = await fetch(
            `${API_LINK}/get_posts?suburb_id=${suburb.id}&time_interval=7200`
          );
          if (response.ok) {
            const result = await response.json();
            return { ...suburb, postCount: result.data.length }; // Store post count with suburb
          } else {
            console.error(`Failed to fetch posts for suburb ${suburb.id}`);
            return { ...suburb, postCount: 0 }; // Default to 0 if API fails
          }
        })
      );
      // console.log('Suburbs with Post Counts:', suburbPostCounts);
      setVisibleSuburbs(suburbPostCounts); // Update visible suburbs with post counts
    } catch (error) {
      console.error('Error fetching post counts:', error);
      Alert.alert('Error', 'An error occurred while fetching post counts.');
    }
  };

  // Handle map region change completion
  const handleRegionChangeComplete = (newRegion) => {
    if (!previousRegion.current || newRegion !== previousRegion.current) {
      previousRegion.current = newRegion; // Update the previous region
      filterSuburbs(newRegion); // Filter suburbs within the new region
    }
    setRegion(newRegion); // Update the region state
  };

  useEffect(() => {
    getUserLocation(); // Fetch user location on mount
    fetchSuburbs(); // Fetch all suburbs on mount
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={handleRegionChangeComplete}
          showsUserLocation
        >
          {visibleSuburbs.map((suburb) => (
            <Marker
              key={suburb.id}
              coordinate={{
                latitude: suburb.latitude,
                longitude: suburb.longitude,
              }}
              title={`${suburb.suburb_name} - Posts: ${suburb.postCount || 0}`}
              description={`Postcode: ${suburb.postcode}`}
            />
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});