import api from "./client";

export const reservationApi = {
  getReservations: async () => {
    const response = await api.get("/reservations");

    console.log(
      "RESERVATIONS API RESPONSE:",
      response.data
    );

    return response.data.data || [];
  },

  getMyReservations: async () => {
    const response = await api.get("/reservations/my");

    return response.data.data || [];
  },

  getReservationById: async (id: string) => {
    const response = await api.get(`/reservations/${id}`);

    return response.data.data;
  },

  createReservation: async (data: {
    user: string;
    book: string;
  }) => {
    const response = await api.post(
      "/reservations",
      data
    );

    return response.data.data;
  },

  cancelReservation: async (id: string) => {
    const response = await api.put(
      `/reservations/cancel/${id}`
    );

    return response.data.data;
  },
};