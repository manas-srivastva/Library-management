import api from "./client";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  profileImage?: string;
  createdAt?: string;
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

  updateProfile: async (data: {
    name?: string;
    phone?: string;
    profileImage?: string;
  }) => {
    const response = await api.put(
      "/users/profile",
      data
    );

    return response.data.data as User;
  },
};