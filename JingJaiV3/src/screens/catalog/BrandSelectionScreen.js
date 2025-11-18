import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  RefreshControl,
  StatusBar,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { callAPI } from '../../../services/api';

const { width, height } = Dimensions.get('window');

const BrandSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category, categoryDisplay } = route.params || {};
  
  // State management
  const [featuredBrands, setFeaturedBrands] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'featured'

  // Load brands when component mounts
  useEffect(() => {
    loadBrands();
  }, []);

  // Filter brands based on search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBrands(allBrands);
    } else {
      const filtered = allBrands.filter(brand =>
        brand.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBrands(filtered);
    }
  }, [searchQuery, allBrands]);

  const loadBrands = async () => {
    try {
      setLoading(true);
      
      const [featuredResponse, allResponse] = await Promise.all([
        callAPI('/brands/featured', 'GET'),
        callAPI('/brands/', 'GET')
      ]);
      
      let featuredBrands = featuredResponse.brands || [];
      let allBrands = allResponse.brands || [];
      
      // Filter by category if provided
      if (category && category !== 'handbags') {
        // For now, since you only have handbags data, show empty for other categories
        // Later you can add category field to brands and filter properly
        featuredBrands = [];
        allBrands = [];
      }
      
      setFeaturedBrands(featuredBrands);
      setAllBrands(allBrands);
      setFilteredBrands(allBrands);
      
    } catch (error) {
      console.error('Failed to load brands:', error);
      Alert.alert(
        'Connection Error', 
        'Unable to load brands. Please check your internet connection and try again.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: loadBrands }
        ]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadBrands();
  };

  const goBack = () => {
    navigation.goBack();
  };

  const handleBrandPress = (brand) => {
    navigation.navigate('ProductAuthSelection', { brand });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderFeaturedBrand = (brand, index) => (
    <TouchableOpacity
      key={brand.id}
      style={[
        styles.featuredBrandItem,
        { marginLeft: index === 0 ? 20 : 12 }
      ]}
      activeOpacity={0.8}
      onPress={() => handleBrandPress(brand)}
    >
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9']}
        style={styles.featuredLogoContainer}
      >
        <Text style={styles.featuredLogo}>{brand.logo}</Text>
      </LinearGradient>
      <Text style={styles.featuredBrandText} numberOfLines={2}>
        {brand.name}
      </Text>
    </TouchableOpacity>
  );

  const renderBrandItem = (brand, index) => (
    <TouchableOpacity
      key={brand.id}
      style={[
        styles.brandItem,
        index === filteredBrands.length - 1 && styles.lastBrandItem
      ]}
      activeOpacity={0.7}
      onPress={() => handleBrandPress(brand)}
    >
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9']}
        style={styles.logoContainer}
      >
        <Text style={styles.logoText}>{brand.logo}</Text>
      </LinearGradient>
      <View style={styles.brandInfo}>
        <Text style={styles.brandText}>{brand.name}</Text>
        <Text style={styles.brandSubtext}>Luxury Fashion</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
    </TouchableOpacity>
  );

  const TabButton = ({ title, isActive, onPress, count }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
      {count !== undefined && (
        <View style={[styles.countBadge, isActive && styles.activeCountBadge]}>
          <Text style={[styles.countText, isActive && styles.activeCountText]}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // Loading state with skeleton
  if (loading) {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <View style={styles.topBar}>
              <TouchableOpacity onPress={goBack} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="#1F2937" />
              </TouchableOpacity>
              <View style={styles.titleContainer}>
                <Text style={styles.headerTitle}>JING JAI</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.loadingContainer}>
            <View style={styles.loadingContent}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Loading premium brands...</Text>
              <Text style={styles.loadingSubtext}>Curating the finest selection</Text>
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }

  const brandsToShow = activeTab === 'featured' ? featuredBrands : filteredBrands;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container}>
        {/* Enhanced Header */}
        <View style={styles.header}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>JING JAI</Text>
            </View>
          </View>
          
          <View style={styles.headerContent}>
            <Text style={styles.title}>{categoryDisplay ? categoryDisplay : 'Discover'}</Text>
            <Text style={styles.subtitle}>{categoryDisplay ? 'Brands' : 'Premium Brands'}</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search brands..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TabButton
              title="All Brands"
              isActive={activeTab === 'all'}
              onPress={() => setActiveTab('all')}
              count={allBrands.length}
            />
            <TabButton
              title="Featured"
              isActive={activeTab === 'featured'}
              onPress={() => setActiveTab('featured')}
              count={featuredBrands.length}
            />
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#3B82F6']}
              tintColor="#3B82F6"
            />
          }
        >
          {/* Featured Brands Horizontal Scroll - only show when on 'all' tab or when search is empty */}
          {activeTab === 'all' && searchQuery.trim() === '' && featuredBrands.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Featured</Text>
                <Text style={styles.sectionSubtitle}>Premium selection</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredBrandsContainer}
                decelerationRate="fast"
                snapToInterval={100}
              >
                {featuredBrands.map((brand, index) => renderFeaturedBrand(brand, index))}
              </ScrollView>
            </View>
          )}

          {/* All Brands List */}
          <View style={styles.section}>
            {activeTab === 'all' && searchQuery.trim() === '' && (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>All Brands</Text>
                <Text style={styles.sectionSubtitle}>{allBrands.length} available</Text>
              </View>
            )}
            
            {searchQuery.trim() !== '' && (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Search Results</Text>
                <Text style={styles.sectionSubtitle}>
                  {filteredBrands.length} brand{filteredBrands.length !== 1 ? 's' : ''} found
                </Text>
              </View>
            )}

            <View style={styles.allBrandsContainer}>
              {brandsToShow.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons 
                    name={searchQuery ? "search" : "bag-outline"} 
                    size={48} 
                    color="#CBD5E1" 
                  />
                  <Text style={styles.emptyTitle}>
                    {searchQuery ? 'No brands found' : 'No brands available'}
                  </Text>
                  <Text style={styles.emptySubtitle}>
                    {searchQuery 
                      ? `Try searching for "${searchQuery}" differently` 
                      : 'Check back later for new brands'
                    }
                  </Text>
                </View>
              ) : (
                brandsToShow.map((brand, index) => renderBrandItem(brand, index))
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 40,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 1.2,
  },
  headerContent: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#64748B',
    letterSpacing: -0.5,
    marginTop: -4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  clearButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#1F2937',
  },
  countBadge: {
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  activeCountBadge: {
    backgroundColor: '#3B82F6',
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  activeCountText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  featuredBrandsContainer: {
    paddingRight: 20,
  },
  featuredBrandItem: {
    alignItems: 'center',
    width: 85,
    marginRight: 12,
  },
  featuredLogoContainer: {
    width: 70,
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featuredLogo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  featuredBrandText: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 16,
  },
  allBrandsContainer: {
    paddingHorizontal: 20,
  },
  brandItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  lastBrandItem: {
    borderBottomWidth: 0,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  logoText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  brandInfo: {
    flex: 1,
  },
  brandText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    marginBottom: 2,
  },
  brandSubtext: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#1F2937',
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingSubtext: {
    marginTop: 6,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default BrandSelectionScreen;