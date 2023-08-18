import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser, InitialUserState } from "../../types/InitialUserState";

const user = localStorage.getItem("user");

const initialState: InitialUserState = {
  user: user !== null ? JSON.parse(user) : ({} as IUser),
  usersList: [] as IUser[],
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser(state, { payload }: PayloadAction<IUser>) {
      state.user = payload;
    },
    removeUser(state) {
      state.user = {} as IUser;
      state.usersList = [] as IUser[];
    },
    setUsersList(state, action) {
      state.usersList = action.payload;
    },
  },
});

export const { actions, reducer } = userSlice;