// AtticaScreen.js
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AuthSetupScreen = () => {
  const navigation = useNavigation();
  const [selectedService, setSelectedService] = useState('basic');

  const goBack = () => {
    navigation.goBack();
  };

  const requiredPhotos = [
    'Front', 'Material', 'Label', 'Serial', 
    'Zipper', 'Hardware', 'Inside', 'Details'
  ];

  const services = [
    { id: 'basic', title: 'Basic Check', subtitle: 'Quick authentication By AI' },
    { id: 'certificate', title: 'Certificate', subtitle: 'For resale proof' },
    { id: 'escrow', title: 'Safe Trade', subtitle: 'Secure transaction' },
    { id: 'expert', title: 'Expert Review', subtitle: 'In-person inspection' }
  ];

  const renderPhotoItem = (photo, index) => (
    <View key={index} style={styles.photoItem}>
      <View style={styles.photoPlaceholder}>
        <Ionicons name="camera-outline" size={20} color="#9CA3AF" />
      </View>
      <Text style={styles.photoLabel}>{photo}</Text>
    </View>
  );

  const renderServiceItem = (service) => (
    <TouchableOpacity
      key={service.id}
      style={[
        styles.serviceItem,
        selectedService === service.id && styles.selectedService
      ]}
      onPress={() => setSelectedService(service.id)}
      activeOpacity={0.7}
    >
      <View style={styles.serviceContent}>
        <View style={styles.serviceText}>
          <Text style={[
            styles.serviceTitle,
            selectedService === service.id && styles.selectedText
          ]}>
            {service.title}
          </Text>
          <Text style={[
            styles.serviceSubtitle,
            selectedService === service.id && styles.selectedSubtext
          ]}>
            {service.subtitle}
          </Text>
        </View>
        <View style={[
          styles.radioButton,
          selectedService === service.id && styles.selectedRadio
        ]}>
          {selectedService === service.id && (
            <View style={styles.radioInner} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={goBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Authenticate</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Section */}
        <View style={styles.productSection}>
          <View style={styles.productImageContainer}>
            <View style={styles.productImage}>
              <View style={styles.productImageInner} />
            </View>
          </View>
          <Text style={styles.brandName}>Alexander Wang</Text>
          <Text style={styles.productType}>Attica Bag</Text>
        </View>

        {/* Photos Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Photos</Text>
          <View style={styles.photosGrid}>
            {requiredPhotos.map((photo, index) => renderPhotoItem(photo, index))}
          </View>
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Type</Text>
          <View style={styles.servicesContainer}>
            {services.map(service => renderServiceItem(service))}
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={() => navigation.navigate('Payment')}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  productSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  productImageContainer: {
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImageInner: {
    width: 48,
    height: 48,
    backgroundColor: '#92400E',
    borderRadius: 8,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
  },
  productType: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 16,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoItem: {
    width: (width - 60) / 4,
    marginBottom: 16,
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  photoLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  servicesContainer: {
    gap: 12,
  },
  serviceItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  selectedService: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  serviceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceText: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  serviceSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  selectedText: {
    color: '#FFFFFF',
  },
  selectedSubtext: {
    color: '#D1D5DB',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadio: {
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#111827',
  },
  continueButton: {
    marginHorizontal: 24,
    backgroundColor: '#111827',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AuthSetupScreen;