import json
import os
import psycopg2
from datetime import datetime
from typing import Dict, Any
import uuid
import base64
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Handle hotel room bookings and payment processing
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with request_id attribute
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        return create_booking(event, context)
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }

def create_booking(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    try:
        body_data = json.loads(event.get('body', '{}'))
        
        guest_name = body_data.get('guestName')
        guest_email = body_data.get('guestEmail')
        guest_phone = body_data.get('guestPhone')
        room_type = body_data.get('roomType')
        check_in = body_data.get('checkIn')
        check_out = body_data.get('checkOut')
        total_price = body_data.get('totalPrice')
        nights = body_data.get('nights')
        
        if not all([guest_name, guest_email, guest_phone, room_type, check_in, check_out, total_price, nights]):
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing required fields'})
            }
        
        db_url = os.environ.get('DATABASE_URL')
        if not db_url:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Database configuration error'})
            }
        
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO bookings (guest_name, guest_email, guest_phone, room_type, check_in, check_out, nights, total_price, payment_status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        ''', (guest_name, guest_email, guest_phone, room_type, check_in, check_out, nights, total_price, 'pending'))
        
        booking_id = cursor.fetchone()[0]
        conn.commit()
        
        shop_id = os.environ.get('YOOKASSA_SHOP_ID')
        secret_key = os.environ.get('YOOKASSA_SECRET_KEY')
        
        if not shop_id or not secret_key:
            cursor.close()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'bookingId': booking_id,
                    'message': 'Booking created, but payment system not configured',
                    'paymentUrl': f'/booking-success?id={booking_id}'
                })
            }
        
        idempotence_key = str(uuid.uuid4())
        
        auth_string = f'{shop_id}:{secret_key}'
        auth_bytes = auth_string.encode('utf-8')
        auth_b64 = base64.b64encode(auth_bytes).decode('utf-8')
        
        payment_data = {
            'amount': {
                'value': f'{total_price}.00',
                'currency': 'RUB'
            },
            'confirmation': {
                'type': 'redirect',
                'return_url': f'https://your-domain.com/booking-success?id={booking_id}'
            },
            'capture': True,
            'description': f'Бронирование номера {room_type} в отеле LUXE HOTEL'
        }
        
        response = requests.post(
            'https://api.yookassa.ru/v3/payments',
            json=payment_data,
            headers={
                'Authorization': f'Basic {auth_b64}',
                'Idempotence-Key': idempotence_key,
                'Content-Type': 'application/json'
            }
        )
        
        if response.status_code == 200:
            payment_response = response.json()
            payment_id = payment_response.get('id')
            payment_url = payment_response.get('confirmation', {}).get('confirmation_url')
            
            cursor.execute(
                'UPDATE bookings SET payment_id = %s WHERE id = %s',
                (payment_id, booking_id)
            )
            conn.commit()
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'bookingId': booking_id,
                    'paymentId': payment_id,
                    'paymentUrl': payment_url
                })
            }
        else:
            cursor.close()
            conn.close()
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Payment creation failed'})
            }
        
    except Exception as e:
        if 'conn' in locals():
            conn.rollback()
            conn.close()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
