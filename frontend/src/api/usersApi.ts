import api from "./client";

export const usersApi = {
  getUsers: async () => {
    const response = await api.get("/users");

    console.log("USERS API RESPONSE:", response.data);

    return response.data.data.users || [];
  },
};