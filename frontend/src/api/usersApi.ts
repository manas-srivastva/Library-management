import api from "./client";

export const usersApi = {
  getUsers: async () => {
    const response = await api.get("/users");
    return response.data.data;
  },
};