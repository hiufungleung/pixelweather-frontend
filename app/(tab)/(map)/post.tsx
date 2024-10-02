import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, TextInput } from 'react-native';
import GradientTheme from '@/components/GradientTheme';
import * as ColorScheme from '@/constants/ColorScheme';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function NewPostScreen() {

    const [weather, setWeather] = useState(null);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Clear Sky', value: 'Clear Sky' },
        { label: 'Rainy', value: 'Rainy' },
        { label: 'Cloudy', value: 'Cloudy' },
        { label: 'Thunderstorm', value: 'Thunderstorm' },
        { label: 'Windy', value: 'Windy' },
        { label: 'Storm', value: 'Storm' },
        { label: 'Fog', value: 'Fog' },
        { label: 'Hail', value: 'Hail' },
        { label: 'Hot', value: 'Hot' },
        { label: 'Cold', value: 'Cold' },
    ]);
    const router = useRouter();

    // State for text input
    const [preparationText, setPreparationText] = useState('');
    const [searchText, setSearchText] = useState('');

    const handleNextPress = () => {
        // Navigate to postConfirm with query params
        if (weather) {
            router.push({
                pathname: 'postConfirm',
                params: { weather, preparationText },
            })
        } else {
            alert("You must select a weather condition!")
        }
        ;
    };

    return (
        <GradientTheme>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>←</Text>
                </TouchableOpacity>
                <View style={styles.card}>
                    <Text style={styles.header}>New Post</Text>
                    <View style={{flexDirection: 'row', justifyContent:'space-between',}}>
                        <Text style={styles.label}>Now it's...</Text>
                        <Text style={{color: 'red',}}>*required</Text>
                    </View>
                    {/* Dropdown Menu */}
                    <DropDownPicker
                        open={open}
                        value={weather}
                        items={items}
                        setOpen={setOpen}
                        setValue={setWeather}
                        setItems={setItems}
                        placeholder="Type to search..."
                        searchable={true}
                        searchPlaceholder="Search for weather..."
                        onChangeSearchText={setSearchText}
                        style={styles.input}
                        dropDownContainerStyle={styles.dropdownContainer}
                    />
                    <Text style={styles.label}>Comment</Text>
                    <TextInput
                        value={preparationText}
                        onChangeText={setPreparationText}
                        style={styles.input}
                        placeholder="Enter preparation notes"
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNextPress} style={styles.saveButton}>
                            <Text style={styles.saveText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </GradientTheme>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: '5%',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#FFFFFFA3',
        padding: '10%',
        borderRadius: 10,
    },
    header: {
        fontSize: 40,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: '10%',
    },
    backButton: {
        fontSize: 40,
        color: 'black',
        marginBottom: '3%',
    },
    label: {
        fontSize: 18,
        marginBottom: '4%',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: '4%',
        borderRadius: 5,
        marginBottom: '8%',
        backgroundColor: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: ColorScheme.SECOND_BTN,
        padding: '5%',
        borderRadius: 10,
        width: '45%',
    },
    cancelText: {
        textAlign: 'center',
        color: 'red',
    },
    saveButton: {
        backgroundColor: ColorScheme.BTN_BACKGROUND,
        padding: '5%',
        borderRadius: 10,
        width: '45%',
    },
    saveText: {
        color: 'white',
        textAlign: 'center',
    },
});