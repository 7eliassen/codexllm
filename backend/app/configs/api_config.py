from dotenv import load_dotenv
import os

TIMEOUT = 30

# .env must be in root directory
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.env"))
load_dotenv(env_path)

api_key = os.getenv("API_KEY")

url = "http://llm.codex.so/stream"

headers = {
    "x-api-key": api_key,
    "Content-Type" : "application/json",
    "Accept": "application/x-ndjson"
}