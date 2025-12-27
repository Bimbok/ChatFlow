import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();
      const isMessageSentFromSelectedUser = selectedUser?._id === newMessage.senderId;

      if (isMessageSentFromSelectedUser) {
        set({
          messages: [...get().messages, newMessage],
        });
      } else {
        const sound = new Audio("/notification.mp3");
        sound.play();

        if (Notification.permission === "granted") {
          new Notification("New Message", {
            body: `New message from ${
              get().users.find((u) => u._id === newMessage.senderId)?.fullName || "User"
            }`,
            icon: "/logo.png",
          });
        }

        set({
          users: get().users.map((user) => {
            if (user._id === newMessage.senderId) {
              return { ...user, unreadCount: (user.unreadCount || 0) + 1 };
            }
            return user;
          }),
        });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  markMessagesAsRead: async (id) => {
    try {
      await axiosInstance.put(`/messages/mark-read/${id}`);
      set({
        users: get().users.map((user) => {
          if (user._id === id) {
            return { ...user, unreadCount: 0 };
          }
          return user;
        }),
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark messages as read");
    }
  },
}));
