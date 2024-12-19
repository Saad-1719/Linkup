import React, { useContext, useEffect, useState } from "react";
import LeftSideBar from "../../components/LeftSideBar";
import ChatBox from "../../components/ChatBox";
import RightSideBar from "../../components/RightSideBar";
import { AppContext } from "../../context/AppContext";

const Chat = () =>
{
  
  const { chatData, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (chatData && userData)
    {
      setLoading(false);
    }
},[chatData,userData])
	return (
		<div className="min-h-screen bg-sky-700 flex justify-center items-center">
      {
        loading ?
          
          <span className="loader"></span> :
          
      <div className="w-[90%] h-[85vh] py-auto max-h-screena bg-blue-200  grid grid-cols-[1fr_2fr_1fr] rounded-lg">
        <LeftSideBar />
        <ChatBox />
        <RightSideBar/>

      </div>
      }
		</div>
	);
};

export default Chat;
