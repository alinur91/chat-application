import { IoMdAttach } from "react-icons/io";
import { AiOutlinePicture } from "react-icons/ai";
import { useState } from "react";

const ChatInput = () => {
  const [message, setmessage] = useState("");

  const handleSubmitMessage = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log(message);
    
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
