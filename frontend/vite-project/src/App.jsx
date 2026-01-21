import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails'; // Ensure this file exists in /pages

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Router>
      <div className="App">
        {/* Navbar stays at the top on every page */}
        <Navbar setSearchTerm={setSearchTerm} />
        
        <Routes>
          {/* Route for the Main Product Grid */}
          <Route 
            path="/" 
            element={<Products searchTerm={searchTerm} />} 
          />

          {/* Route for the Individual Product Details Page */}
          {/* The ':id' is a dynamic parameter we use to fetch the product */}
          <Route 
            path="/product/:id" 
            element={<ProductDetails />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;