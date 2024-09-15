import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import GradientTheme from '@/components/GradientTheme';
import { useRouter } from 'expo-router';

const data = [
    { id: '1', title: 'Account Center', icon: 'arrow-right', action: () => alert('Account Center') },
    { id: '2', title: 'Saved Location', icon: 'arrow-right', action: () => alert('Saved Location') },
    { id: '3', title: 'Help Center', icon: 'arrow-right', action: () => alert('Help Center') },
    { id: '4', title: 'Privacy', icon: 'arrow-right', route: '/privacy' },
];

export default function SettingScreen() {
  const router = useRouter();

  return (
      <GradientTheme>
          <View style={styles.container}>
          {/* List */}
          <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.listItem} onPress={() => router.push(item.route)}>
                  <Text style={styles.itemText}>{item.title}</Text>
                  <FontAwesome name={item.icon} size={24} color="black" />
                </TouchableOpacity>
              )}
              style={styles.list}
            />
            {/* Log Out Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={() => alert('Log Out')}>
              <Text style={styles.logoutText}>LOG OUT</Text>
            </TouchableOpacity>
          </View>
      </GradientTheme>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        marginTop: 70,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        backgroundColor: '#DABFFF', // Match the header color in your design
        paddingVertical: 10,
        marginVertical: 20,
        borderRadius: 10,
    },
    list: {
        flex: 1,
        marginTop: 10
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 8,
        borderRadius: 10,
    },
    itemText: {
        fontSize: 18,
        color: 'black',
    },
    logoutButton: {
        backgroundColor: '#4600DB',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 10,
        marginVertical: 20,
    },
    logoutText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
});
