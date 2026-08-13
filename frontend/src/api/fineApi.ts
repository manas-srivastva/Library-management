import api from "./client";

export const fineApi = {
  getFines: async () => {
    const response = await api.get("/fines");

    console.log("FINES API RESPONSE:", response.data);

    return response.data.data;
  },

  getFineById: async (id: string) => {
    const response = await api.get(`/fines/${id}`);

    return response.data.data;
  },

  getUserFines: async (userId: string) => {
    const response = await api.get(`/fines/user/${userId}`);

    return response.data.data;
  },

  payFine: async (id: string) => {
    const response = await api.put(`/fines/${id}/pay`);

    return response.data.data;
  },
};