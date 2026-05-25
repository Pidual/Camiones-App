import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from './api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            userType: action.userType,
            isLoading: false,
            user: action.user,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            userType: action.userType,
            user: action.user,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            userType: null,
            user: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      userType: null,
      user: null,
    }
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken, userType;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        userType = await AsyncStorage.getItem('userType');
      } catch (e) {
        // Restoring token failed
      }

      dispatch({ type: 'RESTORE_TOKEN', token: userToken, userType, user: null });
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    signIn: async (email, password) => {
      try {
        const res = await authAPI.login(email, password);
        const { token, userId, userType } = res.data;
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userId', userId);
        await AsyncStorage.setItem('userType', userType);
        dispatch({
          type: 'SIGN_IN',
          token,
          userType,
          user: { userId, email, userType },
        });
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.error || 'Login failed',
        };
      }
    },
    signUp: async (email, password, phone, userType) => {
      try {
        const res = await authAPI.signup(email, password, phone, userType);
        const { token, userId } = res.data;
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userId', userId);
        await AsyncStorage.setItem('userType', userType);
        dispatch({
          type: 'SIGN_IN',
          token,
          userType,
          user: { userId, email, userType },
        });
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.error || 'Signup failed',
        };
      }
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('userType');
        dispatch({ type: 'SIGN_OUT' });
      } catch (error) {
        console.error('Logout error:', error);
      }
    },
  };

  return (
    <AuthContext.Provider value={{ ...state, ...authContext }}>
      {children}
    </AuthContext.Provider>
  );
};
