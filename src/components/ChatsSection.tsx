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
  console.log(chattingUser);
  
  const currentUser = useTypedSelector(state=>state.userInfo.user);

  const shouldScrollToBottomOfDiv = (value: boolean) => {
    setscrollToBottomOfDiv(value);
  };

  let content;

  const renderContent = (content: React.ReactNode) => {
    if (chattingUser) {
      content = (
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
     if (!chattingUser) {
      content = (
        <div className="grid place-items-center h-full text-3xl text-gray-400">
          Choose a chat to start the conversation
        </div>
      );
    }  if (!chattingUser) {
      content = (
        <div className="flex items-center justify-center h-full">
          <Audio height="200" width="200" color="#667eea" ariaLabel="loading" />
        </div>
      );
    }
    // if (!chattingUser && chattingUser?.id) {
    //   content = (
    //     <div className="flex items-center justify-center h-full">
    //       <Audio height="200" width="200" color="#667eea" ariaLabel="loading" />
    //     </div>
    //   );
    // } else if (!chattingUser) {
    //   content = (
    //     <div className="grid place-items-center h-full text-3xl text-gray-400">
    //       Choose a chat to start the conversation
    //     </div>
    //   );
    // } else if (chattingUser) {
    //   content = (
    //     <div className="flex flex-col">
    //       <ChatSectionHeader chattingUser={chattingUser!} />
    //       <Chats
    //         userId={chattingUser.id}
    //         scrollToBottomOfDiv={scrollToBottomOfDiv}
    //         shouldScrollToBottomOfDiv={shouldScrollToBottomOfDiv}
    //       />
    //       <ChatInput
    //         chattingUser={chattingUser}
    //         shouldScrollToBottomOfDiv={shouldScrollToBottomOfDiv}
    //       />
    //     </div>
    //   );
    // }
    return content;
  };

  return (
    <div className="flex-1 rounded-tr-lg bg-gray-100 rounded-br-lg ">
      {renderContent(content)}
    </div>
  );
};

export default ChatsSection;
