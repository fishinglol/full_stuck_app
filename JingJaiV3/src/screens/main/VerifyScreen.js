import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const VerifyScreen = ({ navigation, route }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const stats = [
    { count: '2.5K+', label: 'Verified Items', icon: 'checkmark-done-outline' },
    { count: '98%', label: 'Accuracy Rate', icon: 'analytics-outline' },
    { count: '24/7', label: 'Support', icon: 'time-outline' },
  ];

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
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Card */}
          <Animated.View 
            style={[
              styles.heroCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.heroIconContainer}>
              <Ionicons name="shield-checkmark" size={48} color="#3498db" />
            </View>
            <Text style={styles.heroTitle}>Legit Your Things</Text>
            <Text style={styles.heroSubtitle}>Legit Your Confidence</Text>
            <Text style={styles.heroDescription}>
              AI-powered authentication for luxury brands
            </Text>
          </Animated.View>

          {/* Stats Row */}
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.statCard,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                  }
                ]}
              >
                <Ionicons name={stat.icon} size={28} color="#3498db" />
                <Text style={styles.statCount}>{stat.count}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Animated.View>
            ))}
          </View>

          {/* Recent Verifications */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Verifications</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.certificatesScroll}
            >
              {[1, 2, 3, 4].map((item, index) => (
                <View key={index} style={styles.certificateCard}>
                  <View style={styles.certificateIconContainer}>
                    <Ionicons name="checkmark-circle" size={40} color="#27ae60" />
                  </View>
                  <Text style={styles.certificateText}>VERIFIED</Text>
                  <Text style={styles.certificateDate}>5/19/2023</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Main Verify Button */}
          <TouchableOpacity 
            style={styles.verifyButton}
            onPress={() => navigation && navigation.navigate('Category')}
            activeOpacity={0.8}
          >
            <View style={styles.verifyButtonContent}>
              <View style={styles.verifyIconCircle}>
                <Ionicons name="scan" size={28} color="white" />
              </View>
              <View style={styles.verifyButtonTextContainer}>
                <Text style={styles.verifyButtonTitle}>Start Verification</Text>
                <Text style={styles.verifyButtonSubtitle}>
                  Authenticate your luxury items now
                </Text>
              </View>
            </View>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>

          {/* Info Cards */}
          <View style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <Ionicons name="flash" size={32} color="#3498db" />
              <Text style={styles.infoCardTitle}>Fast Process</Text>
              <Text style={styles.infoCardText}>Get results in 10-20 minutes</Text>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="shield-checkmark" size={32} color="#3498db" />
              <Text style={styles.infoCardTitle}>AI Powered</Text>
              <Text style={styles.infoCardText}>95% accuracy with deep learning</Text>
            </View>
          </View>
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
            <Ionicons name="checkmark-circle" size={24} color="#3498db" />
            <Text style={[styles.navText, styles.activeNavText]}>Verify</Text>
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
            <Ionicons name="person-outline" size={24} color="#7f8c8d" />
            <Text style={styles.navText}>Profile</Text>
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
  scrollContent: {
    paddingBottom: 20,
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
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e74c3c',
    borderWidth: 2,
    borderColor: 'white',
  },
  heroCard: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: 'white',
    padding: 30,
    alignItems: 'center',
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e8f4fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 6,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3498db',
    marginBottom: 10,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
  },
  statCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
  },
  certificatesScroll: {
    paddingLeft: 20,
    gap: 12,
  },
  certificateCard: {
    width: 120,
    height: 140,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  certificateIconContainer: {
    marginBottom: 12,
  },
  certificateText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 4,
  },
  certificateDate: {
    fontSize: 11,
    color: '#7f8c8d',
  },
  serviceCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
    textAlign: 'center',
  },
  serviceTime: {
    fontSize: 11,
    color: '#7f8c8d',
    marginBottom: 6,
    textAlign: 'center',
  },
  servicePrice: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3498db',
    textAlign: 'center',
  },
  verifyButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#3498db',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verifyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  verifyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  verifyButtonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  verifyButtonSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  infoCardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  infoCardText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 16,
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

export default VerifyScreen;