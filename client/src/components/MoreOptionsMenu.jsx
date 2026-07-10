import React, { useEffect, useRef } from 'react';
import {
  Monitor, Maximize, Minimize, PictureInPicture,
  MessageSquare, Wrench, Shield, AlertCircle, HelpCircle,
  Settings, X
} from 'lucide-react';
import { cn } from '../lib/utils';

const MoreOptionsMenu = ({
  onClose,
  onAction,
  activeActions = {} // { fullscreen: true, pip: false, ... }
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const menuItems = [
    { id: 'adjust-view', icon: Monitor, label: 'Adjust view' },
    { id: 'fullscreen', icon: activeActions.fullscreen ? Minimize : Maximize, label: activeActions.fullscreen ? 'Exit full screen' : 'Full screen' },
    { id: 'pip', icon: PictureInPicture, label: 'Open picture-in-picture' },
    { id: 'chat', icon: MessageSquare, label: 'In-call messages' },
    { id: 'tools', icon: Wrench, label: 'Meeting tools' },
    { id: 'host-controls', icon: Shield, label: 'Host controls' },
    { id: 'report', icon: AlertCircle, label: 'Report a problem' },
    { id: 'troubleshoot', icon: HelpCircle, label: 'Troubleshooting & help' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div
      ref={menuRef}
      className={cn(
        "absolute bottom-24 right-4 md:right-auto md:left-1/2 md:-translate-x-1/2 lg:left-auto lg:right-6",
        "bg-dark-bg border border-white/10 rounded-xl shadow-2xl py-2 w-72 z-[100] animate-in slide-in-from-bottom-2 duration-200"
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 md:hidden">
        <span className="text-sm font-medium text-white/60">More options</span>
        <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="max-h-[70vh] overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onAction(item.id);
              if (item.id !== 'fullscreen') onClose();
            }}
            className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors text-white text-sm text-left group"
          >
            <item.icon className="w-5 h-5 text-white group-hover:text-accent-purple transition-colors" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoreOptionsMenu;
