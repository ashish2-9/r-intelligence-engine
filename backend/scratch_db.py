from Database import engine
from sqlalchemy import text

with engine.connect() as conn:
    try:
        conn.execute(text('ALTER TABLE users ADD COLUMN email VARCHAR(255) UNIQUE;'))
    except Exception as e: print(e)
    try:
        conn.execute(text('ALTER TABLE users ADD COLUMN username VARCHAR(255) UNIQUE;'))
    except Exception as e: print(e)
    try:
        conn.execute(text('ALTER TABLE users ADD COLUMN full_name VARCHAR(255);'))
    except Exception as e: print(e)
    try:
        conn.execute(text('ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);'))
    except Exception as e: print(e)
    try:
        conn.commit()
    except Exception as e: print(e)
    print('Columns added (or already existed).')
