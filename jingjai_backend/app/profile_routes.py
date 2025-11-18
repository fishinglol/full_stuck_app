from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Optional, List
from datetime import datetime, timedelta
from .database import get_db
from .models import User, Authentication, Product
from .schemas import (
    UserProfile, 
    UserProfileUpdate, 
    UserStats, 
    AuthenticationResponse,
    AuthenticationCreate,
    UserSettings,
    NotificationSettings,
    PrivacySettings
)
from .auth_utils import get_current_user

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's profile information"""
    return current_user

@router.put("/me", response_model=UserProfile)
async def update_profile(
    profile_update: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile information"""
    
    # Update only provided fields
    if profile_update.name is not None:
        current_user.name = profile_update.name
    if profile_update.bio is not None:
        current_user.bio = profile_update.bio
    if profile_update.phone_number is not None:
        current_user.phone_number = profile_update.phone_number
    if profile_update.date_of_birth is not None:
        current_user.date_of_birth = profile_update.date_of_birth
    
    try:
        db.commit()
        db.refresh(current_user)
        return current_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to update profile")

@router.post("/upload-photo")
async def upload_profile_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload and update profile picture"""
    
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Save file logic (implement based on your storage solution)
    # This is a placeholder - you'd implement actual file storage
    file_url = f"https://your-storage.com/profiles/{current_user.id}_{file.filename}"
    
    current_user.profile_picture = file_url
    db.commit()
    
    return {"profile_picture": file_url}

@router.get("/stats", response_model=UserStats)
async def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user statistics"""
    
    # Get authentication count
    auth_count = db.query(Authentication).filter(
        Authentication.user_id == current_user.id
    ).count()
    
    # Get total spent
    total_spent = db.query(func.sum(Authentication.cost)).filter(
        Authentication.user_id == current_user.id,
        Authentication.status == "COMPLETED"
    ).scalar() or 0
    
    # Get favorite items count (you'd need to implement favorites)
    favorite_items = 0  # Placeholder
    
    # Calculate member since
    member_since = current_user.created_at.strftime("%Y")
    
    return UserStats(
        authentications_count=auth_count,
        total_spent=float(total_spent),
        favorite_items=favorite_items,
        member_since=member_since
    )

@router.get("/authentications", response_model=List[AuthenticationResponse])
async def get_authentication_history(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's authentication history"""
    
    authentications = db.query(Authentication).filter(
        Authentication.user_id == current_user.id
    ).order_by(desc(Authentication.created_at)).offset(skip).limit(limit).all()
    
    return authentications

@router.post("/authentications", response_model=AuthenticationResponse)
async def create_authentication_request(
    auth_data: AuthenticationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new authentication request"""
    
    authentication = Authentication(
        user_id=current_user.id,
        product_id=auth_data.product_id,
        brand_name=auth_data.brand_name,
        product_name=auth_data.product_name,
        photos_uploaded=auth_data.photos_uploaded,
        status="PENDING"
    )
    
    db.add(authentication)
    db.commit()
    db.refresh(authentication)
    
    return authentication

@router.get("/settings", response_model=UserSettings)
async def get_user_settings(
    current_user: User = Depends(get_current_user)
):
    """Get user settings"""
    
    # Parse JSON settings or return defaults
    notification_prefs = current_user.notification_preferences or {}
    privacy_prefs = current_user.privacy_settings or {}
    
    return UserSettings(
        notifications=NotificationSettings(**notification_prefs),
        privacy=PrivacySettings(**privacy_prefs)
    )

@router.put("/settings")
async def update_user_settings(
    settings: UserSettings,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user settings"""
    
    current_user.notification_preferences = settings.notifications.dict()
    current_user.privacy_settings = settings.privacy.dict()
    
    db.commit()
    
    return {"message": "Settings updated successfully"}

@router.delete("/me")
async def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete user account"""
    
    # You might want to soft delete or anonymize data instead
    current_user.is_active = False
    current_user.email = f"deleted_{current_user.id} @deleted.com"
    
    db.commit()
    
    return {"message": "Account deleted successfully"}
