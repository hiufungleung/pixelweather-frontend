import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { FontAwesome } from '@expo/vector-icons';
import GradientTheme from '@/components/GradientTheme';

// AlertButton component that accepts an alertText prop and an isSelected prop
function AlertButton({ alertText, isSelected = true }) {
    /* const [isSelected, setSelected] = useState(isActive);

    function handleClick() {
        isSelected ? setSelected(false) : setSelected(true)
    } */

    return (
        <TouchableOpacity
            style={[styles.button, isSelected && styles.selectedButton]}
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

// Edit Button Component for editing Alert Type and Areas
function EditButton() {
    return (
        <TouchableOpacity
            style={styles.editButton}
        >
            <FontAwesome name="edit" size={24} color="black" style={styles.editIcon} />
        </TouchableOpacity>
    );
}

function AreaButton ({ areaLocation }) {
    return (
        <TouchableOpacity
             style={ styles.button }>
            <Text
                 style={ styles.buttonText }
                 adjustsFontSizeToFit
                 numberOfLines={1}>
                {areaLocation}
            </Text>
        </TouchableOpacity>
    );
}

// Timing Component
function TimingBar({ startTime, endTime }) {

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <View style={styles.timingBar}>
            <Text style={styles.timingBarText}>{startTime}-{endTime}</Text>
            <Switch
                trackColor={{false: '#767577', true: '#363EFF'}}
                thumbColor={isEnabled ? '#BCB2FE' : '#f4f3f4'}
                onValueChange={toggleSwitch}
                value={isEnabled}
            />
        </View>
    );
}

// Main component
export default function AlertsScreen() {
    return (
        <GradientTheme>
            <ScrollView style={styles.container}>
                <View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Alert Type</Text>
                        <EditButton />
                    </View>
                    <View style={styles.buttonContainer}>
                        <AlertButton alertText="Test"/>
                        <AlertButton alertText="Foggy"/>
                        <AlertButton alertText="Strong Wind"/>
                        <AlertButton alertText="Floods"/>
                    </View>
                </View>
                <View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Areas</Text>
                        <EditButton />
                    </View>
                    <View style={styles.buttonContainer}>
                        <AreaButton areaLocation="Woolloongabba"/>
                        <AreaButton areaLocation="Brisbane City"/>
                        <AreaButton areaLocation="South Brisbane"/>
                        <AreaButton areaLocation="+"/>
                    </View>
                </View>
                <View style={{paddingBottom: 30}}>
                  <Text style={styles.header}>Alert Timing</Text>
                  <View style={styles.timingBarContainer}>
                     <TimingBar startTime="07:00" endTime="19:00"></TimingBar>
                     <TimingBar startTime="16:00" endTime="17:00"></TimingBar>
                     <TimingBar startTime="07:00" endTime="19:00"></TimingBar>
                     <TimingBar startTime="16:00" endTime="17:00"></TimingBar>
                     <TimingBar startTime="07:00" endTime="19:00"></TimingBar>
                     <TimingBar startTime="16:00" endTime="17:00"></TimingBar>
                  </View>
                </View>
            </ScrollView>
        </GradientTheme>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'transparent',
        marginTop: 50,
    },
    headerContainer: {
        flexDirection: 'row', // Puts the text and icon in a row
        justifyContent: 'space-between', // Aligns text to the left and icon to the right
        alignItems: 'center', // Vertically centers the text and icon
        marginBottom: 10,
        width: '100%',
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
    backgroundColor: '#FFFFFFA3',
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
    backgroundColor: '#FFFFFFA3', // Light red background for selected buttons
  },
  buttonText: {
    color: 'black',
    fontSize: 18, // Adjust font size to fit better
  },
  selectedButtonText: {
      color: 'black', // Change text color for selected buttons
  },
  editButton: {
      borderColor: 'black',
      borderWidth: 1,
      padding: 5,
      borderRadius: 5,
  },
  timingBarContainer: {
      width: '100%',
  },
  timingBar: {
      backgroundColor: '#FFFFFFA3',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      borderRadius: 10,
      padding: 10,
      marginBottom: 10, // Adds space between rows
  },
  timingBarText: {
      fontSize: 20,
  },
});
