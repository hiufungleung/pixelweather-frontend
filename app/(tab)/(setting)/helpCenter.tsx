import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import GradientTheme from '@/components/GradientTheme';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

// Data for Help Center Sections
const gettingStarted = [
    { id: '1', text: 'How do I create an account? \nTo create an account, open the Pixel Weather app and follow the on-screen instructions to sign up using your email address and a secure password.' },
    { id: '2', text: 'How do I update my account information? \nGo to the "Settings" section in the app, select "Account," and update your personal details as needed.' },
];

const usingApp = [
    { id: '3', text: 'How do I customize my weather preferences? \nNavigate to the "Preferences" section in the app settings to set your location, choose your preferred weather metrics, and adjust notification settings.' },
    { id: '4', text: 'How can I view historical weather data? \nAccess the "History" tab from the main menu to view past weather data for your selected location.' },
];

const troubleshooting = [
    { id: '5', text: 'The app is not working properly. What should I do? \nFirst, try restarting the app or your device. If the problem persists, check for updates in your app store. If the issue continues, contact our support team.' },
    { id: '6', text: 'I forgot my password. How can I reset it? \nOn the login screen, select "Forgot Password" and follow the instructions to reset your password via email.' },
];

const privacyAndSecurity = [
    { id: '7', text: 'How is my data protected? \nWe use industry-standard security measures to protect your data. For detailed information, please review our Privacy Policy.' },
    { id: '8', text: 'How do I delete my account? \nTo delete your account, go to "Settings," select "Account," and choose "Delete Account." Follow the prompts to complete the process.' },
];

const contactUs = [
    { id: 'contact-intro', isIntro: true, text: 'If you need further assistance or have any other questions, please reach out to us using the contact information provided below.' },
    { id: '9', text: 'Email: support@yakiniku.com' },
    { id: '10', text: 'In-App Support: Use the "Help" or "Support" feature within the app to submit a request directly.' },
    { id: '11', text: 'Phone: [Insert Phone Number, if applicable]' },
    { id: '12', text: 'Mailing Address: [Insert Mailing Address, if applicable]' },
];

// Combine Help Center data into one array
const helpCenterData = [
    { id: 'welcome-header', isHeader: true, section: 'Welcome' }, // 用於標記第一段歡迎詞
    { id: 'getting-started-header', isHeader: true, section: 'Getting Started' },
    ...gettingStarted.map((item) => ({ ...item, section: 'gettingStarted' })),
    { id: 'using-app-header', isHeader: true, section: 'Using the App' },
    ...usingApp.map((item) => ({ ...item, section: 'usingApp' })),
    { id: 'troubleshooting-header', isHeader: true, section: 'Troubleshooting' },
    ...troubleshooting.map((item) => ({ ...item, section: 'troubleshooting' })),
    { id: 'privacy-header', isHeader: true, section: 'Privacy and Security' },
    ...privacyAndSecurity.map((item) => ({ ...item, section: 'privacyAndSecurity' })),
    { id: 'contact-header', isHeader: true, section: 'Contact Us' },
    ...contactUs.map((item) => ({ ...item, section: 'contactUs' })),
];

export default function HelpCenterScreen() {
    const navigation = useNavigation();

    return (
        <GradientTheme>
            <View style={styles.container}>
                <View>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backButton}><FontAwesome6 size={28} name="arrow-left"/></Text>
                    </TouchableOpacity>
                    <Text style={styles.header}>Pixel Weather {"\n"}Help Center</Text>
                </View>

                {/* FlatList for Help Center Sections */}
                <FlatList
                    data={helpCenterData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        // 檢查是否包含換行符號 "\n"
                        const splitText = item.text ? item.text.split('\n') : [''];
                        return item.isHeader ? (
                            item.section === 'Welcome' ? (
                                <Text style={styles.welcomeText}>
                                    Welcome to the Pixel Weather Help Center! {"\n"}We're here to assist you with any questions or issues you may have. Below you'll find answers to common questions, as well as information on how to contact us for further support.
                                </Text>
                            ) : (
                                <Text style={styles.sectionTitle}>
                                    {item.section === 'Getting Started' ? '1. Getting Started' :
                                        item.section === 'Using the App' ? '2. Using the App' :
                                            item.section === 'Troubleshooting' ? '3. Troubleshooting' :
                                                item.section === 'Privacy and Security' ? '4. Privacy and Security' :
                                                    '5. Contact Us'}
                                </Text>
                            )
                        ) : item.isIntro ? (
                            <Text style={styles.contactIntroText}>{item.text}</Text>
                        ) : (
                            <View style={styles.listItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.listText}>
                                    <Text style={{fontWeight: 500, fontSize: 17,}}>{splitText[0]}</Text>
                                    {splitText.length > 1 && <Text style={styles.listText}>{`\n${splitText[1]}`}</Text>}
                                </Text>
                            </View>
                        );
                    }}
                    ListFooterComponent={
                        <Text style={styles.agreementText}>
                            Our support team is available [insert hours of operation] and will respond to your inquiry as soon as possible.{"\n"}Thank you for using Pixel Weather!
                        </Text>
                    }
                    style={styles.list}
                />
            </View>
        </GradientTheme>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '5%',
        paddingTop: '15%',
        paddingBottom: '15%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    backButton: {
        fontSize: 40,
        paddingVertical: 15,
        color: 'black',
    },
    welcomeText: {
        fontSize: 16,
        marginVertical: 20,
        lineHeight: 24,
        textAlign: 'left',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    list: {
        marginBottom: '20%',
        marginTop: '5%',
    },
    listItem: {
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'flex-start',
    },
    bulletPoint: {
        fontSize: 20,
        lineHeight: 24,
        marginRight: 10,
    },
    questionText: {
        fontSize: 18,
        fontWeight: 'semibold',
        lineHeight: 28,
        marginBottom: 20,
    },
    listText: {
        fontSize: 16,
        lineHeight: 24,
        flex: 1,
    },
    contactIntroText: {
        fontSize: 16,
        marginTop: 10,
        marginBottom: 5,
        textAlign: 'left',
    },
    agreementText: {
        fontSize: 16,
        marginTop: 20,
        lineHeight:22,
        textAlign: 'left',
    },
});