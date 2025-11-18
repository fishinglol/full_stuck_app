import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screens/main/HomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import MarketplaceScreen from './src/screens/main/MarketplaceScreen';
import VerifyScreen from './src/screens/main/VerifyScreen';
import CategoryScreen from './src/screens/catalog/CategoryScreen';
import BrandSelectionScreen from './src/screens/catalog/BrandSelectionScreen';
import ProductCatalogScreen from './src/screens/catalog/ProductCatalogScreen';
import AuthSetupScreen from './src/screens/authentication/AuthSetupScreen';
import PaymentScreen  from './src/screens/authentication/PaymentScreen';
import PhotoUploadInstructionsScreen from './src/screens/authentication/PhotoUploadInstructionsScreen';
import PhotoCaptureScreen from './src/screens/authentication/PhotoCaptureScreen';
import AIAnalysisScreen from './src/screens/authentication/AIAnalysisScreen';
import ProductSelectionScreen from './src/screens/ProductSelectionScreen';
import AIResultsScreen from './src/screens/authentication/AIResultsScreen';
import ProductDetailScreen from './src/screens/catalog/ProductDetailScreen';
import ProfileScreen from './src/screens/main/ProfileScreen';
import ProductAuthSelectionScreen from './src/screens/authentication/ProductAuthSelectionScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Marketplace" component={MarketplaceScreen} />
        <Stack.Screen name="Verify" component={VerifyScreen} />
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="BrandSelection" component={BrandSelectionScreen} />
        <Stack.Screen name="ProductCatalog" component={ProductCatalogScreen} />
        <Stack.Screen name="AuthSetup" component={AuthSetupScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="ProductSelection" component={ProductSelectionScreen} />
        <Stack.Screen name="PhotoInstructions" component={PhotoUploadInstructionsScreen} />
        <Stack.Screen name="PhotoCapture" component={PhotoCaptureScreen} />
        <Stack.Screen name="AIAnalysis" component={AIAnalysisScreen} />
        <Stack.Screen name="AIResults" component={AIResultsScreen} />
        <Stack.Screen name="ProductAuthSelection" component={ProductAuthSelectionScreen} />
                <Stack.Screen 
          name="ProductDetail" 
          component={ProductDetailScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>

  );
};

export default AppNavigator;