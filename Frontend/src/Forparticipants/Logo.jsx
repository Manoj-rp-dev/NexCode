import React from 'react'
import { Link } from "react-router-dom";

const Logo = () => {
    return (
        <Link to="/">
            <div className="flex items-center gap-3 sm:gap-4 group hover:opacity-80 transition-opacity">
                <div className='h-10 sm:h-14'>
                    <img
                        src="/logo.png"
                        alt="NexCode Logo"
                        className="h-full object-contain drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                    />
                </div>
                <div className='text-2xl sm:text-4xl font-bold text-fuchsia-500 dark:text-cyan-400 uppercase tracking-tight'>NexCode</div>
            </div>
        </Link>
    )
}

export default Logo
