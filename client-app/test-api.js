// Test script to check if analytics API is working
console.log('Testing Analytics API...');

const API_BASE = 'http://localhost:5000/api';

async function testAPI() {
  try {
    // Test health endpoint first
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE.replace('/api', '')}/health`);
    console.log('Health status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.text();
      console.log('Health data:', healthData);
    }

    // Test analytics endpoint without auth
    console.log('2. Testing analytics endpoint...');
    const analyticsResponse = await fetch(`${API_BASE}/analytics/dashboard`);
    console.log('Analytics status:', analyticsResponse.status);
    
    if (!analyticsResponse.ok) {
      const errorText = await analyticsResponse.text();
      console.log('Analytics error:', errorText);
    } else {
      const data = await analyticsResponse.json();
      console.log('Analytics data structure:', Object.keys(data));
    }

  } catch (error) {
    console.error('API Test failed:', error);
  }
}

testAPI();
