# app/migrate_user_profile.py
from sqlalchemy import text
from database import engine

def migrate_user_table():
    """Add new profile columns to existing users table"""
    
    migrations = [
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR;", 
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth TIMESTAMP;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_level VARCHAR DEFAULT 'Unverified';",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_preferences JSON;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS privacy_settings JSON;",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;"
    ]
    
    try:
        with engine.begin() as conn:
            for migration in migrations:
                conn.execute(text(migration))
                print(f"✅ Added column: {migration}")
        
        print(" Migration completed successfully!")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")

if __name__ == "__main__":
    migrate_user_table()
