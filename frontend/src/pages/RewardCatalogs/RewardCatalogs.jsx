import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentRewards } from '../../features/studentRewardsSlice';

const RewardBadge = ({ name, rewardImage, points, activeQuarters }) => {
  const ICON_SIZE = 'text-5xl';

  const activeColor = '#fbbf24';
  const inactiveColor = '#f59e0b20';
  const gapColor = '#ffffff';


  const segmentSize = 86;
  const gapSize = 4;

  const gradientStops = [
    // Quarter 1 (0 to 90 deg) - Top Right
    `${activeQuarters >= 4 ? activeColor : inactiveColor} 0deg ${segmentSize}deg`,
    `${gapColor} ${segmentSize}deg ${segmentSize + gapSize}deg`, // Gap

    // Quarter 2 (90 to 180 deg) - Bottom Right
    `${activeQuarters >= 1 ? activeColor : inactiveColor} ${90 + gapSize}deg ${90 + segmentSize}deg`,
    `${gapColor} ${90 + segmentSize}deg ${90 + segmentSize + gapSize}deg`, // Gap

    // Quarter 3 (180 to 270 deg) - Bottom Left
    `${activeQuarters >= 2 ? activeColor : inactiveColor} ${180 + gapSize}deg ${180 + segmentSize}deg`,
    `${gapColor} ${180 + segmentSize}deg ${180 + segmentSize + gapSize}deg`, // Gap

    // Quarter 4 (270 to 360 deg) - Top Left
    `${activeQuarters >= 3 ? activeColor : inactiveColor} ${270 + gapSize}deg ${270 + segmentSize}deg`,
    `${gapColor} ${270 + segmentSize}deg 360deg`, // Gap
  ].join(', ');

  const conicGradient = `conic-gradient(${gradientStops})`;

  return (
    <div className="flex flex-col items-center p-4">
      <div className="relative w-32 h-32 mb-4">


        <div
          className="
            w-full h-full rounded-full p-[6px]
            flex items-center justify-center relative rotate-45
          "
          style={{ backgroundImage: conicGradient }}
        >

          <div className="w-full h-full -rotate-45 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <img
              src={rewardImage}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>


        <div className="absolute bottom-0 left-3/4 transform -translate-x-1/4 translate-y-1/8">
          <svg
            className="w-12 h-12 "
            viewBox="0 0 51 48"
            fill="gold"
            xmlns="http://www.w3.org/2000/svg"
          >

            <path d="M25.5 1.5L33.7 17.5L50.5 18.5L37.1 30.7L41.3 47.5L25.5 38.3L9.7 47.5L13.9 30.7L0.5 18.5L17.3 17.5L25.5 1.5Z" />

            <text
              x="25.5"
              y="32"
              fill="#ffffff"
              fontSize="18"
              fontWeight="bold"
              textAnchor="middle"
              className="font-sans"
            >
              {points}
            </text>
          </svg>
        </div>
      </div>

      {/* Reward Name */}
      <p className="text-lg font-semibold text-[#6955A5] tracking-wide">
        {name}
      </p>
    </div>
  );
};


const RewardCatalogs = () => {
  const dispatch = useDispatch();
  const { rewards, isLoading } = useSelector((state) => state.studentReward);

  useEffect(() => {
    dispatch(getStudentRewards());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen ml-60 font-[Poppins] mt-14 bg-gray-50 p-4">
        <h1 className="text-2xl font-medium text-purple-700 mb-10">
          Rewards Catalogue
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl w-full p-6 rounded-3xl">
          {[1].map((i) => (
            <div key={i} className="flex flex-col items-center p-4 animate-pulse">
              <div className="relative w-32 h-32 mb-4">
                <div className="w-full h-full rounded-full bg-gray-300"></div>
                <div className="absolute bottom-0 left-3/4 transform -translate-x-1/4 translate-y-1/8">
                  <div className="w-12 h-12 bg-gray-400 rounded-full"></div>
                </div>
              </div>
              <div className="h-6 w-20 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (rewards.length === 0) {
    return (
      <div className="min-h-screen ml-60 font-[Poppins] mt-14 bg-gray-50 p-4">
        <h1 className="text-2xl font-medium text-purple-700 mb-10">
          Rewards Catalogue
        </h1>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl text-gray-600">No rewards found</p>
          <p className="text-gray-500 mt-2">Check back later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-60 font-[Poppins] mt-14 bg-gray-50 p-4">
      <h1 className="text-2xl font-medium text-purple-700 mb-10">
        Rewards Catalogue
      </h1>

      <div className="
        grid grid-cols-2 md:grid-cols-4 gap-8
        max-w-4xl w-full p-6 rounded-3xl
      ">
        {rewards.map((reward) => (
          <RewardBadge
            key={reward._id}
            name={reward.name}
            rewardImage={reward.rewardImage}
            points={reward.totalPoints}
            activeQuarters={Math.floor((reward.completedPoints / reward.totalPoints) * 4)}
          />
        ))}
      </div>


    </div>
  );
};

export default RewardCatalogs;