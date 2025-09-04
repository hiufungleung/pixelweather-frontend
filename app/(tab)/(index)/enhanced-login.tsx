import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FadeInView, SlideInView, ScaleInView } from '@/components/animations';
import { EnhancedButton, EnhancedTextInput, LoadingSpinner } from '@/components/ui';
import { API_LINK } from '@/constants/API_link';
import { useAuth } from '@/components/accAuth';

export default function EnhancedLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/(map)/map');
    }
  }, [isLoggedIn]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleAuth = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');
    setUsernameError('');

    // Validation
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    if (!isLogin && !username.trim()) {
      setUsernameError('Username is required');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? '/handle_login' : '/handle_signup';
      const body = isLogin 
        ? { email, password }
        : { email, username, password };

      const response = await fetch(`${API_LINK}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Success', 
          isLogin ? 'Login successful!' : 'Sign up successful!',
          [
            {
              text: 'OK',
              onPress: () => router.push('/(map)/map')
            }
          ]
        );

        if (!isLogin) {
          // Set up default alert timing for new users
          const userToken = data.data.token;
          try {
            await fetch(`${API_LINK}/user_alert_time`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
              },
              body: JSON.stringify({
                start_time: '00:00:00',
                end_time: '23:59:59',
                is_active: true,
              }),
            });
          } catch (error) {
            console.log('Failed to set default alert timing:', error);
          }
        }
      } else {
        Alert.alert('Error', data.error || 'Authentication failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    Alert.alert(
      'Guest Mode',
      'You can explore the app without an account. Some features may be limited.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue as Guest',
          onPress: () => router.push('/(map)/map')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <FadeInView style={styles.header}>
              <ScaleInView delay={300}>
                <View style={styles.logoContainer}>
                  <Ionicons name="partly-sunny" size={60} color="#fff" />
                </View>
              </ScaleInView>
              <SlideInView direction="down" delay={500}>
                <Text style={styles.title}>Pixel Weather</Text>
                <Text style={styles.subtitle}>
                  {isLogin ? 'Welcome back' : 'Join the community'}
                </Text>
              </SlideInView>
            </FadeInView>

            {/* Form */}
            <View style={styles.formContainer}>
              <SlideInView direction="left" delay={700}>
                <EnhancedTextInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={emailError}
                  leftIcon={<Ionicons name="mail-outline" size={20} color="#8E8E93" />}
                />
              </SlideInView>

              {!isLogin && (
                <SlideInView direction="left" delay={800}>
                  <EnhancedTextInput
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Choose a username"
                    autoCapitalize="none"
                    error={usernameError}
                    leftIcon={<Ionicons name="person-outline" size={20} color="#8E8E93" />}
                  />
                </SlideInView>
              )}

              <SlideInView direction="left" delay={isLogin ? 800 : 900}>
                <EnhancedTextInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry
                  error={passwordError}
                  leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#8E8E93" />}
                />
              </SlideInView>

              {/* Auth Button */}
              <SlideInView direction="up" delay={1000}>
                <EnhancedButton
                  title={loading ? '' : isLogin ? 'Sign In' : 'Sign Up'}
                  onPress={handleAuth}
                  disabled={loading}
                  loading={loading}
                  gradientColors={['#667eea', '#764ba2']}
                  style={styles.authButton}
                  icon={loading ? <LoadingSpinner size={20} colors={['#fff']} /> : undefined}
                />
              </SlideInView>

              {/* Switch Mode */}
              <FadeInView delay={1200}>
                <EnhancedButton
                  title={isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                  onPress={() => setIsLogin(!isLogin)}
                  variant="ghost"
                  style={styles.switchButton}
                  textStyle={styles.switchButtonText}
                />
              </FadeInView>

              {/* Guest Login */}
              <FadeInView delay={1400}>
                <EnhancedButton
                  title="Continue as Guest"
                  onPress={handleGuestLogin}
                  variant="outline"
                  style={styles.guestButton}
                  textStyle={styles.guestButtonText}
                />
              </FadeInView>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '400',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  authButton: {
    marginTop: 20,
    marginBottom: 16,
  },
  switchButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  switchButtonText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '500',
  },
  guestButton: {
    borderColor: 'rgba(102, 126, 234, 0.5)',
  },
  guestButtonText: {
    color: '#667eea',
    fontWeight: '500',
  },
});