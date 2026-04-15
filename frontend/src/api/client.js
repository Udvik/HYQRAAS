import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const generateKey = async (mode, length) => {
  const response = await api.post("/generate-key", {
    mode,
    length,
  });
  return response.data;
};

export const generateOtp = async (mode) => {
  const response = await api.get("/demo/otp", {
    params: { mode },
  });
  return response.data;
};

export const runLotteryDemo = async (mode, participants) => {
  const response = await api.post("/demo/lottery", {
    mode,
    participants,
  });
  return response.data;
};

export const getStats = async () => {
  const response = await api.get("/stats");
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get("/history");
  return response.data;
};

export default api;