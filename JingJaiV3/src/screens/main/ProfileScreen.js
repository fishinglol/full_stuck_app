import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Alert,
  Switch,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    memberSince: '2024'
  });
  const [stats, setStats] = useState({
    authenticationsCount: 12,
    favoriteItems: 8,
    totalSpent: 2400,
  });
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
  });
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['userData', 'authToken']);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Logout failed:', error);
            }
          }
        }
      ]
    );
  };

  const toggleSetting = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  const MenuSection = ({ title, children }) => (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const MenuItem = ({ icon, title, subtitle, onPress, rightElement }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={22} color="#3498db" />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement || <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />}
    </TouchableOpacity>
  );

  const SettingsToggle = ({ icon, title, subtitle, value, onToggle }) => (
    <View style={styles.menuItem}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={22} color="#3498db" />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#ecf0f1", true: "#3498db" }}
        thumbColor={value ? "#FFFFFF" : "#bdc3c7"}
      />
    </View>
  );

  if (loading) {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#e8f4fd" />
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#e8f4fd" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="grid-outline" size={24} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={styles.logo}>TRUST<Text style={styles.logoAccent}>TAG</Text></Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#2c3e50" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileImageContainer}>
              <View style={styles.defaultAvatar}>
                <Text style={styles.avatarText}>
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'JD'}
                </Text>
              </View>
              <TouchableOpacity style={styles.editPhotoButton}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || ''}</Text>
            
            <View style={styles.verificationBadge}>
              <Ionicons name="shield-checkmark" size={16} color="#27ae60" />
              <Text style={styles.verificationText}>Verified Member</Text>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.authenticationsCount}</Text>
              <Text style={styles.statLabel}>Verifications</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.favoriteItems}</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>${stats.totalSpent}</Text>
              <Text style={styles.statLabel}>Spent</Text>
            </View>
          </View>

          {/* Account Section */}
          <MenuSection title="Account">
            <MenuItem
              icon="person-outline"
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={() => {}}
            />
            <MenuItem
              icon="shield-outline"
              title="Security"
              subtitle="Password and privacy settings"
              onPress={() => {}}
            />
            <MenuItem
              icon="card-outline"
              title="Payment Methods"
              subtitle="Manage cards and billing"
              onPress={() => {}}
            />
            <MenuItem
              icon="time-outline"
              title="Authentication History"
              subtitle="View past authentications"
              onPress={() => {}}
            />
          </MenuSection>

          {/* Preferences Section */}
          <MenuSection title="Preferences">
            <SettingsToggle
              icon="notifications-outline"
              title="Push Notifications"
              subtitle="Get notified about authentications"
              value={settings.notifications}
              onToggle={() => toggleSetting('notifications')}
            />
            <SettingsToggle
              icon="mail-outline"
              title="Email Updates"
              subtitle="Receive updates via email"
              value={settings.emailUpdates}
              onToggle={() => toggleSetting('emailUpdates')}
            />
          </MenuSection>

          {/* Support Section */}
          <MenuSection title="Support">
            <MenuItem
              icon="help-circle-outline"
              title="Help Center"
              subtitle="FAQs and guides"
              onPress={() => {}}
            />
            <MenuItem
              icon="chatbubble-ellipses-outline"
              title="Contact Support"
              subtitle="Get help from our team"
              onPress={() => {}}
            />
            <MenuItem
              icon="star-outline"
              title="Rate TRUSTTAG"
              subtitle="Share your feedback"
              onPress={() => {
                Alert.alert('Rate App', 'Thank you for using TRUSTTAG!');
              }}
            />
          </MenuSection>

          {/* About Section */}
          <MenuSection title="About">
            <MenuItem
              icon="document-text-outline"
              title="Terms of Service"
              onPress={() => {}}
            />
            <MenuItem
              icon="shield-checkmark-outline"
              title="Privacy Policy"
              onPress={() => {}}
            />
            <MenuItem
              icon="information-circle-outline"
              title="About TRUSTTAG"
              subtitle="Version 1.0.0"
              onPress={() => {}}
            />
          </MenuSection>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#e74c3c" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

          <View style={styles.footerSpace} />
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation && navigation.navigate('Home')}
          >
            <Ionicons name="home-outline" size={24} color="#7f8c8d" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation && navigation.navigate('Marketplace')}
          >
            <Ionicons name="cart-outline" size={24} color="#7f8c8d" />
            <Text style={styles.navText}>Market</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation && navigation.navigate('Verify')}
          >
            <Ionicons name="checkmark-circle-outline" size={24} color="#7f8c8d" />
            <Text style={styles.navText}>Verify</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation && navigation.navigate('Escrow')}
          >
            <Ionicons name="shield-outline" size={24} color="#7f8c8d" />
            <Text style={styles.navText}>Escrow</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navItem}
            onPress={() => navigation && navigation.navigate('Profile')}
          >
            <Ionicons name="person" size={24} color="#3498db" />
            <Text style={[styles.navText, styles.activeNavText]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f4fd',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  logoAccent: {
    color: '#3498db',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  defaultAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  verificationText: {
    color: '#2c3e50',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 15,
    paddingVertical: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#ecf0f1',
  },
  menuSection: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 15,
    marginBottom: 10,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#e8f4fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#7f8c8d',
    lineHeight: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 15,
    marginTop: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
    marginLeft: 8,
  },
  footerSpace: {
    height: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  activeNavText: {
    color: '#3498db',
  },
});

export default ProfileScreen;