export interface IUser {
  id: string;
  name: string;
  email: string;
  photo: string;
  myAccountId?: string;
  message?: string;
  unreadMessageCount?: number;
  latestMessage?: string;
}


export type InitialUserState = {
  user: IUser;
  usersList: IUser[];
  currentUsersChattingList: IUser[];
  activeChattingUsersId: {
    chattingUserId: string;
    sendingUser: IUser;
  };
};