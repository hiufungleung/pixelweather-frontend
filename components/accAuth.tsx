import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';  // 引入 `expo-secure-store`

// 建立一個 context，用來管理登入狀態
export const AuthContext = createContext();

// 提供者組件，包裹應用所有的子組件
export const AuthProvider = ({ children }) => {
    // 管理登入狀態、用戶資料和 token 的狀態變數
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userToken, setUserToken] = useState(null); // 用來存儲用戶的登入 token
    const [userData, setUserData] = useState(null);  // 存儲使用者的其他資料

    // 當應用啟動時，檢查是否已經儲存了登入狀態
    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync('userToken');  // 使用 SecureStore 取代 AsyncStorage
                const storedUserData = await SecureStore.getItemAsync('userData'); // 使用 SecureStore 取代 AsyncStorage

                if (storedToken) {
                    setUserToken(storedToken);
                    setUserData(JSON.parse(storedUserData));
                    setIsLoggedIn(true);
                }
            } catch (e) {
                console.error('Failed to load token');
            }

        };
        loadToken();
    }, []);

    // useEffect(() => {
    //     // 每當 `userData` 發生變化時列印出其內容
    //     console.log('Current User Data:', userData);
    // }, [userData]);

    // 定義登入方法
    const login = async (token, userInfo) => {
        setIsLoggedIn(true);
        setUserToken(token);
        setUserData(userInfo);

        // 保存到 SecureStore
        await SecureStore.setItemAsync('userToken', token); // 使用 SecureStore 存儲 Token
        await SecureStore.setItemAsync('userData', JSON.stringify(userInfo)); // 使用 SecureStore 存儲用戶資料
    };

    // 定義登出方法
    const logout = async () => {
        setIsLoggedIn(false);
        setUserToken(null);
        setUserData(null);

        // 移除 SecureStore 中的資料
        await SecureStore.deleteItemAsync('userToken');  // 使用 SecureStore 刪除 Token
        await SecureStore.deleteItemAsync('userData');  // 使用 SecureStore 刪除用戶資料
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, userToken, userData }}>
            {children}
        </AuthContext.Provider>
    );
};

// 自定義 Hook：用來方便取得 `AuthContext` 的內容
export const useAuth = () => useContext(AuthContext);