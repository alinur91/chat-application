import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser, InitialUserState } from "../../types/InitialUserState";
import { RootState } from "../store";

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

export const selectLoggedInUser = (state: RootState) =>
  state.userInfo.user;

  export const selectChattingUser = (state: RootState, chattingUserId: string) =>
    state.userInfo.usersList.find((user) => user.id === chattingUserId);

export const { actions, reducer } = userSlice;
