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
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Video className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-medium text-gray-300">Meet MVP</span>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center p-8 gap-12 max-w-7xl mx-auto w-full">
        <div className="flex-1 space-y-8 max-w-lg">
          <h1 className="text-5xl font-normal leading-tight">
            Premium video meetings. Now free for everyone.
          </h1>
          <p className="text-xl text-gray-400">
            We re-engineered the service we built for secure business meetings, Google Meet, to make it free and available for all.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button
              onClick={handleCreateMeeting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors w-full sm:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              New meeting
            </button>
            
            <form onSubmit={handleJoinMeeting} className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1">
                <Keyboard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter a code or link"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="bg-transparent border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md py-3 pl-11 pr-4 outline-none w-full text-white"
                />
              </div>
              <button
                type="submit"
                disabled={!roomCode.trim()}
                className="text-blue-500 hover:bg-blue-500/10 px-4 py-3 rounded-md font-medium transition-colors disabled:text-gray-600 disabled:hover:bg-transparent"
              >
                Join
              </button>
            </form>
          </div>
          
          <hr className="border-gray-700" />
          
          <p className="text-gray-400">
            <a href="#" className="text-blue-500 hover:underline">Learn more</a> about Google Meet
          </p>
        </div>

        <div className="flex-1 hidden md:block">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-dark-surface rounded-full p-12 aspect-square flex items-center justify-center">
               <div className="text-center space-y-4">
                  <div className="bg-blue-600/20 p-6 rounded-full inline-block">
                    <Video className="w-24 h-24 text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-medium">Your meeting is safe</h2>
                  <p className="text-gray-400">No one can join a meeting unless invited or admitted by the host</p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;