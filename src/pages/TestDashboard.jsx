import React from 'react';

const TestDashboard = () => {
  console.log('TestDashboard: Rendering simple test dashboard');
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            🎉 Dashboard Test - SUCCESS!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            If you can see this, the routing and authentication are working correctly.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Test Card 1</h3>
              <p className="text-3xl font-bold text-blue-600">✅</p>
              <p className="text-sm text-blue-700">Authentication Working</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Test Card 2</h3>
              <p className="text-3xl font-bold text-green-600">✅</p>
              <p className="text-sm text-green-700">Routing Working</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Test Card 3</h3>
              <p className="text-3xl font-bold text-purple-600">✅</p>
              <p className="text-sm text-purple-700">CSS Working</p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Debug Info:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Current URL: {window.location.href}</li>
              <li>• Auth Token: {localStorage.getItem('access_token') ? '✅ Present' : '❌ Missing'}</li>
              <li>• User Email: {localStorage.getItem('email') || 'Not set'}</li>
              <li>• Is Admin: {localStorage.getItem('is_admin') || 'Not set'}</li>
            </ul>
          </div>
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Try Original Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDashboard;
