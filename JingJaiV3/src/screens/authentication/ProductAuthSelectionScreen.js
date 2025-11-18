// ProductAuthSelectionScreen.js
import React, { useState, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
  PanResponder,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProductAuthSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState('basic');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  
  const slideAnim = useRef(new Animated.Value(0)).current;

  const paymentMethods = [
    { id: 'google', name: 'Google Pay', icon: 'logo-google' },
    { id: 'apple', name: 'Apple Pay', icon: 'logo-apple' },
    { id: 'paypal', name: 'PayPal', icon: 'logo-paypal' },
    { id: 'credit', name: 'Credit Card', icon: 'card-outline' },
  ];

  const packages = [
    {
      id: 'basic',
      title: 'Basic Check',
      time: '10-20 min Check',
      badge: 'Fast',
      badgeColor: '#C8FF00',
      price: 300,
      color: '#3498db',
    },
    {
      id: 'certificate',
      title: 'Earn Certificate',
      time: '30-40 min Check',
      badge: 'Medium',
      badgeColor: '#FCD34D',
      price: 750,
      color: '#9b59b6',
    },
    {
      id: 'expert',
      title: 'Expert Review',
      time: '1-2 days Check',
      badge: 'Premium',
      badgeColor: '#A78BFA',
      price: 1500,
      color: '#e74c3c',
    },
  ];

  const { 
    brandName = 'ALEXANDER WANG',
    productName = 'Attica Bag',
  } = route.params || {};

  const selectedPackageData = packages.find(p => p.id === selectedPackage);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy < 0 && !isExpanded) {
          slideAnim.setValue(Math.max(gestureState.dy, -200));
        } else if (gestureState.dy > 0 && isExpanded) {
          slideAnim.setValue(Math.min(gestureState.dy - 200, 0));
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy < -50 && !isExpanded) {
          setIsExpanded(true);
          Animated.spring(slideAnim, {
            toValue: -200,
            useNativeDriver: true,
            tension: 65,
            friction: 8,
          }).start();
        } else if (gestureState.dy > 50 && isExpanded) {
          setIsExpanded(false);
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 8,
          }).start();
        } else {
          Animated.spring(slideAnim, {
            toValue: isExpanded ? -200 : 0,
            useNativeDriver: true,
            tension: 65,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  const goBack = () => {
    navigation.goBack();
  };

  const handleHowToCheck = () => {
    navigation.navigate('PhotoInstructions', {
      brandName,
      productName,
      price: selectedPackageData.price,
      packageType: selectedPackageData.title,
    });
  };

  const handleContinue = () => {
    const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);
    
    if (selectedPaymentMethod === 'credit') {
      if (!cardNumber.trim() || !expiryDate.trim() || !cvv.trim() || !cardName.trim()) {
        Alert.alert('Missing Information', 'Please fill in all card details');
        return;
      }
    }
    
    navigation.navigate('PhotoCapture', {
      brandName,
      productName,
      price: selectedPackageData.price,
      packageType: selectedPackageData.title,
      paymentMethod: selectedMethod.name,
    });
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const match = cleaned.match(/\d{1,4}/g);
    return match ? match.join(' ') : '';
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentImageIndex === index && styles.dotActive
            ]}
          />
        ))}
      </View>
    );
  };

  const renderPackageCard = (pkg, index) => {
    const isSelected = selectedPackage === pkg.id;
    const isVisible = index === 0 || isExpanded;
    
    if (!isVisible) return null;

    return (
      <TouchableOpacity
        key={pkg.id}
        style={[
          styles.packageCard,
          isSelected && styles.selectedPackageCard,
        ]}
        onPress={() => setSelectedPackage(pkg.id)}
        activeOpacity={0.8}
      >
        <View style={[styles.packageContent, { backgroundColor: pkg.color }]}>
          <View style={styles.packageLeft}>
            <Text style={styles.packageTitle}>{pkg.title}</Text>
            <Text style={styles.packageTime}>{pkg.time}</Text>
            <View style={[styles.packageBadge, { backgroundColor: pkg.badgeColor }]}>
              <Text style={styles.packageBadgeText}>{pkg.badge}</Text>
            </View>
          </View>
          <View style={styles.packageRight}>
            <Text style={styles.packagePrice}>{pkg.price} Bath</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isExpanded}
      >
        {/* Back Button */}
        <TouchableOpacity 
          onPress={goBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#2c3e50" />
        </TouchableOpacity>

        {/* Brand Name */}
        <Text style={styles.brandName}>{brandName}</Text>

        {/* Product Image Card */}
        <View style={styles.imageCard}>
          <View style={styles.imageContainer}>
            <View style={styles.bagIcon}>
              <View style={styles.bagHandle} />
              <View style={styles.bagBody} />
            </View>
          </View>
          
          {renderDots()}
        </View>

        {/* How to Check Link */}
        <TouchableOpacity 
          style={styles.howToCheckContainer}
          activeOpacity={0.7}
          onPress={handleHowToCheck}
        >
          <Text style={styles.howToCheckText}>How to Check?</Text>
        </TouchableOpacity>

        {/* Swipe Indicator */}
        <View style={styles.swipeIndicatorContainer}>
          <View style={styles.swipeIndicator} />
        </View>

        {/* Packages Section */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.packagesWrapper,
            {
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.packagesContainer}>
            {packages.map((pkg, index) => renderPackageCard(pkg, index))}
          </View>

          {/* Payment & Continue Section */}
          <View style={styles.bottomSection}>
            <TouchableOpacity 
              style={styles.paymentRow}
              activeOpacity={0.7}
              onPress={() => setShowPaymentModal(true)}
            >
              <View style={styles.paymentLeft}>
                <Ionicons name="card-outline" size={20} color="#3498db" />
                <Text style={styles.paymentText}>
                  {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>
                Choose {selectedPackageData.title}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Payment Method Modal */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Payment Method</Text>
              <TouchableOpacity 
                onPress={() => setShowPaymentModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#2c3e50" />
              </TouchableOpacity>
            </View>

            <View style={styles.paymentMethodsList}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethodItem,
                    selectedPaymentMethod === method.id && styles.selectedPaymentMethod
                  ]}
                  onPress={() => {
                    setSelectedPaymentMethod(method.id);
                    setShowPaymentModal(false);
                    if (method.id === 'credit') {
                      if (isExpanded) {
                        setIsExpanded(false);
                        Animated.spring(slideAnim, {
                          toValue: 0,
                          useNativeDriver: true,
                          tension: 65,
                          friction: 8,
                        }).start(() => {
                          setTimeout(() => setShowCardForm(true), 100);
                        });
                      } else {
                        setTimeout(() => setShowCardForm(true), 300);
                      }
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.paymentMethodLeft}>
                    <View style={styles.paymentMethodIcon}>
                      <Ionicons 
                        name={method.icon} 
                        size={24} 
                        color={selectedPaymentMethod === method.id ? '#3498db' : '#7f8c8d'} 
                      />
                    </View>
                    <Text style={[
                      styles.paymentMethodName,
                      selectedPaymentMethod === method.id && styles.selectedPaymentMethodText
                    ]}>
                      {method.name}
                    </Text>
                  </View>
                  {selectedPaymentMethod === method.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#3498db" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Credit Card Form Modal */}
      <Modal
        visible={showCardForm}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCardForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cardFormModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Card Information</Text>
              <TouchableOpacity 
                onPress={() => setShowCardForm(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#2c3e50" />
              </TouchableOpacity>
            </View>

            <View style={styles.cardFormContent}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChangeText={(text) => {
                    const formatted = formatCardNumber(text);
                    if (formatted.length <= 19) {
                      setCardNumber(formatted);
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={19}
                  placeholderTextColor="#bdc3c7"
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChangeText={(text) => {
                      const formatted = formatExpiryDate(text);
                      if (formatted.length <= 5) {
                        setExpiryDate(formatted);
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={5}
                    placeholderTextColor="#bdc3c7"
                  />
                </View>
                <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="123"
                    value={cvv}
                    onChangeText={(text) => {
                      const cleaned = text.replace(/\D/g, '');
                      setCvv(cleaned);
                    }}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    placeholderTextColor="#bdc3c7"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Cardholder Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="JOHN DOE"
                  value={cardName}
                  onChangeText={setCardName}
                  autoCapitalize="characters"
                  placeholderTextColor="#bdc3c7"
                />
              </View>

              <TouchableOpacity 
                style={styles.saveCardButton}
                onPress={() => {
                  if (!cardNumber.trim() || !expiryDate.trim() || !cvv.trim() || !cardName.trim()) {
                    Alert.alert('Missing Information', 'Please fill in all card details');
                    return;
                  }
                  setShowCardForm(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.saveCardButtonText}>Save Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f4fd',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 20,
    color: '#2c3e50',
  },
  imageCard: {
    backgroundColor: '#2c3e50',
    borderRadius: 20,
    height: 240,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bagIcon: {
    alignItems: 'center',
  },
  bagHandle: {
    width: 70,
    height: 35,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    borderWidth: 12,
    borderBottomWidth: 0,
    borderColor: '#FFFFFF',
    marginBottom: -5,
  },
  bagBody: {
    width: 140,
    height: 95,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
  },
  howToCheckContainer: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  howToCheckText: {
    color: '#7f8c8d',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  swipeIndicatorContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  swipeIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#bdc3c7',
    borderRadius: 2,
  },
  packagesWrapper: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  packagesContainer: {
    gap: 12,
    marginBottom: 20,
  },
  packageCard: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  selectedPackageCard: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  packageContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  packageLeft: {
    flex: 1,
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  packageTime: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  packageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  packageBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2c3e50',
  },
  packageRight: {
    paddingTop: 2,
  },
  packagePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bottomSection: {
    gap: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  continueButton: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodsList: {
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 12,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPaymentMethod: {
    backgroundColor: '#e8f4fd',
    borderColor: '#3498db',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  selectedPaymentMethodText: {
    color: '#2c3e50',
    fontWeight: '600',
  },
  cardFormModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    minHeight: 450,
  },
  cardFormContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ecf0f1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    color: '#2c3e50',
  },
  saveCardButton: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveCardButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ProductAuthSelectionScreen;