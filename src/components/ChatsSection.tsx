import { useTypedSelector } from "../hooks/useTypedSelector";
import { selectChattingUser } from "../store/user/userSlice";
import ChatSectionHeader from "./ChatSectionHeader";
import Chats from "./Chats";
import ChatInput from "./ChatInput";
import { Audio } from "react-loader-spinner";
import { useState } from "react";

const ChatsSection = () => {
  const [scrollToBottomOfDiv, setscrollToBottomOfDiv] = useState(false);

  const chattingUser = useTypedSelector(selectChattingUser);

  const currentUsersChattingList = useTypedSelector(
    (state) => state.userInfo.currentUsersChattingList
  );

  const shouldScrollToBottomOfDiv = (value: boolean) => {
    setscrollToBottomOfDiv(value);
  };

  const renderContent = () => {
    // if (!chattingUser && currentUsersChattingList.length <= 0) {
    //   return (
    //     <div className="flex items-center justify-center h-full">
    //       <Audio height="200" width="200" color="#667eea" ariaLabel="loading" />
    //     </div>
    //   );
    // }

    if (currentUsersChattingList.length <= 0) {
      return null;
    }

    if (!chattingUser) {
      return (
        <div className="grid place-items-center h-full text-3xl text-gray-400">
          Choose a chat to start the conversation
        </div>
      );
    }

    if (chattingUser) {
      return (
        <div className="flex flex-col">
          <ChatSectionHeader chattingUser={chattingUser!} />
          <Chats
            userId={chattingUser.id}
            scrollToBottomOfDiv={scrollToBottomOfDiv}
            shouldScrollToBottomOfDiv={shouldScrollToBottomOfDiv}
          />
          <ChatInput
            chattingUser={chattingUser}
            shouldScrollToBottomOfDiv={shouldScrollToBottomOfDiv}
          />
        </div>
      );
    }
  };

  return (
    <div className="flex-1 rounded-tr-lg bg-gray-100 rounded-br-lg ">
      {renderContent()}
    </div>
  );
};

export default ChatsSection;
