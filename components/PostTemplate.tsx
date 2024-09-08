import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function PostTemplate() {
    return (
        <View style={styles.postContainer}>
            <View style={styles.postInfoContainer}>
                <View >
                    <Text> testing123 </Text>
                </View>
                <View>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: '#D9D9D9',
        borderRadius: 10,
    },
    postInfoContainer: {
        flex: 1,
    },
    weatherIcon: {
        width: '30%',
    },
    weatherInfo: {
        width: '70%',
    },
});