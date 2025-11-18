import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getProductConfig } from '../../../config/productConfig';

const { width, height } = Dimensions.get('window');

const PhotoCaptureScreen = ({ route }) => {
  const navigation = useNavigation();
  const { serviceType = 'basic', productId = 'attica-bag' } = route.params || {};
  
  // Get product configuration
  const productConfig = getProductConfig ? getProductConfig(productId) : {
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
  
  const { name: itemName, requiredPhotos } = productConfig;

  const [photos, setPhotos] = useState({});
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  // Request permissions on mount
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus.status !== 'granted') {
        Alert.alert('Camera Permission', 'We need camera access to take photos of your item.');
      }
      if (libraryStatus.status !== 'granted') {
        Alert.alert('Gallery Permission', 'We need gallery access to select photos.');
      }
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  const goBack = () => {
    if (Object.keys(photos).length > 0) {
      Alert.alert(
        'Discard Photos?',
        'You have uploaded photos. Are you sure you want to go back?',
        [
          { text: 'Keep Photos', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleNext = () => {
    if (currentPhotoIndex < requiredPhotos.length - 1) {
      const nextIndex = currentPhotoIndex + 1;
      setCurrentPhotoIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const handlePrevious = () => {
    if (currentPhotoIndex > 0) {
      const prevIndex = currentPhotoIndex - 1;
      setCurrentPhotoIndex(prevIndex);
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const handleTakePhoto = async (photoId) => {
    try {
      setLoading(true);
      
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera access is needed to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
        exif: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setPhotos(prev => ({ ...prev, [photoId]: imageUri }));
        
        // Auto-advance to next photo if not the last one
        if (currentPhotoIndex < requiredPhotos.length - 1) {
          setTimeout(() => handleNext(), 500);
        }
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async (photoId) => {
    try {
      setLoading(true);
      
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Gallery access is needed to select photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
        exif: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setPhotos(prev => ({ ...prev, [photoId]: imageUri }));
        
        // Auto-advance to next photo if not the last one
        if (currentPhotoIndex < requiredPhotos.length - 1) {
          setTimeout(() => handleNext(), 500);
        }
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = (photoId) => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setPhotos(prev => {
              const newPhotos = { ...prev };
              delete newPhotos[photoId];
              return newPhotos;
            });
          }
        }
      ]
    );
  };

  const renderPhotoCard = ({ item, index }) => {
    const isCurrentPhoto = index === currentPhotoIndex;
    const hasPhoto = photos[item.id];
    
    return (
      <View style={styles.photoCardContainer}>
        <View style={[styles.photoCard, isCurrentPhoto && styles.activePhotoCard]}>
          {/* Progress indicator */}
          <View style={styles.progressIndicator}>
            <View style={[styles.progressDot, hasPhoto && styles.completedDot]} />
            <Text style={[styles.progressLabel, hasPhoto && styles.completedLabel]}>
              {hasPhoto ? 'Completed' : 'Required'}
            </Text>
          </View>

          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <Ionicons name={item.icon} size={24} color="#3498db" />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>{item.description}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.imageContainer, hasPhoto && styles.imageContainerFilled]}
            onPress={() => hasPhoto ? null : handleTakePhoto(item.id)}
            disabled={loading}
          >
            {loading && currentPhotoIndex === index ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={styles.loadingText}>Processing...</Text>
              </View>
            ) : hasPhoto ? (
              <>
                <Image source={{ uri: photos[item.id] }} style={styles.previewImage} />
                <View style={styles.photoOverlay}>
                  <TouchableOpacity 
                    style={styles.overlayButton}
                    onPress={() => handleRemovePhoto(item.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.placeholderContainer}>
                <View style={styles.cameraIcon}>
                  <Ionicons name="camera-outline" size={40} color="#3498db" />
                </View>
                <Text style={styles.placeholderTitle}>Tap to take photo</Text>
                <Text style={styles.placeholderSubtitle}>or choose from gallery below</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.galleryButton]}
              onPress={() => handlePickImage(item.id)}
              disabled={loading}
            >
              <Ionicons name="images-outline" size={18} color="#3498db" />
              <Text style={styles.actionButtonText}>Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.cameraButton]}
              onPress={() => handleTakePhoto(item.id)}
              disabled={loading}
            >
              <Ionicons name="camera-outline" size={18} color="#FFFFFF" />
              <Text style={[styles.actionButtonText, styles.cameraButtonText]}>Camera</Text>
            </TouchableOpacity>
            
            {hasPhoto && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.retakeButton]}
                onPress={() => handleTakePhoto(item.id)}
                disabled={loading}
              >
                <Ionicons name="refresh-outline" size={18} color="#e74c3c" />
                <Text style={[styles.actionButtonText, styles.retakeButtonText]}>Retake</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const allPhotosTaken = Object.keys(photos).length === requiredPhotos.length;
  const photoProgress = Object.keys(photos).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Upload Photos</Text>
          <Text style={styles.itemName}>{itemName}</Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{photoProgress}/{requiredPhotos.length}</Text>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${(photoProgress / requiredPhotos.length) * 100}%` }]} 
            />
          </View>
        </View>
      </View>

      {/* Photo Carousel */}
      <FlatList
        ref={flatListRef}
        data={requiredPhotos}
        renderItem={renderPhotoCard}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.carousel}
        onScrollToIndexFailed={(info) => {
          console.log('Scroll failed:', info);
        }}
      />

      {/* Navigation Controls */}
      <View style={styles.navigationControls}>
        <TouchableOpacity 
          onPress={handlePrevious} 
          disabled={currentPhotoIndex === 0}
          style={[styles.navButton, currentPhotoIndex === 0 && styles.disabledNavButton]}
        >
          <Ionicons 
            name="chevron-back" 
            size={20} 
            color={currentPhotoIndex === 0 ? "#bdc3c7" : "#FFFFFF"} 
          />
          <Text style={[styles.navButtonText, currentPhotoIndex === 0 && styles.disabledNavText]}>
            Previous
          </Text>
        </TouchableOpacity>

        {/* Photo indicators */}
        <View style={styles.photoIndicators}>
          {requiredPhotos.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.indicator,
                index === currentPhotoIndex && styles.activeIndicator,
                photos[requiredPhotos[index].id] && styles.completedIndicator
              ]}
              onPress={() => {
                setCurrentPhotoIndex(index);
                flatListRef.current?.scrollToIndex({ index, animated: true });
              }}
            />
          ))}
        </View>

        <TouchableOpacity 
          onPress={handleNext} 
          disabled={currentPhotoIndex === requiredPhotos.length - 1}
          style={[
            styles.navButton, 
            currentPhotoIndex === requiredPhotos.length - 1 && styles.disabledNavButton
          ]}
        >
          <Text style={[
            styles.navButtonText, 
            currentPhotoIndex === requiredPhotos.length - 1 && styles.disabledNavText
          ]}>
            Next
          </Text>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={currentPhotoIndex === requiredPhotos.length - 1 ? "#bdc3c7" : "#FFFFFF"} 
          />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {allPhotosTaken ? (
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={() => navigation.navigate('AIAnalysis', { photos, itemName, serviceType })}
          >
            <View style={styles.submitButtonContent}>
              <Ionicons name="sparkles" size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Start AI Analysis</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.incompleteFooter}>
            <View style={styles.incompleteInfo}>
              <Ionicons name="information-circle-outline" size={20} color="#666" />
              <Text style={styles.incompleteText}>
                Upload {requiredPhotos.length - photoProgress} more photo{requiredPhotos.length - photoProgress !== 1 ? 's' : ''} to continue
              </Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 4,
    marginBottom: 4,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  itemName: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3498db',
    marginBottom: 6,
  },
  progressBar: {
    width: 120,
    height: 3,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 2,
  },
  carousel: {
    flex: 1,
  },
  photoCardContainer: {
    width: width,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  photoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
    maxHeight: height * 0.7,
  },
  activePhotoCard: {
    borderColor: '#3498db',
  },
  progressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e2e8f0',
    marginRight: 8,
  },
  completedDot: {
    backgroundColor: '#10b981',
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  completedLabel: {
    color: '#10b981',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  imageContainer: {
    width: '100%',
    height: Math.min(width * 0.7, 260),
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  imageContainerFilled: {
    borderStyle: 'solid',
    borderColor: '#10b981',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  overlayButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 20,
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  cameraIcon: {
    marginBottom: 12,
  },
  placeholderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  placeholderSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '600',
    color: '#3498db',
  },
  galleryButton: {
    backgroundColor: '#eff6ff',
  },
  cameraButton: {
    backgroundColor: '#3498db',
  },
  cameraButtonText: {
    color: '#FFFFFF',
  },
  retakeButton: {
    backgroundColor: '#fef2f2',
  },
  retakeButtonText: {
    color: '#e74c3c',
  },
  navigationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    minWidth: 70,
  },
  disabledNavButton: {
    backgroundColor: '#f1f5f9',
  },
  navButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginHorizontal: 2,
  },
  disabledNavText: {
    color: '#bdc3c7',
  },
  photoIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e2e8f0',
  },
  activeIndicator: {
    backgroundColor: '#3498db',
    width: 24,
  },
  completedIndicator: {
    backgroundColor: '#10b981',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  submitButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  incompleteFooter: {
    alignItems: 'center',
  },
  incompleteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  incompleteText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 6,
    fontWeight: '500',
  },
});

export default PhotoCaptureScreen;