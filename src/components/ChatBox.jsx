import React from "react";
import assets from "../assets/assets";

const ChatBox = () => {
	return (
		<div className="h-[75vh] relative bg-sky-200">
			<div className="py-3 px-4 flex items-center gap-3 border-b-black border-2">
				<img src={assets.profile_img} alt="" className="rounded-full w-10" />
				<p className="flex gap-x-3 font-semibold text-lg flex-1 items-center ">
					Richard{" "}
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
				{/* sender message */}
				<div className=" flex items-end justify-end gap-1 py-0 px-4">
					<p className="text-white bg-sky-500 p-2 max-w-48 text-base mb-7 rounded-tr-lg rounded-tl-lg rounded-bl-lg">
						Lorem ipsum dolor sit.
					</p>
					<div className="text-center text-[11px]">
						<img
							src={assets.profile_img}
							alt=""
							className="w-6 rounded-full aspect-square"
						/>
						<p>2:30 PM</p>
					</div>
				</div>

				{/* send image */}

				<div className=" flex items-end justify-end gap-1 py-0 px-4">
					<img src={assets.pic1} alt="" className="max-w-60 mb-8 rounded-lg" />
					<div className="text-center text-[11px]">
						<img
							src={assets.profile_img}
							alt=""
							className="w-6 rounded-full aspect-square"
						/>
						<p>2:30 PM</p>
					</div>
				</div>
				{/* receiver message */}
				<div className="flex  flex-row  ">
					<div className="flex flex-col items-end pl-3 pr-2 justify-end text-center text-[11px]">
						<img
							src={assets.profile_img}
							alt=""
							className="w-6 rounded-full  aspect-square"
						/>
						<p>2:30 PM</p>
					</div>
					<p className="text-white bg-sky-500 p-2 max-w-48 text-base mb-7 rounded-tr-lg rounded-tl-lg rounded-br-lg">
						Lorem ipsum dolor sit.
					</p>
				</div>
			</div>

			{/* //bottom */}

			<div className="flex items-center gap-3 py-2 px-4 bg-white absolute bottom-0 left-0 right-0">
				<input
					type="text"
					placeholder="send a message"
					className="outline-none flex-1"
				/>
				<input type="file" id="image" accept="image/png, image/jpeg" hidden />
				<label htmlFor="image" className="flex ">
					<img
						src={assets.gallery_icon}
						alt=""
						className=" cursor-pointer w-5"
					/>
				</label>
				<img src={assets.send_button} alt="" className="w-7 cursor-pointer" />
			</div>
		</div>
	);
};

export default ChatBox;
