import { create } from "zustand";

export interface UserStore {
  uid: string | null;
  name: string | null;
  email: string | null;

  setUser: (uid: string, name: string, email: string) => void;
}

let storedState;
if (typeof window !== "undefined") {
  storedState = JSON.parse(localStorage.getItem("userStore") || "{}");
}

const initialState: UserStore = {
  uid: null,
  name: null,
  email: null,
  setUser: (uid, name, email) => {},
  ...storedState, // Load values from localStorage
};

const useUserStore = create<UserStore>((set) => ({
  ...initialState,
  setUser: (uid, name, email) => set({ uid, name, email }),
}));

useUserStore.subscribe((state) => {
  localStorage.setItem("userStore", JSON.stringify(state));
});

export default useUserStore;
