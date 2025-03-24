import pandas as pd
import numpy as np
import pickle
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

class PropertyValuationModel:
    def __init__(self, data_path=None):
        """Initialize the valuation model"""
        self.model = None
        self.preprocessor = None
        
        if data_path:
            self.train(data_path)
    
    def train(self, data_path):
        """Train the valuation model on property data"""
        # Load data
        df = pd.read_csv(data_path)
        
        # Extract features and target
        X = df.drop(['Property ID', 'Sale Price (INR)', 'Sale Date', 'Nearby Amenities', 'Property Features'], axis=1)
        y = df['Sale Price (INR)']
        
        # Define categorical and numerical features
        categorical_features = ['Property Type', 'City', 'Neighborhood', 'ZIP Code', 'Renovation Status']
        numerical_features = ['Bedrooms', 'Bathrooms', 'Square Footage', 'Lot Size', 'Year Built', 'Renovation Year']
        
        # Create preprocessor
        categorical_transformer = Pipeline(steps=[
            ('onehot', OneHotEncoder(handle_unknown='ignore'))
        ])
        
        numerical_transformer = Pipeline(steps=[
            ('scaler', StandardScaler())
        ])
        
        self.preprocessor = ColumnTransformer(
            transformers=[
                ('cat', categorical_transformer, categorical_features),
                ('num', numerical_transformer, numerical_features)
            ])
        
        # Create and train the model
        self.model = Pipeline(steps=[
            ('preprocessor', self.preprocessor),
            ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
        ])
        
        self.model.fit(X, y)
    
    def predict(self, property_data):
        """
        Predict property value based on features
        
        Parameters:
        -----------
        property_data: dict
            Dictionary containing property features:
            - propertyType: str
            - location: str (neighborhood)
            - bedrooms: int
            - bathrooms: int
            - squareFeet: int
            - yearBuilt: int
            - lotSize: str (optional)
            - renovationStatus: str (optional)
            - renovationYear: int (optional)
            
        Returns:
        --------
        dict
            Dictionary with predicted value and confidence interval
        """
        if not self.model:
            raise ValueError("Model not trained. Call train() first or load a trained model.")
        
        # Prepare input data
        input_data = pd.DataFrame({
            'Property Type': [property_data.get('propertyType', 'Apartment')],
            'City': ['Delhi'],  # Assuming all properties are in Delhi
            'Neighborhood': [property_data.get('location', 'Vasant Kunj')],
            'ZIP Code': [property_data.get('zipCode', '110017')],  # Default to Vasant Kunj ZIP
            'Bedrooms': [int(property_data.get('bedrooms', 2))],
            'Bathrooms': [int(property_data.get('bathrooms', 2))],
            'Square Footage': [int(property_data.get('squareFeet', 1500))],
            'Lot Size': [float(property_data.get('lotSize', 2000))],
            'Year Built': [int(property_data.get('yearBuilt', 2010))],
            'Renovation Status': [property_data.get('renovationStatus', 'Not Renovated')],
            'Renovation Year': [int(property_data.get('renovationYear', property_data.get('yearBuilt', 2010)))]
        })
        
        # Make prediction
        predicted_value = self.model.predict(input_data)[0]
        
        # Calculate confidence interval (simplified)
        # In a real model, we would use proper statistical methods
        confidence_interval = predicted_value * 0.15  # 15% range
        
        return {
            'predictedValue': round(predicted_value, 2),
            'lowerBound': round(predicted_value - confidence_interval, 2),
            'upperBound': round(predicted_value + confidence_interval, 2),
            'currency': 'INR'
        }
    
    def save_model(self, filepath):
        """Save the trained model to a file"""
        if not self.model:
            raise ValueError("No trained model to save")
        
        with open(filepath, 'wb') as f:
            pickle.dump({'model': self.model}, f)
    
    def load_model(self, filepath):
        """Load a trained model from a file"""
        with open(filepath, 'rb') as f:
            model_data = pickle.load(f)
            self.model = model_data['model']