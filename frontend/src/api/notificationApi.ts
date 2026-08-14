import api from "./client";
import type { Notification } from "@/types/notification";

export const notificationApi = {
  getUserNotifications: async (userId: string) => {
    const response = await api.get(
      `/notifications/user/${userId}`
    );

    console.log(
      "NOTIFICATIONS API RESPONSE:",
      response.data
    );

    return (response.data.data || []) as Notification[];
  },

  getNotificationById: async (id: string) => {
    const response = await api.get(
      `/notifications/${id}`
    );

    return response.data.data as Notification;
  },

  markAsRead: async (id: string) => {
    const response = await api.put(
      `/notifications/read/${id}`
    );

    return response.data.data as Notification;
  },

  markAllAsRead: async () => {
    const response = await api.put(
      "/notifications/read-all"
    );

    return response.data.data;
  },
};