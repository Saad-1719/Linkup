import React, { useState } from "react";
import assets from "../../assets/assets";

const ProfileUpdate = () =>
{
  const [image, setImage] = useState(false);




  return <div className="min-h-screen bg-[url('/background.png')] bg-no-repeat flex items-center justify-center">
    
    <div className="bg-white flex items-center justify-between min-w-[700px] border-4 rounded-lg px-10 space-x-12">
      <form className="flex flex-col gap-5 p-10">
        <h3 className="font-medium text-lg">Profile Details</h3>
        <label htmlFor="avatar" className="flex items-center gap-3 text-gray-400 cursor-pointer">
          <input type="file" id="avatar" accept=".png,.jpg,.jpeg" hidden onChange={(e)=>setImage(e.target.files[0])}/>
          <img src={image?URL.createObjectURL(image) : assets.avatar_icon} alt="" className="w-12 aspect-square rounded-full" />
          upload profile image
        </label>
        <input type="text" placeholder="Your name" required className="p-3 min-w-72 border-[1px] border-gray-400 outline-blue-700" />
        <textarea placeholder="Write profile bio" required className="p-3 min-w-72 border-[1px] border-gray-400 outline-blue-700"></textarea>
        <button type="submit" className="text-white bg-blue-600 p-2 cursor-pointer hover:bg-blue-700 transition-all ease-in-out">Save</button>
      </form>
      <img src={image?URL.createObjectURL(image) : assets.logo_icon} alt=""  className="max-w-40 aspect-square my-5 mx-0 rounded-full "/>
    </div>
  </div>;
};

export default ProfileUpdate;
