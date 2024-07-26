from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv
import json
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from .env file
load_dotenv()
app = FastAPI()

# Allow all origins
origins = ["http://localhost:3000"]

class UserInput(BaseModel):
    input: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # you can also set this to ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')


def palettePrompt(str):
    prompt = f"""
    Generate the color palette in JSON format for the following brand or keyword:

    Input: "{str}"

    Output:
    Just return the JSON object with the color names and their corresponding hex codes with no additional text or formatting.

    Output Example:
    {{ "Blue": "#4285F4", "Red": "#DB4437", "Yellow": "#F4B400", "Green": "#0F9D58" }}
    """
    return prompt

@app.post("/generate_palette/")
async def generate_palette(data: UserInput):
    input_value = data.input
    url = 'https://api.openai.com/v1/chat/completions'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {OPENAI_API_KEY}',
    }
    data = {
        "model": "gpt-4o",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant.",
            },
            {
                "role": "user",
                "content": palettePrompt(input_value),
            },
        ],
        "max_tokens": 300,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers, json=data)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Error fetching data from OpenAI")

        # Extract the content from the response
        data = response.json()
        print(data)
        # Extract the content from the response
        content = data['choices'][0]['message']['content']

        # Parse the JSON string to a Python dictionary
        palette_dict = json.loads(content)

        # Convert the dictionary back to a JSON string with desired formatting
        transformed_palette_json = json.dumps(palette_dict, indent=2)

        print(transformed_palette_json)

        return {"palette": transformed_palette_json}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
