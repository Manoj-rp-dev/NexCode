import React, { useState } from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
const Demo = () => {
    const [open, setOpen] = useState(false);
  return (
    <>
    <div className='w-full h-screen bg-black'>
        <div className='h-[10vh] hidden w-full  bg-red-800 lg:flex lg:flex-col justify-around items-center'>
            <div>Demo</div>
            <div>Demo</div>
            <div>Demo</div>
            <div>Demo</div>
            <div>Demo</div>
        </div>
    <div className='h-[10vh] lg:hidden absolute top-10 right-5'>
        <button onClick={()=>setOpen(!open)}>
            {open ?<p className='text-white'>X</p> :<GiHamburgerMenu color='white' scale={20} className='text-white text-2xl' />}
        </button>
    </div>
    {open &&(
        <div className='w-[50vw] flex lg:flex-col absolute top-15 right-6 h-[30vh] bg-amber-950'>
            <div>Demo</div>
            <div>Demo</div>
            <div>Demo</div>
            <div>Demo</div>
            <div>Demo</div>
        </div>
    )}
    </div>
    </>
  )
}

export default Demo