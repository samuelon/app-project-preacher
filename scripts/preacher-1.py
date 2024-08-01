from dotenv import load_dotenv
import os
import openai

load_dotenv()
APIKEY = os.getenv('OPENAI_API_KEY')
openai.api_key = APIKEY

(APIKEY)
# # Example usage

chat_completion = openai.api_key.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "Say this is a test",
        }
    ],
    model="gpt-3.5-turbo",
)

# response = openai.ChatCompletion.create(
#   model="gpt-3.5-turbo",
#   messages=[
#     {"role": "user", "content": "Hello!"},
#     # We'll add the reply back in!
#     {
#       "content": "Hello there! How can I assist you today?",
#       "role": "assistant"     },
#     # Now we add our response:
#     {"role": "user", "content": "I am good, briefly, what is the definition of AI?"},
#   ]
# )

print(chat_completion.choices[0].message)