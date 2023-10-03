import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { auth, db, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useActions } from "../hooks/useActions";
import { doc, setDoc } from "firebase/firestore";

const SignInWithGoogle = () => {
  const { setUser } = useActions();
  const navigate = useNavigate();

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
        navigate('/')
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="bg-gray-300 w-80 rounded-xl grid place-items-center h-10 cursor-pointer">
      <div
        onClick={handleSignInWithGoogle}
        className="flex justify-center items-center gap-2"
      >
        <FcGoogle fontSize="1.3rem" />
        <button className="font-bold">Continue with Google</button>
      </div>
    </div>
  );
};

export default SignInWithGoogle;
