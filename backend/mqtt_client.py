'''
    Used for sending data to all the devices for the testing
'''

import paho.mqtt.client as mqtt
import json
import random
import time
import psycopg2

THINGSBOARD_HOST = '3.111.205.170'
DB_HOST = '3.111.205.170'
DB_PORT = 5432
DB_NAME = 'thingsboard'
DB_USER = 'postgres'
DB_PASSWORD = 'Admin@123'

def fetch_access_tokens():
    try:
        connection = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = connection.cursor()
        query = "SELECT credentials_id FROM device_credentials"
        cursor.execute(query)
        tokens = cursor.fetchall()
        tokens = [token[0] for token in tokens]
        return tokens
    except Exception as e:
        print(f"Error fetching access tokens: {e}")
        return []
    finally:
        if connection:
            cursor.close()
            connection.close()

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")

def on_publish(client, userdata, mid):
    telemetry_data = userdata
    print(f"Message published with data: {telemetry_data}")

# Callback to log all MQTT actions (useful for debugging)
def on_log(client, userdata, level, buf):
    print(f"Log: {buf}")

def send_telemetry_data(access_token):
    client = mqtt.Client()
    client.username_pw_set(access_token)
    client.on_connect = on_connect
    client.on_publish = on_publish
    client.on_log = on_log
    
    # Enable logger for debugging
    client.enable_logger()
    
    # Connect to ThingsBoard MQTT broker
    client.connect(THINGSBOARD_HOST, 1883, 60)
    client.loop_start()

    try:
        telemetry_data = {
            "temperature": round(random.uniform(-10, 35), 3),
            "humidity": round(random.uniform(30, 85), 3),
            "power": round(random.uniform(0, 12), 3),
        }
        print(f"Sending telemetry data: {telemetry_data}")
        client.publish('v1/devices/me/telemetry', json.dumps(telemetry_data))
        time.sleep(0.01)
    except Exception as e:
        print(f"Error while sending telemetry: {e}")
    finally:
        client.loop_stop()
        # client.disconnect()

if __name__ == "__main__":
    try:
        access_tokens = fetch_access_tokens()
        while True:
            for access_token in access_tokens:
                print(access_token)
                send_telemetry_data(access_token)
            time.sleep(1)
    except KeyboardInterrupt:
        print("Disconnected by user")
