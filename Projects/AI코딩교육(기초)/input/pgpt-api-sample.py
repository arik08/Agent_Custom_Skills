import os
import requests

url = "http://pgpt.posco.com/s0la01-gpt/gptApi/personalApi"
api_key = os.getenv("PGPT_API_KEY")

headers = {
    "accept": "*/*",
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}
data = {
    "model": "gpt-5.4-mini",
    "messages": [
        {"role": "system", "content": "시스템 지시"},
        {"role": "user", "content": "테스트"}
    ]
}
response = requests.post(url, headers=headers, json=data)
print('\n', response.text, '\n')
