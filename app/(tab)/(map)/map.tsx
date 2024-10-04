import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Alert, Dimensions, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import Icon from '@expo/vector-icons/Entypo';
import GradientTheme from '@/components/GradientTheme';
import { useRouter } from 'expo-router';
import { useAuth } from '@/components/accAuth';
import * as WeatherIcons from "@/constants/WeatherIcons";
import { weatherIconById } from '@/constants/weatherCode';

const SCREEN_HEIGHT = Dimensions.get('window').height;  // 取得螢幕高度
const SCREEN_WIDTH = Dimensions.get('window').width;    // 取得螢幕寬度

const SEARCH_CONTAINER_WIDTH = SCREEN_WIDTH - 30;  // SearchContainer 的寬度 (左右 margin 各 15)
const BUTTON_TO_TOP_DISTANCE = SCREEN_HEIGHT*0.12;

const API_KEY = '9480d17e216cfcf5b44da6050c7286a4'; // 替换为你的天气API密钥

// 請求位置權限的函數
const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
};

// 獲取當前位置的函數
const getCurrentLocation = async (setLocation) => {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        });
        const { latitude, longitude } = location.coords;
        setLocation({ latitude, longitude });
    } else {
        Alert.alert('Permission denied');
    }
};

// HomeScreen 組件
export default function HomeScreen() {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [weather, setWeather] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [hourlyForecast, setHourlyForecast] = useState([]);
    const router = useRouter();
    const { isLoggedIn } = useAuth(); // 使用 `useAuth` 取得登入狀態

    const animatedHeight = useRef(new Animated.Value(400)).current;  // 初始化地圖高度動畫
    const animatedWidth = useRef(new Animated.Value(SEARCH_CONTAINER_WIDTH)).current;  // 初始化地圖寬度動畫
    const animatedPadding = useRef(new Animated.Value(15)).current;  // 初始化 `paddingHorizontal`
    const animatedBorderRadius = useRef(new Animated.Value(15)).current;  // 初始化 `borderRadius`
    const animatedBtnTop = useRef(new Animated.Value(50)).current; // 控制按鈕的 top 屬性

    const [mapExpanded, setMapExpanded] = useState(false);

    useEffect(() => {
        const getLocation = async () => {
            const hasPermission = await requestLocationPermission();
            if (hasPermission) {
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });
                const { latitude, longitude } = location.coords;
                setLocation({ latitude, longitude });
                fetchWeather(latitude, longitude);
                fetchHourlyForecast(latitude, longitude);
            }
        };
        getLocation();
    }, []);

    const fetchWeather = async (latitude: number, longitude: number) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
            );
            const data = await response.json();
            setWeather(data);
        } catch (error) {
            console.error(error);
        }
    };

    const searchLocation = async () => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&units=metric&appid=${API_KEY}`
            );
            const data = await response.json();
            setWeather(data);
            const { lon, lat } = data.coord;
            // console.log(data);
            setLocation({ latitude: lat, longitude: lon });
            fetchHourlyForecast(lat, lon);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchHourlyForecast = async (latitude: number, longitude: number) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,daily,alerts&units=metric&appid=${API_KEY}`
            );
            const data = await response.json();
            // 取出未來 12 小時的資料
            const forecastData = data.hourly.slice(1, 24).map((hourData, index) => {
                const weatherType = weatherIconById[hourData.weather[0].id] || 'Clear Sky';
                return {
                    time: new Date(hourData.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // 轉換成可讀格式
                    temp: hourData.temp.toFixed(0), // 溫度
                    icon: WeatherIcons.weatherIconMap[weatherType],
                };
            });
            setHourlyForecast(forecastData);
        } catch (error) {
            console.error("Failed to fetch hourly forecast:", error);
        }
    };

    const handleAddPost = () => {
        if (!isLoggedIn) {
            // 未登入：彈出提示，並跳轉到登入頁面
            Alert.alert('Warning', 'Please login to use this function', [
                { text: 'login', onPress: () => router.push('/login') },
                { text: 'cancel' },
            ]);
        } else {
            // 已登入：跳轉到發文頁面
            router.push('/post');
        }
    };

    const handleMapPress = () => {
        setMapExpanded(!mapExpanded);
        Animated.timing(animatedHeight, {
            toValue: mapExpanded ? 400 : SCREEN_HEIGHT,  // 高度改變
            duration: 300,
            useNativeDriver: false,
        }).start();

        Animated.timing(animatedWidth, {
            toValue: mapExpanded ? SEARCH_CONTAINER_WIDTH : SCREEN_WIDTH,  // 寬度改變
            duration: 300,
            useNativeDriver: false,
        }).start();

        Animated.timing(animatedPadding, {
            toValue: mapExpanded ? 15 : 0,  // 根據地圖狀態更改 `paddingHorizontal`
            duration: 300,
            useNativeDriver: false,
        }).start();

        Animated.timing(animatedBorderRadius, {
            toValue: mapExpanded ? 15 : 0,  // 邊角半徑變化：展開時為 0（直角），收起時為 15（圓角）
            duration: 300,
            useNativeDriver: false,
        }).start();

        Animated.timing(animatedBtnTop, {
            toValue: mapExpanded ? 15 : BUTTON_TO_TOP_DISTANCE,
            duration: 300,
            useNativeDriver: false,
        }).start();

    };

    return (
        <GradientTheme>
            <SafeAreaView style={{ flex: 1 }}>
                <Animated.View style={{ flex: 1, paddingTop: 10, paddingHorizontal: animatedPadding }}>
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search Location"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={searchLocation}
                        />
                        {/* 點擊放大鏡執行搜尋 */}
                        <Icon name="magnifying-glass" size={20} color="gray" style={styles.searchIcon} onPress={searchLocation} />
                    </View>

                    {weather ? (
                        <View>
                            {/* 天氣資訊顯示容器 */}
                            <View style={styles.weatherInfoContainer}>

                                <Text style={styles.locationText}>
                                    {weather.name ? `${weather.name}` : 'Unknown Location'}
                                </Text>
                                <View style={{ flexDirection: 'row', marginVertical: 30, width: '65%', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <Image source={WeatherIcons.weatherIconMap['Clear Sky']} style={styles.weatherIcon} />

                                    <View style={{alignItems:'center', padding: 5}}>
                                        <Text style={styles.temperatureText}>
                                            {weather.main?.temp ? `${weather.main.temp.toFixed(0)}` : 'N/A'}
                                            <Text style={{fontSize: 20}}>{' '}{'°C'}</Text>
                                        </Text>

                                        {/* 高溫和低溫顯示 */}
                                        <Text style={styles.highLowText}>
                                            {weather.main?.temp_max ? `H: ${weather.main.temp_max.toFixed(0)}` : 'H: N/A'} |
                                            {weather.main?.temp_min ? ` L: ${weather.main.temp_min.toFixed(0)}` : 'L: N/A'}
                                        </Text>
                                    </View>
                                </View>

                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyForecastContainer}>
                                    {hourlyForecast.map((forecast, index) => (
                                        <View key={index} style={styles.hourlyForecast}>
                                            <Image source={forecast.icon} style={styles.hourIcon} />
                                            <Text style={styles.hourText}>{forecast.time}</Text>
                                            {/*<Text style={styles.hourText}>{forecast.temp}°C</Text>*/}
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* 地圖顯示 */}
                            <Animated.View
                                style={[
                                    styles.mapContainer,
                                    {
                                        height: animatedHeight,
                                        width: animatedWidth,
                                        borderRadius: animatedBorderRadius,
                                        position: 'absolute',
                                        bottom: -400,
                                        left: 0,
                                        right: 0,
                                    },
                                ]}
                            >
                                <MapView
                                    style={{ flex: 1, borderRadius: 15, }}
                                    region={{
                                        latitude: location.latitude,
                                        longitude: location.longitude,
                                        latitudeDelta: 0.05,
                                        longitudeDelta: 0.05,
                                    }}
                                    onPress={handleMapPress}
                                >
                                    <Marker coordinate={location} title="Your Location" />
                                </MapView>

                                <Animated.View style={[styles.mapBtnContainer, { top: animatedBtnTop }]}>
                                    <TouchableOpacity style={styles.mapBtn}>
                                        <Text style={styles.btnText}>1 HR AGO</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.mapBtn} onPress={handleAddPost}>
                                        <Text style={styles.btnText}>+ ADD POST</Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            </Animated.View>
                        </View>
                    ) : null}
                </Animated.View>
            </SafeAreaView>
        </GradientTheme>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: 1,
        backgroundColor: '#ffffff',
        borderRadius: 5,
    },
    searchInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
    },
    searchIcon: {
        paddingRight: 10,
    },
    weatherInfoContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    weatherIcon: {
        width: 100,
        height: 100,
    },
    locationText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    temperatureText: {
        fontSize: 70,
        color: '#FFFFFF',
    },
    highLowText: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    mapContainer: {
        borderStyle: 'solid',
        borderWidth: 0.2,
        borderRadius: 15,
    },
    mapView: {
        height: 400,
        marginTop: 10,
        borderStyle: 'solid',
        borderWidth: 0.2,
        borderRadius: 15,
    },
    btnText: {
        color: '#000000',
        fontWeight: 'bold',
    },
    mapBtnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        width: '100%',
    },
    mapBtn: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 15,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    hourlyForecastContainer: {
        width: '100%',
        backgroundColor: '#FFFFFF50',
        borderRadius: 15,
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    hourlyForecast: {
        padding: 10,
        alignItems: 'center',
    },
    hourIcon: {
        width: 50,
        height: 50,
    },
    hourText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
});