import { BsFillCameraVideoFill } from "react-icons/bs";
import { AiOutlineUserAdd } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { IUser } from "../types/InitialUserState";

const ChatSectionHeader = ({ chattingUser }: { chattingUser: IUser }) => {
  return (
    <div className="text-white flex  items-center justify-between h-[69px]   bg-indigo-600 px-3">
      <h4 className="mr-auto">{chattingUser?.name} </h4>
      <div className="flex gap-3 items-center text-lg">
        <BsFillCameraVideoFill className="cursor-pointer" />
        <AiOutlineUserAdd className="cursor-pointer" />
        <BsThreeDots className="cursor-pointer" />
      </div>
    </div>
  );
};

export default ChatSectionHeader;
