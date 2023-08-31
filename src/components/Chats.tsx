import { DocumentData, collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { IUser } from "../types/InitialUserState";
import { useTypedSelector } from "../hooks/useTypedSelector";

const Chats = ({
  userId,
  scrollToBottomOfDiv,
  shouldScrollToBottomOfDiv,
}: {
  userId: string;
  scrollToBottomOfDiv: boolean;
  shouldScrollToBottomOfDiv: (value: boolean) => void;
}) => {
  const [chatMessages, setchatMessages] = useState<DocumentData[]>([]);
  const user = useTypedSelector((state) => state.userInfo.user);
  const combinedId = user.id > userId ? user.id + userId : userId + user.id;
  const scrollRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    setchatMessages([]);
  }, [userId]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "rooms", combinedId, "messages"),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            setchatMessages((message) => [
              ...message,
              change.doc.data() as IUser,
            ]);
          }
        });
      }
    );

    return () => unsubscribe();
  }, [combinedId, user.id, userId]);

  const getTextClasses = (
    currentUserEmail: string,
    textedUserEmail: string
  ) => {
    /* max-w-[80%] */
    let textClass = ` px-5 py-3 text-lg `;
    if (currentUserEmail === textedUserEmail) {
      textClass += `text-white bg-blue-500 rounded-tl-xl rounded-bl-xl rounded-br-xl`;
    } else {
      textClass += `text-gray-600 bg-white font-semibold  rounded-tr-xl rounded-bl-xl rounded-br-xl`;
    }

    return textClass;
  };

  const getMessageInfoClasses = (
    currentUserEmail: string,
    textedUserEmail: string
  ) => {
    let messageInfoClass = `flex items-center gap-`;
    if (currentUserEmail === textedUserEmail) {
      messageInfoClass += `5 self-end`;
    } else {
      messageInfoClass += `8`;
    }

    return messageInfoClass;
  };

  const renderMessageInfo = (
    currentUserEmail: string,
    textedUser: DocumentData
  ) => {
    const messageInfoArray = [
      <img
        key="0"
        className="h-11 rounded-full"
        src={textedUser.photo}
        alt={textedUser.name}
      />,
      <span
        key="1"
        className={`${getTextClasses(currentUserEmail, textedUser.email)}`}
      >
        {textedUser.message}{" "}
      </span>,
    ];

    if (currentUserEmail === textedUser.email) {
      [messageInfoArray[0], messageInfoArray[1]] = [
        messageInfoArray[1],
        messageInfoArray[0],
      ];
    }

    return messageInfoArray;
  };

  useEffect(() => {
    if (scrollToBottomOfDiv) {
      // scrollRef.current?.scrollIntoView({
      //   behavior: "smooth",
      // }),
      setTimeout(
        () =>
          scrollRef.current?.scrollIntoView({
            behavior: "smooth",
            block: 'end'
          }),
        100
      );
      shouldScrollToBottomOfDiv(false);
    }
  }, [scrollToBottomOfDiv, shouldScrollToBottomOfDiv]);

  return (
    <div className="flex flex-col items-start gap-5 p-4 bg-indigo-100 h-[593.19px] overflow-auto">
      {chatMessages.map((messageInfo) => (
        <div
          ref={scrollRef}
          key={messageInfo.id}
          className={`${getMessageInfoClasses(user.email, messageInfo.email)}`}
        >
          {renderMessageInfo(user.email, messageInfo).map((jsxEl) => jsxEl)}
        </div>
      ))}
    </div>
  );
};

export default Chats;
