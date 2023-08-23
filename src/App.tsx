import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import { FcGoogle } from "react-icons/fc";
import { useTypedSelector } from "./hooks/useTypedSelector";
import { signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "./firebase";
import { useActions } from "./hooks/useActions";
import { useEffect } from "react";
import {
  DocumentData,
  collection,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import "./App.css";
import { selectLoggedInUser } from "./store/user/userSlice";

function App() {
  const user = useTypedSelector(selectLoggedInUser);
  const { setUser, setUsersList } = useActions();

  const handleSignInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        const newUser = {
          id: user.uid,
          name: user.displayName || user.email!.split("@")[0],
          email: user.email!,
          photo: user.photoURL!,
        };
        setUser(newUser);
        const userRef = doc(db, "users", user.email!);
        setDoc(userRef, newUser, { merge: false });
        localStorage.setItem("user", JSON.stringify(newUser));
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  useEffect(() => {
    if (Object.keys(user).length !== 0) {
      const unsubscribe = onSnapshot(
        collection(db, "users"),
        (snapshot) => {
          const users: DocumentData[] = [];
          snapshot.docs.forEach((doc) => {
            if (doc.data().id !== user.id) {
              users.push(doc.data());
            }
          });

          setUsersList(users);
        },
        (error) => {
          alert(error);
        }
      );
    }
  }, [setUsersList, user]);

  return (
    <BrowserRouter>
      <div className="h-screen grid place-items-center  bg-indigo-300">
        {Object.keys(user).length > 0 ? (
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/chats/:userId" element={<MainPage />} />
          </Routes>
        ) : (
          <div className="bg-gray-300 w-80 rounded-xl grid place-items-center h-10 cursor-pointer">
            <div
              onClick={handleSignInWithGoogle}
              className="flex justify-center items-center gap-2"
            >
              <FcGoogle fontSize="1.3rem" />
              <button className="font-bold">Continue with Google</button>
            </div>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
