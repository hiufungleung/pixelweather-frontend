import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function SuburbSearch() {
    const [query, setQuery] = useState(''); // Input value
    const [filteredSuburbs, setFilteredSuburbs] = useState([]); // Filtered results
    const [selectedSuburb, setSelectedSuburb] = useState(null); // Selected suburb
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [suburbData, setSuburbData] = useState([
        { id: 1, name: "Brisbane City", postcode: "4000" },
        { id: 2, name: "Brisbane Adelaide Street", postcode: "4000" },
        { id: 3, name: "Brisbane", postcode: "4000" },
        { id: 4, name: "Petrie Terrace", postcode: "4000" },
        { id: 5, name: "Spring Hill", postcode: "4000" },
        { id: 6, name: "Fortitude Valley", postcode: "4006" },
        { id: 7, name: "New Farm", postcode: "4005" },
        { id: 8, name: "Herston", postcode: "4006" },
        { id: 9, name: "Kangaroo Point", postcode: "4169" },
        { id: 10, name: "Bowen Hills", postcode: "4006" },
    ]);

    // Generalized fetch function
    const fetchData = async (url, setState) => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                setState(jsonResponse.data);
                setLoading(false);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData('https://149.28.188.65//suburbs', setSuburbData);
    }, []);

    // Function to filter suburbs based on input (either name or postal code)
    const filterSuburbs = (input) => {
        if (input.length === 0) {
            setFilteredSuburbs([]);
        } else {
            const filtered = suburbData
                .filter(suburb =>
                    suburb.name.toLowerCase().includes(input.toLowerCase()) ||
                    suburb.postcode.includes(input)
                )
                .slice(0, 6); // Limit to top 6 results
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
        setQuery(suburb.name + ', ' + suburb.postcode); // Set the selected suburb in the input field
        setFilteredSuburbs([]); // Hide the dropdown
    };

    return (
        <View>
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
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={() => handleSelectSuburb(item)}
                            >
                                <Text style={styles.itemText}>{item.name}, {item.postcode}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

            {selectedSuburb && (
                <Text style={styles.selectedSuburb}>
                    Selected Suburb: {selectedSuburb.name}, {selectedSuburb.postcode}
                </Text>
            )}

            {/* Add additional logic like "Add Location" button */}
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        borderRadius: 5,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginTop: 5,
    },
    dropdownItem: {
        padding: 10,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    itemText: {
        fontSize: 16,
    },
    selectedSuburb: {
        marginTop: 10,
        fontSize: 16,
        color: 'green',
    },
});

