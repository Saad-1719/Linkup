import React, { useContext, useEffect, useState,useCallback } from "react";
import assets from "../assets/assets";
import { logout } from "../config/firebase";
import ImageViewer from "react-simple-image-viewer";
import { AppContext } from "../context/AppContext";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const RightSideBar = () => {
	const { chatUser, messages } = useContext(AppContext);
	const [msgImages, setMsgImages] = useState([]);
	const [currentImage, setCurrentImage] = useState(0);
	const [isViewerOpen, setIsViewerOpen] = useState(false);
	const [parent] = useAutoAnimate({
		duration: 500, // Animation duration in milliseconds
		easing: 'ease-in-out', // Easing function
	  });

	useEffect(() => {
		let tempVar = [];
		messages.forEach((msg) => {
			if (msg.type === "image") {
				tempVar.push(msg.text); // Push the image URL
			}
		});
		setMsgImages(tempVar);
	}, [messages]);

	const openImageViewer = useCallback((index) => {
		setCurrentImage(index);
		setIsViewerOpen(true);
	}, []);

	const closeImageViewer = () => {
		setCurrentImage(0);
		setIsViewerOpen(false);
	};

	return chatUser ? (
		<div className="text-white bg-slate-950 rounded-tr-lg rounded-br-lg relative h-[85vh] overflow-y-scroll no-scrollbar" ref={parent}>
			<div className="pt-14 text-center max-w-[70%] m-auto flex flex-col items-center">
				<img
					src={chatUser.userData.avatar}
					alt=""
					className="w-28 aspect-square h-auto rounded-full"
				/>
				<h3 className="font-medium flex gap-x-1 mx-0 my-1 text-center items-center justify-center text-lg">
					{chatUser.userData.name}
					{Date.now()-chatUser.userData.lastSeen <=70000 ?<img src={assets.green_dot} alt="" /> : " "}
					
				</h3>
				<p className="text-sm opacity-80 ">{chatUser.userData.bio}</p>
			</div>
			<hr className="border-gray-500 my-4 mx-0" />
			<div className="py-0 px-5">
				<p className="text-sm">Media</p>
				<div className="max-h-52 overflow-y-scroll grid grid-cols-[1fr_1fr_1fr] gap-1 mt-2 no-scrollbar">
					{msgImages.map((url, index) => (
						<img
							key={index}
							src={url}
							alt=""
							className="rounded-md cursor-pointer"
							onClick={() => openImageViewer(index)}
						/>
					))}
					{isViewerOpen && (
						<ImageViewer
							src={msgImages}
							currentIndex={currentImage}
							onClose={closeImageViewer}
							disableScroll={false}
							backgroundStyle={{
								backgroundColor: "rgba(0,0,0,0.9)",
							}}
							closeOnClickOutside={true}
						/>
					)}
				</div>
				<button
					className=" rounded-md text-lg font-bold bg-white bg-opacity-10 backdrop-blur-md hover:bg-[#26a0da] transition-all text-white hover:text-black  border hover:border-none items-end justify-center mt-5 px-20 py-2 leading-2 absolute bottom-5 left-[50%] translate-x-[-50%] "
					onClick={() => logout()}
				>
					Logout
				</button>
			</div>
		</div>
	) : (
		<div className="text-white bg-slate-950 relative h-[85vh] overflow-y-scroll no-scrollbar">
			<button
				className=" rounded-md text-lg font-bold bg-white bg-opacity-10 backdrop-blur-md hover:bg-[#26a0da] transition-colors	 duration-900 ease-linear text-white hover:text-black  border hover:border-none items-end justify-center mt-5 px-20 py-2 leading-2 absolute bottom-5 left-[50%] translate-x-[-50%] "
				onClick={() => logout()}
			>
				Logout
			</button>
		</div>
	);
};

export default RightSideBar;
