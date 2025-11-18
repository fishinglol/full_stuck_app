# auth_routes.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
import requests
import jwt
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .database import get_db
from .models import User
from .utils import create_access_token, hash_password
import logging

router = APIRouter(prefix="/auth", tags=["authentication"])
logger = logging.getLogger(__name__)

class GoogleAuthRequest(BaseModel):
    provider: str
    providerId: str
    email: EmailStr
    name: str
    picture: Optional[str] = None
    accessToken: str

class AuthResponse(BaseModel):
    user: dict
    access_token: str
    token_type: str = "bearer"

@router.post("/google", response_model=AuthResponse)
async def google_auth(auth_data: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Handle Google OAuth authentication
    """
    try:
        # Verify the Google access token
        google_user_info = await verify_google_token(auth_data.accessToken)
        
        # Verify that the token matches the provided user info
        if google_user_info.get('email') != auth_data.email:
            raise HTTPException(
                status_code=400, 
                detail="Token email doesn't match provided email"
            )
        
        # Check if user exists in database
        existing_user = db.query(User).filter(
            (User.email == auth_data.email) | 
            (User.google_id == auth_data.providerId)
        ).first()
        
        if existing_user:
            # Update existing user with Google info if needed
            if not existing_user.google_id:
                existing_user.google_id = auth_data.providerId
                existing_user.profile_picture = auth_data.picture
                db.commit()
                db.refresh(existing_user)
            
            user_data = {
                "id": existing_user.id,
                "name": existing_user.name,
                "email": existing_user.email,
                "profile_picture": existing_user.profile_picture,
                "provider": "google"
            }
        else:
            # Create new user
            new_user = User(
                name=auth_data.name,
                email=auth_data.email,
                google_id=auth_data.providerId,
                profile_picture=auth_data.picture,
                is_active=True,
                created_at=datetime.utcnow()
            )
            
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            
            user_data = {
                "id": new_user.id,
                "name": new_user.name,
                "email": new_user.email,
                "profile_picture": new_user.profile_picture,
                "provider": "google"
            }
        
        # Create JWT access token
        access_token = create_access_token(
            data={"sub": user_data["email"], "user_id": user_data["id"]}
        )
        
        logger.info(f"Google authentication successful for user: {auth_data.email}")
        
        return AuthResponse(
            user=user_data,
            access_token=access_token
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Google authentication error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error during Google authentication"
        )

async def verify_google_token(access_token: str) -> dict:
    """
    Verify Google access token and get user info
    """
    try:
        # Verify token with Google's API
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Accept': 'application/json'
        }
        
        # Get user info from Google
        response = requests.get(
            'https://www.googleapis.com/userinfo/v2/me',
            headers=headers,
            timeout=10
        )
        
        if response.status_code != 200:
            logger.error(f"Google token verification failed: {response.status_code}")
            raise HTTPException(
                status_code=400,
                detail="Invalid Google access token"
            )
        
        user_info = response.json()
        
        # Validate required fields
        if not all(key in user_info for key in ['id', 'email', 'name']):
            raise HTTPException(
                status_code=400,
                detail="Incomplete user information from Google"
            )
        
        return user_info
        
    except requests.RequestException as e:
        logger.error(f"Network error during Google token verification: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="Failed to verify with Google servers"
        )
    except Exception as e:
        logger.error(f"Unexpected error during Google token verification: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Token verification failed"
        )

@router.post("/google/revoke")
async def revoke_google_token(access_token: str, db: Session = Depends(get_db)):
    """
    Revoke Google access token (logout)
    """
    try:
        # Revoke token with Google
        response = requests.post(
            f'https://oauth2.googleapis.com/revoke?token={access_token}',
            timeout=10
        )
        
        if response.status_code == 200:
            return {"message": "Token revoked successfully"}
        else:
            logger.warning(f"Google token revocation failed: {response.status_code}")
            return {"message": "Token revocation failed, but session cleared locally"}
            
    except Exception as e:
        logger.error(f"Error revoking Google token: {str(e)}")
        return {"message": "Token revocation failed, but session cleared locally"}