from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import Optional
from .database import get_db
from .models import Product, Brand, ProductCategory
from .schemas import ProductWithBrand, ProductsResponse

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/{product_id}", response_model=ProductWithBrand)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    """Get a specific product with brand information"""
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return product

@router.get("/search", response_model=ProductsResponse)
def search_products(
    q: str = Query(..., description="Search query"),
    brand_id: Optional[int] = Query(None, description="Filter by brand ID"),
    category: Optional[str] = Query(None, description="Filter by category"),
    min_price: Optional[float] = Query(None, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, description="Maximum price filter"),
    limit: Optional[int] = Query(50, description="Limit number of results"),
    offset: Optional[int] = Query(0, description="Offset for pagination"),
    db: Session = Depends(get_db)
):
    """Search products across all brands or within a specific brand"""
    
    query = db.query(Product).filter(Product.is_active == True)
    
    # Apply search term
    search_term = f"%{q}%"
    query = query.filter(
        or_(
            Product.name.ilike(search_term),
            Product.model.ilike(search_term),
            Product.description.ilike(search_term)
        )
    )
    
    # Apply filters
    if brand_id:
        query = query.filter(Product.brand_id == brand_id)
    
    if category:
        query = query.join(ProductCategory).filter(ProductCategory.name == category.lower())
    
    if min_price is not None:
        query = query.filter(Product.price_numeric >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.price_numeric <= max_price)
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    products = query.offset(offset).limit(limit).all()
    
    return ProductsResponse(
        products=products,
        total=total
    )
