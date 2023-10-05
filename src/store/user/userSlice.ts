import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser, InitialUserState } from "../../types/InitialUserState";
import { RootState } from "../store";

const user = localStorage.getItem("user");
const activeChattingUsersId = localStorage.getItem("activeChattingUsersId");

const initialState: InitialUserState = {
  user: user !== null ? JSON.parse(user) : ({} as IUser),
  usersList: [] as IUser[],
  currentUsersChattingList: [] as IUser[],
  activeChattingUsersId:
    activeChattingUsersId !== null
      ? JSON.parse(activeChattingUsersId)
      : { chattingUserId: "", sendingUser: {} as IUser },
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
      state.currentUsersChattingList = [] as IUser[];
      state.activeChattingUsersId = {
        chattingUserId: "",
        sendingUser: {} as IUser,
      };
    },
    setUsersList(state, action) {
      state.usersList = action.payload;
    },
    setCurrentUsersChattingList(state, action) {
      state.currentUsersChattingList = action.payload;
    },
    setActiveChattingUsersId(state, action) {
      state.activeChattingUsersId = action.payload;
    },
  },
});

export const selectLoggedInUser = (state: RootState) => state.userInfo.user;

export const selectChattingUser = (state: RootState) =>
  state.userInfo.usersList.find(
    (user) => user.id === state.userInfo.activeChattingUsersId.chattingUserId
  );

export const { actions, reducer } = userSlice;
