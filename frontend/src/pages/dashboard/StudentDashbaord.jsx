import React, { useState } from "react";
import { Award, User, Zap, Star, MessageSquare } from "lucide-react";
import {
  Heart,
  UserCheck,
  Trash2,
  Share2,
  UserPlus,
  Bell,
  Gift,
} from "lucide-react";
import card from "/card.svg"
import { useNavigate } from "react-router-dom";



const pointsData = [
  { icon: Award, title: "Appreciation Points", value: 99 , color: "text-[#6955A5]"},
  { icon: Star, title: "Redeemable Points", value: 99, color: "text-yellow-500" },
  { icon: User, title: "Friend/Referral Points", value: 99, color:"text-[#71ADE2]" },
  { icon: Zap, title: "Streak Days", value: 99, color: "text-red-300" },
];

const goalData = [
  { id: 1, reward: "Pizza", progress: 45, color: "bg-[#6955A5]" },
  { id: 2, reward: "Coffee", progress: 29, color: "bg-[#F3B11C]" },
  { id: 3, reward: "Chocolate", progress: 78, color: "bg-[#6955A5]" },
];

const MetricCard = ({ icon: Icon, title, value, color }) => (
  <div className="p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300">
    <div className="flex space-x-3">
      <div className={`p-2 rounded-lg bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-xl font-semibold text-gray-800 ">{value}</p>
      </div>
    </div>
  </div>
);

const CircularProgress = ({ percent }) => {
  const radius = 80;

  const trackStrokeWidth = 8; 
  const borderStrokeWidth = 2;
  
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;


  const trackColor = '#ffffff'; 
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
          fill="#ffffff"
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
        <span className="text-5xl font-bold font-inter ">
          {percent}%
        </span>
      </div>
    </div>
  );
};

const GoalRow = ({ index, reward, progress, color }) => {
  const baseColor = color.replace("bg-", "").replace("[", "").replace("]", "");

  return (
    <div className="flex px-6 items-center py-3 border-b last:border-b-0">
      <div className="w-1/12 text-sm text-gray-500 font-semibold">{index}</div>
      <div className="w-3/12 text-sm font-medium text-gray-700">{reward}</div>
      <div className="w-7/12 px-4">
        <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className={`h-full rounded-full ${color}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div
        className={`w-1/12 text-sm  rounded-lg text-center border text-[${baseColor}] border-[${baseColor}]`}
      >
        {progress}
      </div>
    </div>
  );
};

const notificationsData = [
  {
    id: 1,
    icon: Star,
    title: "Streak continued",
    desc: "+2 points added to your streak",
    time: "2 hours ago",
  },
  {
    id: 2,
    icon: UserPlus,
    title: "New user registered",
    desc: "A new user joined the platform",
    time: "5 hours ago",
  },
  {
    id: 3,
    icon: Bell,
    title: "New subscriber",
    desc: "Andi Lane subscribed to you",
    time: "1 day ago",
  },
  {
    id: 4,
    icon: Award,
    title: "Reward unlocked",
    desc: "You unlocked Gold Badge level",
    time: "3 days ago",
  },
  {
    id: 5,
    icon: Gift,
    title: "Daily bonus received",
    desc: "You earned +10 daily reward points",
    time: "1 week ago",
  },
];

const activitiesData = [
  {
    id: 1,
    icon: Heart,
    title: "Photo liked",
    desc: "John Doe liked your photo",
    time: "10 mins ago",
  },
  {
    id: 2,
    icon: UserCheck,
    title: "Friend request",
    desc: "Emily sent you a friend request",
    time: "30 mins ago",
  },
  {
    id: 3,
    icon: MessageSquare,
    title: "New comment",
    desc: "Michael commented on your post",
    time: "1 hour ago",
  },
  {
    id: 4,
    icon: Share2,
    title: "Post shared",
    desc: "Your post was shared by Alex",
    time: "3 hours ago",
  },
  {
    id: 5,
    icon: Trash2,
    title: "Page deleted",
    desc: "You deleted a page",
    time: "1 day ago",
  },
];

