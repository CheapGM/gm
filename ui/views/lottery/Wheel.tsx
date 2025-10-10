'use client';

import { useMemo } from 'react';

interface WheelProps {
  players: number;
  maxPlayers: number;
  spinning?: boolean;
}

const wheelColors = [
  '#4A90E2', // Blue
  '#F5A623', // Orange
  '#D0021B', // Red
  '#50E3C2', // Cyan
  '#F8E71C', // Yellow
  '#B8E986', // Light Green
  '#8B572A', // Brown
  '#BD10E0', // Purple
  '#E74C3C', // Light Red
  '#9013FE', // Violet
  '#4A4A4A', // Dark Gray
  '#7ED321', // Green
  '#F06292', // Pink
  '#1976D2', // Dark Blue
  '#FFD700', // Gold
  '#FF5722', // Deep Orange
  '#00BCD4', // Light Blue
  '#795548', // Dark Brown
  '#607D8B', // Blue Gray
  '#3F51B5', // Indigo
];

export function Wheel({ players, maxPlayers, spinning = false }: WheelProps) {
  const segments = useMemo(() => {
    return Array.from({ length: maxPlayers }, (_, i) => ({
      id: i,
      filled: i < players,
      color: wheelColors[i % wheelColors.length],
    }));
  }, [players, maxPlayers]);

  return (
    <div className="relative w-[431px] h-[440px] flex items-center justify-center">
      {/* Pointer indicator - Top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
        <div
          className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px]"
          style={{
            borderTopColor: '#4A90E2',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
          }}
        />
      </div>

      {/* Wheel Container */}
      <div className={`relative w-[380px] h-[380px] ${spinning ? 'animate-spin-slow' : ''}`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          style={{
            filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))',
          }}
        >
          {/* Segments */}
          {segments.map((segment, index) => {
            const angle = (360 / maxPlayers) * index - 90;
            const nextAngle = (360 / maxPlayers) * (index + 1) - 90;
            const x1 = 100 + 90 * Math.cos((angle * Math.PI) / 180);
            const y1 = 100 + 90 * Math.sin((angle * Math.PI) / 180);
            const x2 = 100 + 90 * Math.cos((nextAngle * Math.PI) / 180);
            const y2 = 100 + 90 * Math.sin((nextAngle * Math.PI) / 180);
            const largeArc = 360 / maxPlayers > 180 ? 1 : 0;

            return (
              <g key={segment.id}>
                <path
                  d={`M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={segment.color}
                  stroke="#2C3E50"
                  strokeWidth="2"
                  opacity={segment.filled ? 1 : 0.4}
                />
              </g>
            );
          })}

          {/* Outer ring */}
          <circle
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke="#2C3E50"
            strokeWidth="4"
          />

          {/* Center circle - Blue */}
          <circle
            cx="100"
            cy="100"
            r="45"
            fill="#4A90E2"
            stroke="#2C3E50"
            strokeWidth="3"
          />

          {/* Text "gm" */}
          <text
            x="100"
            y="108"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: '48px',
              fontWeight: '700',
              fill: '#FFFFFF',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            gm
          </text>
        </svg>

        {/* Base/Stand */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-24 h-16 bg-gradient-to-b from-[#34495E] to-[#2C3E50] rounded-b-xl"
             style={{
               clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
             }}
        />
      </div>
    </div>
  );
}