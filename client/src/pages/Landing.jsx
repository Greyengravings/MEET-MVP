import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Video, Keyboard, Plus } from 'lucide-react';

const Landing = () => {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleCreateMeeting = () => {
    const id = uuidv4().substring(0, 8);
    navigate(`/${id}`);
  };

  const handleJoinMeeting = (e) => {
    e.preventDefault();
    if (roomCode.trim()) {
      navigate(`/${roomCode.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#202124] text-white flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Video className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-google text-[#e8eaed]">Meet MVP</span>
        </div>
        <div className="flex items-center gap-4 text-[#9aa0a6] text-sm">
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center px-6 lg:px-24 gap-16 max-w-7xl mx-auto w-full">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-tight text-[#e8eaed]">
            Premium video meetings. <br /> Now free for everyone.
          </h1>
          <p className="text-[#9aa0a6] text-xl lg:text-2xl font-light max-w-lg">
            We re-engineered the service we built for secure business meetings, Meet, to make it free and available for all.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button
              onClick={handleCreateMeeting}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Plus className="w-5 h-5" />
              New meeting
            </button>

            <form onSubmit={handleJoinMeeting} className="w-full sm:w-auto flex items-center gap-3 group">
              <div className="relative flex-1 sm:w-64">
                <Keyboard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9aa0a6] group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Enter a code or link"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="w-full bg-transparent border border-[#5f6368] focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded-md py-3 pl-12 pr-4 outline-none transition-all placeholder-[#9aa0a6]"
                />
              </div>
              <button
                type="submit"
                disabled={!roomCode.trim()}
                className="text-blue-400 font-medium hover:bg-blue-400/10 px-4 py-3 rounded-md transition-all disabled:text-[#5f6368] disabled:hover:bg-transparent"
              >
                Join
              </button>
            </form>
          </div>

          <div className="pt-8 border-t border-[#3c4043] max-w-md">
            <p className="text-[#9aa0a6]">
              <span className="text-blue-400 cursor-pointer hover:underline">Learn more</span> about Meet MVP
            </p>
          </div>
        </div>

        <div className="flex-1 hidden md:block">
          <div className="relative">
            <div className="w-full aspect-square max-w-md bg-[#303134] rounded-full overflow-hidden flex items-center justify-center border-8 border-[#202124] shadow-2xl">
               <Video className="w-32 h-32 text-blue-600/20" />
            </div>
            {/* Carousel simulation dots */}
            <div className="flex justify-center mt-8 gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <div className="w-2 h-2 rounded-full bg-[#5f6368]"></div>
              <div className="w-2 h-2 rounded-full bg-[#5f6368]"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
