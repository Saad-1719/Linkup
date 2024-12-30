import React, { useContext, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db,logout } from "../config/firebase";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const { userData, chatData, chatUser, setChatUser, setMessagesId, messagesId } = useContext(AppContext);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [parent] = useAutoAnimate({
    duration: 500, // Animation duration in milliseconds
    easing: 'ease-in-out', // Easing function
  });

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      setSearchInput(input);
      
      if (input) {
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          const foundUser = querySnap.docs[0].data();
          const existingChat = chatData.find(chat => chat.rId === foundUser.id);
          setSearchResults({
            ...foundUser,
            existingChat
          });
        } else {
          setSearchResults(null);
        }
      } else {
        setSearchResults(null);
      }
    } catch (error) {
      console.error("Error in inputHandler:", error);
    }
  };

  const addChat = async (user) => {
    const messagesRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");
    try {
      setIsLoading(true);
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: []
      });

      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true
        })
      });

      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true
        })
      });

      const newChat = {
        messageId: newMessageRef.id,
        rId: user.id,
        userData: user
      };
      setChat(newChat);
      
    } catch (error) {
      toast.error(error.message);
      console.error("Error in addChat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setChat = (item) => {
    setMessagesId(item.messageId);
    setChatUser(item);
  };

  const handleUserSelect = async () => {
    if (!searchResults || isLoading) return;

    if (searchResults.existingChat) {
      setChat({
        messageId: searchResults.existingChat.messageId,
        rId: searchResults.id,
        userData: searchResults
      });
    } else {
      await addChat(searchResults);
    }
    
    setSearchInput("");
    setSearchResults(null);
  };

  const isActiveChat = (item) => {
    return messagesId === item.messageId;
  };

  return (
    <div className="bg-gray-950 rounded-tl-lg rounded-bl-lg  text-white h-[85vh] " >
      <div className="p-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="" className="w-fit h-12" />

          <div className="relative py-2 px-0 group">
            <img
              src={assets.menu_icon}
              alt=""
              className="h-8 w-auto cursor-pointer opacity-60 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
            />

            <div className="absolute top-full right-0 w-32 py-3 px-3 z-10 rounded-lg text-center bg-white text-black hidden group-hover:block opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
              <p
                className="text-sm cursor-pointer hover:bg-gray-200 px-2 py-3 rounded-lg transition-all ease-in-out duration-300 transform group-hover:scale-105"
                onClick={() => navigate("/profile")}
              >
                Edit Profile
              </p>

              <hr className="border-none h-[1px] bg-gray-500 my-2" />

              <p className="text-sm cursor-pointer hover:bg-gray-200 px-2 py-3 rounded-lg transition-all ease-in-out duration-300 transform group-hover:scale-105" onClick={()=>logout()}>
                Logout
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 flex items-center gap-2 py-3 px-3 mt-5 rounded-lg">
          <img src={assets.search_icon} alt="" className="w-4" />
          <input
            type="text"
            placeholder="Search Here"
            value={searchInput}
            className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white w-full"
            onChange={inputHandler}
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="flex flex-col h-[75%] overflow-y-scroll no-scrollbar" ref={parent}>
        {searchResults ? (
          <div 
            onClick={handleUserSelect}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer text-md hover:bg-slate-900 transition-all relative ${
              isLoading ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            <img src={searchResults.avatar} alt="" className="w-9 h-auto aspect-square rounded-full"/>
            <p>{searchResults.name}</p>
            {isLoading && (
              <div className="absolute right-4 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        ) : (
          chatData.map((item, index) => (
            <div
              onClick={() => setChat(item)}
              key={index}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer text-md transition-all ${
                isActiveChat(item) ? 'bg-slate-800' : 'hover:bg-slate-900'
              }`}
            >
              <img
                src={item.userData.avatar}
                alt=""
                className="w-9 aspect-square rounded-full"
              />
              <div className="flex flex-col">
                <p>{item.userData.name}</p>
                <span className="text-gray-500 text-sm">
                  {item.lastMessage}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;