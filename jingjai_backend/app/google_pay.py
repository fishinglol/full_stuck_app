import json
import requests
from typing import Dict, Optional
from pathlib import Path
from google.auth.transport.requests import Request
from google.oauth2 import service_account
import logging

logger = logging.getLogger(__name__)

class GooglePayService:
    def __init__(self, service_account_file: str, issuer_id: str):
        self.service_account_file = service_account_file
        self.issuer_id = issuer_id
        self.base_url = 'https://walletobjects.googleapis.com/walletobjects/v1'
        self.credentials = None
        self._authenticate()
    
    def _authenticate(self):
        """Authenticate with Google Pay API using service account"""
        try:
            # Debug output
            print(f"Debug - Service account file: {self.service_account_file}")
            print(f"Debug - Issuer ID: {self.issuer_id}")
            print(f"Debug - File exists: {Path(self.service_account_file).exists()}")
            
            scopes = ['https://www.googleapis.com/auth/wallet_object.issuer']
            self.credentials = service_account.Credentials.from_service_account_file(
                self.service_account_file, scopes=scopes
            )
            
            # Verify the service account details
            with open(self.service_account_file, 'r') as f:
                sa_data = json.load(f)
                print(f"Debug - Project ID: {sa_data.get('project_id')}")
                print(f"Debug - Client Email: {sa_data.get('client_email')}")
                print(f"Debug - Auth URI: {sa_data.get('auth_uri')}")
                print(f"Debug - Token URI: {sa_data.get('token_uri')}")
            
        except Exception as e:
            logger.error(f"Authentication failed: {e}")
            print(f"Debug - Authentication error: {e}")
            raise
    
    def _get_access_token(self) -> str:
        """Get access token for API requests"""
        try:
            if self.credentials.expired or not self.credentials.token:
                print("Debug - Refreshing token...")
                self.credentials.refresh(Request())
                print(f"Debug - Token refreshed successfully")
                print(f"Debug - Token (first 50 chars): {self.credentials.token[:50]}...")
            
            return self.credentials.token
        except Exception as e:
            print(f"Debug - Token refresh error: {e}")
            raise
    
    def create_loyalty_class(self, class_data: Dict) -> Dict:
        """Create a loyalty card class"""
        headers = {
            'Authorization': f'Bearer {self._get_access_token()}',
            'Content-Type': 'application/json'
        }
        
        url = f'{self.base_url}/loyaltyClass'
        
        # Debug output
        print(f"Making request to: {url}")
        print(f"Headers: {json.dumps(headers, indent=2)}")
        print(f"Data: {json.dumps(class_data, indent=2)}")
        
        try:
            response = requests.post(url, headers=headers, json=class_data)
            
            # Detailed debug output
            print(f"Response status: {response.status_code}")
            print(f"Response headers: {dict(response.headers)}")
            print(f"Response text: {response.text}")
            
            if response.status_code == 401:
                print("❌ 401 Unauthorized Error!")
                print("This usually means:")
                print("1. Invalid service account credentials")
                print("2. Missing or wrong scopes")
                print("3. Service account doesn't have proper permissions")
                print("4. Google Wallet API not enabled")
                
                # Try to parse error details
                try:
                    error_data = response.json()
                    print(f"Error details: {json.dumps(error_data, indent=2)}")
                except:
                    pass
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            logger.error(f"Failed to create loyalty class: {e}")
            raise
    
    def create_loyalty_object(self, object_data: Dict) -> Dict:
        """Create a loyalty card object for a specific user"""
        headers = {
            'Authorization': f'Bearer {self._get_access_token()}',
            'Content-Type': 'application/json'
        }
        
        url = f'{self.base_url}/loyaltyObject'
        
        # Debug output
        print(f"Making request to: {url}")
        print(f"Headers: {json.dumps(headers, indent=2)}")
        print(f"Data: {json.dumps(object_data, indent=2)}")
        
        try:
            response = requests.post(url, headers=headers, json=object_data)
            
            # Detailed debug output
            print(f"Response status: {response.status_code}")
            print(f"Response headers: {dict(response.headers)}")
            print(f"Response text: {response.text}")
            
            if response.status_code == 401:
                print("❌ 401 Unauthorized Error!")
                print("This usually means:")
                print("1. Invalid service account credentials")
                print("2. Missing or wrong scopes")
                print("3. Service account doesn't have proper permissions")
                print("4. Google Wallet API not enabled")
                
                # Try to parse error details
                try:
                    error_data = response.json()
                    print(f"Error details: {json.dumps(error_data, indent=2)}")
                except:
                    pass
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            logger.error(f"Failed to create loyalty object: {e}")
            raise
    
    def create_generic_class(self, class_data: Dict) -> Dict:
        """Create a generic pass class"""
        headers = {
            'Authorization': f'Bearer {self._get_access_token()}',
            'Content-Type': 'application/json'
        }
        
        url = f'{self.base_url}/genericClass'
        
        try:
            response = requests.post(url, headers=headers, json=class_data)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to create generic class: {e}")
            raise
    
    def create_generic_object(self, object_data: Dict) -> Dict:
        """Create a generic pass object"""
        headers = {
            'Authorization': f'Bearer {self._get_access_token()}',
            'Content-Type': 'application/json'
        }
        
        url = f'{self.base_url}/genericObject'
        
        try:
            response = requests.post(url, headers=headers, json=object_data)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to create generic object: {e}")
            raise
    
    def generate_add_to_wallet_url(self, object_id: str, object_type: str = 'loyaltyObject') -> str:
        """Generate URL to add pass to Google Wallet"""
        payload = {
            "aud": "google",
            "origins": ["www.example.com"],  # Replace with your domain
            "typ": "savetowallet",
            "payload": {
                object_type + "s": [{"id": object_id}]
            }
        }
        
        # In production, you should sign this JWT with your private key
        # For now, this is a placeholder
        token = json.dumps(payload)  # This should be a proper JWT
        
        return f"https://pay.google.com/gp/v/save/{token}"