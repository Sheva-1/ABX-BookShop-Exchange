import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  whiteText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  whiteText = false,
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  }[size];

  const titleSize = {
    sm: 'text-xl leading-none',
    md: 'text-2xl leading-none',
    lg: 'text-4xl leading-none',
  }[size];

  const subtitleSize = {
    sm: 'text-[9px] tracking-wide',
    md: 'text-[11px] tracking-wider',
    lg: 'text-sm tracking-widest',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Emblem SVG mimicking the official ABX Tree, River & Mountain emblem */}
      <div className={`relative ${iconDimensions} rounded-xl overflow-hidden flex-shrink-0 bg-white p-[1.5px] border border-slate-200`}>
        <div className="w-full h-full rounded-[10px] bg-white relative flex items-center justify-center overflow-hidden">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background Mountains */}
            <path
              d="M15 72 L36 44 L48 58 L68 38 L88 72 Z"
              fill="#2C384E"
            />
            <path
              d="M36 44 L48 58 L42 72 L22 72 Z"
              fill="#1C2434"
            />
            <path
              d="M68 38 L88 72 L72 72 L62 55 Z"
              fill="#4A5568"
            />

            {/* River Flow (Teal #2B8A88) flowing from tree heart down to foreground */}
            <path
              d="M48 48 C46 54 56 60 52 68 C49 74 38 78 40 92 L60 92 C58 80 66 72 61 64 C56 56 52 52 50 48 Z"
              fill="#2B8A88"
            />
            <path
              d="M50 50 C48 55 54 62 50 70 C47 76 43 82 45 92"
              stroke="#A7F3D0"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Tree Foliage (Green #2E7D47) */}
            <g fill="#2E7D47">
              {/* Canopy Clusters */}
              <circle cx="50" cy="24" r="16" fill="#2E7D47" />
              <circle cx="36" cy="30" r="13" fill="#27693C" />
              <circle cx="64" cy="30" r="13" fill="#358B50" />
              <circle cx="28" cy="40" r="10" fill="#2E7D47" />
              <circle cx="72" cy="40" r="10" fill="#27693C" />
              
              {/* Leaf Highlights */}
              <circle cx="48" cy="18" r="5" fill="#4ADE80" opacity="0.6" />
              <circle cx="38" cy="24" r="4" fill="#86EFAC" opacity="0.5" />
              <circle cx="60" cy="24" r="4.5" fill="#86EFAC" opacity="0.5" />
            </g>

            {/* Tree Trunk & Roots */}
            <path
              d="M47 36 C47 44 45 49 46 56 C46 62 44 68 34 76"
              stroke="#1C2434"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M53 36 C53 44 55 49 54 56 C54 62 58 70 66 76"
              stroke="#1C2434"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M50 54 L50 68"
              stroke="#1C2434"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Brand Name Typography */}
      <div className="flex flex-col">
        <span
          className={`font-extrabold tracking-tight font-sans ${
            whiteText ? 'text-white' : 'text-[#1C2434]'
          } ${titleSize}`}
        >
          ABX
        </span>
        {showSubtitle && (
          <span
            className={`font-semibold uppercase tracking-wider font-sans -mt-0.5 ${
              whiteText ? 'text-emerald-300' : 'text-[#1C2434]/80'
            } ${subtitleSize}`}
          >
            BookShop Exchange
          </span>
        )}
      </div>
    </div>
  );
};
