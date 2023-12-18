import {
  DocumentData,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { IUser } from "../types/InitialUserState";
import { useTypedSelector } from "../hooks/useTypedSelector";

const Chats = ({
  userId,
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
    const q = query(
      collection(db, "rooms", combinedId, "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          setchatMessages((messages) => [...messages, change.doc.data()]);
        }
        if (change.type === "added") {
          setchatMessages((messages) => {
            if (change.doc.data().createdAt)
              return [...messages, change.doc.data() as IUser];

            return messages;
          });
        }
      });
    });

    return () => unsubscribe();
  }, [combinedId, user.id, userId]);

  const getTextClasses = (
    currentUserEmail: string,
    textedUser: DocumentData
  ) => {
    let textClass = `relative px-5 py-3 pr-28 text-lgm break-all `;
    if (currentUserEmail === textedUser.email) {
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
    let messageInfoClass = `flex items-center `;
    if (currentUserEmail === textedUserEmail) {
      messageInfoClass += `gap-5 self-end`;
    } else {
      messageInfoClass += `gap-6`;
    }

    return messageInfoClass;
  };

  const getTimeStampMessage = (
    currentUserEmail: string,
    textedUser: DocumentData
  ) => {
    const uneditedDate = new Date(textedUser.createdAt?.seconds * 1000);
    const date = uneditedDate.toLocaleDateString();
    const hours = uneditedDate.getHours();
    const minutes = uneditedDate.getMinutes();
    const messageColor =
      currentUserEmail === textedUser.email
        ? "text-slate-200"
        : "text-slate-400";
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const fullDate = `${date}, ${hours}:${formattedMinutes}`;

    return (
      <span className={`absolute text-xs bottom-2 right-2 ${messageColor}`}>
        {fullDate}{" "}
      </span>
    );
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
        className={`${getTextClasses(currentUserEmail, textedUser)}`}
      >
        {textedUser.message} {getTimeStampMessage(currentUserEmail, textedUser)}
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
    /* scroll happens  happens as soon as the page is loaded, thats why we removed array of dependencyi [] */
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    }),
      shouldScrollToBottomOfDiv(false);
  });

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
