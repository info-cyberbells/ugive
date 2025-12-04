import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CircularProgress = ({ percent }) => {
  const radius = 80;

  const trackStrokeWidth = 8;
  const borderStrokeWidth = 2;

  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;


  const trackColor = '#fafbfa';
  const progressStrokeColor = '#EBB142';
  const borderStrokeColor = '#EBB142';

  const innerBorderRadius = radius - (trackStrokeWidth / 2) - (borderStrokeWidth / 2);
  const outerBorderRadius = radius + (trackStrokeWidth / 2) + (borderStrokeWidth / 2);

  return (
    <div className="relative w-60 h-60 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">

        <circle
          cx="100"
          cy="100"
          r={radius - (trackStrokeWidth / 8) - borderStrokeWidth - 5}
          fill="#fafbfc"
          stroke="none"
        />

        <circle
          cx="100"
          cy="100"
          r={innerBorderRadius}
          fill="none"
          stroke={borderStrokeColor}
          strokeWidth={borderStrokeWidth}
        />

        <circle
          cx="100"
          cy="100"
          r={outerBorderRadius}
          fill="none"
          stroke={borderStrokeColor}
          strokeWidth={borderStrokeWidth}
        />

        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={trackStrokeWidth}
          strokeLinecap="round"
        />

        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={progressStrokeColor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>

      <div className={`absolute top-0 left-0 flex items-center justify-center w-full h-full text-[#EBB142]`}>
        <span className="text-6xl font-bold font-inter ">
          {percent}%
        </span>
      </div>
    </div>
  );
};



const LetsGo = () => {

  const [rewardPercent, setRewardPercent] = useState(0);

  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setTimeout(() => setRewardPercent(20), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen ml-60 mt-14 bg-gray-50 p-8">
      <div className="w-full max-w-4xl rounded-2xl ">

        <div className="mb-2 text-indigo-800">
          <button
            onClick={() => navigate(-1)}
            className="p-2 mr-4 rounded-full cursor-pointer hover:bg-indigo-50 transition transform hover:scale-[1.10] duration-150"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-center justify-center text-center">

          <h1 className="text-2xl font-semibold mb-6 max-w-md leading-relaxed">
            Send 4 more cards to receive a free <span className="font-semibold text-[#E18925]">coffee.</span>
          </h1>

          <div className="mb-12">
            <CircularProgress percent={rewardPercent} />
          </div>

          <button
            onClick={() => navigate('/write-card')}
            className="py-3 px-10 rounded-full cursor-pointer border-3 border-white text-white font-medium  shadow-xl transition transform hover:scale-[1.02] active:scale-[0.98]
                       bg-[#E9B243]
                       hover:bg-[#daa232]
                       focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-opacity-50"
          >
            Start Writing
          </button>

        </div>
      </div>
    </div>
  );
};

export default LetsGo;