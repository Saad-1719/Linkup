import React from "react";
import assets from "../assets/assets";
import { logout } from "../config/firebase";

const RightSideBar = () => {
	return (
		<div className="text-white bg-slate-950 relative h-[85vh] overflow-y-scroll no-scrollbar">
			<div className="pt-14 text-center max-w-[70%] m-auto flex flex-col items-center">
				<img
					src={assets.profile_img}
					alt=""
					className="w-28 aspect-auto rounded-full"
				/>
				<h3 className="font-medium flex gap-x-1 mx-0 my-1 text-center items-center justify-center text-lg">
					Richard <img src={assets.green_dot} alt="" />
				</h3>
				<p className="text-sm opacity-80 ">Lorem ipsum dolor sit amet consectetur.</p>
			</div>
			<hr className="border-gray-500 my-4 mx-0" />
			<div className="py-0 px-5">
				<p className="text-sm">Media</p>
				<div className="max-h-52 overflow-y-scroll grid grid-cols-[1fr_1fr_1fr] gap-1 mt-2 no-scrollbar">
					<img src={assets.pic1} alt="" className="rounded-md cursor-pointer"/>
					<img src={assets.pic2} className="rounded-md cursor-pointer" alt="" />
					<img src={assets.pic3} className="rounded-md cursor-pointer" alt="" />
					<img src={assets.pic4} className="rounded-md cursor-pointer" alt="" />
					<img src={assets.pic1} className="rounded-md cursor-pointer" alt="" />
					<img src={assets.pic2} className="rounded-md cursor-pointer" alt="" />
				</div>
				<button className=" bg-sky-800 hover:bg-sky-600 transition-all text-xl rounded-lg items-end justify-center mt-5 px-20 py-2 leading-2 absolute bottom-5 left-[50%] translate-x-[-50%] " onClick={()=>logout()}>Logout</button>
			</div>
		</div>
	);
};

export default RightSideBar;
