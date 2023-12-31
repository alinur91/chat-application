import { IUser } from "../types/InitialUserState";
import { db } from "../firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useActions } from "../hooks/useActions";
import { useTypedSelector } from "../hooks/useTypedSelector";

const ChattingWithUser = ({
  chattingWithUser,
  user,
}: {
  chattingWithUser: IUser;
  user: IUser;
}) => {
  const { setActiveChattingUsersId } = useActions();
  const { chattingUserId, sendingUser } = useTypedSelector(
    (state) => state.userInfo.activeChattingUsersId
  );

  const handleClick = () => {
    const chattingUserRef = doc(
      db,
      "usersChat",
      user.email,
      "chattingUsersList",
      chattingWithUser.email
    );

    const usersObjInfo = {
      chattingUserId: chattingWithUser.id,
      sendingUser: user,
    };

    const currentUserRef = doc(db, "usersChat", user.email);
    setDoc(currentUserRef, usersObjInfo, { merge: true });
    updateDoc(chattingUserRef, {
      unreadMessageCount: null,
    });

    setActiveChattingUsersId(usersObjInfo);
    localStorage.setItem("activeChattingUsersId", JSON.stringify(usersObjInfo));
  };

  const getLatestMessage = (latestMessage: string) => {
    if (latestMessage.length >= 25) {
      latestMessage = latestMessage.substring(0, 26) + "...";
    }

    return <p>{latestMessage}</p>;
  };

  return (
    <div
      className={`flex text-gray-200 p-2 cursor-pointer justify-between items-center ${
        sendingUser?.id === user.id &&
        chattingWithUser.id === chattingUserId &&
        `bg-indigo-400 text-white`
      }`}
      onClick={handleClick}
    >
      <div className="flex gap-2">
        <img
          className="h-10 rounded-full"
          src={chattingWithUser.photo}
          alt=""
        />
        <div className="self-center">
          <h4>{chattingWithUser.name}</h4>
          {chattingWithUser.latestMessage &&
            getLatestMessage(chattingWithUser.latestMessage)}
        </div>
      </div>
      {chattingWithUser.unreadMessageCount &&
        chattingWithUser.id !== chattingUserId && (
          <div className="rounded-full bg-green-400 h-5 w-5 text-center text-sm">
            {chattingWithUser.unreadMessageCount}
          </div>
        )}
    </div>
  );
};

export default ChattingWithUser;
