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
  Image,
  Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

const AIResultsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { photos, itemName, serviceType, analysisResults } = route.params;

  const goBack = () => {
    navigation.goBack();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Authenticity results for ${itemName}: ${analysisResults.overall.status}. Score: ${analysisResults.overall.score}%`,
        // You can add a URL to a web report here
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const renderOverallResult = () => {
    const isAuthentic = analysisResults.overall.status === 'Authentic';
    const resultColor = isAuthentic ? '#27ae60' : '#e74c3c';
    const resultIcon = isAuthentic ? 'shield-checkmark' : 'shield-half';

    return (
      <Animatable.View animation="fadeInUp" duration={800} style={[styles.overallResultCard, { borderColor: resultColor }]}>
        <View style={styles.overallHeader}>
          <Ionicons name={resultIcon} size={32} color={resultColor} />
          <Text style={[styles.overallStatus, { color: resultColor }]}>
            {analysisResults.overall.status}
          </Text>
        </View>
        <Text style={styles.overallScore}>{analysisResults.overall.score}%</Text>
        <Text style={styles.confidenceText}>Authenticity Score</Text>
        <View style={[styles.riskBadge, { backgroundColor: isAuthentic ? '#e8f5e8' : '#fee2e2' }]}>
          <Text style={[styles.riskText, { color: isAuthentic ? '#27ae60' : '#e74c3c' }]}>
            {isAuthentic ? 'Low Risk' : 'High Risk'}
          </Text>
        </View>
        <Text style={styles.summaryText}>{analysisResults.overall.summary}</Text>
      </Animatable.View>
    );
  };

  const DetailSection = ({ title, data }) => {
    const [expanded, setExpanded] = useState(false);
    const isAuthentic = data.status === 'Pass';
    const statusColor = isAuthentic ? '#27ae60' : '#e74c3c';

    return (
      <View style={styles.detailSection}>
        <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.detailHeader}>
          <Text style={styles.detailTitle}>{title}</Text>
          <View style={styles.detailStatus}>
            <Text style={[styles.detailScore, { color: statusColor }]}>{data.score}%</Text>
            <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
          </View>
        </TouchableOpacity>
        {expanded && (
          <Animatable.View animation="fadeIn" duration={500} style={styles.detailContent}>
            <Text style={styles.detailNotes}>{data.notes}</Text>
          </Animatable.View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Authentication Results</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.itemName}>{itemName}</Text>
        
        {renderOverallResult()}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Analysis</Text>
          {Object.entries(analysisResults.details).map(([key, value]) => (
            <DetailSection key={key} title={key.replace(/([A-Z])/g, ' $1').trim()} data={value} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Submitted Photos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Object.entries(photos).map(([key, uri]) => (
              <View key={key} style={styles.photoThumbnail}>
                <Image source={{ uri }} style={styles.photoImage} />
                <Text style={styles.photoLabel}>{key.replace(/([A-Z])/g, ' $1').trim()}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => alert('Download Report (Not Implemented)')}>
            <Ionicons name="download-outline" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Download Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={20} color="#3498db" />
            <Text style={styles.secondaryButtonText}>Share Results</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          This AI-generated report is for informational purposes only and is not a legally binding certificate of authenticity.
        </Text>
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
    scrollContent: {
        paddingBottom: 32,
    },
    itemName: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        paddingHorizontal: 24,
    },
    overallResultCard: {
        marginHorizontal: 24,
        borderRadius: 20,
        padding: 24,
        backgroundColor: '#f8f9fa',
        borderWidth: 2,
        alignItems: 'center',
    },
    overallHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    overallStatus: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 12,
    },
    overallScore: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#111827',
    },
    confidenceText: {
        fontSize: 16,
        color: '#666',
        marginTop: -8,
        marginBottom: 16,
    },
    riskBadge: {
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    riskText: {
        fontSize: 14,
        fontWeight: '600',
    },
    summaryText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
    section: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    detailSection: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginBottom: 12,
    },
    detailHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    detailTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#111827',
    },
    detailStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailScore: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    detailContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    detailNotes: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    photoThumbnail: {
        marginRight: 12,
        alignItems: 'center',
    },
    photoImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
        backgroundColor: '#e0e0e0',
    },
    photoLabel: {
        marginTop: 8,
        fontSize: 12,
        color: '#666',
    },
    actionButtons: {
        marginTop: 32,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    primaryButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3498db',
        paddingVertical: 16,
        borderRadius: 16,
        marginRight: 8,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    secondaryButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e3f2fd',
        paddingVertical: 16,
        borderRadius: 16,
        marginLeft: 8,
    },
    secondaryButtonText: {
        color: '#3498db',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    homeButton: {
        marginTop: 16,
        alignItems: 'center',
    },
    homeButtonText: {
        fontSize: 16,
        color: '#666',
        textDecorationLine: 'underline',
    },
    disclaimer: {
        marginTop: 32,
        marginHorizontal: 24,
        fontSize: 12,
        color: '#95a5a6',
        textAlign: 'center',
    },
});

export default AIResultsScreen;