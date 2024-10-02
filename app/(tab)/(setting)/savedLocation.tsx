import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import GradientTheme from '@/components/GradientTheme';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

// simulation of data from saved suburb API calls
const data = {
  'message': 'Data retrieved successfully',
  'data': [
    {
      'id': 1,
      'suburb_id': 1,
      'label': 'Home',
      'suburb_name': 'Suburb 1',
      'post_code': 4000,
      'latitude': -33.8688,
      'longitude': 151.2093,
      'state_code': 'QLD'
    },
    {
      'id': 14,
      'suburb_id': 2,
      'label': 'Work',
      'suburb_name': 'Suburb 2',
      'post_code': 4067,
      'latitude': -37.8136,
      'longitude': 144.9631,
      'state_code': 'QLD'
    }
  ]
};

export default function SavedLocationScreen() {
    const router = useRouter();
    const navigation = useNavigation();

    // Function to render each suburb item in the FlatList
    const renderSuburbItem = ({ item }) => (
        <View style={styles.locationContainer}>
            <Text style={styles.locationText}>{item.suburb_name}</Text>
            <TouchableOpacity onPress={() => router.push(`/editLocation/${item.id}`)}>
                <Text style={styles.editIcon}><FontAwesome6 size={20} name="pencil"/></Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <GradientTheme>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}><FontAwesome6 size={28} name="arrow-left"/></Text>
                </TouchableOpacity>

                {/* Card to display the saved locations */}
                <View style={styles.card}>
                    <FlatList
                        data={data.data}  // Access the suburb data array
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderSuburbItem}
                    />
                    {/* Add Location Button */}
                    <TouchableOpacity style={styles.addLocationButton} onPress={() => router.push('/addLocation')}>
                        <Text style={styles.addLocationText}>Add Location</Text>
                        <Text style={styles.addIcon}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </GradientTheme>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        marginTop: '20%',
        marginBottom: '70%',
        paddingHorizontal: '5%',
    },
    card: {
        backgroundColor: 'white',
        padding: '7%',
        borderRadius: 10,
    },
    backButton: {
        fontSize: 40,
        color: 'black',
        // marginTop: '15%',
    },
    locationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    locationText: {
        fontSize: 16,
        color: 'black',
    },
    editIcon: {
        fontSize: 20,
        color: 'black',
    },
    addLocationButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        marginTop: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        paddingHorizontal: 15,
    },
    addLocationText: {
        fontSize: 16,
        color: 'black',
    },
    addIcon: {
        fontSize: 24,
        color: 'black',
    },
});
