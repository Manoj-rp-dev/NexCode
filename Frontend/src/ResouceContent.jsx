import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const ResouceContent = ({ role }) => {
    const contentRef = useRef(null);

    useEffect(() => {
        if (role && contentRef.current) {
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
            );
        }
    }, [role]);

    if (!role) return null;
    return (
        <div
            ref={contentRef}
            className="w-full text-white flex flex-col gap-4 mt-6">
            <h1 className="text-xl md:text-3xl font-bold text-center">
                {role.title}
            </h1>

            {role.para.map((text, index) => (
                <p key={index} className="text-gray-300 leading-relaxed ml-[3vh]">
                    {text}
                </p>
            ))}

            <div className="flex justify-center">
                <button
                    onClick={() => window.open(role.link, "_blank")}
                    className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-md transition">
                    Get Link
                </button>
            </div>
        </div>
    );
};

export default ResouceContent;