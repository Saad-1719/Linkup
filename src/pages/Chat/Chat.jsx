import React from "react";
import LeftSideBar from "../../components/LeftSideBar";
import ChatBox from "../../components/ChatBox";
import RightSideBar from "../../components/RightSideBar";

const Chat = () => {
	return (
		<div className="min-h-screen bg-blue-800 flex justify-center items-center">
      <div className="w-[95%] h-[75vh] py-auto max-h-screena bg-blue-200  grid grid-cols-[1fr_2fr_1fr]">
        <LeftSideBar />
        <ChatBox />
        <RightSideBar/>

      </div>
		</div>
	);
};

export default Chat;
