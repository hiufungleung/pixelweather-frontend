import React, { useState, useEffect, useRef } from 'react';
import * as RN from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, {Marker} from 'react-native-maps';
import GradientTheme from '@/components/GradientTheme';
import { useAuth } from '@/components/accAuth';
import * as WeatherIcons from "@/constants/Mappings";
import * as ColorScheme from "@/constants/ColorScheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
    getCurrentLocation,
    fetchWeather,
    fetchHourlyForecast,
    loadRecentSearches,
    saveRecentSearch,
    removeSearchItem,
    fetchFilteredPosts,
    handleAddPost,
    isLocationSaved,
    fetchSavedLocations,
    setPostModalVisible,
    fetchSuburbs,
    handleInputChange,
    handleSuggestionSelect, handleToggleLike, handleLikedPost,
} from '@/constants/mapUtils';
import {usePosts} from "@/hooks/usePosts"
import {BTN_BACKGROUND} from "@/constants/ColorScheme";
import {Text, TouchableOpacity} from "react-native";


const SCREEN_HEIGHT = RN.Dimensions.get('window').height;  // 取得螢幕高度
const SCREEN_WIDTH = RN.Dimensions.get('window').width;    // 取得螢幕寬度

const SEARCH_CONTAINER_WIDTH = SCREEN_WIDTH - 30;  // SearchContainer 的寬度 (左右 margin 各 15)
const BUTTON_TO_TOP_DISTANCE = SCREEN_HEIGHT*0.08;

const API_KEY = '9480d17e216cfcf5b44da6050c7286a4'; // 替换为你的天气API密钥


