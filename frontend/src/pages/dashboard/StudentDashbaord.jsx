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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { remainingCardProgress } from "../../features/studentCardSlice";

const SkeletonBox = ({ className }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
);

const MetricCard = ({ icon: Icon, title, value, color, route }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(route)}
      className=" py-2 px-1 sm:p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 cursor-pointer"
    >
      <div className="flex space-x-1 sm:space-x-3">
        <div className={`py-3 px-0.5 sm:p-2 rounded-lg bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-lg sm:text-xl font-semibold text-gray-800">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

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
    <div className="relative w-40 h-40 mx-auto">
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
        className={`absolute top-0 left-0 tracking-tighter flex items-center justify-center w-full h-full text-[#EBB142]`}
      >
        <span className="text-4xl font-bold font-inter ">{percent}%</span>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const [rewardPercent, setRewardPercent] = useState(0);
  const dispatch = useDispatch();

  const { social, isLoading } = useSelector((state) => state.auth);
  const { studentDashboard, dasboardLoading, isError } = useSelector(
    (state) => state.studentData
  );
  const { cardsProgress } = useSelector((state) => state.studentCard);

 useEffect(() => {
   dispatch(getstudentDashboardData());
   dispatch(remainingCardProgress());
  dispatch(getSocialLinks());
}, []);


  const navigate = useNavigate();

  const pointsData = studentDashboard
    ? [
        {
          icon: Award,
          title: "Total Cards Sent",
          value: studentDashboard.cardStats.totalCardsSent,
          color: "text-[#6955A5]",
          route: "/my-cards",
        },
        {
          icon: Star,
          title: "Total Gift Sent",
          value: studentDashboard.cardStats.totalGiftsSent,
          color: "text-yellow-500",
          route: "/rewards-catalog",
        },
        {
          icon: User,
          title: "Friends",
          value: studentDashboard.friendStats.totalFriends,
          color: "text-[#71ADE2]",
          route: "/friends",
        },
        {
          icon: Zap,
          title: "Streak Weeks",
          value: studentDashboard.streakInfo.currentStreak,
          color: "text-yellow-300",
          route: "/streaks",
        },
      ]
    : [];

  const cardTrendData = [
    {
      name: "This Month",
      sent: studentDashboard?.streakInfo?.totalCardsThisMonth || 0,
      received: studentDashboard?.cardStats?.totalCardsReceivedThisMonth || 0,
    },
  ];

  const cardPercentage = cardsProgress?.currentReward?.percentage || 0;

 const cardsLeft =
    cardsProgress?.currentReward
      ? Math.max(
        0,
        cardsProgress.currentReward.totalPoints -
        cardsProgress.currentReward.completedPoints
      )
      : "X";

  useEffect(() => {
    const timer = setTimeout(() => setRewardPercent(cardPercentage), 500);
    return () => clearTimeout(timer);
  }, [cardPercentage]);

  return (
    <div className="min-h-screen lg:ml-60 mt-14 bg-gray-50 font-[Inter] p-4 sm:p-8 ">
      <header className="mb-4 sm:mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-xs sm:text-lg font-medium text-gray-500">
            Welcome,{" "}
            <span className="text-[#DE9650] font-bold">
              {" "}
              {studentDashboard?.studentProfile?.name}
            </span>
            !
          </h1>
          <div className="flex  gap-1 sm:gap-3">
            {social?.length >= 1 && (
              <h3 className="text-[#6955A5] text-xs sm:text-base font-medium">
                Follow Us
              </h3>
            )}
            {social?.map((item) => (
              <a
                key={item._id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className=" w-4 h-4 sm:w-6 sm:h-6 overflow-hidden hover:scale-110 transition"
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
        </div>
        <p className="text-base lg:text-2xl font-semibold text-[#6955A5] mt-1">
          Be the difference in someone's world today
        </p>
      </header>
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {dasboardLoading
              ? [...Array(4)].map((_, i) => (
                  <div key={i} className="p-5 bg-white rounded-xl shadow-sm">
                    <div className="flex space-x-3">
                      <SkeletonBox className="h-10 w-10 rounded-lg" />
                      <div className="flex-1">
                        <SkeletonBox className="h-3 w-20 mb-2" />
                        <SkeletonBox className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                ))
              : pointsData.map((data, index) => (
                  <MetricCard key={index} {...data} />
                ))}
          </div>

          {dasboardLoading ? (
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm flex items-center justify-between mt-8 animate-pulse">
              <div className="flex-1">
                <div className="h-6 w-52 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
              </div>

              <div className="mt-6 md:mt-0 md:ml-8 flex-shrink-0">
                <div className="h-28 w-28 sm:h-36 sm:w-36 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 sm:p-8 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between mt-8">
              <div className="flex-1 text-center ">
                <h2 className="text-xl sm:text-2xl font-semibold text-[#7C759B] leading-snug">
                  Send a card to a friend on campus!
                </h2>

                <button
                  onClick={() => navigate("/write-card")}
                  className="mt-4 px-6 py-2 bg-[#AE9DEB] cursor-pointer border-2 border-white 
                 text-white font-medium rounded-3xl hover:bg-violet-700 
                 transition duration-150 shadow-lg"
                >
                  Start Writing
                </button>
              </div>

              <div className="mt-6 md:mt-0 md:ml-8 flex-shrink-0">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36">
                  <img
                    src={card}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          )}

          {dasboardLoading ? (
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm flex items-center justify-between mt-8 animate-pulse">
              <div className="flex-1">
                <div className="h-6 w-52 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
              </div>

              <div className="mt-6 md:mt-0 md:ml-8 flex-shrink-0">
                <div className="h-28 w-28 sm:h-36 sm:w-36 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : (
            <div className="bg-white lg:col-span-2 p-6 sm:p-8 rounded-xl shadow-sm mt-8">
              <div className="flex flex-col md:flex-row items-center justify-between sm:gap-8">
               
                <div className="flex-1 text-center  px-4">
                  {cardsProgress?.message === "No rewards found" ? (
                    <>
                      <span>No rewards available right now.</span>
                      <br />
                      <span className="text-gray-500 text-sm">
                        You can still send cards to your friends!
                      </span>
                    </>
                  ) : cardsLeft === 0 ? (
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-medium text-[#7C759B]">
                        Your reward has unlocked!
                      </span>
                      <span className="text-purple-400 text-sm font-medium mt-2">
                        Please visit the reward catalog to claim your reward.
                      </span>
                    </div>
                  ) : (
                    <div className="text-[#7C759B] leading-snug">
                      Send <span className="font-semibold">{cardsLeft}</span>{" "}
                      more cards to receive a free{" "}
                      <span className="font-semibold text-[#E18925]">
                        {cardsProgress?.currentReward?.rewardName || "reward"}
                      </span>
                      .
                    </div>
                  )}

                  <div className="flex justify-center mt-2 mb-1 sm:mt-6">
                    <button
                      onClick={() => navigate("/lets-go")}
                      className="px-8 py-2 bg-[#E9B243] cursor-pointer hover:bg-[#d3a032] text-white 
               font-medium border-2 border-white rounded-3xl 
               transition duration-150 shadow-md"
                    >
                      Let's go!
                    </button>
                  </div>
                </div>

                {/* PROGRESS CIRCLE */}
                <div className="flex justify-center flex-shrink-0">
                  <CircularProgress percent={rewardPercent} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-8 mt-8 lg:mt-0">
          <div className="bg-white p-4 lg:col-span-2 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-[#05004E] mb-2 px-2">
              Your Activity Progress
            </h2>
            <p className="text-gray-600 text-sm px-2 mb-3">
              Visual breakdown of your activity and streak performance
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="w-full h-56">
                <h3 className="text-sm font-semibold text-gray-700 mb-1 text-center">
                  Best vs Current Streak
                </h3>
                {dasboardLoading ? (
                  <div className="h-56 w-full">
                    <SkeletonBox className="h-56 w-full" />
                  </div>
                ) : studentDashboard?.streakInfo?.currentStreak === 0 &&
                  studentDashboard?.streakInfo?.bestStreak === 0 ? (
                  <div className="border h-56 w-full flex justify-center items-center border-gray-100 rounded-md">
                    <Frown className="w-4 h-4 text-gray-400" />
                    <p className="text-center text-xs text-gray-400">
                      No streak data available
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip />
                      {/* <Legend /> */}
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Pie
                        data={[
                          {
                            name: "Current Streak",
                            value:
                              studentDashboard?.streakInfo?.currentStreak || 0,
                          },
                          {
                            name: "Best Streak",
                            value:
                              studentDashboard?.streakInfo?.bestStreak || 0,
                          },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        label={false}
                        labelLine={false}
                        outerRadius={85}
                        // label
                      >
                        <Cell fill="#7C3AED" /> {/* Purple */}
                        <Cell fill="#F59E0B" /> {/* Amber */}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="w-full h-56 mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-1 text-center">
                  All Time Cards Activity
                </h3>
                {dasboardLoading ? (
                  <div className="h-56 w-full">
                    <SkeletonBox className="h-56 w-full" />
                  </div>
                ) : studentDashboard?.cardStats?.totalCardsSent === 0 &&
                  studentDashboard?.cardStats?.totalCardsReceived === 0 ? (
                  <div className="border h-56 w-full flex justify-center items-center border-gray-100 rounded-md">
                    <Frown className="w-4 h-4 text-gray-400" />
                    <p className="text-center text-xs text-gray-400">
                      No card Activity
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "All Time",
                          Sent:
                            studentDashboard?.cardStats?.totalCardsSent || 0,
                          Received:
                            studentDashboard?.cardStats?.totalCardsReceived ||
                            0,
                        },
                      ]}
                      barSize={34}
                    >
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      {/* <Legend /> */}
                      <Legend wrapperStyle={{ fontSize: "10px" }} />

                      <Bar
                        dataKey="Sent"
                        name="Cards Sent"
                        fill="#34D399" // Green
                        radius={[6, 6, 0, 0]}
                      />

                      <Bar
                        dataKey="Received"
                        name="Cards Received"
                        fill="#F87171" // Red
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* <div className="w-full flex justify-center mb-14 md:mb-4">
              <div className="w-[60%] h-40">
                {" "}
                <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">
                  Cards Sent vs Received (This Month)
                </h3>
                {dasboardLoading ? (
                  <div className="flex justify-center">
                    <SkeletonBox className="h-40 w-[60%]" />
                  </div>
                ) : cardTrendData[0]?.sent === 0 &&
                  cardTrendData[0]?.received === 0 ? (
                  <div className="border h-40 w-full flex justify-center items-center border-gray-100 rounded-md">
                    <Frown className="w-4 h-4 text-gray-400" />
                    <p className="text-center text-xs text-gray-400">
                      No monthly Card Activity Available
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cardTrendData} barGap={12}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        axisLine={{ stroke: "#e5e7eb" }}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{ fill: "#9CA3AF", fontSize: 12 }}
                        axisLine={{ stroke: "#e5e7eb" }}
                        tickLine={false}
                        allowDecimals={false}
                      />

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />

                      <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ fontSize: "10px", marginTop: 8 }}
                      />

                      <Bar
                        dataKey="sent"
                        name="Cards Sent"
                        fill="#6366F1"
                        radius={[6, 6, 0, 0]}
                      />

                      <Bar
                        dataKey="received"
                        name="Cards Received"
                        fill="#F59E0B"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div> */}
          </div>

          <div className="bg-white p-3 sm:py-4 sm:px-0 rounded-xl shadow-sm">
            <h2 className="text-xl px-4 font-semibold text-[#05004E] mb-1">
              Recent Activity Feed
            </h2>
            <div className="grid grid-cols-2 sm:pl-4">
              {/* NOTIFICATIONS LIST */}
              <div className="pl-4 mt-3">
                <h2 className="font-medium text-sm">Recent Card Sent</h2>
                {dasboardLoading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-3 py-2">
                      <SkeletonBox className="h-6 w-6 rounded" />
                      <div className="flex-1">
                        <SkeletonBox className="h-3 w-32 mb-2" />
                        <SkeletonBox className="h-2 w-20" />
                      </div>
                    </div>
                  ))
                ) : studentDashboard?.recentActivity?.recentCardsSent?.length >
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
                          <p className="text-xs truncate max-w-[100px] sm:max-w-[240px] lg:max-w-[180px] text-[#05004E]">
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

                {dasboardLoading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-3 py-2">
                      <SkeletonBox className="h-6 w-6 rounded" />
                      <div className="flex-1">
                        <SkeletonBox className="h-3 w-32 mb-2" />
                        <SkeletonBox className="h-2 w-20" />
                      </div>
                    </div>
                  ))
                ) : studentDashboard?.recentActivity?.recentCardsReceived
                    ?.length > 0 ? (
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
                          <p className="text-xs truncate max-w-[100px] sm:max-w-[240px] lg:max-w-[180px] text-[#05004E]">
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
