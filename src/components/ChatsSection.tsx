import { useParams } from "react-router-dom";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { selectChattingUser } from "../store/user/userSlice";
import ChatSectionHeader from "./ChatSectionHeader";
import Chats from "./Chats";
import ChatInput from "./ChatInput";
import { Audio } from "react-loader-spinner";

const ChatsSection = () => {
  const { userId } = useParams();

  const chattingUser = useTypedSelector((state) =>
    selectChattingUser(state, userId!)
  );

  let content;

  const renderContent = (content: React.ReactNode) => {
    if (!chattingUser && userId) {
      content = (
        <div className="flex items-center justify-center h-full">
          <Audio height="200" width="200" color="#667eea" ariaLabel="loading" />
        </div>
      );
    } else if (!userId && !chattingUser) {
      content = (
        <div className="grid place-items-center h-full text-3xl text-gray-400">
          Choose a chat to start the conversation
        </div>
      );
    } else if (userId && chattingUser) {
      content = (
        <div className="flex flex-col">
          <ChatSectionHeader chattingUser={chattingUser!} />
          <Chats userId={userId} />
          <ChatInput userId={userId} />
        </div>
      );
    }
    return content;
  };

  return (
    <div className="bg- flex-1 rounded-tr-lg bg-gray-100 rounded-br-lg ">
      {renderContent(content)}
    </div>
  );
};

export default ChatsSection;
