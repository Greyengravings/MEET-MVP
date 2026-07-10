import React from 'react';
import { X, Grid, Layout, Square } from 'lucide-react';
import { cn } from '../lib/utils';

const AdjustViewPanel = ({ onClose, currentLayout, onLayoutChange }) => {
  const layouts = [
    { id: 'auto', icon: Grid, label: 'Auto', description: 'Let Meet choose the best layout for you' },
    { id: 'tiled', icon: Layout, label: 'Tiled', description: 'See all participants in a grid' },
    { id: 'spotlight', icon: Square, label: 'Spotlight', description: 'The active speaker or shared screen fills the window' },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-bg border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-lg font-medium">Change layout</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {layouts.map((layout) => (
            <button
              key={layout.id}
              onClick={() => onLayoutChange(layout.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left group border border-transparent",
                currentLayout === layout.id
                  ? "bg-accent-purple/10 border-accent-purple text-accent-purple"
                  : "hover:bg-white/5 text-white"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                currentLayout === layout.id ? "bg-accent-purple text-white" : "bg-white/5 group-hover:bg-white/10"
              )}>
                <layout.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{layout.label}</div>
                <div className="text-xs opacity-60">{layout.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdjustViewPanel;
