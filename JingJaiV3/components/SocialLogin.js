import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { callAPI } from '../services/api';

WebBrowser.maybeCompleteAuthSession();

const SocialLogin = ({ provider, onLoginSuccess, onLoginError, style, textStyle, showIcon = true }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Configurations
  const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
  const FACEBOOK_APP_ID = 'YOUR_FACEBOOK_APP_ID';

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'your-app-scheme', // replace with your app scheme
    path: 'auth',
  });

  const handleLogin = async () => {
    try {
      setIsLoading(true);

      let authUrl;
      if (provider === 'google') {
        authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=profile%20email`;
      } else if (provider === 'facebook') {
        authUrl = `https://www.facebook.com/v16.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=email,public_profile`;
      } else {
        throw new Error('Unsupported provider');
      }

      const result = await AuthSession.startAsync({ authUrl });
      console.log(`${provider} auth result:`, result);

      if (result.type === 'success' && result.params.access_token) {
        await handleSuccessfulAuth(result.params.access_token);
      } else if (result.type === 'cancel') {
        console.log(`${provider} login cancelled`);
      } else {
        throw new Error(`Authentication failed: ${result.type}`);
      }

    } catch (error) {
      console.error(`${provider} authentication error:`, error);
      const errorMessage = getErrorMessage(error);
      onLoginError ? onLoginError(errorMessage) : Alert.alert(`${provider} Login Failed`, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulAuth = async (accessToken) => {
    try {
      const userInfo = provider === 'google'
        ? await fetchGoogleUserInfo(accessToken)
        : await fetchFacebookUserInfo(accessToken);

      console.log(`${provider} user info:`, userInfo);

      const backendResponse = await authenticateWithBackend(userInfo, accessToken);
      onLoginSuccess
        ? onLoginSuccess(backendResponse)
        : Alert.alert('Welcome!', `Signed in as ${userInfo.name}`);

    } catch (error) {
      console.error('Failed to complete authentication:', error);
      throw error;
    }
  };

  const fetchGoogleUserInfo = async (accessToken) => {
    const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error('Failed to fetch Google user info');
    return res.json();
  };

  const fetchFacebookUserInfo = async (accessToken) => {
    const res = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`);
    if (!res.ok) throw new Error('Failed to fetch Facebook user info');
    const data = await res.json();
    return { ...data, picture: data.picture.data.url };
  };

  const authenticateWithBackend = async (userInfo, accessToken) => {
    const payload = {
      provider,
      providerId: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      accessToken,
    };
    console.log('Sending auth data to backend...', payload);
    return await callAPI(`/auth/${provider}`, 'POST', payload);
  };

  const getErrorMessage = (error) => {
    if (error.message.includes('Network request failed')) {
      return 'Network error. Please check your internet connection.';
    }
    if (error.message.includes('access_token')) {
      return 'Failed to get authentication token. Please try again.';
    }
    return `${provider} login failed. Please try again.`;
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
          opacity: isLoading ? 0.7 : 1,
        },
        style,
      ]}
      onPress={handleLogin}
      disabled={isLoading}
      activeOpacity={0.7}
    >
      {showIcon && (
        <View style={{ width: 20, height: 20, marginRight: 10, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: provider === 'google' ? '#4285F4' : '#1877F2' }}>
            {provider === 'google' ? 'G' : 'f'}
          </Text>
        </View>
      )}
      <Text style={[{ fontSize: 14, color: '#374151', fontWeight: '500', flex: 1 }, textStyle]}>
        {isLoading ? `Signing in with ${provider}...` : `Continue with ${capitalize(provider)}`}
      </Text>
      {isLoading && (
        <MaterialCommunityIcons
          name="loading"
          size={16}
          color="#9CA3AF"
          style={{ marginLeft: 8 }}
        />
      )}
    </TouchableOpacity>
  );
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default SocialLogin;
