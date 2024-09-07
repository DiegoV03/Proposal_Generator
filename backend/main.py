from pydantic import BaseModel
import cohere
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cohere API key
cohere_api_key = "insert_key_here"
if not cohere_api_key:
    logging.error("Cohere API key is missing or not loaded correctly")

# Initialize Cohere client
cohere_client = cohere.Client(cohere_api_key)

# Define the proposal request model
class ProposalRequest(BaseModel):
    topic: str
    description: str

# Calculates max tokens based on input length. Example logic: Allow fewer tokens if description is very long
def calculate_max_tokens(description: str, base_max_tokens: int = 500) -> int:
    description_length = len(description.split())
    adjusted_max_tokens = min(base_max_tokens, max(50, base_max_tokens - description_length))
    return adjusted_max_tokens

# Endpoint to generate a proposal
@app.post("/generate")
async def generate_proposal(request: ProposalRequest):
    try:
        max_tokens = calculate_max_tokens(request.description)

        response = cohere_client.generate(
            model='command-r-plus', #Specific cohere model used
            prompt=f"Generate a concise business proposal about {request.topic}. {request.description}",
            max_tokens=max_tokens
        )
        proposal_text = response.generations[0].text.strip()

        return {"proposal": proposal_text}
    except Exception as e:
        logging.error(f"Error generating proposal: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")