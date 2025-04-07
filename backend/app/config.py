import os
from urllib.parse import quote_plus

RDS_HOST = os.environ.get('RDS_HOST', 'sujayvm.mysql.polardb.eu-west-1.rds.aliyuncs.com')
RDS_PORT = os.environ.get('RDS_PORT', '3306')
RDS_DB = os.environ.get('RDS_DB', 'robot')
RDS_USER = os.environ.get('RDS_USER', 'root_name')
# Replace YOUR_DB_PASSWORD with your actual password that contains '@'
raw_password = os.environ.get('RDS_PASSWORD', 'sujay@HOME7')
RDS_PASSWORD = quote_plus(raw_password)  # URL-encode the password

SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{RDS_USER}:{RDS_PASSWORD}@{RDS_HOST}:{RDS_PORT}/{RDS_DB}"
SQLALCHEMY_TRACK_MODIFICATIONS = False
