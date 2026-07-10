import React, { useState, useEffect } from 'react';
import { X, Mic, Video, Speaker, Check } from 'lucide-react';
import { cn } from '../lib/utils';

const MeetingSettings = ({ onClose }) => {
  const [devices, setDevices] = useState({ audioinput: [], videoinput: [], audiooutput: [] });
  const [selectedDevices, setSelectedDevices] = useState({ mic: '', camera: '', speaker: '' });

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devList = await navigator.mediaDevices.enumerateDevices();
        const categorized = {
          audioinput: devList.filter(d => d.kind === 'audioinput'),
          videoinput: devList.filter(d => d.kind === 'videoinput'),
          audiooutput: devList.filter(d => d.kind === 'audiooutput'),
        };
        setDevices(categorized);

        // Pick currently active if possible, else first available
        setSelectedDevices({
          mic: categorized.audioinput[0]?.deviceId || '',
          camera: categorized.videoinput[0]?.deviceId || '',
          speaker: categorized.audiooutput[0]?.deviceId || '',
        });
      } catch (err) {
        console.error('Error listing devices:', err);
      }
    };
    getDevices();
  }, []);

  const handleDeviceChange = (type, deviceId) => {
    setSelectedDevices(prev => ({ ...prev, [type]: deviceId }));
    // In a real app, we would trigger track replacement here
    console.log(`Switched ${type} to ${deviceId}`);
  };

  const sections = [
    { id: 'mic', label: 'Microphone', icon: Mic, type: 'audioinput' },
    { id: 'camera', label: 'Camera', icon: Video, type: 'videoinput' },
    { id: 'speaker', label: 'Speakers', icon: Speaker, type: 'audiooutput' },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-bg border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-medium text-white">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
          {sections.map((section) => (
            <div key={section.id} className="space-y-4">
              <div className="flex items-center gap-2 text-white/60 font-medium text-sm">
                <section.icon className="w-4 h-4" />
                <span>{section.label}</span>
              </div>

              <div className="space-y-2">
                {devices[section.type].map((device) => (
                  <button
                    key={device.deviceId}
                    onClick={() => handleDeviceChange(section.id, device.deviceId)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-lg transition-all text-left group",
                      selectedDevices[section.id] === device.deviceId
                        ? "bg-accent-purple/10 text-accent-purple"
                        : "hover:bg-white/5 text-white/80"
                    )}
                  >
                    <span className="text-sm truncate mr-4">{device.label || `${section.label} ${device.deviceId.slice(0, 4)}`}</span>
                    {selectedDevices[section.id] === device.deviceId && (
                      <Check className="w-4 h-4 shrink-0" />
                    )}
                  </button>
                ))}
                {devices[section.type].length === 0 && (
                  <div className="text-xs text-white/40 italic px-3">No devices found</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 bg-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="bg-accent-purple hover:bg-accent-purpleHover text-white px-6 py-2 rounded-full font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingSettings;
