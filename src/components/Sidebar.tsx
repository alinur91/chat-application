import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { IUser } from "../types/InitialUserState";
import SidebarHead from "./SidebarHead";
import SidebarInput from "./SidebarInput";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import ChattingWithUser from "./ChattingWithUser";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { Outlet, useNavigate } from "react-router-dom";
import { useActions } from "../hooks/useActions";

const Sidebar = () => {
  const [shouldClearInput, setshouldClearInput] = useState(false);
  const user = useTypedSelector((state) => state.userInfo.user);
  const currentUsersChattingList = useTypedSelector(
    (state) => state.userInfo.currentUsersChattingList
  );
  const navigate = useNavigate();
  const { setActiveChattingUsersId ,setCurrentUsersChattingList} = useActions();

  const addUserToChattingList = async (chattingWithUser: IUser) => {
    setshouldClearInput(true);
    const userRef = doc(
      db,
      "usersChat",
      user.email!,
      "chattingUsersList",
      chattingWithUser.email
    );

    const usersObjInfo = {
      chattingUserId: chattingWithUser.id,
      sendingUser: user,
    };
    const currentUserRef = doc(db, "usersChat", user.email);
    setDoc(currentUserRef, usersObjInfo, { merge: true });

    setActiveChattingUsersId({
      sendingUser: user,
      chattingUserId: chattingWithUser.id,
    });
    localStorage.setItem(
      "activeChattingUsersId",
      JSON.stringify({ sendingUser: user, chattingUserId: chattingWithUser.id })
    );
    await setDoc(userRef, chattingWithUser, { merge: false });
    setshouldClearInput(false);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "usersChat", user.email, "chattingUsersList"),
      (data) => {
        const listOfChattingUsers = [] as IUser[];

        data.docs.forEach((doc) => {
          listOfChattingUsers.push(doc.data() as IUser);
        });
        setCurrentUsersChattingList(listOfChattingUsers);
      }
    );

    return () => unsubscribe();
  }, [setCurrentUsersChattingList, user.email, user.id]);

  return (
    <>
      <div className="bg-indigo-800 rounded-tl-lg rounded-bl-lg  w-4/12 overflow-auto">
        <SidebarHead />
        <SidebarInput
          addUserToChattingList={addUserToChattingList}
          shouldClearInput={shouldClearInput}
        />
        {currentUsersChattingList.map((chattingWithUser) => (
          <ChattingWithUser
            key={chattingWithUser.id}
            chattingWithUser={chattingWithUser}
            user={user}
          />
        ))}
      </div>
      <Outlet />
    </>
  );
};

export default Sidebar;
