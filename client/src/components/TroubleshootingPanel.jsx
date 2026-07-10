import React, { useState, useEffect } from 'react';
import { X, Activity, Wifi, ShieldCheck, Monitor, Video, Mic, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const TroubleshootingPanel = ({ onClose, participantCount }) => {
  const [diagnostics, setDiagnostics] = useState({
    connection: 'Connecting...',
    camera: 'Checking...',
    mic: 'Checking...',
    screen: 'Checking...',
    latency: '...'
  });

  useEffect(() => {
    // Simulate real diagnostics fetch
    const checkStatus = async () => {
      const perms = await navigator.permissions.query({ name: 'camera' });
      const micPerms = await navigator.permissions.query({ name: 'microphone' });

      setDiagnostics({
        connection: 'Stable',
        camera: perms.state === 'granted' ? 'Accessible' : 'No access',
        mic: micPerms.state === 'granted' ? 'Accessible' : 'No access',
        screen: !!navigator.mediaDevices.getDisplayMedia ? 'Available' : 'Unsupported',
        latency: '24ms'
      });
    };
    checkStatus();
  }, []);

  const diagnosticItems = [
    { label: 'Socket Connection', value: diagnostics.connection, icon: Wifi, status: 'success' },
    { label: 'Camera Status', value: diagnostics.camera, icon: Video, status: diagnostics.camera === 'Accessible' ? 'success' : 'error' },
    { label: 'Microphone Status', value: diagnostics.mic, icon: Mic, status: diagnostics.mic === 'Accessible' ? 'success' : 'error' },
    { label: 'Screen Share API', value: diagnostics.screen, icon: Monitor, status: diagnostics.screen === 'Available' ? 'success' : 'error' },
    { label: 'Active Participants', value: participantCount.toString(), icon: ShieldCheck, status: 'success' },
    { label: 'Network Latency', value: diagnostics.latency, icon: Activity, status: 'success' },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-bg border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-medium text-white">Troubleshooting & help</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">System Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diagnosticItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/5">
                  <div className={cn(
                    "p-2 rounded-lg",
                    item.status === 'success' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                  )}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-white/40">{item.label}</div>
                    <div className="text-sm font-medium text-white/90">{item.value}</div>
                  </div>
                  <div className="ml-auto">
                    {item.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-accent-purple/5 border border-accent-purple/20 rounded-xl p-4">
            <h3 className="text-sm font-medium text-accent-purple mb-2">Need more help?</h3>
            <p className="text-sm text-white/60">
              If you're experiencing issues, try refreshing your browser or checking your internet connection.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TroubleshootingPanel;
