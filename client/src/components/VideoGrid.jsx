import React, { useMemo, useEffect, useState, useRef } from 'react';
import VideoTile from './VideoTile';
import { cn } from '../lib/utils';

const VideoGrid = ({ participants, localUser, sidebarOpen, layout = 'auto' }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const frameRef = useRef(null);

  useEffect(() => {
    const updateDimensions = (entries) => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        if (!entries || !entries.length) return;
        const entry = entries[entries.length - 1];
        const newWidth = Math.floor(entry.contentRect.width);
        const newHeight = Math.floor(entry.contentRect.height);

        setDimensions(prev => {
          if (Math.abs(prev.width - newWidth) < 2 && Math.abs(prev.height - newHeight) < 2) {
            return prev;
          }
          return { width: newWidth, height: newHeight };
        });
      });
    };

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

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

    const isMobilePortrait = width < 600 && height > width;
    const allowedRatios = isMobilePortrait ? [16 / 9, 4 / 3] : [16 / 9];
    let bestLayoutOverall = { area: -1 };

    allowedRatios.forEach(aspectRatio => {
      const gap = 12;
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

        const area = tileWidth * tileHeight * count;

        if (area > bestLayoutOverall.area) {
          bestLayoutOverall = { cols, rows, tileWidth, tileHeight, area, aspectRatio };
        }
      }
    });

    return bestLayoutOverall;
  }, [count, dimensions]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center overflow-hidden bg-black p-3"
    >
      <div
        className="flex flex-wrap items-center justify-center gap-3"
        style={{
          width: gridLayout.cols * gridLayout.tileWidth + (gridLayout.cols - 1) * 12,
          height: gridLayout.rows * gridLayout.tileHeight + (gridLayout.rows - 1) * 12,
        }}
      >
        {allParticipants.map((p) => (
          <div
            key={p.socketId}
            className="overflow-hidden rounded-2xl bg-dark-surface border border-white/5 transition-[transform,opacity] duration-200"
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
