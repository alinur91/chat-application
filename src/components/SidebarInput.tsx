// import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
// import { db } from "../firebase";
import React, { useCallback, useEffect, useMemo } from "react";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { IUser } from "../types/InitialUserState";
import debounce from "lodash.debounce";

const SidebarInput = ({
  addUserToChattingList,
}: {
  addUserToChattingList: (arg0: IUser) => void;
}) => {
  const usersList = useTypedSelector((state) => state.user.usersList);

  const changeHandler = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    const searcheduser = usersList.find(
      (user) => user.name === (event.target as HTMLInputElement).value
    );

    if (searcheduser) addUserToChattingList(searcheduser);
  },[addUserToChattingList, usersList])

  const debouncedChangeHandler = useMemo(
    () => debounce(changeHandler, 300),
    [changeHandler]
  );

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, [debouncedChangeHandler]);

  return (
    <div className="border-solid border-b border-gray-500 text-gray-100">
      <input
        onChange={debouncedChangeHandler}
        className="w-full outline-none p-2 bg-indigo-700 placeholder-gray-300"
        type="text"
        placeholder="Find a user"
      />
      {/* <hr /> */}
    </div>
  );
};

export default SidebarInput;
