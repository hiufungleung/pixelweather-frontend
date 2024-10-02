import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

// Timing Component
export default function TimingBar({ startTime, endTime }) {

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <View style={styles.timingBar}>
            {startTime && endTime ? (
                <Text style={styles.timingBarText}>{startTime} - {endTime}</Text>
            ) : (
                <Text style={styles.timingBarText}>Whole Day</Text>
            )}

            <Switch
                trackColor={{ false: '#767577', true: '#363EFF' }}
                thumbColor={isEnabled ? '#BCB2FE' : '#f4f3f4'}
                onValueChange={toggleSwitch}
                value={isEnabled}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    timingBar: {
        backgroundColor: '#FFFFFFB3',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderRadius: 20,
        padding: 5,
        marginBottom: 10,
    },
    timingBarText: {
        fontSize: 20,
    },
});
