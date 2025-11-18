// HomeScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Add navigation as a prop
const HomeScreen = ({ navigation }) => {
  const featuredBrands = [
    { name: 'Louis Vuitton', logo: 'LV' },
    { name: 'Chanel', logo: 'CC' },
    { name: 'Hermes', logo: 'H' },
    { name: 'Air Jordan', logo: 'J' },
    { name: 'Nike', logo: 'N' },
  ];

  const authenticators = [
    { name: 'FishFish', rating: '5.0/5.0', reviews: 'Expert', experience: 'We have the above authentication result based on Exterior lower' },
    { name: 'FishFish', rating: '5.0/5.0', reviews: 'Expert', experience: 'We have the above authentication result based on Exterior lower' },
    { name: 'FishFish', rating: '5.0/5.0', reviews: 'Expert', experience: 'We have the above authentication result based on Exterior lower' },
  ];

  const caseHistory = [
    { 
      brand: 'Nike', 
      model: 'Jordan 1 Retro Low OG SP Travis Scott Medium Olive',
      category: 'Highland street shoes',
      date: '5/19/2023',
      status: 'AUTHENTIC'
    },
    { 
      brand: 'Nike', 
      model: 'Jordan 1 Retro Low OG SP Travis Scott Medium Olive',
      category: 'Highland street shoes',
      date: '5/19/2023',
      status: 'AUTHENTIC'
    },
    { 
      brand: 'Nike', 
      model: 'Jordan 1 Retro Low OG SP Travis Scott Medium Olive',
      category: 'Highland street shoes',
      date: '5/19/2023',
      status: 'AUTHENTIC'
    },
  ];

  const CategoryButton = ({ icon, title }) => (
    <TouchableOpacity style={styles.categoryButton}>
      <View style={styles.categoryIcon}>
        {icon}
      </View>
      <Text style={styles.categoryTitle}>{title}</Text>
    </TouchableOpacity>
  );

  const BrandLogo = ({ brand }) => (
    <TouchableOpacity style={styles.brandContainer}>
      <View style={styles.brandLogo}>
        <Text style={styles.brandLogoText}>{brand.logo}</Text>
      </View>
      <Text style={styles.brandName}>{brand.name}</Text>
    </TouchableOpacity>
  );

  const AuthenticatorCard = ({ authenticator }) => (
    <View style={styles.authenticatorCard}>
      <View style={styles.authenticatorHeader}>
        <View style={styles.authenticatorAvatar}>
          <Text style={styles.avatarText}>FF</Text>
        </View>
        <View style={styles.authenticatorInfo}>
          <View style={styles.nameRating}>
            <Text style={styles.authenticatorName}>{authenticator.name}</Text>
            <View style={styles.expertBadge}>
              <Text style={styles.expertText}>{authenticator.reviews}</Text>
            </View>
          </View>
          <Text style={styles.rating}>{authenticator.rating}</Text>
        </View>
      </View>
      <Text style={styles.experience}>{authenticator.experience}</Text>
    </View>
  );

  const CaseHistoryItem = ({ item }) => (
    <View style={styles.caseItem}>
      <View style={styles.caseImage}>
        <View style={styles.shoePlaceholder}>
          <Text style={styles.shoePlaceholderText}>👟</Text>
        </View>
        <View style={styles.authenticBadge}>
          <Text style={styles.authenticText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.caseDetails}>
        <View style={styles.brandHeader}>
          <Text style={styles.caseBrandText}>{item.brand}</Text>
        </View>
        <Text style={styles.caseModel}>{item.model}</Text>
        <Text style={styles.caseCategory}>{item.category}</Text>
        <Text style={styles.caseDate}>{item.date}</Text>
      </View>
    </View>
  );

  return (
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

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#7f8c8d" style={styles.searchIcon} />
          <TextInput
            placeholder="Search"
            style={styles.searchInput}
            placeholderTextColor="#7f8c8d"
          />
        </View>

        {/* Category Buttons */}
        <View style={styles.categoriesContainer}>
          <CategoryButton 
            icon={<Ionicons name="trending-up" size={20} color="#3498db" />} 
            title="Trending" 
          />
          <CategoryButton 
            icon={<MaterialIcons name="auto-awesome" size={20} color="#3498db" />} 
            title="AI Suggest" 
          />
          <CategoryButton 
            icon={<MaterialIcons name="verified" size={20} color="#3498db" />} 
            title="Newly Verified" 
          />
          <CategoryButton 
            icon={<Ionicons name="time-outline" size={20} color="#3498db" />} 
            title="Upcoming" 
          />
          <CategoryButton 
            icon={<Ionicons name="refresh" size={20} color="#3498db" />} 
            title="Fast-Track" 
          />
        </View>

        {/* Ad Commercial Sections */}
        <View style={styles.adSection}>
          <View style={styles.adCard}>
            <Text style={styles.adText}>Ad commercial</Text>
          </View>
          <View style={styles.adCard}>
            <Text style={styles.adText}>Ad commercial</Text>
          </View>
        </View>

        {/* Featured Brands */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Brands</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.brandsContainer}>
            {featuredBrands.map((brand, index) => (
              <BrandLogo key={index} brand={brand} />
            ))}
          </ScrollView>
        </View>

        {/* Authenticators Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authenticators profile</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {authenticators.map((authenticator, index) => (
              <AuthenticatorCard key={index} authenticator={authenticator} />
            ))}
          </ScrollView>
        </View>

        {/* Case History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Case History</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {caseHistory.map((item, index) => (
              <CaseHistoryItem key={index} item={item} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#3498db" />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation && navigation.navigate('Marketplace')}
        >
          <Ionicons name="cart-outline" size={24} color="#7f8c8d" />
          <Text style={styles.navText}>Marketplace</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation && navigation.navigate('Verify')}
        >
          <Ionicons name="checkmark-circle-outline" size={24} color="#7f8c8d" />
          <Text style={styles.navText}>Verify</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="shield-outline" size={24} color="#7f8c8d" />
          <Text style={styles.navText}>Escrow</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-outline" size={24} color="#7f8c8d" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f4fd',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
    fontWeight: '500',
  },
  adSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 15,
  },
  adCard: {
    flex: 1,
    height: 120,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  brandsContainer: {
    paddingLeft: 20,
  },
  brandContainer: {
    alignItems: 'center',
    marginRight: 25,
  },
  brandLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandLogoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  brandName: {
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
  },
  authenticatorCard: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    marginLeft: 20,
  },
  authenticatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authenticatorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  authenticatorInfo: {
    flex: 1,
  },
  nameRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  authenticatorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginRight: 8,
  },
  expertBadge: {
    backgroundColor: '#3498db',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  expertText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  rating: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  experience: {
    fontSize: 12,
    color: '#7f8c8d',
    lineHeight: 16,
  },
  caseItem: {
    width: 180,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 12,
    marginRight: 15,
    marginLeft: 20,
  },
  caseImage: {
    position: 'relative',
    marginBottom: 10,
  },
  shoePlaceholder: {
    height: 120,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shoePlaceholderText: {
    fontSize: 40,
  },
  authenticBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#3498db',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  authenticText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  caseDetails: {
    flex: 1,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  caseBrandText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  caseModel: {
    fontSize: 12,
    color: '#2c3e50',
    marginBottom: 4,
    lineHeight: 16,
  },
  caseCategory: {
    fontSize: 11,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  caseDate: {
    fontSize: 11,
    color: '#7f8c8d',
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

export default HomeScreen;