const API_BASE_URL = 'http://localhost:8000/api';

export const getPropertyValuation = async (propertyData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/valuation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertyData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      predicted_price: data.predicted_price,
      status: data.status,
      processing_time: data.processing_time
    };
  } catch (error) {
    console.error('Error in getPropertyValuation:', error);
    return {
      success: false,
      error: error.message || 'Failed to get property valuation'
    };
  }
};