// PaymentScreen.js - UI First Version
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import paymentStyles from '../../../styles/PaymentScreenStyles';

const PaymentScreen = () => {
  const navigation = useNavigation();
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const goBack = () => {
    navigation.goBack();
  };

  // SIMPLIFIED: Just simulate payment processing
  const handlePayment = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    // Basic validation for UI
    if (selectedPayment === 'card') {
      if (!cardNumber.trim() || !expiryDate.trim() || !cvv.trim() || !cardName.trim()) {
        Alert.alert('Validation Error', 'Please fill in all card details');
        setIsProcessing(false);
        return;
      }
    }

    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      
      // Show success message
      Alert.alert(
        'Payment Successful! 🎉',
        'Your authentication service has been activated.',
        [
          {
            text: 'Continue',
            onPress: () => {
              navigation.navigate('PhotoInstructions', { 
                serviceType: selectedPayment,
                productId: 'attica-bag'
              });
            },
          },
        ]
      );
    }, 2000); // 2 second fake loading
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

  const paymentMethods = [
    {
      id: 'card',
      title: 'Credit Card',
      subtitle: 'Visa, Mastercard, Amex',
      icon: 'card-outline'
    },
    {
      id: 'apple',
      title: 'Apple Pay',
      subtitle: 'Touch ID or Face ID',
      icon: 'logo-apple'
    },
    {
      id: 'google',
      title: 'Google Pay',
      subtitle: 'Quick and secure payment',
      icon: 'logo-google'
    },
    {
      id: 'paypal',
      title: 'PayPal',
      subtitle: 'Pay with your PayPal account',
      icon: 'card'
    }
  ];

  const orderSummary = {
    service: 'Premium Authentication Check',
    item: 'Alexander Wang - Attica Bag',
    subtotal: 29.99,
    tax: 2.70,
    total: 32.69
  };

  const renderPaymentMethod = (method) => (
    <TouchableOpacity
      key={method.id}
      style={[
        paymentStyles.paymentMethod,
        selectedPayment === method.id && paymentStyles.selectedPaymentMethod
      ]}
      onPress={() => setSelectedPayment(method.id)}
      activeOpacity={0.7}
    >
      <View style={paymentStyles.paymentMethodContent}>
        <View style={paymentStyles.paymentMethodLeft}>
          <Ionicons 
            name={method.icon} 
            size={24} 
            color={selectedPayment === method.id ? '#FFFFFF' : '#111827'} 
          />
          <View style={paymentStyles.paymentMethodText}>
            <Text style={[
              paymentStyles.paymentMethodTitle,
              selectedPayment === method.id && paymentStyles.selectedText
            ]}>
              {method.title}
            </Text>
            <Text style={[
              paymentStyles.paymentMethodSubtitle,
              selectedPayment === method.id && paymentStyles.selectedSubtext
            ]}>
              {method.subtitle}
            </Text>
          </View>
        </View>
        <View style={[
          paymentStyles.radioButton,
          selectedPayment === method.id && paymentStyles.selectedRadio
        ]}>
          {selectedPayment === method.id && (
            <View style={paymentStyles.radioInner} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCardForm = () => {
    if (selectedPayment !== 'card') return null;

    return (
      <View style={paymentStyles.cardForm}>
        <Text style={paymentStyles.formTitle}>Card Information</Text>
        
        <View style={paymentStyles.inputContainer}>
          <Text style={paymentStyles.inputLabel}>Card Number</Text>
          <TextInput
            style={paymentStyles.textInput}
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
          />
        </View>

        <View style={paymentStyles.inputRow}>
          <View style={[paymentStyles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={paymentStyles.inputLabel}>Expiry Date</Text>
            <TextInput
              style={paymentStyles.textInput}
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
            />
          </View>
          <View style={[paymentStyles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={paymentStyles.inputLabel}>CVV</Text>
            <TextInput
              style={paymentStyles.textInput}
              placeholder="123"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
          </View>
        </View>

        <View style={paymentStyles.inputContainer}>
          <Text style={paymentStyles.inputLabel}>Cardholder Name</Text>
          <TextInput
            style={paymentStyles.textInput}
            placeholder="John Doe"
            value={cardName}
            onChangeText={setCardName}
            autoCapitalize="words"
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={paymentStyles.container}>
      {/* Header */}
      <View style={paymentStyles.header}>
        <TouchableOpacity 
          onPress={goBack}
          style={paymentStyles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={paymentStyles.headerTitle}>Payment</Text>
      </View>

      <ScrollView 
        style={paymentStyles.scrollView}
        contentContainerStyle={paymentStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary */}
        <View style={paymentStyles.section}>
          <Text style={paymentStyles.sectionTitle}>Order Summary</Text>
          <View style={paymentStyles.summaryCard}>
            <View style={paymentStyles.summaryItem}>
              <Text style={paymentStyles.summaryLabel}>{orderSummary.service}</Text>
              <Text style={paymentStyles.summaryValue}>${orderSummary.subtotal}</Text>
            </View>
            <View style={paymentStyles.summaryItem}>
              <Text style={paymentStyles.summarySubLabel}>{orderSummary.item}</Text>
            </View>
            <View style={paymentStyles.summaryDivider} />
            <View style={paymentStyles.summaryItem}>
              <Text style={paymentStyles.summaryLabel}>Subtotal</Text>
              <Text style={paymentStyles.summaryValue}>${orderSummary.subtotal}</Text>
            </View>
            <View style={paymentStyles.summaryItem}>
              <Text style={paymentStyles.summaryLabel}>Tax</Text>
              <Text style={paymentStyles.summaryValue}>${orderSummary.tax}</Text>
            </View>
            <View style={paymentStyles.summaryDivider} />
            <View style={paymentStyles.summaryItem}>
              <Text style={paymentStyles.summaryTotal}>Total</Text>
              <Text style={paymentStyles.summaryTotalValue}>${orderSummary.total}</Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={paymentStyles.section}>
          <Text style={paymentStyles.sectionTitle}>Payment Method</Text>
          <View style={paymentStyles.paymentMethodsContainer}>
            {paymentMethods.map(method => renderPaymentMethod(method))}
          </View>
        </View>

        {/* Card Form */}
        {renderCardForm()}

        {/* Pay Button */}
        <TouchableOpacity 
          style={[paymentStyles.payButton, isProcessing && paymentStyles.payButtonDisabled]} 
          activeOpacity={0.8}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          <Text style={paymentStyles.payButtonText}>
            {isProcessing ? 'Processing...' : `Pay $${orderSummary.total}`}
          </Text>
        </TouchableOpacity>

        {/* Security Notice */}
        <View style={paymentStyles.securityNotice}>
          <Ionicons name="shield-checkmark-outline" size={16} color="#6B7280" />
          <Text style={paymentStyles.securityText}>
            Your payment information is encrypted and secure
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentScreen;