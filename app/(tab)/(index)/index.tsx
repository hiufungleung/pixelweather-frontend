import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import UnderDevelopmentScreen from "@/components/alertMsg";
import { useRouter } from 'expo-router';
import GradientTheme from "@/components/GradientTheme";  // 使用 `expo-router` 進行導航
import * as ColorScheme from '@/constants/ColorScheme'
import {API_LINK} from '@/constants/API_link';

export default function SignUpScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const router = useRouter(); // 使用 `useRouter` 來控制導航

    const handleGuestLogin = () => {
        Alert.alert('Guest Mode', 'You have entered the app as a guest.');
        // 導航到主頁或首頁（範例: HomeScreen）
        router.push('/(map)/map');
    };

    const handleSignUp = async () => {
        // 檢查欄位是否填寫完整
        if (!email || !username || !password) {
            Alert.alert('Error', 'Missing email, username or password.');
            return;
        }

        // 發送註冊請求到 API
        try {
            const response = await fetch(`${API_LINK}/handle_signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "email": email,
                    "username": username,
                    "password": password,
                }),
            });

            const data = await response.json();

            switch (response.status) {
                case 201:
                    // 註冊成功
                    Alert.alert('Success', 'Sign up successful!');
                    // 取得 token 和使用者資訊
                    console.log('User Data:', data.data);
                    // 可以在這裡保存 token 或者導航至登入頁面
                    router.push('/signupSuccess');
                    break;
                case 400:
                    // 缺少必要資訊
                    Alert.alert('Error', data.error || 'Missing email, username or password.');
                    break;
                case 409:
                    // 電子郵件已被使用
                    Alert.alert('Error', data.error || 'Email is already in use.');
                    break;
                case 422:
                    // 資料無效
                    const invalidEmail = data.message?.email?.error || '';
                    const invalidUsername = data.message?.username?.error || '';
                    const invalidPassword = data.message?.password?.error || '';

                    Alert.alert(
                        'Invalid Data',
                        `Invalid email or password format.\n${invalidEmail}\n${invalidUsername}\n${invalidPassword}`
                    );
                    break;
                case 500:
                    // 伺服器錯誤
                    Alert.alert('Error', data.error || 'An internal server error occurred. Please try again later.');
                    break;
                default:
                    // 其他錯誤
                    Alert.alert('Error', data.error || 'An error occurred. Please try again.');
                    break;
            }
        } catch (error) {
            // 處理伺服器錯誤
            console.error(error);
            Alert.alert('Error', 'An internal server error occurred. Please try again later.');
        }
    };

    const handleLogin = () => {
        router.push('/login');  // 導航到 `login` 頁面
    };

    return (
        <GradientTheme>
            <View style={styles.container}>
                {/* 標題區域 */}
                <Text style={styles.title}>Welcome</Text>

                {/* 繼續訪客模式按鈕 */}
                <View style={styles.signupContainer}>
                    <View style={{width: '85%'}}>
                        <TouchableOpacity style={styles.guestButton} onPress={handleGuestLogin}>
                            <Text style={styles.guestButtonText}>Continue as a guest!</Text>
                        </TouchableOpacity>

                        {/* 分隔線 */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.line} />
                            <Text style={styles.dividerText}> Or create an account </Text>
                            <View style={styles.line} />
                        </View>

                        {/* 輸入框區域 */}
                        <Text>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="email@example.com"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <Text>Username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="username"
                            value={username}
                            onChangeText={setUsername}
                        />
                        <Text>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        {/* 註冊按鈕 */}
                        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                            <Text style={styles.signUpButtonText}>Join our community!</Text>
                        </TouchableOpacity>
                    </View>
                    {/* 登入連結 */}
                    <Text style={styles.loginLink} onPress={handleLogin}>
                        Already have an account? Login
                    </Text>

                    {/* 使用條款與隱私政策 */}
                    <View style={styles.termsContainer}>
                        <Text style={styles.termsText} onPress={() => router.push('/(setting)/privacy')}>Terms of Use | Privacy Policy</Text>
                    </View>
                </View>
            </View>
        </GradientTheme>
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
    signupContainer: {
        width: '100%',
        backgroundColor: '#FFFFFF90',
        borderRadius: 15,
        paddingVertical: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    guestButton: {
        backgroundColor: ColorScheme.BTN_BACKGROUND,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 30,
    },
    guestButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#45415A',
    },
    dividerText: {
        color: '#45415A',
        fontSize: 14,
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
    signUpButton: {
        backgroundColor: ColorScheme.BTN_BACKGROUND,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    signUpButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    loginLink: {
        marginTop: 20,
        color: '#4A44EF',
        fontSize: 14,
    },
    termsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15,
    },
    termsDivider:{
        color: '#45415A',
        marginHorizontal: 2,
        fontSize: 10,
    },
    termsText: {
        color: '#45415A',
        marginHorizontal: 2,
        fontSize: 10,
        textDecorationLine: 'underline',
    },
});