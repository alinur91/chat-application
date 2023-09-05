import { IoMdAttach } from "react-icons/io";
import { AiOutlinePicture } from "react-icons/ai";
import { useState, useRef, useEffect } from "react";
import {
  DocumentData,
  DocumentReference,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  or,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { v4 as uuidv4 } from "uuid";
import { IUser } from "../types/InitialUserState";

const ChatInput = ({
  chattingUser,
  shouldScrollToBottomOfDiv,
}: {
  chattingUser: IUser;
  shouldScrollToBottomOfDiv: (value: boolean) => void;
}) => {
  const [message, setmessage] = useState("");
  const user = useTypedSelector((state) => state.userInfo.user);
  const inputRef = useRef<HTMLInputElement>(null);

  const userRef = doc(
    db,
    "usersChat",
    chattingUser.email,
    "chattingUsersList",
    user.email
  );

  const handleSubmitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const roomsRef = collection(db, "rooms");
    const q = query(
      roomsRef,
      or(
        where("name", "==", chattingUser.id + user.id),
        where("name", "==", user.id + chattingUser.id)
      )
    );
    const combinedId =
      user.id > chattingUser.id
        ? user.id + chattingUser.id
        : chattingUser.id + user.id;

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((document) => {
      if (document.id) {
        addDoc(collection(db, "rooms", document.id, "messages"), {
          id: uuidv4(),
          name: user.name,
          email: user.email,
          message: message.trim(),
          createdAt: serverTimestamp(),
          photo: user.photo,
        }).then(() => {
          getDoc(userRef).then((docSnapshot) => {
            shouldScrollToBottomOfDiv(true);
            if (docSnapshot.exists()) {
              const docRef = doc(db, "usersChat", chattingUser.email);

              getDoc(docRef).then((docSnap) => {
                if (docSnap.exists()) {
                  if (
                    docSnap.data().sendingUser.id !== chattingUser.id ||
                    user.id !== docSnap.data().chattingUserId
                  ) {
                    increaseUnreadMessageCount(
                      userRef,
                      user,
                      docSnapshot.data()
                    );
                  }
                } else {
                  increaseUnreadMessageCount(userRef, user, docSnapshot.data());
                }
                setDoc(
                  userRef,
                  { ...user, latestMessage: message.trim() },
                  { merge: true }
                );
              });
            } else {
              alert("No such document!");
            }
          });
        });
      }
    });

    if (querySnapshot.docs.length === 0) {
      const docRef = doc(db, "usersChat", chattingUser.email);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          if (
            docSnap.data().sendingUser.id !== chattingUser.id ||
            user.id !== docSnap.data().chattingUserId
          ) {
            setUnreadMessageCountToOne(userRef, user);
          }
        } else {
          setUnreadMessageCountToOne(userRef, user);
        }
      });

      await setDoc(
        userRef,
        { ...user, latestMessage: message.trim() },
        { merge: true }
      );

      await addDoc(collection(db, "rooms", combinedId, "messages"), {
        id: uuidv4(),
        name: user.name,
        email: user.email,
        message: message.trim(),
        createdAt: serverTimestamp(),
        photo: user.photo,
      });
      shouldScrollToBottomOfDiv(true);

      await setDoc(doc(db, "rooms", combinedId), {
        name: chattingUser.id + user.id,
      });
    }
    setmessage("");
  };

  const setUnreadMessageCountToOne = async (
    userRef: DocumentReference<DocumentData, DocumentData>,
    user: IUser
  ) => {
    await setDoc(
      userRef,
      { ...user, unreadMessageCount: 1, latestMessage: message.trim() },
      { merge: false }
    );
  };

  const increaseUnreadMessageCount = async (
    userRef: DocumentReference<DocumentData, DocumentData>,
    user: IUser,
    docSnapshotData: DocumentData
  ) => {
    await setDoc(
      userRef,
      {
        ...user,
        unreadMessageCount: docSnapshotData.unreadMessageCount
          ? docSnapshotData.unreadMessageCount + 1
          : 1,
      },
      { merge: false }
    );
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [chattingUser.id]);

  const textIsEmpty = message.length === 0;

  return (
    <form onSubmit={handleSubmitMessage}>
      <div className="h-[69px] text-white relative">
        <input
          ref={inputRef}
          autoFocus
          value={message}
          onChange={(e) => setmessage(e.target.value)}
          placeholder="Type a message"
          type="text"
          className="w-full h-full outline-none px-3 text-xl text-gray-600"
        />

        <div className="flex items-center gap-2 absolute top-3 right-3 text-xl text-gray-400">
          <IoMdAttach className="cursor-pointer" />
          <AiOutlinePicture className="cursor-pointer" />
          <button
            disabled={textIsEmpty}
            className={`px-3 py-2 bg-indigo-${
              textIsEmpty ? `400` : `600`
            } text-white`}
          >
            Send
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
