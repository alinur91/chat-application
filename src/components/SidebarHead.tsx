import { useTypedSelector } from "../hooks/useTypedSelector";
import noAvatar from "../assets/no-avatar.png";
import { useActions } from "../hooks/useActions";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { selectLoggedInUser } from "../store/user/userSlice";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";

const SidebarHead = () => {
  const user = useTypedSelector(selectLoggedInUser);
  const { removeUser } = useActions();
  const navigate = useNavigate();
  const handleSignOut = () => {
    removeUser();
    signOut(auth).then(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("activeChattingUsersId");
      const currentUserRef = doc(db, "usersChat", user.email);
      updateDoc(currentUserRef, {
        chattingUserId: "",
        sendingUser: "",
      });
      navigate("/");
    });
  };

  return (
    <div className="text-white flex items-center justify-between  py-5 bg-indigo-900 px-3">
      <h4>Chat App</h4>
      <div className="flex items-center gap-2">
        <img
          className="h-6 rounded-full"
          src={`${user.photo ? user.photo : noAvatar}`}
          alt=""
        />
        <span>{user.name.substring(0, 10)} </span>
        <button onClick={handleSignOut} className="bg-indigo-400 p-1">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default SidebarHead;
