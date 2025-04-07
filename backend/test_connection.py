import pymysql

def test_connection():
    try:
        connection = pymysql.connect(
    host="sujayvm.mysql.polardb.eu-west-1.rds.aliyuncs.com",
    port=3306,
    user="root_name",        
    password="sujay@HOME7",
    db="robot",              
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)

        
        print("Connection to PolarDB successful!")
        
        with connection.cursor() as cursor:
            cursor.execute("SHOW TABLES;")
            tables = cursor.fetchall()
            print("Tables in 'robot' database:", tables)

    except Exception as e:
        print("Error connecting to database:", e)

    finally:
        if 'connection' in locals() and connection:
            connection.close()

if __name__ == "__main__":
    test_connection()
