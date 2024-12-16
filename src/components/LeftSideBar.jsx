import React from 'react'
import assets from '../assets/assets'


const LeftSideBar = () => {
  return (
      <div className='bg-gray-950 text-white h-[75vh]'>
          <div className='p-5'>
              <div className='flex justify-between items-center'>
                  <img src={assets.logo} alt="" className='w-fit h-12' />
                  <div className='relative py-2 px-0 group transition-all ease-in-out'>
                      <img src={assets.menu_icon} alt="" className='h-8 w-auto cursor-pointer opacity-60 ' />
                      <div className='absolute top-full right-0 w-32 p-5 rounded bg-white text-black hidden group-hover:block' >
                          <p className='text-sm cursor-pointer hover:border border-black px-2 py-3 rounded-lg transition-all ease-in-out'>
                              Edit Profile
                          </p>
                          <hr className='border-none h-[1px] bg-gray-500 my-2' />
                          <p className='text-sm cursor-pointer hover:border border-black px-2 py-3 rounded-lg transition-all ease-in-out'>
                          Logout</p>
                      </div>
                  </div>
              </div>
              <div className='bg-slate-900 flex items-center gap-2 py-2 px-3 mt-5'>
                  <img src={assets.search_icon} alt="" className='w-4' />
                  <input type="text" placeholder='Search Here' className='bg-transparent border-none outline-none text-xs text-white placeholder:text-white'/>
              </div>
          </div>
          <div className='flex flex-col h-[70%] overflow-y-scroll no-scrollbar '>
              {Array(12).fill("").map((item,index) =>
              (
                <div key={index} className='flex items-center gap-3 px-3 py-2 cursor-pointer text-md hover:bg-slate-900 transition-all'>
                <img src={assets.profile_img} alt="" className='w-9 aspect-auto border rounded-full
                '/>
                <div className='flex flex-col '>
                    <p>Richard</p>
                    <span className='text-gray-500 text-sm '>Hello, how are you?</span>
                </div>
            </div>
              ))}
          </div>
    </div>
  )
}

export default LeftSideBar