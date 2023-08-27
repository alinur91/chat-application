import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { IUser } from "../types/InitialUserState";
import SidebarHead from "./SidebarHead";
import SidebarInput from "./SidebarInput";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import ChattingWithUser from "./ChattingWithUser";
import { useTypedSelector } from "../hooks/useTypedSelector";

const Sidebar = () => {
  const [chattingUsersList, setChattingUsersList] = useState<IUser[]>([]);
  const [shouldClearInput, setshouldClearInput] = useState(false);
  const user = useTypedSelector((state) => state.userInfo.user);

  const addUserToChattingList = async (chattingWithUser: IUser) => {
    setshouldClearInput(true);
    const userRef = doc(
      db,
      "users",
      user.email!,
      "chattingUsersList",
      chattingWithUser.email
    );
    await setDoc(userRef, chattingWithUser, { merge: false });
    setshouldClearInput(false);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "users", user.email, "chattingUsersList"),
      (data) => {
        const listOfChattingUsers = [] as IUser[];

        data.docs.forEach((doc) => {
          listOfChattingUsers.push(doc.data() as IUser);
        });
        setChattingUsersList(listOfChattingUsers.reverse());
      }
    );

    return () => unsubscribe();
  }, [user.email, user.id]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "rooms", user.id, "messages"),
      (data) => {
        const listOfChattingUsers = [] as IUser[];

        data.docs.forEach((doc) => {
          listOfChattingUsers.push(doc.data() as IUser);
        });
      }
    );

    return () => unsubscribe();
  }, [user.email, user.id]);

  return (
    <div className="bg-indigo-800 rounded-tl-lg rounded-bl-lg  w-4/12 overflow-auto">
      <SidebarHead />
      <SidebarInput
        addUserToChattingList={addUserToChattingList}
        shouldClearInput={shouldClearInput}
      />
      {chattingUsersList.map((chattingWithUser) => (
        <ChattingWithUser
          key={chattingWithUser.id}
          chattingWithUser={chattingWithUser}
        />
      ))}
    </div>
  );
};

export default Sidebar;
