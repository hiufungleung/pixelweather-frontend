import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import GradientTheme from '@/components/GradientTheme';

export default function PrivacyScreen() {
    return (
        <GradientTheme>
            <ScrollView style={styles.container}>
                <Text>Privacy Screen</Text>
            </ScrollView>
        </GradientTheme>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: '5%',
        marginTop: '10%',
    },

});