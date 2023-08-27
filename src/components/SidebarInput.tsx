import React, { useEffect, useState } from "react";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { IUser } from "../types/InitialUserState";

const SidebarInput = ({
  addUserToChattingList,
  shouldClearInput,
}: {
  addUserToChattingList: (arg0: IUser) => void;
  shouldClearInput: boolean;
}) => {
  const [text, setText] = useState("");
  const usersList = useTypedSelector((state) => state.userInfo.usersList);

  useEffect(() => {
    if (shouldClearInput) setText("");
  }, [shouldClearInput]);

  const hanldeTextChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setText(target.value);
    const searcheduser = usersList.find(
      (user) =>
        user.name.toLowerCase() ===
        (e.target as HTMLInputElement).value.toLowerCase()
    );

    if (searcheduser) addUserToChattingList(searcheduser);
  };

  return (
    <div className="border-solid border-b border-gray-500 text-gray-100">
      <input
        value={text}
        onChange={hanldeTextChange}
        className="w-full outline-none p-2 bg-indigo-800 placeholder-gray-300"
        type="text"
        placeholder="Find a user"
      />
      {/* <hr /> */}
    </div>
  );
};

export default SidebarInput;
