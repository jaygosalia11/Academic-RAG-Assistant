from app.database.connection import get_connection

connection = get_connection()

print("Database Connected")

connection.close()