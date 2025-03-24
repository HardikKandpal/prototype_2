import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity

class PropertyRecommender:
    def __init__(self, data_path):
        """Initialize the recommender with property data"""
        self.df = pd.read_csv(data_path)
        self.prepare_data()
        
    def prepare_data(self):
        """Prepare and transform the data for recommendation"""
        # Extract amenities into separate columns
        amenities = self.df['Amenities'].str.split(', ', expand=True).stack()
        amenities = pd.get_dummies(amenities).groupby(level=0).sum()
        
        # Convert price to numeric
        self.df['Price'] = pd.to_numeric(self.df['Price (INR)'])
        
        # Create feature matrix
        self.features = pd.DataFrame()
        self.features['property_id'] = self.df['Property ID']
        
        # One-hot encode property type
        property_type = pd.get_dummies(self.df['Property Type'], prefix='type')
        self.features = pd.concat([self.features, property_type], axis=1)
        
        # Add location as one-hot encoded
        location = pd.get_dummies(self.df['Location'], prefix='location')
        self.features = pd.concat([self.features, location], axis=1)
        
        # Add bedrooms and bathrooms
        self.features['bedrooms'] = self.df['Bedrooms']
        self.features['bathrooms'] = self.df['Bathrooms']
        
        # Add square footage
        self.features['square_footage'] = self.df['Square Footage']
        
        # Add amenities
        self.features = pd.concat([self.features, amenities], axis=1)
        
        # Scale numerical features
        scaler = MinMaxScaler()
        numerical_cols = ['bedrooms', 'bathrooms', 'square_footage']
        self.features[numerical_cols] = scaler.fit_transform(self.features[numerical_cols])
        
        # Set property_id as index
        self.features.set_index('property_id', inplace=True)
    
    def get_recommendations(self, preferences, top_n=5):
        """
        Get property recommendations based on user preferences
        
        Parameters:
        -----------
        preferences: dict
            Dictionary containing user preferences with keys:
            - propertyType: str
            - budget: str (price range)
            - location: str
            - bedrooms: str
            - amenities: list of str
            
        top_n: int
            Number of recommendations to return
            
        Returns:
        --------
        list of dict
            List of recommended properties with details
        """
        # Create a user profile vector
        user_profile = pd.DataFrame(0, index=[0], columns=self.features.columns)
        
        # Set property type preference
        if preferences.get('propertyType'):
            type_col = f"type_{preferences['propertyType']}"
            if type_col in user_profile.columns:
                user_profile[type_col] = 1
        
        # Set location preference
        if preferences.get('location'):
            location_col = f"location_{preferences['location']}"
            if location_col in user_profile.columns:
                user_profile[location_col] = 1
        
        # Set bedroom preference
        if preferences.get('bedrooms'):
            try:
                bedrooms = int(preferences['bedrooms'])
                user_profile['bedrooms'] = bedrooms / 6  # Normalize assuming max 6 bedrooms
            except (ValueError, TypeError):
                pass
        
        # Set amenities preferences
        if preferences.get('amenities'):
            for amenity in preferences['amenities']:
                if amenity in user_profile.columns:
                    user_profile[amenity] = 1
        
        # Calculate similarity scores
        similarity = cosine_similarity(user_profile, self.features)
        similarity_scores = similarity[0]
        
        # Get indices of top N similar properties
        indices = np.argsort(similarity_scores)[::-1][:top_n*2]  # Get more than needed for budget filtering
        top_indices = [self.features.index[i] for i in indices]
        
        # Filter by budget if provided
        if preferences.get('budget'):
            try:
                budget_range = preferences['budget'].split('-')
                min_budget = float(budget_range[0].strip())
                max_budget = float(budget_range[1].strip()) if len(budget_range) > 1 else float('inf')
                
                # Filter properties within budget
                budget_filtered_indices = []
                for property_id in top_indices:
                    price = self.df.loc[self.df['Property ID'] == property_id, 'Price (INR)'].values[0]
                    if min_budget <= price <= max_budget:
                        budget_filtered_indices.append(property_id)
                
                top_indices = budget_filtered_indices[:top_n]
            except (ValueError, IndexError):
                top_indices = top_indices[:top_n]
        else:
            top_indices = top_indices[:top_n]
        
        # Get recommended properties
        recommendations = []
        for property_id in top_indices:
            property_data = self.df.loc[self.df['Property ID'] == property_id].iloc[0]
            
            recommendations.append({
                'id': property_id,
                'title': f"{property_data['Property Type']} in {property_data['Location']}",
                'type': property_data['Property Type'],
                'price': property_data['Price (INR)'],
                'location': property_data['Location'],
                'bedrooms': property_data['Bedrooms'],
                'bathrooms': property_data['Bathrooms'],
                'squareFeet': property_data['Square Footage'],
                'amenities': property_data['Amenities'].split(', '),
                'description': property_data['Property Description'],
                'yearBuilt': property_data.get('Year Built', 'N/A')
            })
        
        return recommendations