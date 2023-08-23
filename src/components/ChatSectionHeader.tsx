import { BsFillCameraVideoFill } from "react-icons/bs";
import { AiOutlineUserAdd } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { IUser } from "../types/InitialUserState";

const ChatSectionHeader = ({ user }: { user: IUser }) => {
  return (
    <>
      <h4 className="mr-auto">{user?.name} </h4>
      <div className="flex gap-3 items-center text-lg">
        <BsFillCameraVideoFill className="cursor-pointer" />
        <AiOutlineUserAdd className="cursor-pointer" />
        <BsThreeDots className="cursor-pointer" />
      </div>
    </>
  );
};

export default ChatSectionHeader;
