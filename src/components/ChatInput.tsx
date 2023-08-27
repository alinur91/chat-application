import { IoMdAttach } from "react-icons/io";
import { AiOutlinePicture } from "react-icons/ai";
import { useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  or,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { v4 as uuidv4 } from "uuid";

const ChatInput = ({ userId }: { userId: string }) => {
  const [message, setmessage] = useState("");
  const user = useTypedSelector((state) => state.userInfo.user);

  const handleSubmitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const roomsRef = collection(db, "rooms");
    const q = query(
      roomsRef,
      or(
        where("name", "==", userId + user.id),
        where("name", "==", user.id + userId)
      )
    );
    const combinedId = user.id > userId ? user.id + userId : userId + user.id;

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((document) => {
      if (document.id) {
        addDoc(collection(db, "rooms", document.id, "messages"), {
          id: uuidv4(),
          name: user.name,
          message,
          photo: user.photo,
        });
      }
    });

    if (querySnapshot.docs.length === 0) {
      await addDoc(collection(db, "rooms", combinedId, "messages"), {
        id: uuidv4(),
        name: user.name,
        message,
        photo: user.photo,
      });

      await setDoc(doc(db, "rooms", combinedId), {
        name: userId + user.id,
      });
    }

    setmessage("");
  };

  return (
    <form onSubmit={handleSubmitMessage}>
      <div className="h-[69px] text-white relative">
        <input
          value={message}
          onChange={(e) => setmessage(e.target.value)}
          placeholder="Type something..."
          type="text"
          className="w-full h-full outline-none px-3 text-xl text-gray-600"
        />
        <div className="flex items-center gap-2 absolute top-3 right-3 text-xl text-gray-400">
          <IoMdAttach className="cursor-pointer" />
          <AiOutlinePicture className="cursor-pointer" />
          <button className="px-3 py-2 bg-indigo-400 text-white">Send</button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
