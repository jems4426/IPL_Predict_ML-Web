import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export const fetchPrediction = async (payload) => {
  try {
    const response = await axios.post(`${API_URL}/predict`, payload);
    return response.data;
  } catch (error) {
    console.error("API Error: Fetching prediction failed.", error);
    throw error;
  }
};
