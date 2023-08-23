import { useNavigate } from "react-router-dom";
import { IUser } from "../types/InitialUserState";

const ChattingWithUser = ({
  chattingWithUser,
}: {
  chattingWithUser: IUser;
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/chats/${chattingWithUser.id}`)}
      className="flex gap-2 text-gray-200 p-2 cursor-pointer"
    >
      <img className="h-10 rounded-full" src={chattingWithUser.photo} alt="" />
      <div>
        <h4>{chattingWithUser.name}</h4>
        <p>message</p>
      </div>
    </div>
  );
};

export default ChattingWithUser;
