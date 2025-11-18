import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { callAPI } from '../services/api';

WebBrowser.maybeCompleteAuthSession();

const FacebookLogin = ({ onLoginSuccess, onLoginError, style, textStyle, showIcon = true }) => {
  const [isLoading, setIsLoading] = useState(false);

  const FB_APP_ID = '1275911670847486'; // Replace with your App ID
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'your-app-scheme', // same scheme as Google
    path: 'auth',
  });

  const handleFacebookLogin = async () => {
    try {
      setIsLoading(true);

      const authUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=email,public_profile`;

      const result = await AuthSession.startAsync({ authUrl });

      if (result.type === 'success') {
        const { access_token } = result.params;
        if (access_token) {
          await handleSuccessfulAuth(access_token);
        } else {
          throw new Error('No access token received');
        }
      } else if (result.type === 'cancel') {
        console.log('User cancelled Facebook login');
      } else {
        throw new Error(`Authentication failed: ${result.type}`);
      }
    } catch (error) {
      console.error('Facebook authentication error:', error);
      const errorMessage = error.message || 'Facebook login failed';
      if (onLoginError) {
        onLoginError(errorMessage);
      } else {
        Alert.alert('Facebook Login Failed', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulAuth = async (accessToken) => {
    try {
      const userInfo = await fetchFacebookUserInfo(accessToken);
      console.log('Facebook user info:', userInfo);

      const backendResponse = await authenticateWithBackend(userInfo, accessToken);

      if (onLoginSuccess) {
        onLoginSuccess(backendResponse);
      } else {
        Alert.alert(
          'Welcome!',
          `Successfully signed in as ${userInfo.name}`,
          [{ text: 'Continue' }]
        );
      }
    } catch (error) {
      console.error('Failed to complete Facebook auth:', error);
      throw error;
    }
  };

  const fetchFacebookUserInfo = async (accessToken) => {
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );
    if (!response.ok) throw new Error('Failed to fetch Facebook user info');
    return await response.json();
  };

  const authenticateWithBackend = async (userInfo, accessToken) => {
    const loginData = {
      provider: 'facebook',
      providerId: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture?.data?.url,
      accessToken: accessToken,
    };

    const response = await callAPI('/auth/facebook', 'POST', loginData);
    return response;
  };

  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#1877F2',
          borderRadius: 10,
          paddingVertical: 12,
          paddingHorizontal: 16,
          opacity: isLoading ? 0.7 : 1,
        },
        style
      ]}
      onPress={handleFacebookLogin}
      disabled={isLoading}
      activeOpacity={0.7}
    >
      {showIcon && (
        <View style={{ marginRight: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>f</Text>
        </View>
      )}

      <Text style={[{ fontSize: 14, color: '#fff', fontWeight: '500' }, textStyle]}>
        {isLoading ? 'Signing in with Facebook...' : 'Continue with Facebook'}
      </Text>

      {isLoading && (
        <MaterialCommunityIcons name="loading" size={16} color="#fff" style={{ marginLeft: 8 }} />
      )}
    </TouchableOpacity>
  );
};

export default FacebookLogin;
