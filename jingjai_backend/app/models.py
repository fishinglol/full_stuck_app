# models.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True, nullable=True)
    password_hash = Column(String, nullable=True)
    google_id = Column(String, unique=True, nullable=True, index=True)
    profile_picture = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # NEW PROFILE FIELDS - Add these to your existing User model
    bio = Column(Text, nullable=True)
    phone_number = Column(String, nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    verification_level = Column(String, default="Unverified")  # Unverified, Verified, Premium
    notification_preferences = Column(JSON, nullable=True)  # Store as JSON
    privacy_settings = Column(JSON, nullable=True)
    last_login = Column(DateTime, nullable=True)
    
    # Relationships
    passes = relationship("GooglePayPass", back_populates="owner")
    payments = relationship("Payment", back_populates="user")
    authentications = relationship("Authentication", back_populates="user")  # New relationship

class GooglePayPass(Base):
    __tablename__ = "google_pay_passes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    program_name = Column(String)
    issuer_name = Column(String)
    account_name = Column(String)
    logo_url = Column(String)
    points_balance = Column(Integer, default=0)
    barcode_value = Column(String, nullable=True)
    object_id = Column(String, unique=True, index=True)
    class_id = Column(String, index=True)
    wallet_url = Column(String)
    status = Column(String)

    owner = relationship("User", back_populates="passes")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    transaction_id = Column(String, unique=True, index=True)
    order_id = Column(String, index=True)
    amount = Column(Float)
    currency = Column(String, default="USD")
    payment_method = Column(String)
    status = Column(String)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="payments")

class Refund(Base):
    __tablename__ = "refunds"

    id = Column(Integer, primary_key=True, index=True)
    payment_id = Column(Integer, ForeignKey("payments.id"))
    refund_id = Column(String, unique=True, index=True)
    amount = Column(Float)
    reason = Column(Text, nullable=True)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    payment = relationship("Payment")

class Brand(Base):
    __tablename__ = "brands"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    logo = Column(String)  # Logo text/symbol (like "LV", "GG")
    logo_url = Column(String, nullable=True)  # Optional image URL
    description = Column(Text, nullable=True)
    is_featured = Column(Boolean, default=False)
    api_endpoint = Column(String, unique=True)  # URL-friendly name like "louis-vuitton"
    website_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    products = relationship("Product", back_populates="brand")
    categories = relationship("ProductCategory", back_populates="brand")

class ProductCategory(Base):
    __tablename__ = "product_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"))
    name = Column(String, index=True)  # e.g., "handbags", "backpacks", "crossbody"
    display_name = Column(String)  # e.g., "Hand Bags", "Back Packs"
    is_active = Column(Boolean, default=True)
    
    # Relationships
    brand = relationship("Brand", back_populates="categories")
    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"))
    category_id = Column(Integer, ForeignKey("product_categories.id"), nullable=True)
    name = Column(String, index=True)
    model = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    price = Column(String, nullable=True)  # Store as string like "$2,500" for display
    price_numeric = Column(Float, nullable=True)  # Numeric price for sorting/filtering
    currency = Column(String, default="USD")
    
    # Images
    image_urls = Column(JSON, nullable=True)  # Store array of image URLs
    thumbnail_url = Column(String, nullable=True)
    
    # Product details
    sku = Column(String, unique=True, nullable=True)
    color = Column(String, nullable=True)
    material = Column(String, nullable=True)
    dimensions = Column(String, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    stock_status = Column(String, default="in_stock")  # in_stock, out_of_stock, limited
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    brand = relationship("Brand", back_populates="products")
    category = relationship("ProductCategory", back_populates="products")

# NEW MODEL - Authentication History
class Authentication(Base):
    __tablename__ = "authentications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    brand_name = Column(String, nullable=True)
    product_name = Column(String, nullable=True)
    authentication_result = Column(String)  # AUTHENTIC, FAKE, INCONCLUSIVE
    confidence_score = Column(Float, nullable=True)
    photos_uploaded = Column(JSON, nullable=True)  # Store photo URLs
    authenticator_notes = Column(Text, nullable=True)
    cost = Column(Float, nullable=True)
    status = Column(String, default="PENDING")  # PENDING, COMPLETED, CANCELLED
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="authentications")
    product = relationship("Product")
