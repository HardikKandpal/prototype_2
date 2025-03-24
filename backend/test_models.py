import os
import pandas as pd
from models.recommender_model import PropertyRecommender
from models.valuation_model import PropertyValuationModel
from models.market_analysis_model import MarketAnalysisModel

def test_recommender_model():
    """Test the property recommender model"""
    print("\n===== Testing Property Recommender Model =====")
    
    # Initialize recommender model
    data_path = "delhi_real_estate_recommender.csv"
    recommender = PropertyRecommender(data_path)
    
    # Test with different preferences
    test_preferences = {
        'propertyType': 'Apartment',
        'budget': '50000000-100000000',
        'location': 'Vasant Kunj',
        'bedrooms': '3',
        'amenities': ['Gym', 'Swimming Pool']
    }
    
    print(f"Finding properties matching: {test_preferences}")
    recommendations = recommender.get_recommendations(test_preferences)
    
    print(f"Found {len(recommendations)} matching properties:")
    for i, prop in enumerate(recommendations, 1):
        print(f"\n{i}. {prop['title']}")
        print(f"   Price: ₹{prop['price']:,}")
        print(f"   Bedrooms: {prop['bedrooms']}, Bathrooms: {prop['bathrooms']}")
        print(f"   Square Feet: {prop['squareFeet']}")
        print(f"   Amenities: {', '.join(prop['amenities'])}")
    
    return recommendations

def test_valuation_model():
    """Test the property valuation model"""
    print("\n===== Testing Property Valuation Model =====")
    
    # Initialize and train valuation model
    data_path = "delhi_property_valuation_data.csv"
    valuation_model = PropertyValuationModel(data_path)
    
    # Test with sample property
    test_property = {
        'propertyType': 'Apartment',
        'location': 'Vasant Kunj',
        'bedrooms': 3,
        'bathrooms': 2,
        'squareFeet': 2000,
        'yearBuilt': 2015,
        'lotSize': 2500,
        'renovationStatus': 'Partially Renovated',
        'renovationYear': 2020
    }
    
    print(f"Estimating value for: {test_property}")
    valuation = valuation_model.predict(test_property)
    
    print(f"\nValuation Results:")
    print(f"Predicted Value: ₹{valuation['predictedValue']:,}")
    print(f"Range: ₹{valuation['lowerBound']:,} - ₹{valuation['upperBound']:,}")
    
    # Save the model for future use
    os.makedirs('trained_models', exist_ok=True)
    valuation_model.save_model('trained_models/valuation_model.pkl')
    print("Valuation model saved to trained_models/valuation_model.pkl")
    
    return valuation

def test_market_analysis_model():
    """Test the market analysis model"""
    print("\n===== Testing Market Analysis Model =====")
    
    # Initialize market analysis model
    data_path = "delhi_market_analysis_data.csv"
    market_model = MarketAnalysisModel(data_path)
    
    # Test overall market analysis
    print("Analyzing overall Delhi real estate market...")
    market_trends = market_model.get_market_trends()
    
    print("\nMarket Trends:")
    for trend in market_trends['marketTrends']:
        change_symbol = "+" if trend['isPositive'] else ""
        print(f"{trend['metric']}: {trend['value']} ({change_symbol}{trend['change']})")
    
    print("\nHot Neighborhoods:")
    for i, neighborhood in enumerate(market_trends['hotNeighborhoods'], 1):
        print(f"{i}. {neighborhood['name']} - Growth: {neighborhood['growth']}, Median Price: {neighborhood['medianPrice']}")
    
    print("\nMarket Insights:")
    for i, insight in enumerate(market_trends['insights'], 1):
        print(f"{i}. {insight}")
    
    # Test neighborhood-specific analysis
    neighborhood = "Connaught Place"
    print(f"\nAnalyzing {neighborhood} specifically...")
    neighborhood_trends = market_model.get_market_trends(location=neighborhood)
    
    print(f"\n{neighborhood} Trends:")
    for trend in neighborhood_trends['marketTrends']:
        change_symbol = "+" if trend['isPositive'] else ""
        print(f"{trend['metric']}: {trend['value']} ({change_symbol}{trend['change']})")
    
    return market_trends

if __name__ == "__main__":
    print("Testing AI Models for AIEstate Pro")
    
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # Test each model
    recommendations = test_recommender_model()
    valuation = test_valuation_model()
    market_trends = test_market_analysis_model()
    
    print("\n===== All Models Tested Successfully =====")