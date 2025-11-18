from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import Optional, List
from .database import get_db
from .models import Brand, Product, ProductCategory
from .schemas import (
    Brand as BrandSchema, 
    BrandWithProducts,
    Product as ProductSchema,
    ProductWithBrand,
    BrandsResponse,
    ProductsResponse
)

router = APIRouter(prefix="/brands", tags=["brands"])

@router.get("/", response_model=BrandsResponse)
def get_all_brands(
    featured_only: Optional[bool] = Query(False, description="Get only featured brands"),
    active_only: Optional[bool] = Query(True, description="Get only active brands"),
    db: Session = Depends(get_db)
):
    """Get all brands with optional filtering"""
    query = db.query(Brand)
    
    if active_only:
        query = query.filter(Brand.is_active == True)
    
    if featured_only:
        query = query.filter(Brand.is_featured == True)
    
    brands = query.order_by(Brand.name).all()
    
    return BrandsResponse(
        brands=brands,
        total=len(brands)
    )

@router.get("/featured", response_model=BrandsResponse)
def get_featured_brands(db: Session = Depends(get_db)):
    """Get only featured brands"""
    brands = db.query(Brand).filter(
        and_(Brand.is_featured == True, Brand.is_active == True)
    ).order_by(Brand.name).all()
    
    return BrandsResponse(
        brands=brands,
        total=len(brands)
    )

@router.get("/{brand_id}", response_model=BrandWithProducts)
def get_brand_by_id(brand_id: int, db: Session = Depends(get_db)):
    """Get a specific brand with its products and categories"""
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    return brand

@router.get("/{brand_id}/products", response_model=ProductsResponse)
def get_brand_products(
    brand_id: int,
    category: Optional[str] = Query(None, description="Filter by category name"),
    search: Optional[str] = Query(None, description="Search in product names and models"),
    featured_only: Optional[bool] = Query(False, description="Get only featured products"),
    limit: Optional[int] = Query(50, description="Limit number of results"),
    offset: Optional[int] = Query(0, description="Offset for pagination"),
    db: Session = Depends(get_db)
):
    """Get products for a specific brand with filtering options"""
    
    # Verify brand exists
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    # Start with base query
    query = db.query(Product).filter(Product.brand_id == brand_id)
    
    # Apply filters
    if category:
        query = query.join(ProductCategory).filter(ProductCategory.name == category.lower())
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_term),
                Product.model.ilike(search_term),
                Product.description.ilike(search_term)
            )
        )
    
    if featured_only:
        query = query.filter(Product.is_featured == True)
    
    # Always filter active products
    query = query.filter(Product.is_active == True)
    
    # Get total count
    total = query.count()
    
    # Apply pagination and ordering
    products = query.order_by(Product.name).offset(offset).limit(limit).all()
    
    return ProductsResponse(
        products=products,
        total=total,
        brand=brand
    )

@router.get("/{brand_id}/categories")
def get_brand_categories(brand_id: int, db: Session = Depends(get_db)):
    """Get all categories for a specific brand"""
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    categories = db.query(ProductCategory).filter(
        and_(
            ProductCategory.brand_id == brand_id,
            ProductCategory.is_active == True
        )
    ).all()
    
    return {"categories": categories, "brand": brand}
