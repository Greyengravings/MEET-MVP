import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Video, Keyboard, Plus, ShieldCheck, Globe, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

const BytesMeetLogo = ({ className }) => (
  <div className={cn("flex items-center gap-1 font-bold text-2xl tracking-tighter select-none", className)}>
    <span className="text-white">BYTES</span>
    <span className="text-accent-purple">MEET</span>
  </div>
);

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
      const id = roomCode.split('/').pop();
      navigate(`/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-x-hidden">
      {/* Navbar */}
      <header className="h-16 px-5 md:px-12 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <BytesMeetLogo className="md:text-2xl text-xl" />
        <div className="hidden md:flex items-center gap-6 text-white/50 text-sm font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure video meetings</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-5 lg:px-24 py-8 lg:py-0 gap-10 lg:gap-16 max-w-7xl mx-auto w-full">
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-left duration-700">
          <div className="space-y-3 lg:space-y-4">
            <h1 className="text-[clamp(40px,10vw,72px)] font-bold leading-[1.0] tracking-tight">
              Meet. Connect.<br />Collaborate.
            </h1>
            <p className="text-white/50 text-lg lg:text-xl font-light max-w-lg leading-relaxed">
              Simple video meetings built for seamless conversations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md lg:max-w-none">
            <button
              onClick={handleCreateMeeting}
              className="w-full sm:w-auto bg-accent-purple hover:bg-accent-purpleHover text-white px-8 h-[56px] rounded-xl font-semibold flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              New meeting
            </button>

            <form onSubmit={handleJoinMeeting} className="w-full sm:w-auto flex items-center gap-2 group">
              <div className="relative flex-1 sm:w-64">
                <Keyboard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-accent-purple transition-colors" />
                <input
                  type="text"
                  placeholder="Enter meeting code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="w-full h-[56px] bg-white/5 border border-white/10 focus:border-accent-purple focus:ring-1 focus:ring-accent-purple rounded-xl pl-12 pr-4 outline-none transition-all text-lg placeholder-white/20"
                />
              </div>
              <button
                type="submit"
                disabled={!roomCode.trim()}
                className="bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white w-[56px] h-[56px] rounded-xl transition-all border border-white/10 flex items-center justify-center shrink-0"
                aria-label="Join meeting"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </form>
          </div>

          <div className="hidden lg:flex pt-8 border-t border-white/5 w-full flex-wrap justify-center lg:justify-start gap-8 opacity-40">
             <div className="flex items-center gap-2 text-sm">
               <Globe className="w-4 h-4" />
               <span>Available everywhere</span>
             </div>
             <div className="flex items-center gap-2 text-sm text-accent-purple">
               <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
               <span className="font-medium">Simple. Fast. Connected.</span>
             </div>
          </div>

          <div className="lg:hidden text-xs font-medium text-accent-purple opacity-40 tracking-widest uppercase">
            Simple. Fast. Connected.
          </div>
        </div>

        {/* Abstract Preview Card */}
        <div className="w-full max-w-[400px] lg:max-w-md animate-in fade-in zoom-in duration-1000 delay-200 lg:block">
          <div className="relative aspect-[16/10] lg:aspect-[4/3] rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl p-5 flex flex-col gap-3">
             {/* Header UI Mockup */}
             <div className="flex items-center justify-between opacity-10">
               <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-white" />
                 <div className="w-2.5 h-2.5 rounded-full bg-white" />
               </div>
               <div className="w-12 h-2.5 rounded-full bg-white" />
             </div>

             {/* Participants Grid Mockup */}
             <div className="flex-1 grid grid-cols-2 gap-2">
                {[
                  { name: 'HN', color: 'bg-accent-purple' },
                  { name: 'AS', color: 'bg-white/10' },
                  { name: 'RK', color: 'bg-white/5' },
                  { name: '+3', color: 'bg-black' }
                ].map((p, i) => (
                  <div key={i} className={cn("rounded-lg flex items-center justify-center border border-white/5 relative overflow-hidden", p.color)}>
                     <span className="text-lg font-bold opacity-30">{p.name}</span>
                  </div>
                ))}
             </div>

             {/* Controls UI Mockup */}
             <div className="flex justify-center gap-2 opacity-10">
                <div className="w-6 h-6 rounded-full bg-white" />
                <div className="w-6 h-6 rounded-full bg-white" />
                <div className="w-6 h-6 rounded-full bg-red-500" />
             </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 text-center border-t border-white/5">
        <div className="flex flex-col items-center gap-2 opacity-30 text-xs tracking-widest uppercase font-medium">
          <BytesMeetLogo className="scale-75 origin-center opacity-100" />
          <span>Simple. Fast. Connected.</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
