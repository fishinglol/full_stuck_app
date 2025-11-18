// MarketplaceScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MarketplaceScreen = ({ navigation }) => {
  const featuredBrands = [
    { name: 'Louis Vuitton', logo: 'LV' },
    { name: 'Chanel', logo: 'CC' },
    { name: 'Hermes', logo: 'H' },
    { name: 'Air Jordan', logo: 'J' },
    { name: 'Nike', logo: 'N' },
  ];

  const recommendedProducts = [
    {
      id: 1,
      brand: 'Nike',
      model: 'Jordan 1 Retro Low OG SP Travis Scott Medium Olive',
      price: 'THB 30,000',
      category: 'Highland street shoes',
      isPreOrder: true,
    },
    {
      id: 2,
      brand: 'Nike',
      model: 'Jordan 1 Retro Low OG SP Travis Scott Medium Olive',
      price: 'THB 30,000',
      category: 'Highland street shoes',
      isPreOrder: true,
    },
    {
      id: 3,
      brand: 'Nike',
      model: 'Jordan 1 Retro Low OG SP Travis Scott Medium Olive',
      price: 'THB 30,000',
      category: 'Highland street shoes',
      isPreOrder: true,
    },
  ];

  const categories = [
    { name: 'Sneaker', icon: '👟' },
    { name: 'Apparel', icon: '👕' },
    { name: 'Accessories', icon: '👜' },
    { name: 'Men', icon: '👤' },
    { name: 'Bag', icon: '🎒' },
  ];

  const BrandLogo = ({ brand }) => (
    <TouchableOpacity style={styles.brandContainer}>
      <View style={styles.brandLogo}>
        <Text style={styles.brandLogoText}>{brand.logo}</Text>
      </View>
      <Text style={styles.brandName}>{brand.name}</Text>
    </TouchableOpacity>
  );

  const ProductCard = ({ product }) => (
    <View style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <View style={styles.productImage}>
          <Text style={styles.productImagePlaceholder}>👟</Text>
        </View>
        {product.isPreOrder && (
          <View style={styles.preOrderBadge}>
            <Text style={styles.preOrderText}>Pre-order</Text>
          </View>
        )}
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={20} color="#7f8c8d" />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <View style={styles.brandRow}>
          <View style={styles.nikeLogo}>
            <Text style={styles.nikeLogoText}>NIKE</Text>
          </View>
        </View>
        <Text style={styles.productPrice}>{product.price}</Text>
        <Text style={styles.productModel}>{product.model}</Text>
        <Text style={styles.productCategory}>{product.category}</Text>
      </View>
    </View>
  );

  const CategoryButton = ({ category }) => (
    <TouchableOpacity style={styles.categoryContainer}>
      <View style={styles.categoryIcon}>
        <Text style={styles.categoryEmoji}>{category.icon}</Text>
      </View>
      <Text style={styles.categoryName}>{category.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Ad Commercial */}
        <View style={styles.adContainer}>
          <View style={styles.adCard}>
            <Text style={styles.adText}>Ad commercial</Text>
          </View>
          <View style={styles.pageIndicator}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
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

        {/* Recommended For You */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsContainer}>
            {recommendedProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </ScrollView>
        </View>

        {/* Shop By Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop By Category</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <CategoryButton key={index} category={category} />
            ))}
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
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="cart-outline" size={24} color="#3498db" />
          <Text style={[styles.navText, styles.activeNavText]}>Marketplace</Text>
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
        <TouchableOpacity style={styles.navItem}>
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
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  adContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  adCard: {
    width: '100%',
    height: 150,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  adText: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  pageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#bdc3c7',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#3498db',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  brandName: {
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
  },
  productsContainer: {
    paddingLeft: 20,
  },
  productCard: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 12,
    marginRight: 15,
  },
  productImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  productImage: {
    height: 120,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImagePlaceholder: {
    fontSize: 40,
  },
  preOrderBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  preOrderText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nikeLogo: {
    backgroundColor: '#2c3e50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  nikeLogoText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  productModel: {
    fontSize: 12,
    color: '#2c3e50',
    marginBottom: 4,
    lineHeight: 16,
  },
  productCategory: {
    fontSize: 11,
    color: '#7f8c8d',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  categoryContainer: {
    alignItems: 'center',
    width: (width - 60) / 5, // 5 categories per row with margins
    marginBottom: 20,
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
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
    fontWeight: '500',
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

export default MarketplaceScreen;