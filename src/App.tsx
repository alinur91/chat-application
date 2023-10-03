import {
  Route,
  RouterProvider,
  createRoutesFromElements,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import MainPage from "./pages/MainPage";
import { useTypedSelector } from "./hooks/useTypedSelector";
import { db } from "./firebase";
import { useActions } from "./hooks/useActions";
import { useEffect } from "react";
import {
  DocumentData,
  Unsubscribe,
  collection,
  onSnapshot,
} from "firebase/firestore";
import "./App.css";
import { selectLoggedInUser } from "./store/user/userSlice";
import SignInWithGoogle from "./components/SignInWithGoogle";
import RootLayout from "./layout/RootLayout";

function App() {
  const user = useTypedSelector(selectLoggedInUser);
  const { setUsersList } = useActions();

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (Object.keys(user).length <= 0) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const createRoutes = () => {
    return (
      <Route path="/" element={<RootLayout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<SignInWithGoogle />} />
      </Route>
    );
  };

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (Object.keys(user).length !== 0) {
      unsubscribe = onSnapshot(
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

    () => {
      unsubscribe();
    };
  }, [setUsersList, user]);

  const router = createBrowserRouter(createRoutesFromElements(createRoutes()));

  return (
    <div className="min-h-screen   grid place-items-center  bg-indigo-300">
      <RouterProvider router={router} />{" "}
    </div>
  );
}

export default App;
