import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Switch, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';

// AlertButton component that accepts an alertText prop and an isSelected prop
function AlertButton({ alertText, isActive = false }) {
    const [isSelected, setSelected] = useState(isActive);

    function handleClick() {
        isSelected ? setSelected(false) : setSelected(true)
    }

    return (
        <TouchableOpacity
            style={[styles.button, isSelected && styles.selectedButton]}
            onPress={handleClick}
        >
            <Text
                style={[styles.buttonText, isSelected && styles.selectedButtonText]}
                adjustsFontSizeToFit
                numberOfLines={1}
            >
                {alertText}
            </Text>
        </TouchableOpacity>
    );
}

// Timing Component
function TimingBar({ startTime, endTime }) {
    return (
        <View style={styles.timingBar}>
            <Text style={styles.timingBarText}>{startTime}-{endTime}</Text>
            <Switch/>
        </View>
    );
}

// Main component
export default function AlertsScreen() {
  return (
    <View style={styles.container}>
      <View>
          <Text style={styles.header}>Alert Type</Text>
          <View style={styles.buttonContainer}>
            <AlertButton alertText="Test" isActive={true}/>
            <AlertButton alertText="Foggy"/>
            <AlertButton alertText="Strong Wind"/>
            <AlertButton alertText="Floods"/>
            <AlertButton alertText="Thunder"/>
            <AlertButton alertText="Scorching"/>
            <AlertButton alertText="Tornadoes"/>
            <AlertButton alertText="High Ultraviolet"/>
          </View>
      </View>
      <View>
          <Text style={styles.header}>Areas</Text>
          <View style={styles.buttonContainer}>
            <AlertButton alertText="Woolloongabba"/>
            <AlertButton alertText="Brisbane City"/>
            <AlertButton alertText="South Brisbane"/>
            <AlertButton alertText="More"/>
          </View>
      </View>
      <View>
          <Text style={styles.header}>Alert Timing</Text>
          <View style={styles.timingBarContainer}>
             <TimingBar startTime="07:00" endTime="19:00"></TimingBar>
             <TimingBar startTime="16:00" endTime="17:00"></TimingBar>
          </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    alignSelf: 'flex-start', // Aligns the header to the left
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%', // Adjust width to fit buttons better
  },
  button: {
    backgroundColor: '#FFFFFF',
    width: '48%', // Makes buttons take up half of the container width with some space in between
    height: 50,
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // Adds space between rows
  },
  selectedButton: {
    backgroundColor: '#1CA9C9', // Light red background for selected buttons
  },
  buttonText: {
    color: 'black',
    fontSize: 18, // Adjust font size to fit better
  },
  selectedButtonText: {
      color: 'black', // Change text color for selected buttons
  },
  timingBarContainer: {
      width: '100%',
  },
  timingBar: {
      backgroundColor: '#D9D9D9',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      borderRadius: 10,
      marginBottom: 10, // Adds space between rows
  },
  timingBarText: {
      fontSize: 20,
  },
});
