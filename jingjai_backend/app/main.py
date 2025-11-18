# app/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add this import to your existing main.py imports
from .google_pay_payments import router as payments_router
from .google_pay_routes import router as google_pay_router
from .brands_routes import router as brands_router
from .products_routes import router as products_router
from .profile_routes import router as profile_router

# Import from the same directory (app folder)
from . import models
from . import schemas
from . import crud
from .database import SessionLocal, engine, get_db
from .utils import create_access_token

# Initialize FastAPI app
app = FastAPI(title="JINGJAI API", description="Authentication API for JINGJAI app")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Pydantic models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "JINGJAI API is running", "status": "OK"}

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "API is running properly"}

# Test environment variables endpoint
@app.get("/test-env")
def test_env():
    return {
        "service_account_file": os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE"),
        "issuer_id": os.getenv("GOOGLE_PAY_ISSUER_ID"),
        "file_exists": os.path.exists(os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE", "")),
    }

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Test database connection
@app.get("/test-db")
def test_database(db: Session = Depends(get_db)):
    
    try:
        user_count = db.query(models.User).count()
        return {
            "message": "Database connected successfully", 
            "user_count": user_count,
            "status": "OK"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

# User registration endpoint
@app.post("/register", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    try:
        # Check if email already exists
        existing_email = crud.get_user_by_email(db, email=user.email)
        if existing_email:
            raise HTTPException(
                status_code=400, 
                detail="Email already registered"
            )
        
        # Check if username already exists
        if user.username:
            existing_username = crud.get_user_by_username(db, username=user.username)
            if existing_username:
                raise HTTPException(
                    status_code=400, 
                    detail="Username already taken"
                )
        
        # Create new user
        return crud.create_user(db=db, user=user)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Internal server error during registration"
        )

# User login endpoint
@app.post("/login")
def login_user(login_data: LoginRequest, db: Session = Depends(get_db)):
    try:
        user = crud.get_user_by_email(db, email=login_data.email.lower())
        
        if user is None or not pwd_context.verify(login_data.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Create JWT token
        from .utils import create_access_token  # You'll need to create this
        access_token = create_access_token(data={"user_id": user.id})
        
        return {
            "success": True,
            "message": "Login successful",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "username": user.username
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

# Include auth routes
from .auth_routes import router as auth_router
app.include_router(auth_router)
app.include_router(google_pay_router)
app.include_router(payments_router)
app.include_router(brands_router)
app.include_router(products_router)
app.include_router(profile_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
