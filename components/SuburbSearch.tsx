import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_LINK } from '@/constants/API_link';

export default function SuburbSearch({ onSuburbSelect, token }) {
    const [query, setQuery] = useState('');
    const [filteredSuburbs, setFilteredSuburbs] = useState([]);
    const [selectedSuburb, setSelectedSuburb] = useState(null);
    const [suburbData, setSuburbData] = useState([]);

    // Function to fetch suburbs from the API
    const fetchSuburbs = async () => {
        try {
            console.log('Fetching suburbs from:', `${API_LINK}/suburbs`); // Log the URL

            const response = await fetch(`${API_LINK}/suburbs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await response.json();

            console.log('Response status:', response.status); // Log the status code
            console.log('Response data:', data); // Log the response data

            if (response.status === 200) {
                setSuburbData(data.data); // Update state with fetched suburb data
                await AsyncStorage.setItem('suburbData', JSON.stringify(data.data)); // Cache the suburb data
            } else {
                Alert.alert('Error', 'Failed to retrieve suburb data. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching suburbs:', error); // Log any error that occurs
            Alert.alert('Error', 'Failed to connect to the server. Please try again later.');
        }
    };


    // Function to load suburb data from cache
    const loadCachedSuburbs = async () => {
        try {
            const cachedSuburbs = await AsyncStorage.getItem('suburbData');
            if (cachedSuburbs !== null) {
                setSuburbData(JSON.parse(cachedSuburbs)); // Load cached data
            } else {
                fetchSuburbs(); // If no cache, fetch from the API
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load cached data.');
        }
    };

    // Fetch or load cached data when the component mounts
    useEffect(() => {
        loadCachedSuburbs();
    }, []);

    // Function to filter suburbs based on input (either name or postal code)
    const filterSuburbs = (input) => {
        if (input.length === 0) {
            setFilteredSuburbs([]);
        } else {
            const filtered = suburbData
                .filter(suburb =>
                    suburb.suburb_name.toString().toLowerCase().includes(input.toLowerCase()) ||
                    suburb.postcode.toString().includes(input)
                )
                .slice(0, 10); // Limit to top 6 results
            setFilteredSuburbs(filtered);
        }
    };

    // Handle input changes and filter suburbs with debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => filterSuburbs(query), 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    // Handle suburb selection
    const handleSelectSuburb = (suburb) => {
        setSelectedSuburb(suburb);
        setQuery(suburb.suburb_name + ', ' + suburb.postcode); // Set the selected suburb in the input field
        setFilteredSuburbs([]); // Hide the dropdown
        onSuburbSelect(suburb.id); // Call the parent function with selected suburb_id
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={query}
                placeholder="Search suburb name or postcode in QLD"
                onChangeText={(text) => setQuery(text)}
            />

            {filteredSuburbs.length > 0 && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={filteredSuburbs}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={() => handleSelectSuburb(item)}
                            >
                                <Text style={styles.itemText}>{item.suburb_name}, {item.postcode}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

            {selectedSuburb && (
                <Text style={styles.selectedSuburb}>
                    Selected Suburb: {selectedSuburb.suburb_name}, {selectedSuburb.postcode}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        padding: Platform.OS === 'ios' ? '5%' : '3%',
        borderRadius: 5,
        width: '100%',
    },
    dropdown: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginTop: '1%',
        maxHeight: 200,
        width: '100%',
        backgroundColor: 'white',
    },
    dropdownItem: {
        padding: '3%',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    itemText: {
        fontSize: 16,
    },
    selectedSuburb: {
        marginTop: '3%',
        fontSize: 16,
        color: 'green',
    },
});
