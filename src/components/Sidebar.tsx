import { IUser } from "../types/InitialUserState";
import SidebarHead from "./SidebarHead";
import SidebarInput from "./SidebarInput";
import { useState } from "react";

const Sidebar = () => {
  const [users, setusers] = useState<IUser[]>([]);

  console.log(users);

  const addUserToChattingList = (user: IUser) => {
    setusers((users) => [user, ...users]);
  };

  return (
    <div className="bg-indigo-700 rounded-tl-lg rounded-bl-lg  w-4/12 ">
      <SidebarHead />
      <SidebarInput addUserToChattingList={addUserToChattingList} />
    </div>
  );
};

export default Sidebar;
