import React from 'react'
import { Flame, Coffee, Star, Shield } from 'lucide-react';


const MilestoneItem = ({ number, weeks, reward, progressPercent, icon: Icon, iconColor, progressColor }) => {
  return (
    <div className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
      <div className="w-8 text-center text-sm text-gray-500 hidden sm:block">{number}</div>
      <div className="w-10 flex-shrink-0 flex justify-center">
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="w-1/4 text-sm font-medium text-gray-800 ml-4">{weeks} Weeks</div>
      <div className="flex-1 px-4">
        <div className="h-2 rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full ${progressColor}`}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
      <div className="w-32 flex-shrink-0 text-right">
        <span
          className={`inline-flex items-center px-2 py-1 text-xs font-thin rounded-full ${
            reward.includes('unlocked') ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {reward}
        </span>
      </div>
    </div>
  );
};

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
    <div className="group flex flex-col items-center p-4 rounded-2xl cursor-pointer
  transition-all duration-300 hover:scale-[1.04] hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-200">
      <div className="relative w-32 h-32 mb-4 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-[1.05]">
        <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
          <div className="shine absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"></div>
        </div>
        <div
          className="
            w-full h-full rounded-full p-[6px]
            flex items-center justify-center relative rotate-45
          "
          style={{ backgroundImage: conicGradient }}
        >

          <div className="w-full h-full -rotate-45 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <p className='text-[#6955A5] font-semibold'>4 week</p>
          </div>
        </div>

      </div>
    </div>
  );
};




const Streaks = () => {

     const currentStreakWeeks = 4;
  const milestones = [
    { number: 1, weeks: 3, reward: 'Coffee unlocked', progressPercent: 100, icon: Coffee, iconColor: 'text-blue-500', progressColor: 'bg-blue-400' },
    { number: 2, weeks: 6, reward: 'Bonus points next', progressPercent: 66, icon: Star, iconColor: 'text-yellow-500', progressColor: 'bg-yellow-400' },
    { number: 3, weeks: 10, reward: 'Premium reward', progressPercent: 40, icon: Shield, iconColor: 'text-purple-500', progressColor: 'bg-purple-400' },
  ];


    const activeQuarters = Math.min(4, Math.floor(currentStreakWeeks / 2.5));



  return (
    <div className="min-h-screen ml-60 mt-14 bg-gray-50 px-8 py-4 font-[Poppins]">
      <div className="">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#6955A5] flex items-center">
                        <Flame className="w-6 h-6 text-yellow-400 fill-yellow-400 mr-2" />
            Streaks
          </h1>
          <button
          onClick={()=>navigate('/write-card')}
              className="mt-4 px-6 py-2 bg-[#7f63e6]  cursor-pointer text-white text-sm font-medium rounded-4xl hover:bg-violet-700 hover:scale-[1.02] transition duration-150 shadow-lg ">
               Write Card
            </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Your Streaks Card */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md h-full">
            <h2 className="text-lg font-semibold text-[#05004E] mb-2">
              Your Streaks: <span>{currentStreakWeeks} weeks</span>
            </h2>

            <div className="flex flex-col items-center justify-center">
              <RewardBadge 
                name="Streak Reward"
                rewardImage="/your-reward-image.png"
                points={currentStreakWeeks}
                activeQuarters={activeQuarters}
              />

              <p className="mt-2 text-sm text-gray-600">
                You're doing amazing – keep it going!
              </p>
            </div>
          </div>

          {/* Milestones Card (Takes 2/3 width on large screens) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Milestones</h2>
            
            <div className="hidden sm:flex text-sm font-medium text-gray-500 border-b border-gray-200 pb-2 mb-2">
              <div className="w-8 text-center">#</div>
              <div className="w-10"></div>
              <div className="w-1/4 ml-4">Weeks</div>
              <div className="flex-1 px-4">Progress</div>
              <div className="w-32 text-right">Rewards</div>
            </div>

            <div className="">
              {milestones.map((m, index) => (
                <MilestoneItem key={index} {...m} />
              ))}
            </div>
          </div>

          {/* Your Stats Card (Below Streaks card on large screens, spanning 1 column) */}
          <div className="lg:col-span-1 bg-white px-6 py-8 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Stats</h2>
            
            <ul className="list-disc ml-5 space-y-2 text-gray-700">
              <li className="text-sm">
                <span className="font-semibold text-[#6955A5]">Cards sent:</span> 12
              </li>
              <li className="text-sm">
                <span className="font-semibold text-[#6955A5]">Best streak:</span> 6 weeks
              </li>
              <li className="text-sm">
                <span className="font-semibold text-[#6955A5]">Rewards used:</span> 3
              </li>
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Streaks