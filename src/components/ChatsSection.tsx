import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { selectChattingUser } from "../store/user/userSlice";
import ChatSectionHeader from "./ChatSectionHeader";
import Chats from "./Chats";
import ChatInput from "./ChatInput";

const ChatsSection = () => {
  const { userId } = useParams();
  const user = useTypedSelector((state) => selectChattingUser(state, userId!));

  ChatsSection;
  return (
    <div className="bg- flex-1 rounded-tr-lg bg-gray-100 rounded-br-lg ">
      {!userId && (
        <div className="grid place-items-center h-full text-3xl text-gray-400">
          Choose a chat to start the conversation
        </div>
      )}
      {userId && (
        <div className="flex flex-col">
          <div className="text-white flex  items-center justify-between h-[69px]   bg-indigo-600 px-3">
            <ChatSectionHeader user={user!} />
          </div>
          <Chats />
          <ChatInput />
        </div>
      )}
    </div>
  );
};

export default ChatsSection;
