import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

const AIAnalysisScreen = ({ route }) => {
  const navigation = useNavigation();
  const { photos, itemName, serviceType } = route.params;

  useEffect(() => {
    const timer = setTimeout(() => {
      // Mock analysis results
      const analysisResults = {
        overall: {
          status: 'Authentic',
          score: 98.7,
          summary: 'Based on our analysis of the provided images, the item shows strong indicators of authenticity. All key checkpoints match our database of genuine articles.',
        },
        details: {
          materialAnalysis: {
            score: 99.2,
            status: 'Pass',
            notes: 'Material texture and grain are consistent with authentic Alexander Wang leather from this period.',
          },
          hardwareCheck: {
            score: 97.5,
            status: 'Pass',
            notes: 'Zippers, studs, and clasps match the brand’s specific hardware. Engravings are clean and consistent.',
          },
          stitchingQuality: {
            score: 98.9,
            status: 'Pass',
            notes: 'Stitching is uniform, with consistent spacing and thread thickness. No signs of sloppy workmanship.',
          },
          serialVerification: {
            score: 99.5,
            status: 'Pass',
            notes: 'The serial number font, placement, and format are correct according to our records.',
          },
        },
      };

      navigation.replace('AIResults', { 
        photos,
        itemName,
        serviceType,
        analysisResults 
      });
    }, 3000); // 3-second mock analysis

    return () => clearTimeout(timer);
  }, [navigation, photos, itemName, serviceType]);

  return (
    <SafeAreaView style={styles.container}>
      <Animatable.View 
        animation="zoomIn" 
        duration={1500} 
        iterationCount="infinite" 
        style={styles.content}
      >
        <Text style={styles.title}>Analyzing Photos...</Text>
      </Animatable.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AIAnalysisScreen;