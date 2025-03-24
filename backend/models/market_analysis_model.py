import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import io
import base64
from datetime import datetime

class MarketAnalysisModel:
    def __init__(self, data_path=None):
        """Initialize the market analysis model"""
        self.df = None
        if data_path:
            self.load_data(data_path)
    
    def load_data(self, data_path):
        """Load and prepare market data"""
        self.df = pd.read_csv(data_path)
        
        # Convert time period to datetime for time series analysis
        self.df['Time Period'] = pd.to_datetime(self.df['Time Period'])
        
        # Sort by neighborhood and time
        self.df = self.df.sort_values(['Neighborhood', 'Time Period'])
    
    def get_market_trends(self, location=None, months=12):
        """
        Get market trends data
        
        Parameters:
        -----------
        location: str, optional
            Filter trends by neighborhood
        months: int, optional
            Number of months to analyze
            
        Returns:
        --------
        dict
            Dictionary with market trends data
        """
        if self.df is None:
            raise ValueError("Data not loaded. Call load_data() first.")
        
        # Filter by location if provided
        data = self.df
        if location:
            data = data[data['Neighborhood'] == location]
        
        # Get the most recent data
        latest_date = data['Time Period'].max()
        start_date = latest_date - pd.DateOffset(months=months)
        recent_data = data[data['Time Period'] >= start_date]
        
        # Calculate market metrics
        latest_data = data.loc[data.groupby('Neighborhood')['Time Period'].idxmax()]
        
        # Calculate YoY changes
        yoy_changes = {}
        for neighborhood in latest_data['Neighborhood'].unique():
            neighborhood_data = data[data['Neighborhood'] == neighborhood]
            if len(neighborhood_data) >= 12:
                current = neighborhood_data.iloc[-1]
                year_ago = neighborhood_data.iloc[-13] if len(neighborhood_data) >= 13 else neighborhood_data.iloc[0]
                
                price_change = ((current['Median Home Price'] - year_ago['Median Home Price']) / 
                               year_ago['Median Home Price'] * 100)
                
                yoy_changes[neighborhood] = {
                    'priceChange': price_change,
                    'daysOnMarketChange': current['Days on Market'] - year_ago['Days on Market'],
                    'inventoryChange': ((current['Inventory Levels'] - year_ago['Inventory Levels']) / 
                                      year_ago['Inventory Levels'] * 100)
                }
        
        # Find hot neighborhoods
        if len(latest_data) > 1:
            # Use price growth and days on market to identify hot neighborhoods
            features = latest_data[['Median Home Price', 'Days on Market', 'Year-over-Year Price Change']]
            
            # Scale features
            scaler = StandardScaler()
            scaled_features = scaler.fit_transform(features)
            
            # Use KMeans to identify clusters (hot vs. not)
            kmeans = KMeans(n_clusters=2, random_state=42)
            latest_data['Cluster'] = kmeans.fit_predict(scaled_features)
            
            # Determine which cluster is "hot" (higher price growth, lower days on market)
            cluster_centers = kmeans.cluster_centers_
            price_change_idx = 2  # Index of Year-over-Year Price Change
            days_market_idx = 1   # Index of Days on Market
            
            # Higher price growth and lower days on market is better
            cluster_scores = cluster_centers[:, price_change_idx] - cluster_centers[:, days_market_idx]
            hot_cluster = 0 if cluster_scores[0] > cluster_scores[1] else 1
            
            hot_neighborhoods = latest_data[latest_data['Cluster'] == hot_cluster]
            hot_neighborhoods = hot_neighborhoods.sort_values('Year-over-Year Price Change', ascending=False)
        else:
            hot_neighborhoods = latest_data
        
        # Generate time series charts
        price_chart = self._generate_price_trend_chart(recent_data)
        inventory_chart = self._generate_inventory_chart(recent_data)
        
        # Generate market insights
        insights = self._generate_insights(latest_data, yoy_changes)
        
        return {
            'marketTrends': [
                {
                    'metric': 'Median Home Price',
                    'value': f"₹{latest_data['Median Home Price'].mean():,.0f}",
                    'change': f"{latest_data['Year-over-Year Price Change'].mean():.1f}%",
                    'isPositive': latest_data['Year-over-Year Price Change'].mean() > 0
                },
                {
                    'metric': 'Days on Market',
                    'value': f"{latest_data['Days on Market'].mean():.0f}",
                    'change': f"{(latest_data['Days on Market'].mean() - data.groupby('Neighborhood')['Days on Market'].mean().mean()):.1f}",
                    'isPositive': latest_data['Days on Market'].mean() < data.groupby('Neighborhood')['Days on Market'].mean().mean()
                },
                {
                    'metric': 'Price per Sq.Ft.',
                    'value': f"₹{latest_data['Price per Square Foot'].mean():,.0f}",
                    'change': f"{((latest_data['Price per Square Foot'].mean() / data['Price per Square Foot'].mean() - 1) * 100):.1f}%",
                    'isPositive': latest_data['Price per Square Foot'].mean() > data['Price per Square Foot'].mean()
                }
            ],
            'neighborhoodPerformance': [
                {
                    'name': row['Neighborhood'],
                    'growth': f"{row['Year-over-Year Price Change']:.1f}%",
                    'medianPrice': f"₹{row['Median Home Price']:,.0f}",
                    'daysOnMarket': int(row['Days on Market'])
                } for _, row in latest_data.iterrows()
            ],
            'hotNeighborhoods': [
                {
                    'name': row['Neighborhood'],
                    'growth': f"{row['Year-over-Year Price Change']:.1f}%",
                    'medianPrice': f"₹{row['Median Home Price']:,.0f}",
                    'pricePerSqFt': f"₹{row['Price per Square Foot']:,.0f}"
                } for _, row in hot_neighborhoods.head(5).iterrows()
            ],
            'insights': insights,
            'charts': {
                'priceTrend': price_chart,
                'inventory': inventory_chart
            }
        }
    
    def _generate_price_trend_chart(self, data):
        """Generate price trend chart as base64 encoded image"""
        plt.figure(figsize=(10, 6))
        plt.clf()  # Clear the current figure
        
        for neighborhood in data['Neighborhood'].unique():
            neighborhood_data = data[data['Neighborhood'] == neighborhood]
            if not neighborhood_data.empty:
                plt.plot(neighborhood_data['Time Period'], 
                        neighborhood_data['Median Home Price'], 
                        label=neighborhood if neighborhood else 'Unknown')
        
        plt.title('Median Home Price Trends')
        plt.xlabel('Date')
        plt.ylabel('Price (INR)')
        if any(plt.gca().get_lines()):  # Only add legend if there are lines plotted
            plt.legend()
        plt.grid(True)
        
        # Save plot to a bytes buffer
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        plt.close()  # Close the figure to free memory
        
        # Encode the image to base64 string
        image_png = buffer.getvalue()
        buffer.close()
        
        return base64.b64encode(image_png).decode('utf-8')
    
    def _generate_inventory_chart(self, data):
        """Generate inventory levels chart as base64 encoded image"""
        plt.figure(figsize=(10, 6))
        plt.clf()  # Clear the current figure
        
        for neighborhood in data['Neighborhood'].unique():
            neighborhood_data = data[data['Neighborhood'] == neighborhood]
            if not neighborhood_data.empty:
                plt.plot(neighborhood_data['Time Period'], 
                         neighborhood_data['Inventory Levels'], 
                         label=neighborhood if neighborhood else 'Unknown')
        
        plt.title('Inventory Level Trends')
        plt.xlabel('Date')
        plt.ylabel('Inventory')
        if any(plt.gca().get_lines()):  # Only add legend if there are lines plotted
            plt.legend()
        plt.grid(True)
        
        # Save plot to a bytes buffer
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        plt.close()  # Close the figure to free memory
        
        # Encode the image to base64 string
        image_png = buffer.getvalue()
        buffer.close()
        
        return base64.b64encode(image_png).decode('utf-8')
    
    def _generate_insights(self, latest_data, yoy_changes):
        """Generate market insights based on data analysis"""
        insights = []
        
        # Overall market insight
        avg_price_change = latest_data['Year-over-Year Price Change'].mean()
        if avg_price_change > 5:
            insights.append("The Delhi real estate market is showing strong growth with prices increasing significantly year-over-year.")
        elif avg_price_change > 0:
            insights.append("The Delhi real estate market is stable with modest price appreciation.")
        else:
            insights.append("The Delhi real estate market is experiencing a slight correction with prices decreasing year-over-year.")
        
        # Neighborhood specific insights
        for neighborhood in latest_data['Neighborhood'].unique():
            neighborhood_data = latest_data[latest_data['Neighborhood'] == neighborhood]
            if len(neighborhood_data) > 0:
                row = neighborhood_data.iloc[0]
                
                if row['Year-over-Year Price Change'] > 10:
                    insights.append(f"{neighborhood} is showing exceptional growth with prices up {row['Year-over-Year Price Change']:.1f}% year-over-year.")
                
                if neighborhood in yoy_changes and yoy_changes[neighborhood]['inventoryChange'] < -20:
                    insights.append(f"Inventory in {neighborhood} has decreased significantly, indicating high demand.")
                
                if row['Days on Market'] < 30:
                    insights.append(f"Properties in {neighborhood} are selling quickly, with an average of just {row['Days on Market']:.0f} days on market.")
        
        # Limit to top 5 insights
        return insights[:5]