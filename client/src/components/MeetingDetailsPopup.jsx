import React, { useEffect, useState } from 'react';
import { X, Copy, Check, UserPlus } from 'lucide-react';
import { cn } from '../lib/utils';

const MeetingDetailsPopup = ({ roomId, onClose, isVisible }) => {
  const [copied, setCopied] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const meetingUrl = `${window.location.origin}${window.location.pathname}`;

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        handleClose();
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 500);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(meetingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  if (!isVisible && !isClosing) return null;

  return (
    <div
      className={cn(
        "fixed z-[100] bg-white text-gray-800 rounded-lg shadow-2xl p-6 w-[90%] max-w-[360px] animate-in slide-in-from-bottom-4 md:slide-in-from-left-4 duration-500",
        "bottom-24 left-1/2 -translate-x-1/2 md:bottom-auto md:top-24 md:left-6 md:translate-x-0",
        isClosing && "animate-out fade-out slide-out-to-left-4 duration-500"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-medium text-gray-900">Your meeting's ready</h2>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <button className="w-full bg-accent-purple hover:bg-accent-purpleHover text-white py-2.5 px-4 rounded-full flex items-center justify-center gap-2 mb-6 font-medium transition-colors">
        <UserPlus className="w-5 h-5" />
        Add others
      </button>

      <p className="text-sm text-gray-600 mb-3">
        Or share this meeting link with others you want in the meeting
      </p>

      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md p-3 mb-6">
        <span className="text-sm text-gray-600 truncate flex-1">{meetingUrl}</span>
        <button
          onClick={copyToClipboard}
          className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
          title="Copy link"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
        </button>
      </div>

      {copied && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-full animate-in fade-in slide-in-from-bottom-2">
          Meeting link copied
        </div>
      )}

      <div className="text-sm text-gray-500 border-t border-gray-100 pt-4">
        Meeting code: <span className="font-mono text-gray-700">{roomId}</span>
      </div>
    </div>
  );
};

export default MeetingDetailsPopup;
