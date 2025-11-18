// components/GoogleLogin.js
import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { callAPI } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

const GoogleLogin = ({ 
  onLoginSuccess, 
  onLoginError, 
  style, 
  textStyle 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Configure Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '24215322322-dvvqpfqc246rk0r63sks6ovbavcpt6f0.apps.googleusercontent.com',
    iosClientId: '24215322322-p74tg2r63c6lbrtsaq21s83fij35c7d5.apps.googleusercontent.com',
    androidClientId: '24215322322-vt6mhocivuedmmo17hc6ra71ss0uqj0n.apps.googleusercontent.com',
    webClientId: '24215322322-dvvqpfqc246rk0r63sks6ovbavcpt6f0.apps.googleusercontent.com',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleAuthSuccess(response);
    } else if (response?.type === 'error') {
      handleGoogleAuthError(response.error);
    }
  }, [response]);

  const handleGoogleAuthSuccess = async (authResponse) => {
    setIsLoading(true);
    
    try {
      // Get user info from Google
      const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${authResponse.authentication.accessToken}`
      );
      
      if (!userInfoResponse.ok) {
        throw new Error('Failed to get user info from Google');
      }
      
      const googleUser = await userInfoResponse.json();
      
      // Send to your backend
      const authData = {
        provider: 'google',
        providerId: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        accessToken: authResponse.authentication.accessToken
      };
      
      const backendResponse = await callAPI('/auth/google', 'POST', authData);

      // Save token and user ID to AsyncStorage
      if (backendResponse.token && backendResponse.user?.id) {
        await AsyncStorage.setItem('userToken', backendResponse.token);
        await AsyncStorage.setItem('userId', backendResponse.user.id.toString());
      } else {
        throw new Error('Token or user ID not found in backend response');
      }
      
      if (onLoginSuccess) {
        onLoginSuccess(backendResponse);
      }
      
    } catch (error) {
      console.error('Google authentication error:', error);
      const errorMessage = error.message || 'Google authentication failed';
      
      if (onLoginError) {
        onLoginError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuthError = (error) => {
    console.error('Google Auth Error:', error);
    if (onLoginError) {
      onLoginError('Google authentication was cancelled or failed');
    }
  };

  const handleGoogleLogin = async () => {
    if (!request) {
      Alert.alert('Error', 'Google authentication is not ready');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await promptAsync();
    } catch (error) {
      console.error('Error starting Google auth:', error);
      if (onLoginError) {
        onLoginError('Failed to start Google authentication');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity 
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: 10,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.03,
          shadowRadius: 2,
          elevation: 1,
        },
        style
      ]} 
      onPress={handleGoogleLogin}
      disabled={!request || isLoading}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons 
        name="google" 
        size={20} 
        color="#4285F4" 
      />
      <Text 
        style={[
          {
            fontSize: 14,
            color: '#374151',
            marginLeft: 10,
            fontWeight: '500',
          },
          textStyle
        ]}
      >
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </Text>
    </TouchableOpacity>
  );
};

export default GoogleLogin;