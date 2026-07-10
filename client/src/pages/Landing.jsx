import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Video, Keyboard, Plus, Layout, ShieldCheck, Globe } from 'lucide-react';

const Landing = () => {
  const [roomCode, setRoomCode] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleCreateMeeting = () => {
    const id = uuidv4().substring(0, 8);
    navigate(`/${id}`);
  };

  const handleJoinMeeting = (e) => {
    e.preventDefault();
    if (roomCode.trim()) {
      const id = roomCode.split('/').pop();
      navigate(`/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#202124] text-[#e8eaed] flex flex-col font-sans">
      {/* Google-Style Navbar */}
      <header className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
            <Video className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-normal tracking-tight">Meet MVP</span>
        </div>

        <div className="flex items-center gap-6 text-[#9aa0a6] font-medium">
          <div className="hidden sm:flex items-center gap-4">
            <span className="tabular-nums">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span>•</span>
            <span>
              {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">H</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 lg:px-24 py-12 gap-16 max-w-7xl mx-auto w-full overflow-y-auto">
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-left duration-700">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.1] text-white">
            Premium video meetings. <br className="hidden lg:block" /> Now free for everyone.
          </h1>
          <p className="text-[#9aa0a6] text-xl lg:text-2xl font-light max-w-xl leading-relaxed">
            We re-engineered the service we built for secure business meetings to make it free and available for all.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <button
              onClick={handleCreateMeeting}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-md font-medium flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-blue-500/20 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              New meeting
            </button>

            <form onSubmit={handleJoinMeeting} className="w-full sm:w-auto flex items-center gap-3 group">
              <div className="relative flex-1 sm:w-72">
                <Keyboard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9aa0a6] group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Enter a code or link"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="w-full bg-transparent border border-[#5f6368] focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded-md py-3.5 pl-12 pr-4 outline-none transition-all text-lg placeholder-[#9aa0a6]"
                />
              </div>
              <button
                type="submit"
                disabled={!roomCode.trim()}
                className="text-blue-400 font-semibold hover:bg-blue-400/10 px-6 py-3.5 rounded-md transition-all disabled:text-[#5f6368] text-lg"
              >
                Join
              </button>
            </form>
          </div>

          <div className="pt-10 border-t border-white/5 w-full flex flex-wrap justify-center lg:justify-start gap-8 opacity-60">
             <div className="flex items-center gap-2">
               <ShieldCheck className="w-5 h-5" />
               <span className="text-sm">Secure by default</span>
             </div>
             <div className="flex items-center gap-2">
               <Globe className="w-5 h-5" />
               <span className="text-sm">Global connection</span>
             </div>
          </div>
        </div>

        {/* Feature Graphic */}
        <div className="flex-1 w-full max-w-lg animate-in fade-in zoom-in duration-1000 delay-200">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#303134] border-[12px] border-[#202124] shadow-2xl flex flex-col items-center justify-center p-8">
            <div className="bg-blue-600/10 p-8 rounded-full mb-8">
              <Layout className="w-32 h-32 text-blue-500 opacity-80" />
            </div>
            <h3 className="text-2xl font-medium text-white mb-2">Crystal clear grid</h3>
            <p className="text-[#9aa0a6] text-center text-lg px-8">
              See up to 16 people in a beautifully balanced grid layout on any device.
            </p>

            <div className="mt-12 flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#5f6368]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#5f6368]"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
