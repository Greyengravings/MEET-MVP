import React, { useMemo, useEffect, useState, useRef } from 'react';
import VideoTile from './VideoTile';
import { cn } from '../lib/utils';

const VideoGrid = ({ participants, localUser, sidebarOpen, layout = 'auto' }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [sidebarOpen]);

  const allParticipants = useMemo(() => {
    const list = [{ ...localUser, isLocal: true, socketId: 'local' }, ...participants];
    // If layout is spotlight, find the one sharing screen or most recent speaker (simulated here)
    if (layout === 'spotlight') {
      const screenShare = list.find(p => p.isScreenSharing);
      if (screenShare) return [screenShare];
      return [list[0]]; // Default to local for now
    }
    return list;
  }, [localUser, participants, layout]);

  const count = allParticipants.length;

  const gridLayout = useMemo(() => {
    if (count === 0) return { cols: 1, rows: 1, tileWidth: 0, tileHeight: 0 };

    const { width, height } = dimensions;
    if (width === 0 || height === 0) return { cols: 1, rows: 1, tileWidth: 0, tileHeight: 0 };

    const aspectRatio = 16 / 9;
    const gap = 16;
    let bestLayout = { cols: 1, rows: count, tileWidth: 0, tileHeight: 0, area: 0 };

    // Intelligent layout calculation
    for (let cols = 1; cols <= count; cols++) {
      const rows = Math.ceil(count / cols);

      const availableWidth = width - (cols + 1) * gap;
      const availableHeight = height - (rows + 1) * gap;

      const maxWidth = availableWidth / cols;
      const maxHeight = availableHeight / rows;

      let tileWidth, tileHeight;

      if (maxWidth / aspectRatio <= maxHeight) {
        tileWidth = maxWidth;
        tileHeight = maxWidth / aspectRatio;
      } else {
        tileHeight = maxHeight;
        tileWidth = maxHeight * aspectRatio;
      }

      const area = tileWidth * tileHeight;

      if (area > bestLayout.area) {
        bestLayout = { cols, rows, tileWidth, tileHeight, area };
      }
    }

    return bestLayout;
  }, [count, dimensions]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center overflow-hidden bg-black"
    >
      <div
        className="flex flex-wrap items-center justify-center gap-4 transition-all duration-500 ease-in-out"
        style={{
          width: gridLayout.cols * gridLayout.tileWidth + (gridLayout.cols - 1) * 16,
          height: gridLayout.rows * gridLayout.tileHeight + (gridLayout.rows - 1) * 16,
        }}
      >
        {allParticipants.map((p) => (
          <div
            key={p.socketId}
            className="transition-all duration-500 ease-in-out overflow-hidden rounded-xl bg-dark-surface border border-white/5"
            style={{
              width: gridLayout.tileWidth,
              height: gridLayout.tileHeight,
            }}
          >
             <VideoTile
               stream={p.stream || (p.isLocal ? p.localStream : null)}
               name={p.name}
               isLocal={p.isLocal}
               isMuted={p.isLocal ? !p.isMicOn : !p.isMicOn}
               isCamOff={p.isLocal ? !p.isCamOn : !p.isCamOn}
               isHandRaised={p.isHandRaised}
             />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;
