import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [messagesId, setMessagesId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadUserData = async (uid) => {
    setIsLoading(true);
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      setUserData(userData);

      await updateDoc(userRef, {
        lastSeen: Date.now(),
      });

      setInterval(async () => {
        if (auth.currentUser) {
          await updateDoc(userRef, {
            lastSeen: Date.now(),
          });
        }
      }, 60000);

      setIsLoading(false);
      return !!(userData.avatar && userData.name);
    } catch (error) {
      console.error("Error loading user data:", error);
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, "chats", userData.id);
      const unSub = onSnapshot(chatRef, async (res) => {
        const chatItems = res.data().chatsData;
        const tempData = [];
        for (const item of chatItems) {
          const userRef = doc(db, "users", item.rId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();
          tempData.push({ ...item, userData });
        }
        setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
      });

      return () => {
        unSub();
      };
    }
  }, [userData]);

  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
    messages,
    setMessages,
    messagesId,
    setMessagesId,
    chatUser,
    setChatUser,
    isLoading,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;

