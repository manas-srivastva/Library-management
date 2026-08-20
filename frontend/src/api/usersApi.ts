import api from "./client";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export const userApi = {
  getUsers: async () => {
    const response = await api.get("/users");

    return response.data.data || [];
  },

  activateUser: async (id: string) => {
    const response = await api.put(
      `/users/${id}/activate`
    );

    return response.data.data;
  },

  deactivateUser: async (id: string) => {
    const response = await api.put(
      `/users/${id}/deactivate`
    );

    return response.data.data;
  },

  updateProfile: async (payload: {
    name: string;
    phone?: string;
  }) => {
    const response = await api.put(
      "/users/profile",
      payload
    );

    return response.data.data;
  },

  changePassword: async (payload: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.put(
      "/users/change-password",
      payload
    );

    return response.data.data;
  },
};