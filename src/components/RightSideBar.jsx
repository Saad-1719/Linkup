import React, { useContext, useEffect, useState,useCallback } from "react";
import assets from "../assets/assets";
import { logout } from "../config/firebase";
import ImageViewer from "react-simple-image-viewer";
import { AppContext } from "../context/AppContext";

const RightSideBar = () => {
	const { chatUser, messages } = useContext(AppContext);
	const [msgImages, setMsgImages] = useState([]);
	const [currentImage, setCurrentImage] = useState(0);
	const [isViewerOpen, setIsViewerOpen] = useState(false);

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
		<div className="text-white bg-slate-950 relative h-[85vh] overflow-y-scroll no-scrollbar">
			<div className="pt-14 text-center max-w-[70%] m-auto flex flex-col items-center">
				<img
					src={chatUser.userData.avatar}
					alt=""
					className="w-28 aspect-square h-auto rounded-full"
				/>
				<h3 className="font-medium flex gap-x-1 mx-0 my-1 text-center items-center justify-center text-lg">
					{chatUser.userData.name}
					<img src={assets.green_dot} alt="" />
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
					className=" bg-sky-800 hover:bg-sky-600 transition-all text-xl rounded-lg items-end justify-center mt-5 px-20 py-2 leading-2 absolute bottom-5 left-[50%] translate-x-[-50%] "
					onClick={() => logout()}
				>
					Logout
				</button>
			</div>
		</div>
	) : (
		<div className="text-white bg-slate-950 relative h-[85vh] overflow-y-scroll no-scrollbar">
			<button
				className=" bg-sky-800 hover:bg-sky-600 transition-all text-xl rounded-lg items-end justify-center mt-5 px-20 py-2 leading-2 absolute bottom-5 left-[50%] translate-x-[-50%] "
				onClick={() => logout()}
			>
				Logout
			</button>
		</div>
	);
};

export default RightSideBar;
