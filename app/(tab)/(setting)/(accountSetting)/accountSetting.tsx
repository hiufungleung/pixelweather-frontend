import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import GradientTheme from '@/components/GradientTheme';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function AccountSettingScreen() {

    const router = useRouter();
    const navigation = useNavigation();

    return (
        <GradientTheme>

            <View style={styles.container}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>←</Text>
                </TouchableOpacity>
                <View style={styles.card}>
                    <View style={styles.infoContainer}>
                        <View>
                             <Text style={styles.label}>Email:</Text>
                             <Text style={styles.info}>xxxx@google.com</Text>
                        </View>
                        <TouchableOpacity onPress={() => router.push('/changeEmail')}>
                            <Text style={styles.editIcon}>✏️</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.infoContainer}>
                        <View>
                            <Text style={styles.label}>Username:</Text>
                            <Text style={styles.info}>IamIvyLeeeeeeee</Text>
                        </View>
                        <TouchableOpacity onPress={() => router.push('/changeName')}>
                            <Text style={styles.editIcon}>✏️</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.infoContainer}>
                        <View>
                            <Text style={styles.label}>Password:</Text>
                            <Text style={styles.info}>********</Text>
                        </View>
                        <TouchableOpacity onPress={() => router.push('/changePassword')}>
                            <Text style={styles.editIcon}>✏️</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.deleteButton} onPress={() => router.push('/deleteAccount')}>
                    <Text style={styles.deleteText}>Delete Account</Text>
                </TouchableOpacity>
            </View>
        </GradientTheme>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: '5%',
    },
    card: {
        backgroundColor: 'white',
        padding: '7%',
        borderRadius: 10,
    },
    backButton: {
        fontSize: 40,
        color: 'black',
        marginBottom: '3%',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: '5%',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    info: {
        fontSize: 16,
    },
    editIcon: {
        fontSize: 20,
        color: 'black',
    },
    deleteButton: {
        backgroundColor: 'red',
        marginTop: '10%',
        padding: '4%',
        alignItems: 'center',
        borderRadius: 10,
    },
    deleteText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});