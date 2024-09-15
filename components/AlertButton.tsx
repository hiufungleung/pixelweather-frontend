import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

// Alert button component
export default function AlertButton({ alertText }) {
    return (
        <TouchableOpacity style={styles.button}>
            <Text
                style={styles.buttonText}
                adjustsFontSizeToFit
                numberOfLines={1}
            >
                {alertText}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#FFFFFFB3',
        width: '48%',
        height: 50,
        padding: 10,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10, 
    },
    buttonText: {
        color: 'black',
        fontSize: 18,
    },
});
