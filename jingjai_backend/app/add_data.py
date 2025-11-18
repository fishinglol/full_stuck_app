from database import SessionLocal
from models import Brand, Product
from datetime import datetime

db = SessionLocal()

try:
    # Add Alexander Wang brand
    brand = Brand(
        name="Alexander Wang",
        logo="AW",
        api_endpoint="alexander-wang",
        is_featured=False,
        created_at=datetime.utcnow()
    )
    db.add(brand)
    db.commit()
    db.refresh(brand)
    print(f"Added brand: {brand.name}")

    # Add some products
    products = [
        Product(brand_id=brand.id, name="Attica", model="Alexander Wang", created_at=datetime.utcnow()),
        Product(brand_id=brand.id, name="Rocco", model="Alexander Wang", created_at=datetime.utcnow()),
        Product(brand_id=brand.id, name="Rockie", model="Alexander Wang", created_at=datetime.utcnow()),
    ]

    for product in products:
        db.add(product)

    db.commit()
    print(f"Added {len(products)} products")
    print("Data added successfully!")

except Exception as e:
    db.rollback()
    print(f"Error: {e}")
finally:
    db.close()
