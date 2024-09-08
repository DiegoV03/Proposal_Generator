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
cohere_api_key = "INSERT-KEY-HERE"
if not cohere_api_key:
    logging.error("Cohere API key is missing or not loaded correctly")

# Initialize Cohere client
cohere_client = cohere.Client(cohere_api_key)

# Define the proposal request model
class ProposalRequest(BaseModel):
    description: str

# Endpoint to generate a proposal
@app.post("/generate")
async def generate_proposal(request: ProposalRequest):
    try:
        # Determine if the description is empty or not
        if not request.description.strip():
            # Generate a generic business proposal template if description is empty
            max_tokens = 1500
            prompt = f"Generate a generic business proposal template under 1000 words."
        else:
            # Generate a proposal based on the given description
            max_tokens = 1500
            prompt = f"Generate a concise business proposal template under 1000 words. {request.description}"

        # Call Cohere API to generate the proposal
        response = cohere_client.generate(
            model='command-r-plus',
            max_tokens=max_tokens,
            prompt=prompt
        )

        proposal_text = response.generations[0].text.strip()

        return {"proposal": proposal_text}
    except Exception as e:
        logging.error(f"Error generating proposal: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
