import React, { useEffect, useRef } from 'react';
import {
  Monitor, Maximize, Minimize, PictureInPicture,
  MessageSquare, Wrench, Shield, AlertCircle, HelpCircle,
  Settings, X, Users, Hand, ScreenShare
} from 'lucide-react';
import { cn } from '../lib/utils';

const MobileMoreSheet = ({
  onClose,
  onAction,
  activeStates = {}
}) => {
  const sheetRef = useRef(null);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const menuItems = [
    { id: 'screen-share', icon: ScreenShare, label: activeStates.screen ? 'Stop presenting' : 'Share screen', active: activeStates.screen },
    { id: 'raise-hand', icon: Hand, label: activeStates.hand ? 'Lower hand' : 'Raise hand', active: activeStates.hand },
    { id: 'people', icon: Users, label: 'Participants' },
    { id: 'chat', icon: MessageSquare, label: 'In-call messages' },
    { id: 'adjust-view', icon: Monitor, label: 'Adjust view' },
    { id: 'fullscreen', icon: activeStates.fullscreen ? Minimize : Maximize, label: activeStates.fullscreen ? 'Exit full screen' : 'Full screen' },
    { id: 'pip', icon: PictureInPicture, label: 'Open picture-in-picture' },
    { id: 'tools', icon: Wrench, label: 'Meeting tools', comingSoon: true },
    { id: 'host-controls', icon: Shield, label: 'Host controls', comingSoon: true },
    { id: 'report', icon: AlertCircle, label: 'Report a problem', comingSoon: true },
    { id: 'troubleshoot', icon: HelpCircle, label: 'Troubleshooting & help' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-dark-bg border-t border-white/10 rounded-t-[32px] max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300 ease-out",
          "pb-[env(safe-area-inset-bottom)]"
        )}
      >
        {/* Handle */}
        <div className="w-full flex justify-center py-4">
          <div className="w-12 h-1.5 bg-white/20 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-6 pb-4 border-b border-white/5">
          <h2 className="text-xl font-bold">More options</h2>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-2">
          <div className="grid grid-cols-1 gap-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.comingSoon) {
                    onAction('coming-soon', item.label);
                  } else {
                    onAction(item.id);
                  }
                  onClose();
                }}
                className={cn(
                  "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all text-left group active:bg-white/10",
                  item.active ? "bg-accent-purple/10 text-accent-purple" : "text-white"
                )}
              >
                <div className="flex items-center gap-5">
                  <item.icon className={cn(
                    "w-6 h-6 transition-colors",
                    item.active ? "text-accent-purple" : "text-white/60"
                  )} />
                  <span className="font-medium text-[16px]">{item.label}</span>
                </div>
                {item.comingSoon && (
                  <span className="text-[10px] bg-white/5 text-white/40 px-3 py-1 rounded-full uppercase tracking-widest font-bold">
                    Soon
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMoreSheet;
