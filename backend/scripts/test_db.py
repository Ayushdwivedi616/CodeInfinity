import pyodbc

# Edit these values if needed
SERVER = r"IN-AYUSH-DIWIVE\SQLEXPRESS"
DATABASE = "Codefinity"  # change to exact name shown in SSMS

conn_str = (
    f"DRIVER={{ODBC Driver 17 for SQL Server}};"
    f"SERVER={SERVER};"
    f"DATABASE={DATABASE};"
    "Trusted_Connection=yes"
)

print("Attempting pyodbc.connect() with:\n", conn_str)
try:
    conn = pyodbc.connect(conn_str, timeout=5)
    print("Connected successfully")
    conn.close()
except Exception as e:
    print("Connection failed:\n", repr(e))
    # For detailed error messages, pyodbc may raise DatabaseError with args
    if hasattr(e, 'args'):
        print("Error args:", e.args)
