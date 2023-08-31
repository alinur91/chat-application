export interface IUser {
  id: string;
  name: string;
  email: string;
  photo: string;
  myAccountId?: string,
  message?: string,
  unreadMessageCount?: number
}


export type InitialUserState = {
  user: IUser;
  usersList: IUser[];
  activeChattingUsersId: {
    chattingUserId: string;
    sendingUser: IUser
  };
};