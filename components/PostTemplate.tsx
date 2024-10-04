import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Share, Alert, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as WeatherIcons from '@/constants/WeatherIcons';
import * as ColorScheme from '@/constants/ColorScheme';
import { useAuth } from '@/components/accAuth'
import { API_LINK } from '@/constants/API_link';

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

// Main PostTemplate function component
export default function PostTemplate({ postId, weatherCondition, comment, location, postedTime, likes, isSelfPost, onDelete, token }) {
    const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
    const [reportComment, setReportComment] = useState('');  // State to store the report comment
    const { userToken } = useAuth();

    // Function to handle post sharing
    const onShare = async () => {
        try {
            const result = await Share.share({
                message: `Beware of the weather in ${location}: It's ${weatherCondition}! \n\n ${comment} \n\n Posted ${formatTimeDifference(postedTime)}.`
            });

            if (result.action === Share.sharedAction) {
                console.log('Post shared successfully!');
            } else if (result.action === Share.dismissedAction) {
                console.log('Share dismissed');
            }
        } catch (error) {
            console.error('Error sharing the post:', error.message);
        }
    };

    // Function to confirm deletion
    const confirmDelete = () => {
        Alert.alert(
            "Delete Post",
            "Are you sure you want to delete this post?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => onDelete(postId) }
            ]
        );
    };

    // Function to handle the report submission
    const handleReportPost = async () => {
        if (!reportComment.trim()) {
            Alert.alert('Error', 'Report comment cannot be empty.');
            return;
        }
        try {
            const response = await fetch(`${API_LINK}/posts/report`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userToken}`,  // Token passed as a prop
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ post_id: postId, report_comment: reportComment }),  // Send post_id and report_comment
            });

            if (response.ok) {
                Alert.alert('Success', 'Post reported successfully.');
                setModalVisible(false);  // Close the modal after successful submission
                setReportComment('');    // Clear the comment input field
            } else {
                const errorResponse = await response.json();
                Alert.alert('Error', errorResponse.error || 'Failed to report the post.');
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to connect to the server.');
        }
    };

    return (
        <View style={styles.postContainer}>
            {/* Weather Icon */}
            <View style={styles.postIcon}>
                <Image
                    source={WeatherIcons.weatherIconMap[weatherCondition]}
                    style={styles.postImage}
                    resizeMode="contain"
                />
            </View>

            {/* Weather Information */}
            <View style={styles.postInfo}>
                {/* Weather Info */}
                <View style={styles.infoContainer}>
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusText} adjustsFontSizeToFit numberOfLines={1}>
                            Now it is {weatherCondition}
                        </Text>
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
                            <TouchableOpacity onPress={confirmDelete}>
                                <FontAwesome name="trash" size={24} color="black" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                <Text style={styles.reportText}>Report</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            {/* Report Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                    setReportComment('');
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Report Post</Text>
                        <Text style={styles.modalSubTitle}>Why are you reporting this post?</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter report comment"
                            value={reportComment}
                            onChangeText={setReportComment}
                            multiline
                            numberOfLines={3}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setModalVisible(false);
                                    setReportComment('');
                                }}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.submitButton]}
                                onPress={handleReportPost}
                            >
                                <Text style={styles.modalButtonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '20%',
    },
    statusContainer: {
        flex: 1,
    },
    statusText: {
        fontWeight: 'bold',
        color: '#333',
    },
    timeContainer: {
        width: 'auto',
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
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalSubTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        height: 80,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        width: '48%',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: ColorScheme.BTN_BACKGROUND,
    },
    submitButton: {
        backgroundColor: ColorScheme.BTN_BACKGROUND,
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});