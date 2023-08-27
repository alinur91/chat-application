import { DocumentData, collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { IUser } from "../types/InitialUserState";
import { useTypedSelector } from "../hooks/useTypedSelector";

const Chats = ({ userId }: { userId: string }) => {
  const [chatMessages, setchatMessages] = useState<DocumentData[]>([]);
  const user = useTypedSelector((state) => state.userInfo.user);
  const combinedId = user.id > userId ? user.id + userId : userId + user.id;

  useEffect(() => {
    setchatMessages([]);
  }, [userId]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "rooms", combinedId, "messages"),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            setchatMessages((message) => [
              ...message,
              change.doc.data() as IUser,
            ]);
          }
        });
      }
    );

    return () => unsubscribe();
  }, [combinedId, user.id, userId]);

  return (
    <div className="flex flex-col items-end gap-5 p-4 bg-indigo-100 h-[593.19px] overflow-auto">
      {chatMessages.map((messageInfo) => (
        <div key={messageInfo.id} className="flex gap-3 items-center">
          <span className="rounded-tl-xl rounded-bl-xl rounded-br-xl bg-blue-500 px-5 py-3 text-lg text-white">
            {messageInfo.message}{" "}
          </span>
          <img
            className="h-11 rounded-full"
            src={messageInfo.photo}
            alt={messageInfo.name}
          />
        </div>
      ))}
    </div>
  );
};

export default Chats;
