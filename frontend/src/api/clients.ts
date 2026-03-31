const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const fetchItems = async () => {
  const response = await fetch(`${API_BASE_URL}/api/items`);
  if (!response.ok) throw new Error('Network error');
  return response.json();
};