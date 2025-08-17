// Simple test to check dashboard API
// Run this in browser console

async function testDashboardAPI() {
  console.log('🧪 Testing Dashboard API...');
  
  try {
    // Get auth token
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];
    
    console.log('🔑 Token found:', !!token);
    
    if (!token) {
      console.error('❌ No auth token found. Please login first.');
      return;
    }
    
    // Test dashboard endpoint
    const response = await fetch('/api/analytics/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Dashboard API Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('📊 Dashboard API Response:', data);
      
      if (data.success) {
        console.log('✅ Dashboard data structure:', Object.keys(data.data));
      } else {
        console.log('❌ API returned success: false');
      }
    } else {
      const errorText = await response.text();
      console.error('❌ Dashboard API Error:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testDashboardAPI();
