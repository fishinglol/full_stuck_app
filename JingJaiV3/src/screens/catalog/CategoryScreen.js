
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { callAPI } from '../../../services/api';

const { width, height } = Dimensions.get('window');

const CategoryScreen = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Predefined category mappings with icons and colors
  const categoryConfig = {
    'handbags': {
      icon: 'bag-handle-outline',
      color: '#8B5CF6',
      gradient: ['#8B5CF6', '#A78BFA'],
      displayName: 'Luxury Handbags'
    },
    'sneakers': {
      icon: 'walk-outline',
      color: '#06B6D4',
      gradient: ['#06B6D4', '#67E8F9'],
      displayName: 'Sneakers'
    },
    'clothing': {
      icon: 'shirt-outline',
      color: '#EF4444',
      gradient: ['#EF4444', '#F87171'],
      displayName: 'Luxury Clothing'
    },
    'shoes': {
      icon: 'walk-outline',
      color: '#F59E0B',
      gradient: ['#F59E0B', '#FCD34D'],
      displayName: 'Luxury Shoes'
    },
    'accessories': {
      icon: 'diamond-outline',
      color: '#EC4899',
      gradient: ['#EC4899', '#F472B6'],
      displayName: 'Luxury Accessories'
    },
    'watches': {
      icon: 'watch-outline',
      color: '#10B981',
      gradient: ['#10B981', '#34D399'],
      displayName: 'Luxury Watches'
    },
    'streetwear': {
      icon: 'shirt-outline',
      color: '#6366F1',
      gradient: ['#6366F1', '#818CF8'],
      displayName: 'Streetwear'
    },
    'toys': {
      icon: 'game-controller-outline',
      color: '#F97316',
      gradient: ['#F97316', '#FB923C'],
      displayName: 'Toys & Figures'
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      
      // Get all brands and extract unique categories
      const response = await callAPI('/brands/', 'GET');
      const brands = response.brands || [];
      
      // For now, create categories based on your existing structure
      // Later you can add category field to your Brand model
      const availableCategories = [
        { id: 'handbags', name: 'handbags', brandCount: brands.length },
        { id: 'sneakers', name: 'sneakers', brandCount: 0 },
        { id: 'clothing', name: 'clothing', brandCount: 0 },
        { id: 'shoes', name: 'shoes', brandCount: 0 },
        { id: 'accessories', name: 'accessories', brandCount: 0 },
        { id: 'watches', name: 'watches', brandCount: 0 },
        { id: 'streetwear', name: 'streetwear', brandCount: 0 },
        { id: 'toys', name: 'toys', brandCount: 0 },
      ];
      
      setCategories(availableCategories);
      
    } catch (error) {
      console.error('Failed to load categories:', error);
      Alert.alert(
        'Connection Error',
        'Unable to load categories. Please try again.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: loadCategories }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category) => {
    // Universal navigation - goes to BrandSelection with category filter
    navigation.navigate('BrandSelection', { 
      category: category.name,
      categoryDisplay: categoryConfig[category.name]?.displayName || category.name
    });
  };
  
  const goBack = () => {
    navigation.goBack();
  };

  const renderCategoryItem = (category, index) => {
    const config = categoryConfig[category.name] || {
      icon: 'bag-outline',
      color: '#64748B',
      gradient: ['#64748B', '#94A3B8'],
      displayName: category.name
    };

    return (
      <TouchableOpacity
        key={category.id}
        style={[styles.categoryItem, { marginLeft: index % 2 === 0 ? 0 : 8 }]}
        activeOpacity={0.8}
        onPress={() => handleCategoryPress(category)}
      >
        <LinearGradient
          colors={config.gradient}
          style={styles.categoryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.iconContainer}>
            <Ionicons 
              name={config.icon} 
              size={32} 
              color="#FFFFFF" 
            />
          </View>
          
          <Text style={styles.categoryText}>{config.displayName}</Text>
          
          <View style={styles.brandCountContainer}>
            <Text style={styles.brandCountText}>
              {category.brandCount} brand{category.brandCount !== 1 ? 's' : ''}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Text style={styles.title}>Choose a</Text>
              <Text style={styles.title}>Category</Text>
              <Text style={styles.subtitle}>Loading categories...</Text>
            </View>
          </View>
          
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Loading categories...</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.title}>Choose a</Text>
            <Text style={styles.title}>Category</Text>
            <Text style={styles.subtitle}>Start Authenticating</Text>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => renderCategoryItem(category, index))}
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
    paddingTop: 10,
    paddingBottom: 30,
    backgroundColor: '#FFFFFF',
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
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: (width - 48) / 2,
    height: 140,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'left',
    lineHeight: 20,
  },
  brandCountContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  brandCountText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
});

export default CategoryScreen;
