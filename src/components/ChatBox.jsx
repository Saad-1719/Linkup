import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { AppContext } from "../context/AppContext";
import {
	arrayUnion,
	doc,
	getDoc,
	onSnapshot,
	updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { toast } from "react-toastify";

const ChatBox = () => {
	const { userData, messagesId, chatUser, messages, setMessages } =
		useContext(AppContext);
	const [input, setInput] = useState("");

	const sendMessage = async () => {
		try {
			if (input && messagesId) {
				const messageDocRef = doc(db, "messages", messagesId);
				await updateDoc(messageDocRef, {
					messages: arrayUnion({
						sId: userData.id,
						text: input,
						createdAt: new Date(),
					}),
				});

				const userIDs = [chatUser.rId, userData.id];

				userIDs.forEach(async (id) => {
					const userChatsRef = doc(db, "chats", id);
					const userChatsSnapshot = await getDoc(userChatsRef);

					if (userChatsSnapshot.exists()) {
						const userChatData = userChatsSnapshot.data();
						const chatIndex = userChatData.chatsData.findIndex(
							(c) => c.messageId === messagesId
						);
						userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
						userChatData.chatsData[chatIndex].updatedAt = Date.now();
						if (userChatData.chatsData[chatIndex].rId === userData.id) {
							userChatData.chatsData[chatIndex].messageSeen = false;
						}
						await updateDoc(userChatsRef, {
							chatsData: userChatData.chatsData,
						});
					}
				});
			}
		} catch (error) {
			toast.error(error.message);
		}
		setInput("");
	};

	const convertTimeStamp = (Timestamp) => {
		let date = Timestamp.toDate();
		const hour = date.getHours();
		const minute = date.getMinutes();
		if (hour > 12) {
			return hour - 12 + ":" + minute + "PM";
		} else {
			return hour + ":" + minute + "AM";
		}
	};

	useEffect(() => {
		if (messagesId) {
			const unSub = onSnapshot(doc(db, "messages", messagesId), (snapshot) => {
				if (snapshot.exists()) {
					setMessages(snapshot.data().messages.reverse());
				}
			});
			return () => {
				unSub();
			};
		}
	}, [messagesId]);

	return chatUser ? (
		<div className="h-[85vh] relative bg-sky-200">
			<div className="py-3 px-4 flex items-center gap-3 border-b-black border-2">
				<img
					src={chatUser.userData.avatar}
					alt=""
					className="rounded-full w-10 h-auto aspect-square"
				/>
				<p className="flex gap-x-3 font-semibold text-lg flex-1 items-center ">
					{chatUser.userData.name}{" "}
					<img
						src={assets.green_dot}
						alt=""
						className="rounded-full w-4 items-center"
					/>
				</p>
				<img
					src={assets.help_icon}
					alt=""
					className="rounded-full w-6 h-auto"
				/>
			</div>
			{/* chat area */}
			<div className="pb-[50px] h-[calc(100%-70px)] overflow-y-scroll flex flex-col-reverse no-scrollbar">
				{messages.map((msg, index) =>
					msg.sId === userData.id ? (
						<div
							key={index}
							className=" flex items-end justify-end gap-1 py-0 px-4"
						>
							<p className="text-white bg-sky-500 p-2 max-w-48 text-base mb-7 rounded-tr-lg rounded-tl-lg rounded-bl-lg">{msg.text}</p>
							<div className="text-center text-[11px]">
								<img
									src={userData.avatar}
									alt=""
									className="w-6 rounded-full aspect-square"
								/>
								<p>{convertTimeStamp(msg.createdAt)}</p>
							</div>
						</div>
					) : (
						<div key={index} className="flex flex-row  ">
							<div className="flex flex-col items-end pl-3 pr-2 justify-end text-center text-[11px]">
								<img
									src={chatUser.userData.avatar}
									alt=""
									className="w-6 rounded-full  aspect-square"
								/>
								<p>{convertTimeStamp(msg.createdAt)}</p>
							</div>
							<p className="text-white bg-sky-500 p-2 max-w-48 text-base mb-7 rounded-tr-lg rounded-tl-lg rounded-br-lg">
								{msg.text}
							</p>
						</div>
					)
				)}
			</div>

			{/* //bottom */}

			<div className="flex items-center gap-3 py-2 px-4 bg-white absolute bottom-0 left-0 right-0">
				<input
					type="text"
					placeholder="send a message"
					className="outline-none flex-1"
					value={input}
					onChange={(e) => setInput(e.target.value)}
				/>
				<input type="file" id="image" accept="image/png, image/jpeg" hidden />
				<label htmlFor="image" className="flex ">
					<img
						src={assets.gallery_icon}
						alt=""
						className=" cursor-pointer w-5"
					/>
				</label>
				<img
					src={assets.send_button}
					alt=""
					className="w-7 cursor-pointer"
					onClick={sendMessage}
				/>
			</div>
		</div>
	) : (
		<div className="flex flex-col items-center justify-center">
			<img src={assets.logo_icon} alt="" className="w-20 h-auto" />
			<p>Chat Anytime,anywhere</p>
		</div>
	);
};

export default ChatBox;
