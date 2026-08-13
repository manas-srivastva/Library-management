import api from "./client";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "ADMIN" | "LIBRARIAN" | "MEMBER";
  status: "ACTIVE" | "INACTIVE";
}

export const usersApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get("/users");

    console.log("USERS API RESPONSE:", response.data);
    console.log("ACTUAL USERS ARRAY:", response.data.data);

    return response.data.data;
  },
};