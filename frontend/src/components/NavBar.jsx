import React from 'react';

const Navbar = () => {
  return (
    <div className="bg-black border-b border-gray-700">
      {/* Main Navbar */}
      <div className="py-4 flex justify-between items-center px-6 text-white">
        {/* Logo or Animation */}
        <img
          className="w-14 h-14 object-cover rounded-full shadow-lg"
          src="./giphy.gif"
          alt="Logo Animation"
        />
        {/* Title */}
        <h1 className="text-xl md:text-2xl lg:text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-wide text-center">
          SOCIAL MEDIA PERFORMANCE ANALYSIS
        </h1>
      </div>

      {/* Subtitle */}
      <div >

      </div>
    </div>
  );
};

export default Navbar;