import React, { useEffect, useState } from 'react';
import { Hand, MessageSquare, X } from 'lucide-react';
import { cn } from '../lib/utils';

const NotificationItem = ({ notification }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={cn(
      "max-w-xs bg-white rounded-lg shadow-xl p-4 flex items-start gap-3 transition-all duration-500 ease-in-out pointer-events-auto border border-gray-100",
      isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
    )}>
      <div className={cn(
        "p-2 rounded-full",
        notification.type === 'hand-raise' ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
      )}>
        {notification.type === 'hand-raise' ? <Hand className="w-5 h-5 fill-current" /> : <MessageSquare className="w-5 h-5" />}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {notification.name}
        </p>
        <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
          {notification.type === 'hand-raise' ? "is raising hand ✋" : notification.text}
        </p>
      </div>
    </div>
  );
};

const MeetingNotification = ({ notifications }) => {
  return (
    <div className="fixed bottom-24 left-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </div>
  );
};

export default MeetingNotification;
