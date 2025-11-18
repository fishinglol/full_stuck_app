# schemas.py
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str
    username: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool = True
    created_at: Optional[datetime] = None
    google_id: Optional[str] = None
    profile_picture: Optional[str] = None

    class Config:
        from_attributes = True

class GooglePayPassCreate(BaseModel):
    user_id: int
    program_name: str
    issuer_name: str
    account_name: str
    logo_url: str
    points_balance: Optional[int] = 0
    barcode_value: Optional[str] = None

class GooglePayPassResponse(BaseModel):
    object_id: str
    class_id: str
    wallet_url: str
    status: str

class PaymentBase(BaseModel):
    order_id: str
    amount: float
    currency: str = "USD"
    payment_method: str
    description: Optional[str] = None

class PaymentCreate(PaymentBase):
    user_id: int

class PaymentResponse(PaymentBase):
    id: int
    transaction_id: str
    status: str
    created_at: datetime

class RefundBase(BaseModel):
    payment_id: int
    amount: float
    reason: Optional[str] = None

class RefundCreate(RefundBase):
    pass

class RefundResponse(RefundBase):
    id: int
    refund_id: str
    status: str
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class GoogleLoginRequest(BaseModel):
    token: str

# Brand schemas
class BrandBase(BaseModel):
    name: str
    logo: str
    description: Optional[str] = None
    is_featured: bool = False
    website_url: Optional[str] = None

class BrandCreate(BrandBase):
    api_endpoint: str

class Brand(BrandBase):
    id: int
    api_endpoint: str
    logo_url: Optional[str] = None
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class BrandWithProducts(Brand):
    products: List['Product'] = []
    categories: List['ProductCategory'] = []

# Category schemas
class ProductCategoryBase(BaseModel):
    name: str
    display_name: str

class ProductCategoryCreate(ProductCategoryBase):
    brand_id: int

class ProductCategory(ProductCategoryBase):
    id: int
    brand_id: int
    is_active: bool
    
    class Config:
        from_attributes = True

# Product schemas
class ProductBase(BaseModel):
    name: str
    model: Optional[str] = None
    description: Optional[str] = None
    price: Optional[str] = None
    price_numeric: Optional[float] = None
    currency: str = "USD"
    color: Optional[str] = None
    material: Optional[str] = None
    dimensions: Optional[str] = None

class ProductCreate(ProductBase):
    brand_id: int
    category_id: Optional[int] = None
    image_urls: Optional[List[str]] = None
    thumbnail_url: Optional[str] = None
    sku: Optional[str] = None

class Product(ProductBase):
    id: int
    brand_id: int
    category_id: Optional[int] = None
    image_urls: Optional[List[str]] = None
    thumbnail_url: Optional[str] = None
    sku: Optional[str] = None
    is_active: bool
    is_featured: bool
    stock_status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ProductWithBrand(Product):
    brand: Brand
    category: Optional[ProductCategory] = None

# Response schemas
class BrandsResponse(BaseModel):
    brands: List[Brand]
    total: int

class ProductsResponse(BaseModel):
    products: List[Product]
    total: int
    brand: Optional[Brand] = None

# User profile schemas
class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    
class UserProfile(BaseModel):
    id: int
    name: str
    email: str
    username: Optional[str] = None
    profile_picture: Optional[str] = None
    bio: Optional[str] = None
    phone_number: Optional[str] = None
    verification_level: str
    created_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserStats(BaseModel):
    authentications_count: int
    total_spent: float
    favorite_items: int
    member_since: str

# Authentication history schemas
class AuthenticationCreate(BaseModel):
    product_id: Optional[int] = None
    brand_name: str
    product_name: str
    photos_uploaded: Optional[List[str]] = None
    
class AuthenticationResponse(BaseModel):
    id: int
    brand_name: str
    product_name: str
    authentication_result: Optional[str] = None
    confidence_score: Optional[float] = None
    cost: Optional[float] = None
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Settings schemas
class NotificationSettings(BaseModel):
    push_notifications: bool = True
    email_updates: bool = False
    sms_notifications: bool = False
    
class PrivacySettings(BaseModel):
    profile_visibility: str = "public"  # public, friends, private
    show_authentication_history: bool = True
    allow_contact: bool = True

class UserSettings(BaseModel):
    notifications: NotificationSettings
    privacy: PrivacySettings