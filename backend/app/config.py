import os
from urllib.parse import quote_plus

RDS_HOST = os.environ.get('RDS_HOST', '')
RDS_PORT = os.environ.get('RDS_PORT', '')
RDS_DB = os.environ.get('RDS_DB', '')
RDS_USER = os.environ.get('RDS_USER', '')
# Replace YOUR_DB_PASSWORD with your actual password that contains '@'
raw_password = os.environ.get('RDS_PASSWORD', '7')
RDS_PASSWORD = quote_plus(raw_password)  # URL-encode the password

SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{RDS_USER}:{RDS_PASSWORD}@{RDS_HOST}:{RDS_PORT}/{RDS_DB}"
SQLALCHEMY_TRACK_MODIFICATIONS = False
