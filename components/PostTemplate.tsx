import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Share } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as WeatherIcons from '@/constants/WeatherIcons';

// Helper function to format the time difference
const formatTimeDifference = (postedTime) => {
    const now = new Date();
    const postDate = new Date(postedTime);
    const differenceInMs = now - postDate;
    const differenceInMins = Math.floor(differenceInMs / 60000);
    const differenceInHours = Math.floor(differenceInMins / 60);

    if (differenceInMins < 1) {
        return "Now";
    } else if (differenceInMins < 60) {
        return `${differenceInMins} mins ago`;
    } else if (differenceInHours < 24) {
        return `${differenceInHours} hrs ago`;
    } else {
        const differenceInDays = Math.floor(differenceInHours / 24);
        return `${differenceInDays} days ago`;
    }
};

// Helper function to format the likes count
const formatLikes = (likes) => {
    if (likes < 1000) {
        return likes.toString();
    } else {
        return (likes / 1000).toFixed(1) + 'k';
    }
};

export default function PostTemplate({ postId, weatherCondition, comment, location, postedTime, likes, isSelfPost }) {

    // Function to handle post sharing
    const onShare = async () => {
        try {
            const result = await Share.share({
                message: `Beware of the weather in ${location}: It's ${weatherCondition}! \n ${comment} \n Posted ${formatTimeDifference(postedTime)}.`
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('Shared with activity type:', result.activityType);
                } else {
                    console.log('Post shared successfully!');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('Share dismissed');
            }
        } catch (error) {
            console.error('Error sharing the post:', error.message);
        }
    };

    return (
        <View style={styles.postContainer}>
            {/* Weather Icon */}
            <View style={styles.postIcon}>
                <Image source={WeatherIcons.weatherIconMap[weatherCondition]} style={styles.postImage}/>
            </View>

            {/* Weather Information */}
            <View style={styles.postInfo}>

                {/* Weather Info */}
                <View style={styles.infoContainer}>
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusText}>Now it is {weatherCondition}</Text>
                    </View>
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>{formatTimeDifference(postedTime)}</Text>
                    </View>
                </View>

                <View style={styles.locationContainer}>
                    <Text style={styles.locationText}>{location}</Text>
                </View>

                {/* Action Icons */}
                <View style={styles.footer}>
                    <View style={styles.actionIcons}>
                        <TouchableOpacity style={styles.iconGroup}>
                            <Icon name="favorite-border" size={24} color="black" />
                            <Text style={styles.likeCount}>{formatLikes(likes)}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.iconGroup} onPress={onShare}>
                            <Icon name="share" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <View>
                        {isSelfPost ? (
                            <TouchableOpacity>
                                <FontAwesome name="trash" size={24} color="black" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity>
                                <Text style={styles.reportText}>Report</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    postContainer: {
        padding: 16,
        backgroundColor: '#F9F9F9',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginVertical: 10,
        height: 150,
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    postIcon: {
        width: '30%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '3%',
    },
    postImage: {
        width: '80%',
        height: '70%',
    },
    postInfo: {
        width: '70%',
        justifyContent: 'space-between',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Spread the status and time apart
        alignItems: 'center',  // Center vertically
        height: '20%',
        flexWrap: 'nowrap',  // Prevent wrapping
    },
    statusContainer: {
        flex: 1,  // Allow statusContainer to take up remaining space
    },
    statusText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        flexWrap: 'wrap',  // Enable wrapping if needed
    },
    timeContainer: {
        width: 'auto',  // Let time take only the required width
    },
    timeText: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
    },
    locationContainer: {
        height: '60%',
        justifyContent: 'center',
    },
    locationText: {
        fontSize: 14,
        color: '#666',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: '20%',
        justifyContent: 'space-between',
    },
    actionIcons: {
        width: '70%',
        flexDirection: 'row',
        justifyContent: 'start',
    },
    iconGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    likeCount: {
        fontSize: 12,
        marginLeft: 5,
        color: '#333',
    },
    reportText: {
        color: '#007BFF',
        fontSize: 12,
        alignItems: 'center',
    },
});