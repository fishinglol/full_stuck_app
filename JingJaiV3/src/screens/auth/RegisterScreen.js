import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, StatusBar, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { registerUser } from '../../../services/api';
import GoogleLogin from '../../../components/GoogleLogin';

export default function RegisterScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Basic validation
    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const userData = { 
        name: name.trim(), 
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(), 
        password: password.trim() 
      };
      
      console.log('Attempting registration with:', userData.email);
      const response = await registerUser(userData);
      
      console.log('Registration successful:', response);
      
      // Clear form on success
      setName('');
      setUsername('');
      setEmail('');
      setPassword('');
      
      Alert.alert("Welcome!", "Account created successfully!", [
        {
          text: "Continue to Login",
          onPress: () => {
            if (navigation && navigation.navigate) {
              navigation.navigate('Login');
            }
          }
        }
      ]);
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific error messages from backend
      let errorMessage = "Registration failed. Please try again.";
      if (error.message.includes("Email already registered")) {
        errorMessage = "Email already registered. Please use a different email.";
      } else if (error.message.includes("Username already taken")) {
        errorMessage = "Username already taken. Please choose a different one.";
      } else if (error.message.includes("Network request failed")) {
        errorMessage = "Cannot connect to server. Please check your internet connection.";
      }
      
      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Unified success handler for both regular and Google registration
  const handleRegistrationSuccess = (response) => {
    const userName = response?.user?.name || 'User';
    Alert.alert("Welcome!", `Account created successfully! Welcome, ${userName}`, [
      {
        text: "Continue",
        onPress: () => {
          if (navigation && navigation.navigate) {
            // Pass user data to HomeScreen
            navigation.navigate('Home', { user: response.user });
          }
        }
      }
    ]);
  };

  // Handle Google registration success
  const handleGoogleRegistrationSuccess = (response) => {
    console.log('Google registration successful:', response);
    handleRegistrationSuccess(response);
  };

  // Handle Google registration error
  const handleGoogleRegistrationError = (errorMessage) => {
    Alert.alert("Google Registration Failed", errorMessage);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#74cefbff', '#ffffff68', '#74b5ffff', '#4f7bf376', '#0052eaff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        <View style={styles.container}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Text style={styles.logoText}>
              <Text style={styles.logoBlue}>TRUST</Text>
              <Text style={styles.logoLight}>TAG</Text>
            </Text>
          </View>

          {/* Main Card */}
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join Trasttag to authenticate{'\n'}your luxury items with experts.
              </Text>
            </View>

            {/* Input Section */}
            <View style={styles.inputSection}>
              {/* Name Input */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="account-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* Username Input */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="at" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="email-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="lock-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <MaterialCommunityIcons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#9CA3AF" 
                  />
                </TouchableOpacity>
              </View>

              {/* Login Links */}
              <View style={styles.forgotSection}>
                <TouchableOpacity 
                  style={styles.forgotContainer}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.forgotText}>Already have an account?</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Create Account Button */}
            <TouchableOpacity 
              style={[styles.getStartedButton, isLoading && styles.disabledButton]} 
              onPress={handleRegister}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#7DD3FC', '#38BDF8', '#0EA5E9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.getStartedGradient}
              >
                <Text style={styles.getStartedText}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <Text style={styles.dividerText}>Or Register with</Text>

            {/* Social Registration Buttons */}
            <View style={styles.socialSection}>
              <TouchableOpacity 
                style={styles.socialButton} 
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="facebook" size={20} color="#1877F2" />
                <Text style={styles.socialText}>Continue with Facebook</Text>
              </TouchableOpacity>
              
              {/* Google Registration */}
              <GoogleLogin 
                onLoginSuccess={handleGoogleRegistrationSuccess}
                onLoginError={handleGoogleRegistrationError}
                style={styles.socialButton}
                textStyle={styles.socialText}
              />
              
              <TouchableOpacity 
                style={styles.socialButton} 
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="apple" size={20} color="#000" />
                <Text style={styles.socialText}>Continue with Apple</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: height * 0.06,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: height * 0.03,
    paddingHorizontal: width * 0.05,
  },
  logoText: {
    fontSize: width * 0.12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  logoBlue: {
    color: '#002D72',
    fontWeight: 'normal',
  },
  logoLight: {
    color: '#38BDF8',
    fontWeight: 'normal',
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: height * 0.025,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: width * 0.032,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: width * 0.045,
  },
  inputSection: {
    marginBottom: height * 0.02,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: width * 0.035,
    marginBottom: height * 0.015,
    height: height * 0.055,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: width * 0.035,
    color: '#1F2937',
  },
  eyeButton: {
    padding: 3,
  },
  forgotSection: {
    alignItems: 'flex-end',
    marginTop: -height * 0.005,
  },
  forgotContainer: {
    marginBottom: 2,
  },
  forgotText: {
    color: '#9CA3AF',
    fontSize: width * 0.03,
    textDecorationLine: 'underline',
  },
  getStartedButton: {
    borderRadius: 14,
    marginBottom: height * 0.02,
    shadowColor: '#54bbffff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.7,
  },
  getStartedGradient: {
    paddingVertical: height * 0.018,
    alignItems: 'center',
    borderRadius: 14,
    borderBottomWidth: 2,
    borderBottomColor: '#7abfffff',
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dividerText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: width * 0.03,
    marginBottom: height * 0.02,
  },
  socialSection: {
    gap: height * 0.01,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.035,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  socialText: {
    fontSize: width * 0.035,
    color: '#374151',
    marginLeft: 10,
    fontWeight: '500',
  },
});