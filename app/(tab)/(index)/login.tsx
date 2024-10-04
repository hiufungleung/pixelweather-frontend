import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView, Platform
} from 'react-native';
import {showAlert} from "@/components/alertMsg";
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import GradientTheme from "@/components/GradientTheme";
import * as ColorScheme from "@/constants/ColorScheme";
import { useAuth } from '@/components/accAuth';
import {API_LINK} from '@/constants/API_link';
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function LogInScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { login, isLoggedIn } = useAuth();
    const passwordRef = useRef(null);

    const handleLogIn = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Missing email or password.');
            return;
        }

        try {
            console.log('testing 123');
            const response = await fetch(`${API_LINK}/handle_login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "email": email,
                    "password": password,
                }),
            });

            // 確認回傳的內容類型（不解析 JSON，直接顯示文字）
            const rawResponse = await response.text();
            // console.log('Raw Response:', rawResponse);  // 列印回應文字內容

            // 確認回應狀態碼
            // console.log('Response Status:', response.status);

            // 如果回傳內容包含 '<'，表示是 HTML 內容
            if (rawResponse.includes('<')) {
                console.error('伺服器回傳了 HTML 而非 JSON:', rawResponse);
                Alert.alert('Server Error', 'Received unexpected response from server.');
                return;
            }

            // 嘗試解析 JSON 格式的資料
            const data = JSON.parse(rawResponse);
            // console.log('Parsed Response Data:', data);

            if (response.status === 200) {
                login(data.data.token, { email: data.data.email, username: data.data.username });  // 傳遞 `token` 和 `userData`
                Alert.alert('Success', 'Login successful!');
                router.push('/(map)/map');
            } else {
                Alert.alert('Error', data.error || 'Invalid credentials.');
            }
        } catch (error) {
            console.log("Error: didn't send the request");
            Alert.alert('Error', `${error.message}`);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <GradientTheme>
                    <View style={styles.container}>
                        <TouchableOpacity style={{marginBottom: '3%', alignSelf: 'flex-start',}} onPress={() => router.back()}>
                            <Text style={styles.backButton}><FontAwesome6 size={28} name="arrow-left"/></Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Log In</Text>
                        <View style={styles.loginContainer}>
                            <View style={{width: '85%'}}>
                                <Text>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="email@example.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    returnKeyType="next"
                                    onSubmitEditing={() => passwordRef.current.focus()}
                                />
                                <Text>Password</Text>
                                <TextInput
                                    ref={passwordRef}
                                    style={styles.input}
                                    placeholder="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    returnKeyType="done"
                                    onSubmitEditing={() => handleLogIn()}
                                />

                                {/* 測試按鈕 */}
                                <TouchableOpacity style={styles.loginButton} onPress={handleLogIn}>
                                    <Text style={styles.loginButtonText}>Log in</Text>
                                </TouchableOpacity>

                                <Text style={styles.forgotPasswordText} onPress={() => router.push('')}>Forgot password?</Text>
                                <Text style={styles.linkText} onPress={() => router.push('/')}>
                                    Don't have an account? Sign Up
                                </Text>
                            </View>
                        </View>
                    </View>
                </GradientTheme>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        width: '100%',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 20,
    },
    loginContainer: {
        width: '100%',
        backgroundColor: '#FFFFFF90',
        borderRadius: 15,
        paddingVertical: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 40,
        borderColor: '#D9D9D9',
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    loginButton: {
        backgroundColor: ColorScheme.BTN_BACKGROUND,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    forgotPasswordText: {
        color: '#45415A',
        marginTop: 20,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    linkText: {
        marginTop: 20,
        color: ColorScheme.BTN_BACKGROUND,
        textAlign: 'center',
    },
});