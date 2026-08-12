import api from "./client";

export const borrowApi = {
  getBorrows: async () => {
    const response = await api.get('/borrows');
    return response.data.data;
  },

  borrowBook: async (data: {
    userId: string;
    bookCopyId: string;
    dueDate: string;
  }) => {
    const response = await api.post('/borrows', data);
    return response.data.data;
  },

  returnBook: async (id: string) => {
    const response = await api.put(`/borrows/return/${id}`);
    return response.data.data;
  },

  getBorrowById: async (id: string) => {
    const response = await api.get(`/borrows/${id}`);
    return response.data.data;
  },

  getUserBorrowHistory: async (userId: string) => {
    const response = await api.get(`/borrows/user/${userId}`);
    return response.data.data;
  },
};