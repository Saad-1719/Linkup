import React, { useContext } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { AppContext } from "../context/AppContext";

const LeftSideBar = () => {
	const navigate = useNavigate();
	const { userData } = useContext(AppContext);

	const inputHandler = async (e) => {
		try {
			const input = e.target.value;
			const userRef = collection(db, "users");
			const q = query(userRef, where("username", "==", input.toLowerCase()));
			const querySnap = await getDocs(q);
			if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
				console.log(querySnap.docs[0].data());
			}
		} catch (error) {}
	};
	return (
		<div className="bg-gray-950 text-white h-[75vh]">
			<div className="p-5">
				<div className="flex justify-between items-center">
					<img src={assets.logo} alt="" className="w-fit h-12" />

					<div className="relative py-2 px-0 group">
						<img
							src={assets.menu_icon}
							alt=""
							className="h-8 w-auto cursor-pointer opacity-60 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
						/>

						<div className="absolute top-full right-0 w-32 py-3 px-3 rounded-lg text-center bg-white text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
							<p
								className="text-sm cursor-pointer hover:bg-gray-200 px-2 py-3 rounded-lg transition-all ease-in-out duration-300 transform group-hover:scale-105"
								onClick={() => navigate("/profile")}
							>
								Edit Profile
							</p>

							<hr className="border-none h-[1px] bg-gray-500 my-2" />

							<p className="text-sm cursor-pointer hover:bg-gray-200 px-2 py-3 rounded-lg transition-all ease-in-out duration-300 transform group-hover:scale-105">
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
						className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white"
						onChange={inputHandler}
					/>
				</div>
			</div>
			<div className="flex flex-col h-[70%] overflow-y-scroll no-scrollbar ">
				{Array(12)
					.fill("")
					.map((item, index) => (
						<div
							key={index}
							className="flex items-center gap-3 px-3 py-2 cursor-pointer text-md hover:bg-slate-900 transition-all"
						>
							<img
								src={assets.profile_img}
								alt=""
								className="w-9 aspect-auto border rounded-full
                "
							/>
							<div className="flex flex-col ">
								<p>Richard</p>
								<span className="text-gray-500 text-sm ">
									Hello, how are you?
								</span>
							</div>
						</div>
					))}
			</div>
		</div>
	);
};

export default LeftSideBar;
