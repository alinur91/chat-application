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
import ChattingWithUser from "./ChattingWithUser";
import { useTypedSelector } from "../hooks/useTypedSelector";

const Sidebar = () => {
  const [chattingUsersList, setChattingUsersList] = useState<IUser[]>([]);
  const [shouldClearInput, setshouldClearInput] = useState(false);
  const user = useTypedSelector((state) => state.userInfo.user);

  const addUserToChattingList = async (chattingWithUser: IUser) => {
    const roomsRef = collection(db, "rooms");
    const q1 = query(roomsRef, where("id", "==", chattingWithUser.id));
    const doesUserExist = await getDocs(q1);

    if (doesUserExist.docs.length === 0) {
      setshouldClearInput(true);
      await addDoc(collection(db, "rooms"), {
        id: chattingWithUser.id,
        name: chattingWithUser.name,
        photo: chattingWithUser.photo,
        email: chattingWithUser.email,
        myAccountId: user.id,
      });
      setshouldClearInput(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rooms"), (data) => {
      const listOfChattingUsers = [] as IUser[];

      if (data.docs[0]?.data().myAccountId === user.id) {
        data.docs.forEach((doc) => {
          listOfChattingUsers.push(doc.data() as IUser);
        });
      }
      console.log(listOfChattingUsers);
      
      setChattingUsersList(listOfChattingUsers.reverse());
    });

    return () => unsubscribe();
  }, [user.id]);

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
