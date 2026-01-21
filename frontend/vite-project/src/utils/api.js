const API_URL = '/api';

export const fetchProducts = async (params = '') => {
  const response = await fetch(`${API_URL}/products?${params}`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

export const fetchProductById = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) throw new Error('Product not found');
  return response.json();
};