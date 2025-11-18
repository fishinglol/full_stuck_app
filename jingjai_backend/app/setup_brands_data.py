from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import Brand, ProductCategory, Product
from sqlalchemy import and_

def setup_initial_brands_data():
    """Setup initial brands and products data"""
    db = SessionLocal()
    
    try:
        # Create brands
        brands_data = [
            {
                "name": "Louis Vuitton",
                "logo": "LV",
                "api_endpoint": "louis-vuitton",
                "is_featured": True,
                "website_url": "https://louisvuitton.com"
            },
            {
                "name": "Gucci",
                "logo": "GG", 
                "api_endpoint": "gucci",
                "is_featured": True,
                "website_url": "https://gucci.com"
            },
            {
                "name": "Hermes",
                "logo": "H",
                "api_endpoint": "hermes",
                "is_featured": True,
                "website_url": "https://hermes.com"
            },
            {
                "name": "Chanel",
                "logo": "CC",
                "api_endpoint": "chanel",
                "is_featured": True,
                "website_url": "https://chanel.com"
            },
            {
                "name": "Alexander Wang",
                "logo": "AW",
                "api_endpoint": "alexander-wang",
                "is_featured": False,
                "website_url": "https://alexanderwang.com"
            }
        ]
        
        for brand_data in brands_data:
            existing_brand = db.query(Brand).filter(Brand.name == brand_data["name"]).first()
            if not existing_brand:
                brand = Brand(**brand_data)
                db.add(brand)
                db.flush()  # Get the brand.id
                
                # Add categories for each brand
                categories = [
                    {"name": "handbags", "display_name": "Hand Bags"},
                    {"name": "backpacks", "display_name": "Backpacks"},
                    {"name": "crossbody", "display_name": "Crossbody Bags"},
                    {"name": "totes", "display_name": "Tote Bags"},
                ]
                
                for cat_data in categories:
                    category = ProductCategory(
                        brand_id=brand.id,
                        name=cat_data["name"],
                        display_name=cat_data["display_name"]
                    )
                    db.add(category)
        
        # Add Alexander Wang products (as example)
        alexander_wang = db.query(Brand).filter(Brand.name == "Alexander Wang").first()
        if alexander_wang:
            handbags_cat = db.query(ProductCategory).filter(
                and_(
                    ProductCategory.brand_id == alexander_wang.id,
                    ProductCategory.name == "handbags"
                )
            ).first()
            
            products = [
                {"name": "Attica", "model": "Alexander Wang", "category_id": handbags_cat.id if handbags_cat else None},
                {"name": "Attica Fanny Pack", "model": "Alexander Wang", "category_id": handbags_cat.id if handbags_cat else None},
                {"name": "Rocco", "model": "Alexander Wang", "category_id": handbags_cat.id if handbags_cat else None},
                {"name": "Rockie", "model": "Alexander Wang", "category_id": handbags_cat.id if handbags_cat else None},
                {"name": "Mini Marti Backpack", "model": "Alexander Wang"},
                {"name": "Rhett Tote", "model": "Alexander Wang"},
            ]
            
            for product_data in products:
                existing_product = db.query(Product).filter(
                    and_(
                        Product.brand_id == alexander_wang.id,
                        Product.name == product_data["name"]
                    )
                ).first()
                
                if not existing_product:
                    product = Product(
                        brand_id=alexander_wang.id,
                        **product_data
                    )
                    db.add(product)
        
        db.commit()
        print("✅ Initial brands and products data setup completed!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error setting up brands data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    setup_initial_brands_data()
