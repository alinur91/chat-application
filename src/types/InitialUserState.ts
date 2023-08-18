export interface IUser {
  id: string;
  name: string;
  email: string;
  photo: string;
}


export type InitialUserState = {
  user: IUser;
  usersList: IUser[];
};