// HomeScreen 組件
export default function HomeScreen() {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [weather, setWeather] = useState(null);
    const [suburb, setSuburb] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [hourlyForecast, setHourlyForecast] = useState([]);
    const [mapExpanded, setMapExpanded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);  // 控制搜尋框是否展開
    const [savedLocations, setSavedLocations] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);  // 存放最近的搜尋紀錄
    const [modalVisible, setModalVisible] = useState(false);
    const [postVisible, setPostVisible] = useState(false);
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [markerPressed, setMarkerPressed] = useState(false);  // 追蹤是否點擊了 Marker
    const [isLiked, setIsLiked] = useState(null); // 初始化為 `item` 中的 liked 狀態
    const [likeCount, setLikeCount] = useState(0); // 初始化喜歡的數量


    const animatedHeight = useRef(new RN.Animated.Value(400)).current;  // 初始化地圖高度動畫
    const animatedWidth = useRef(new RN.Animated.Value(SEARCH_CONTAINER_WIDTH)).current;  // 初始化地圖寬度動畫
    const animatedPadding = useRef(new RN.Animated.Value(15)).current;  // 初始化 `paddingHorizontal`
    const animatedBorderRadius = useRef(new RN.Animated.Value(15)).current;  // 初始化 `borderRadius`
    const animatedBtnTop = useRef(new RN.Animated.Value(50)).current; // 控制按鈕的 top 屬性
    const{handleToogleLike} = usePosts();

    const { isLoggedIn, userToken } = useAuth(); // 使用 `useAuth` 取得登入狀態

    useEffect(() => {
        const initializeData = async () => {
            setLoading(true);

            // 取得當前位置及天氣資訊
            const coords = await getCurrentLocation();
            if (coords) {
                setLocation(coords);
                const weatherData = await fetchWeather(coords.latitude, coords.longitude);
                setWeather(weatherData);
                const hourlyData = await fetchHourlyForecast(coords.latitude, coords.longitude);
                setHourlyForecast(hourlyData);
                const isCurrentLocationSaved = await isLocationSaved(weatherData, savedLocations)
                setIsSaved(isCurrentLocationSaved);
            }
            const locations = await fetchSavedLocations(userToken);
            setSavedLocations(locations);
            // 讀取最近搜尋
            await loadRecentSearches(setRecentSearches);
            const savedPosts = await fetchFilteredPosts(userToken);
            setPosts(savedPosts);
            const suburbList = await fetchSuburbs(userToken);
            setSuburb(suburbList);
            setLoading(false);
        };

        initializeData();
    }, []);


    const searchLocation = async () => {
        if (!searchQuery.trim()) {
            RN.Alert.alert('Please enter a location to search.');
            return;
        }
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&units=metric&appid=${API_KEY}`
            );
            const data = await response.json();
            setWeather(data);
            const { lon, lat } = data.coord;
            setLocation({ latitude: lat, longitude: lon });
            const hourlyData = await fetchHourlyForecast(lat, lon);
            setHourlyForecast(hourlyData);
            await saveRecentSearch(searchQuery, recentSearches, setRecentSearches);
            const isCurrentLocationSaved = await isLocationSaved(data, savedLocations)
            setIsSaved(isCurrentLocationSaved);
            const savedPosts = await fetchFilteredPosts(userToken);
            setPosts(savedPosts);
        } catch (error) {
            console.error(error);
        }
    };

    const handleMapPress = () => {
        if (!markerPressed) {
            setMapExpanded(!mapExpanded);
            RN.Animated.timing(animatedHeight, {
                toValue: mapExpanded ? 400 : SCREEN_HEIGHT,  // 高度改變
                duration: 300,
                useNativeDriver: false,
            }).start();

            RN.Animated.timing(animatedWidth, {
                toValue: mapExpanded ? SEARCH_CONTAINER_WIDTH : SCREEN_WIDTH,  // 寬度改變
                duration: 300,
                useNativeDriver: false,
            }).start();

            RN.Animated.timing(animatedPadding, {
                toValue: mapExpanded ? 15 : 0,  // 根據地圖狀態更改 `paddingHorizontal`
                duration: 300,
                useNativeDriver: false,
            }).start();

            RN.Animated.timing(animatedBorderRadius, {
                toValue: mapExpanded ? 15 : 0,  // 邊角半徑變化：展開時為 0（直角），收起時為 15（圓角）
                duration: 300,
                useNativeDriver: false,
            }).start();

            RN.Animated.timing(animatedBtnTop, {
                toValue: mapExpanded ? 15 : BUTTON_TO_TOP_DISTANCE,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    const filteredPosts = posts.filter(post => post.suburb_name.toLowerCase() === (weather?.name || '').toLowerCase());


    if (loading) {
        return (
            <GradientTheme>
                <RN.ActivityIndicator size="large" color={ColorScheme.BTN_BACKGROUND} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
            </GradientTheme>
        );
    }

    return (
        <GradientTheme>
            <SafeAreaView style={{ flex: 1 }}>
                <RN.Animated.View style={{ flex: 1, paddingTop: 10, paddingHorizontal: animatedPadding }}>
                    <RN.View style={styles.searchContainer}>
                        <RN.TextInput
                            style={styles.searchInput}
                            placeholder="Search Location"
                            value={searchQuery}
                            onFocus={() => {
                                setExpanded(true);
                                setModalVisible(true); // 當點擊 TextInput 時顯示 Modal
                            }}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={() => {
                                searchLocation();
                            }}
                        />
                        {/* 點擊放大鏡執行搜尋 */}
                        <FontAwesome6 name="magnifying-glass" size={20} color="gray" style={styles.searchIcon} onPress={searchLocation} />
                    </RN.View>

                    {weather && location ? (
                        <RN.View>
                            {/* 天氣資訊顯示容器 */}
                            <RN.View style={styles.weatherInfoContainer}>
                                <RN.View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <RN.Text style={styles.locationText}>
                                        {weather?.name ? `${weather.name}` : 'Unknown Location'}
                                        {/* 顯示書籤符號，如果是已保存的地點 */}
                                    </RN.Text>
                                    <RN.Text>{isSaved && <FontAwesome name="bookmark"  size={24} color="#FFFFFF" />}</RN.Text>
                                </RN.View>
                                <RN.View style={{ flexDirection: 'row', marginBottom: 30, marginTop:20, width: '75%', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <RN.Image source={WeatherIcons.weatherIconMap['Clear Sky']} style={styles.weatherIcon} />

                                    <RN.View style={{alignItems:'center', padding: 5}}>
                                        <RN.Text style={styles.temperatureText}>
                                            {weather.main?.temp ? `${weather.main.temp.toFixed(0)}` : 'N/A'}
                                            <RN.Text style={{fontSize: 20}}>{'°C'}</RN.Text>
                                        </RN.Text>

                                        {/* 高溫和低溫顯示 */}
                                        <RN.Text style={styles.highLowText}>
                                            {weather.main?.temp_max ? `H: ${weather.main.temp_max.toFixed(0)}` : 'H: N/A'} |
                                            {weather.main?.temp_min ? ` L: ${weather.main.temp_min.toFixed(0)}` : 'L: N/A'}
                                        </RN.Text>
                                    </RN.View>
                                </RN.View>

                                <RN.ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyForecastContainer}>
                                    {hourlyForecast.map((forecast, index) => (

                                        <RN.View key={index} style={styles.hourlyForecast}>
                                            <RN.Image source={forecast.icon} style={styles.hourIcon} />
                                            <RN.Text style={styles.hourText}>{forecast.time}</RN.Text>
                                            {/*<Text style={styles.hourText}>{forecast.temp}°C</Text>*/}
                                        </RN.View>
                                    ))}
                                </RN.ScrollView>
                            </RN.View>

                            {/* 地圖顯示 */}
                            <RN.Animated.View
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
                                    onPress={(e) => {
                                        if (!markerPressed) {
                                            handleMapPress();  // 僅當未點擊 Marker 時觸發展開地圖行為
                                        } else {
                                            setMarkerPressed(false);  // 重置狀態
                                        }
                                    }}
                                >
                                    {filteredPosts.map((post, index) => (
                                        <Marker
                                            key={index}
                                            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                                            title={post.suburb_name}
                                            onPress={() => {
                                                setMarkerPressed(true);
                                                setPostModalVisible(setPostVisible);

                                            }}
                                        >
                                            <RN.View style={styles.circleContainer}>
                                                <RN.Text style={styles.circleText}>{filteredPosts.length}</RN.Text>
                                            </RN.View>
                                        </Marker>
                                    ))}
                                </MapView>

                                <RN.Animated.View style={[styles.mapBtnContainer, { top: animatedBtnTop }]}>
                                    <RN.TouchableOpacity style={styles.mapBtn}>
                                        <RN.Text style={styles.btnText}>1 HR AGO</RN.Text>
                                    </RN.TouchableOpacity>
                                    <RN.TouchableOpacity style={styles.mapBtn} onPress={() => handleAddPost(isLoggedIn)}>
                                        <RN.Text style={styles.btnText}>+ ADD POST</RN.Text>
                                    </RN.TouchableOpacity>
                                </RN.Animated.View>
                            </RN.Animated.View>
                        </RN.View>
                    ) : null}
                </RN.Animated.View>

                {/* search modal*/}
                <RN.Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <RN.View style={{ flex: 1, paddingTop: 50, paddingHorizontal: 15 }}>
                        {/*<RN.View style={{zIndex:10,}}>*/}
                            <RN.View style={styles.fullScreenSearchContainer}>
                                <FontAwesome6
                                    name="arrow-left"
                                    size={20}
                                    color="gray"
                                    style={styles.fullScreenSearchIcon}
                                    onPress={() => {
                                        setExpanded(false);
                                        setModalVisible(false);
                                    }}
                                />
                                <RN.TextInput
                                    style={styles.fullScreenSearchInput}
                                    placeholder="Search Here"
                                    value={searchQuery}
                                    onChangeText={(text) => handleInputChange(text, suburb, setSearchQuery, setFilteredSuggestions, setShowSuggestions)}
                                    onSubmitEditing={() => {
                                        searchLocation();
                                        setExpanded(false);
                                        setModalVisible(false);
                                    }}
                                />
                                <FontAwesome6 name="magnifying-glass" size={20} color="gray" style={styles.searchIcon} onPress={() => {
                                    searchLocation();
                                    setExpanded(false);
                                    setModalVisible(false);
                                }}
                                />
                            </RN.View>
                            {showSuggestions && filteredSuggestions.length > 0 && (
                                <RN.FlatList
                                    data={filteredSuggestions}
                                    keyExtractor={(item) => item.suburb_id}
                                    renderItem={({ item }) => { // 檢查 renderItem 中的 item
                                        return (
                                            <RN.TouchableOpacity
                                                style={styles.suggestionItem}
                                                onPress={() => {
                                                    handleSuggestionSelect(item.suburb_name, setSearchQuery, setShowSuggestions);
                                                }}
                                            >
                                                <RN.Text style={styles.suggestionText}>{item.suburb_name}</RN.Text>
                                            </RN.TouchableOpacity>
                                        );
                                    }}
                                    style={styles.suggestionList}
                                />
                            )}
                        {/*</RN.View>*/}

                        {/* Recent Searches List */}
                        <RN.ScrollView style={styles.recentSearchContainer}>
                            {recentSearches.length > 0 ? (
                                recentSearches.map((item, index) => (
                                    <RN.View key={index} style={styles.recentSearchItem}>
                                        <RN.View style={{flexDirection:'row', alignItems:'center'}}>
                                            <FontAwesome6 name="clock-rotate-left" size={20} color="gray" style={{ marginRight: 10 }} />
                                            <RN.TouchableOpacity onPress={() => setSearchQuery(item)}>
                                                <RN.Text style={{ fontSize: 20}}>{item}</RN.Text>
                                            </RN.TouchableOpacity>
                                        </RN.View>
                                        <RN.TouchableOpacity onPress={() => removeSearchItem(index, recentSearches, setRecentSearches)}>
                                            <FontAwesome6 name="xmark" size={20} color="black" />
                                        </RN.TouchableOpacity>
                                    </RN.View>
                                ))
                            ) : (
                                <RN.Text style={styles.noRecentSearch}>No recent searches</RN.Text>
                            )}
                        </RN.ScrollView>
                    </RN.View>
                </RN.Modal>

                    <RN.Modal
                        animationType="slide"
                        transparent={true}
                        visible={postVisible}
                        onRequestClose={() => {
                            setSelectedPost(null);
                            setPostVisible(false);
                        }} // Hide the modal when user taps outside
                    >

                        <RN.View style={styles.modalBackdrop}>
                            {/* Modal 容器 */}

                            <RN.View style={styles.modalContainer}>
                                <GradientTheme>
                                {!selectedPost ? (
                                    <>
                                        <RN.ScrollView style={styles.modalContent}>
                                            {filteredPosts.map((post, index) => (
                                                <RN.TouchableOpacity
                                                    key={index}
                                                    style={styles.postContainer}
                                                    onPress={() => {
                                                        setSelectedPost(post);
                                                        handleLikedPost(userToken, post.post_id, setIsLiked);
                                                    }} // 點擊某篇 post 顯示詳細內容
                                                >
                                                    <RN.Text style={styles.postTitle}>Post ID: {post.post_id}</RN.Text>
                                                    <RN.Text style={styles.postText}>{post.comment}</RN.Text>
                                                    <RN.Text style={styles.postDetails}>Likes: {post.likes} | Views: {post.views}</RN.Text>
                                                    <RN.Text style={styles.postDetails}>Weather: {post.weather}</RN.Text>
                                                </RN.TouchableOpacity>
                                            ))}
                                        </RN.ScrollView>
                                        {/* 底部按鈕區域 */}
                                        <RN.View style={styles.footer}>
                                            <RN.Button title="Close" onPress={() => setPostVisible(false)} />
                                        </RN.View>
                                    </>
                                ) : (
                                    // 顯示選中 post 的詳細內容
                                    <RN.View style={styles.postDetailContainer}>
                                        <FontAwesome6
                                            name="arrow-left"
                                            size={26}
                                            color= {BTN_BACKGROUND}
                                            style={styles.postBackIcon}
                                            onPress={async () => {
                                                try {
                                                    // 返回的時候先將選中的貼文設為 null
                                                    setSelectedPost(null);

                                                    // 取得過濾後的貼文
                                                    const savedPosts = await fetchFilteredPosts(userToken);

                                                    // 更新 `posts` 狀態
                                                    setPosts(savedPosts);
                                                } catch (error) {
                                                    console.error("Error retrieving filtered posts:", error);
                                                }
                                        }}
                                        />
                                        <RN.Text style={styles.postDetailTitle}>Post ID: {selectedPost.post_id}</RN.Text>
                                        <RN.Text style={styles.postDetailText}>{selectedPost.comment}</RN.Text>
                                        <RN.Text style={styles.postDetailInfo}>Likes: {likeCount} | Views: {selectedPost.views}</RN.Text>
                                        <TouchableOpacity
                                            style={styles.iconGroup}
                                            onPress={() => {
                                                handleToggleLike(userToken, selectedPost.post_id, isLiked, likeCount, setLikeCount, setIsLiked);
                                                console.log(selectedPost.post_id, selectedPost.likes);

                                            }}
                                        >
                                            <Icon
                                                name={isLiked ? "favorite" : "favorite-border"}
                                                size={24}
                                                color={isLiked ? "red" : "black"} // Red when liked
                                            />
                                            <Text style={styles.likeCount}>{likeCount}</Text>
                                        </TouchableOpacity>
                                        <RN.Text style={styles.postDetailInfo}>Weather: {selectedPost.weather}</RN.Text>

                                        {/* 可以顯示其他更多詳細內容 */}
                                        <RN.Text style={styles.additionalInfo}>Additional Info: {selectedPost.additionalInfo}</RN.Text>


                                    </RN.View>
                                )}
                            </GradientTheme>
                            </RN.View>

                        </RN.View>

                    </RN.Modal>

            </SafeAreaView>
        </GradientTheme>
    );
}

const styles = RN.StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor: 'gray',
        // borderWidth: 1,
        backgroundColor: '#ffffff90',
        borderRadius: 30,
    },
    searchInput: {
        flex: 1,
        height: 50,
        paddingHorizontal: 15,
        fontSize: 20,
    },
    searchIcon: {
        paddingRight: 15,
    },
    weatherInfoContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    weatherIcon: {
        width: 120,
        height: 120,
    },
    locationText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        paddingRight: 10,
    },
    temperatureText: {
        fontSize: 90,
        color: '#FFFFFF',
    },
    highLowText: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    mapContainer: {
        // borderStyle: 'solid',
        // borderWidth: 0.2,
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
        // fontWeight: 'bold',
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
        borderRadius: 30,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    hourlyForecastContainer: {
        width: '100%',
        backgroundColor: '#FFFFFF50',
        borderRadius: 20,
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

    // Full screen style
    fullScreenSearchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: ColorScheme.BTN_BACKGROUND,
        borderWidth: 1,
        backgroundColor: '#ffffff90',
        borderRadius: 30,
        marginTop: 10
    },
    fullScreenSearchInput: {
        flex: 1,
        height: 50,
        paddingHorizontal: 15,
        fontSize: 20,
    },
    fullScreenSearchIcon: {
        paddingLeft: 15,
        color: ColorScheme.BTN_BACKGROUND,
    },

    // recent search style
    recentSearchContainer: {
        flexDirection: 'row',
        paddingLeft:15,
        paddingTop: 10,
        // borderWidth:1
    },
    recentSearchItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: SCREEN_WIDTH*0.85,
        // borderWidth: 1,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#D0D0D090',
    },
    noRecentSearch: {
        flexDirection: 'row',
    },
    circleContainer: {
        backgroundColor: 'rgba(0, 150, 255, 0.7)',
        borderRadius: 30,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    calloutContainer:{
        flexDirection: 'column',
        width: 400,
    },
    calloutTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    calloutText: {
        fontSize: 14,
    },
    modalView: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },

    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明背景
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        width: '85%',
        height: '60%', // 固定 Modal 的高度
        borderRadius: 20,
        overflow: 'hidden',
    },
    modalContent: {
        padding: 20,
        height: '80%', // ScrollView 的高度，讓內部 post 可以滾動
    },
    footer: {
        height: '10%', // 預留按鈕區域的高度
        justifyContent: 'center',
        alignItems: 'center',
    },
    postContainer: {
        marginBottom: 15,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    postTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    postText: {
        marginBottom: 10,
    },
    postDetails: {
        fontSize: 12,
        color: '#555',
    },
    postDetailContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    postDetailTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    postDetailText: {
        fontSize: 18,
        marginVertical: 10,
    },
    postDetailInfo: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 20,
    },
    additionalInfo: {
        fontSize: 16,
        marginBottom: 20,
    },

    suggestionList: {
        position: 'absolute', // 設置為絕對定位
        top: 120, // 根據輸入框位置調整，確保它顯示在輸入框下方
        width: '100%',
        maxHeight: '40%',
        backgroundColor: '#ffffff',
        zIndex: 100, // 確保它顯示在其他元素上方
        marginLeft:15,
        borderLeftWidth: 1,
        borderLeftColor:BTN_BACKGROUND,
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    suggestionText: {
        fontSize: 16,
    },
    postBackIcon: {
        position: 'absolute',
        top: 20,
        left: 20,
    },

});