import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { IUser } from "../types/InitialUserState";
import SidebarHead from "./SidebarHead";
import SidebarInput from "./SidebarInput";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useTypedSelector } from "../hooks/useTypedSelector";

const Sidebar = () => {
  const [users, setusers] = useState<IUser[]>([]);
  const user = useTypedSelector((state) => state.user.user);

  // console.log(users);

  const addUserToChattingList = async (chattingWithUser: IUser) => {
    setusers((users) => [user, ...users]);
    const roomsRef = collection(db, "rooms");
    const q1 = query(
      roomsRef,
      where("me.email", "==", user.email),
      where("chattingWithUser.email", "==", chattingWithUser.email)
    );
    const doesUserExist = await getDocs(q1);

    if (doesUserExist.docs.length === 0)
      await addDoc(collection(db, "rooms"), {
        me: user,
        chattingWithUser,
      });
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rooms"), (data) => {
      const listOfChattingUsers = [];
      data.docs.forEach((doc) => {
        listOfChattingUsers.push(doc.data());
      });
      setusers(listOfChattingUsers);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-indigo-700 rounded-tl-lg rounded-bl-lg  w-4/12 ">
      <SidebarHead />
      <SidebarInput addUserToChattingList={addUserToChattingList} />
    </div>
  );
};

export default Sidebar;
