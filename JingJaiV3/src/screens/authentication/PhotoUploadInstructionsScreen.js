import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Mock product config if the real one isn't available
const getProductConfig = (productId) => {
  return {
    name: 'Alexander Wang Attica Bag',
    requiredPhotos: [
      { id: 'front', name: 'Front View', description: 'Full front view of the item', icon: 'camera-outline' },
      { id: 'material', name: 'Material Close-up', description: 'Close-up of material texture', icon: 'search-outline' },
      { id: 'label', name: 'Brand Label', description: 'Brand label or logo clearly visible', icon: 'text-outline' },
      { id: 'serial', name: 'Serial Number', description: 'Serial number or authentication code', icon: 'barcode-outline' },
      { id: 'zipper', name: 'Zipper Details', description: 'Zipper hardware and branding', icon: 'lock-closed-outline' },
      { id: 'hardware', name: 'Hardware', description: 'All metal hardware and studs', icon: 'hammer-outline' },
      { id: 'inside', name: 'Interior', description: 'Interior lining and pockets', icon: 'eye-outline' },
      { id: 'details', name: 'Detail Shots', description: 'Any unique details or features', icon: 'star-outline' }
    ]
  };
};

const PhotoUploadInstructionsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { serviceType = 'basic', productId = 'attica-bag' } = route.params || {};
  
  const productConfig = getProductConfig(productId);
  const { name: itemName, requiredPhotos } = productConfig;

  const goBack = () => {
    navigation.goBack();
  };

  const photoTips = [
    {
      icon: 'sunny-outline',
      title: 'Use Natural Light',
      subtitle: 'Avoid flash, use daylight for best results'
    },
    {
      icon: 'camera-outline',
      title: 'Sharp Focus',
      subtitle: 'Ensure all details are clear and in focus'
    },
    {
      icon: 'resize-outline',
      title: 'Fill the Frame',
      subtitle: 'Get close to capture important details'
    },
    {
      icon: 'layers-outline',
      title: 'Multiple Angles',
      subtitle: 'Take different angles of the same area'
    }
  ];

  const renderPhotoRequirement = (photo, index) => (
    <View key={photo.id} style={styles.photoRequirement}>
      <View style={styles.photoIcon}>
        <Ionicons name={photo.icon} size={24} color="#3498db" />
      </View>
      <View style={styles.photoInfo}>
        <Text style={styles.photoName}>{photo.name}</Text>
        <Text style={styles.photoDescription}>{photo.description}</Text>
      </View>
      <View style={styles.photoNumber}>
        <Text style={styles.photoNumberText}>{index + 1}</Text>
      </View>
    </View>
  );

  const renderPhotoTip = (tip, index) => (
    <View key={index} style={styles.tipItem}>
      <View style={styles.tipIcon}>
        <Ionicons name={tip.icon} size={20} color="#27ae60" />
      </View>
      <View style={styles.tipContent}>
        <Text style={styles.tipTitle}>{tip.title}</Text>
        <Text style={styles.tipSubtitle}>{tip.subtitle}</Text>
      </View>
    </View>
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
        <Text style={styles.headerTitle}>Photo Instructions</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Status */}
        <View style={styles.statusSection}>
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <View style={styles.statusIcon}>
                <Ionicons name="checkmark-circle" size={24} color="#27ae60" />
              </View>
              <View style={styles.statusInfo}>
                <Text style={styles.statusTitle}>Payment Successful</Text>
                <Text style={styles.statusSubtitle}>{serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} AI Check</Text>
              </View>
            </View>
            <Text style={styles.itemName}>{itemName}</Text>
          </View>
        </View>

        {/* Photo Requirements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Required Photos</Text>
            <View style={styles.photoCount}>
              <Text style={styles.photoCountText}>{requiredPhotos.length} photos needed</Text>
            </View>
          </View>
          
          <View style={styles.photoRequirements}>
            {requiredPhotos.map((photo, index) => renderPhotoRequirement(photo, index))}
          </View>
        </View>

        {/* AI Analysis Info */}
        <View style={styles.section}>
          <View style={styles.aiInfoCard}>
            <View style={styles.aiInfoHeader}>
              <Ionicons name="hardware-chip-outline" size={24} color="#3498db" />
              <Text style={styles.aiInfoTitle}>AI Analysis Process</Text>
            </View>
            <Text style={styles.aiInfoText}>
              Our AI will analyze your photos against 500,000+ authentic luxury items to determine authenticity with up to 95% accuracy.
            </Text>
            <View style={styles.aiFeatures}>
              <View style={styles.aiFeature}>
                <Ionicons name="eye-outline" size={16} color="#666" />
                <Text style={styles.aiFeatureText}>Material texture recognition</Text>
              </View>
              <View style={styles.aiFeature}>
                <Ionicons name="construct-outline" size={16} color="#666" />
                <Text style={styles.aiFeatureText}>Hardware authenticity check</Text>
              </View>
              <View style={styles.aiFeature}>
                <Ionicons name="text-outline" size={16} color="#666" />
                <Text style={styles.aiFeatureText}>Brand marking verification</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Photo Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo Tips for Best Results</Text>
          <View style={styles.tipsContainer}>
            {photoTips.map((tip, index) => renderPhotoTip(tip, index))}
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => navigation.navigate('PhotoCapture', { 
            serviceType, 
            productId,
            itemName,
            requiredPhotos 
          })}
          activeOpacity={0.8}
        >
          <View style={styles.startButtonContent}>
            <Ionicons name="camera" size={24} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Start Photo Upload</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Estimated Time */}
        <View style={styles.timeEstimate}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.timeText}>Estimated time: 5-10 minutes for photos + 2-3 minutes for AI analysis</Text>
        </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  statusSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  statusCard: {
    backgroundColor: '#f8fffe',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIcon: {
    marginRight: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '500',
  },
  itemName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  photoCount: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  photoCountText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  photoRequirements: {
    gap: 12,
  },
  photoRequirement: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  photoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  photoInfo: {
    flex: 1,
  },
  photoName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  photoDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  photoNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  aiInfoCard: {
    backgroundColor: '#f8faff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e3f2fd',
  },
  aiInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  aiInfoText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 12,
  },
  aiFeatures: {
    gap: 8,
  },
  aiFeature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiFeatureText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
  },
  tipsContainer: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fff9',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e8f5e8',
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f5e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  tipSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111827',
    marginHorizontal: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  startButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  timeEstimate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default PhotoUploadInstructionsScreen;