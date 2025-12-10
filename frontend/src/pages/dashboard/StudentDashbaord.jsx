import React, { useEffect, useState } from "react";
import { Award, User, Zap, Star, MessageSquare, Frown } from "lucide-react";
import {
  Heart,
  UserCheck,
  Trash2,
  Share2,
  UserPlus,
  Bell,
  Gift,
} from "lucide-react";
import card from "/card.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSocialLinks } from "../../features/studentSlice";
import { getstudentDashboardData } from "../../features/studentDataSlice";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

  const trackColor = "#ffffff";
  const progressStrokeColor = "#EBB142";
  const borderStrokeColor = "#EBB142";

  const innerBorderRadius =
    radius - trackStrokeWidth / 2 - borderStrokeWidth / 2;
  const outerBorderRadius =
    radius + trackStrokeWidth / 2 + borderStrokeWidth / 2;

  return (
    <div className="relative w-60 h-60 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r={radius - trackStrokeWidth / 8 - borderStrokeWidth - 5}
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
          style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
        />
      </svg>

      <div
        className={`absolute top-0 left-0 flex items-center justify-center w-full h-full text-[#EBB142]`}
      >
        <span className="text-5xl font-bold font-inter ">{percent}%</span>
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
  const dispatch = useDispatch();

  const { social, isLoading } = useSelector((state) => state.auth);
  const { studentDashboard, dasboardLoading, isError } = useSelector(
    (state) => state.studentData
  );

  useEffect(() => {
    dispatch(getSocialLinks());
  }, []);

  useEffect(() => {
    dispatch(getstudentDashboardData());
  }, []);

  const navigate = useNavigate();

  React.useEffect(() => {
    const timer = setTimeout(() => setRewardPercent(20), 500);
    return () => clearTimeout(timer);
  }, []);

  const pointsData = studentDashboard
    ? [
        {
          icon: Award,
          title: "Cards Sent",
          value: studentDashboard.cardStats.totalCardsSent,
          color: "text-[#6955A5]",
        },
        {
          icon: Star,
          title: "Cards Received",
          value: studentDashboard.cardStats.totalCardsReceived,
          color: "text-yellow-500",
        },
        {
          icon: User,
          title: "Friends",
          value: studentDashboard.friendStats.totalFriends,
          color: "text-[#71ADE2]",
        },
        {
          icon: Zap,
          title: "Streak Days",
          value: studentDashboard.streakInfo.currentStreak,
          color: "text-red-300",
        },
      ]
    : [];

  const comparisonData = [
    {
      name: "All Time",
      Sent: studentDashboard?.cardStats?.totalCardsSent || 0,
      Received: studentDashboard?.cardStats?.totalCardsReceived || 0,
    },
    {
      name: "This Month",
      Sent: studentDashboard?.streakInfo?.totalCardsThisMonth || 0,
      Received: studentDashboard?.cardStats?.totalCardsReceived || 0,
    },
    {
      name: "Streak",
      Sent: studentDashboard?.streakInfo?.currentStreak || 0,
      Received: studentDashboard?.streakInfo?.bestStreak || 0,
    },
  ];

  return (
    <div className="min-h-screen ml-56 mt-10 bg-gray-50 font-[Inter] p-4 sm:p-8 lg:p-12">
      <header className="flex justify-between mb-8">
        <div className="">
          <h1 className="text-lg font-medium text-gray-500">
            Welcome,{" "}
            <span className="text-[#DE9650] font-bold">
              {" "}
              {studentDashboard?.studentProfile?.name}
            </span>
            !
          </h1>
          <p className="text-2xl font-semibold text-[#6955A5] mt-1">
            Be the difference in someone's world today
          </p>
        </div>
        <div className="flex items-center gap-3">
          {social?.length >= 1 && (
            <h3 className="text-[#6955A5] font-medium">Follow Us</h3>
          )}
          {social?.map((item) => (
            <a
              key={item._id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 overflow-hidden hover:scale-110 transition"
            >
              <img
                src={
                  item.icon ||
                  "https://cdn-icons-png.flaticon.com/512/25/25394.png"
                }
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </a>
          ))}
        </div>
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
                onClick={() => navigate("/write-card")}
                className="mt-4 px-6 py-2 bg-[#AE9DEB]  cursor-pointer border-2 border-white text-white font-medium rounded-4xl hover:bg-violet-700 transition duration-150 shadow-lg "
              >
                Start Writing
              </button>
            </div>

            <div className="mt-6 md:mt-0 md:ml-8 flex-shrink-0">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36">
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
                  onClick={() => navigate("/lets-go")}
                  className="px-8 py-1.5 cursor-pointer mt-4 bg-[#E9B243] hover:bg-[#daa232] text-white border-2 border-white rounded-4xl  transition shadow-md"
                >
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
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-[#05004E] mb-4 px-2">
              Your Activity Progress
            </h2>

            <p className="text-gray-600 text-sm px-2 mb-3">
              Comparison of your cards activity and streak performance
            </p>

            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} barSize={28}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Sent" fill="#6955A5" radius={[6, 6, 0, 0]} />
                  <Bar
                    dataKey="Received"
                    fill="#EBB142"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 sm:py-4 sm:px-0 rounded-xl shadow-sm">
            <h2 className="text-xl px-4 font-semibold text-[#05004E] mb-1">
              Recent Activity Feed
            </h2>
            <div className="grid grid-cols-2 pl-4">
              {/* NOTIFICATIONS LIST */}
              <div className="pl-4 mt-3">
                <h2 className="font-medium text-sm">Recent Card Sent</h2>
                {studentDashboard?.recentActivity?.recentCardsSent?.length >
                0 ? (
                  studentDashboard.recentActivity.recentCardsSent
                    .slice(0, 5)
                    .map((card) => (
                      <div
                        key={card._id}
                        className="flex items-start gap-3 py-2"
                      >
                        <MessageSquare className="w-5 h-5 text-purple-600 mt-1" />
                        <div>
                          <p className="text-xs text-[#05004E]">
                            {card.message}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1">
                            Sent to {card.recipient_name}
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-400 text-xs py-2 flex items-center gap-2">
                    <Frown className="w-4 h-4 text-gray-400" />
                    No cards sent yet.
                  </p>
                )}
              </div>

              <div className="pr-4 mt-3">
                <h2 className="font-medium text-sm">Recent Received Card</h2>

                {studentDashboard?.recentActivity?.recentCardsReceived?.length >
                0 ? (
                  studentDashboard.recentActivity.recentCardsReceived
                    .slice(0, 5)
                    .map((card) => (
                      <div
                        key={card._id}
                        className="flex items-start gap-3 py-2"
                      >
                        {/* Icon */}
                        <MessageSquare className="w-5 h-5 text-blue-600 mt-1" />

                        <div>
                          <p className="text-xs text-[#05004E] font-medium">
                            {card.message}
                          </p>

                          <p className="text-[11px] text-gray-400">
                            From: {card.sender?.name}
                          </p>

                          {/* <p className="text-[11px] text-gray-400">
          {new Date(card.sent_at).toLocaleString()}
        </p> */}
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-400 text-xs py-2 flex items-center gap-2">
                    <Frown className="w-4 h-4 text-gray-400" />
                    No cards received yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
