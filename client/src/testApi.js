import api from "./services/api";

const testConnection = async () => {
  try {
    const response = await api.get("/health");
    console.log("Backend connected:", response.data);
  } catch (error) {
    console.error("Backend connection failed:", error.message);
  }
};

testConnection();