const StudentDashboard = () => {
  const [rewardPercent, setRewardPercent] = useState(0);

  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setTimeout(() => setRewardPercent(20), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen ml-56 mt-10 bg-gray-50 font-[Inter] p-4 sm:p-8 lg:p-12">
      <header className="mb-8">
            <h1 className="text-lg font-medium text-gray-500">
              Welcome, <span className="text-[#DE9650] font-bold">Annie</span>!
            </h1>
            <p className="text-2xl font-semibold text-[#6955A5] mt-1">
              Be the difference in someone's world today
            </p>
          </header>
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {pointsData.map((data, index) => (
              <MetricCard key={index} {...data} />
            ))}
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between mt-8">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#7C759B] max-w-sm leading-snug">
                Send a card to a friend on campus!
              </h2>
              <button
              onClick={()=>navigate('/write-card')}
              className="mt-4 px-6 py-2 bg-[#AE9DEB]  cursor-pointer border-2 border-white text-white font-medium rounded-4xl hover:bg-violet-700 transition duration-150 shadow-lg ">
                Start Writing
              </button>
            </div>

            <div className="mt-6 md:mt-0 md:ml-8 flex-shrink-0">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36">
                {/* <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-orange-200 rounded-lg transform rotate-6 shadow-md"></div>
                <div className="absolute bottom-0 left-0 w-3/4 h-3/4 bg-blue-500 rounded-xl shadow-2xl flex items-center justify-center p-2 transform -rotate-3">
                  <div className="text-white text-4xl transform scale-125">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-heart text-red-400"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </div>
                </div> */}
                <img src={card} alt="" />
              </div>
            </div>
          </div>

          <div className="bg-white lg:col-span-2 p-6 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="px-4">
                <h2 className="text-2xl font-medium text-[#EBB142]">
                  You're close to a reward!
                </h2>
                <p className="text-[#EBB142] text-base mt-1">
                  Send 5 more cards to receive a free
                  <span className="font-semibold text-blue-300"> coffee.</span>
                </p>

                <button 
                onClick={()=>navigate("/lets-go")}
                className="px-8 py-1.5 cursor-pointer mt-4 bg-[#E9B243] hover:bg-[#daa232] text-white border-2 border-white rounded-4xl  transition shadow-md">
                  Let's go!
                </button>
              </div>

              <div className="flex justify-center">
                <CircularProgress percent={rewardPercent} />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8 mt-8 lg:mt-0">
          <div className="bg-white p-6 sm:py-4 sm:px-0 rounded-xl shadow-sm">
            <h2 className="text-xl px-6 font-semibold text-[#05004E] mb-4">
              Progress & Goals Section
            </h2>

            <div className="flex items-center pl-6 pr-10 pb-2 border-b-2 border-gray-100 font-semibold text-xs uppercase text-gray-500">
              <div className="w-1/12">#</div>
              <div className="w-3/12">Reward</div>
              <div className="w-7/12 px-4">Progress</div>
              <div className="w-1/12 text-right">%</div>
            </div>

            <div className="divide-y divide-gray-100">
              {goalData.map((goal, index) => (
                <GoalRow key={goal.id} index={index + 1} {...goal} />
              ))}
            </div>
          </div>

          <div className="bg-white p-6 sm:py-4 sm:px-0 rounded-xl shadow-sm">
            <h2 className="text-xl px-4 font-semibold text-[#05004E] mb-1">
              Recent Activity Feed
            </h2>
            <div className="grid grid-cols-2 pl-4">
              {/* NOTIFICATIONS LIST */}
              <div className="pl-4 mt-3">
                <h2 className="font-medium text-sm">Notifications</h2>
                {notificationsData.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 py-2">
                    {/* Icon */}
                    <item.icon className="w-5 h-5 text-purple-600 mt-1" />

                
                    <div>
                      <p className="text-xs text-[#05004E]">{item.desc}</p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pr-4 mt-3">
                <h2 className="font-medium text-sm">Activities</h2>
                {activitiesData.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 py-2">
                    {/* Icon */}
                    <item.icon className="w-5 h-5 text-blue-600 mt-1" />

                    {/* Text */}
                    <div>
                      <p className="text-xs text-[#05004E]">{item.desc}</p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
