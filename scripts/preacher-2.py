import requests

headers = {
    'Content-Type': 'application/json',
}

data = '{\n"message":"your_message_text",\n "link":"your_url",\n "published":"false",\n  "scheduled_publish_time":"unix_time_stamp_of_a_future_date",\n         }'

response = requests.post('https://graph.facebook.com/v20.0/page_id/feed', headers=headers, data=data)