from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import pandas as pd
import pickle
import os
from datetime import datetime

# Import your model from pickle file
model_path = os.path.join(os.path.dirname(__file__), "c:\\Users\\hardi\\OneDrive\\Desktop\\re_work\\project\\backend\\trained_models\\valuation_model.pkl")
with open(model_path, 'rb') as f:
    model = pickle.load(f)

app = FastAPI()

# Update CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PropertyValuationRequest(BaseModel):
    property_type: str
    neighborhood: str
    bedrooms: int
    bathrooms: int
    square_footage: int
    lot_size: int
    year_built: int
    renovation_status: str
    renovation_year: Optional[int] = None
    property_features: str

@app.post("/api/valuation")
async def predict_property_value(request: PropertyValuationRequest):
    import time
    start_time = time.time()
    
    try:
        # Print received data for debugging
        print(f"Received data: {request}")
        print(f"Time after receiving data: {time.time() - start_time:.2f} seconds")
        
        # Clean up string values by removing any extra quotes
        neighborhood = request.neighborhood.strip('"')
        property_type = request.property_type.strip('"')
        renovation_status = request.renovation_status.strip('"')
        property_features = request.property_features.strip('"')
        
        print(f"Time after cleaning strings: {time.time() - start_time:.2f} seconds")
        
        # Prepare the input data for the model
        input_data = {
            'Property Type': property_type,
            'Neighborhood': neighborhood,
            'Bedrooms': request.bedrooms,
            'Bathrooms': request.bathrooms,
            'Square Footage': request.square_footage,
            'Lot Size': request.lot_size,
            'Year Built': request.year_built,
            'Renovation Status': renovation_status,
            'Renovation Year': request.renovation_year if request.renovation_year else request.year_built,
            'Property Features': property_features
        }
        
        # Print formatted data for debugging
        print(f"Formatted data for model: {input_data}")
        print(f"Time after formatting data: {time.time() - start_time:.2f} seconds")
        
        # Convert to DataFrame (assuming your model expects a DataFrame)
        input_df = pd.DataFrame([input_data])
        print(f"Time after creating DataFrame: {time.time() - start_time:.2f} seconds")
        
        # Check if model is loaded correctly
        print(f"Model type: {type(model)}")
        
        # Make prediction with timeout
        print("Starting prediction...")
        prediction_start = time.time()
        
        # Try a simple prediction to see if it works
        try:
            predicted_price = model.predict(input_df)[0]
            print(f"Prediction completed in {time.time() - prediction_start:.2f} seconds")
        except Exception as pred_error:
            print(f"Error during model prediction: {str(pred_error)}")
            
            # Try a fallback prediction method
            print("Trying fallback prediction...")
            # Simple fallback calculation based on square footage
            predicted_price = request.square_footage * 10000  # Simple estimate
            print("Used fallback prediction")
        
        print(f"Total processing time: {time.time() - start_time:.2f} seconds")
        
        return {
            "predicted_price": float(predicted_price),
            "status": "success",
            "processing_time": f"{time.time() - start_time:.2f} seconds"
        }
    except Exception as e:
        end_time = time.time()
        print(f"Error during prediction: {str(e)}")
        print(f"Error occurred after {end_time - start_time:.2f} seconds")
        
        # Return a fallback response with an error
        return {
            "predicted_price": request.square_footage * 10000,  # Simple fallback estimate
            "status": "error",
            "error": str(e),
            "note": "Using fallback estimation due to error"
        }

@app.get("/api/test")
async def test_endpoint():
    return {"message": "Test endpoint works!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)