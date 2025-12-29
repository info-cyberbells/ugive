import React, { useEffect } from "react";
import { Flame, Coffee, Star, Shield } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getStreakSummary } from "../../features/studentDataSlice";
import { useNavigate } from "react-router-dom";

const Skeleton = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded-md ${className}`} />
);

const MilestoneItem = ({
  number,
  weekLabel,
  cardsSent,
  streakEarned,
  icon: Icon,
  iconColor,
}) => {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 text-center text-sm text-gray-500">{number}</td>

      <td className="py-3 text-center">
        <Icon className={`w-5 h-5 mx-auto ${iconColor}`} />
      </td>

      <td className="py-3 text-sm font-medium text-gray-800">{weekLabel}</td>

      <td className="py-3 text-sm font-medium text-gray-700">
        {cardsSent > 0 ? (
          cardsSent
        ) : (
          <>
            No <span className="hidden sm:inline">card sent</span>
          </>
        )}
      </td>

      <td className="py-3 text-center pr-2">
        <span
          className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
            streakEarned
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {streakEarned ? "Streak Earned" : "Not Earned"}
        </span>
      </td>
    </tr>
  );
};

const RewardBadge = ({ name, rewardImage, points, activeQuarters }) => {
  const ICON_SIZE = "text-5xl";

  const activeColor = "#fbbf24";
  const inactiveColor = "#f59e0b20";
  const gapColor = "#ffffff";

  const segmentSize = 100;
  const gapSize = 0;

  const gradientStops = [
    // Quarter 1 (0 to 90 deg) - Top Right
    `${
      activeQuarters >= 4 ? activeColor : inactiveColor
    } 0deg ${segmentSize}deg`,
    `${gapColor} ${segmentSize}deg ${segmentSize + gapSize}deg`, // Gap

    // Quarter 2 (90 to 180 deg) - Bottom Right
    `${activeQuarters >= 1 ? activeColor : inactiveColor} ${90 + gapSize}deg ${
      90 + segmentSize
    }deg`,
    `${gapColor} ${90 + segmentSize}deg ${90 + segmentSize + gapSize}deg`, // Gap

    // Quarter 3 (180 to 270 deg) - Bottom Left
    `${activeQuarters >= 2 ? activeColor : inactiveColor} ${180 + gapSize}deg ${
      180 + segmentSize
    }deg`,
    `${gapColor} ${180 + segmentSize}deg ${180 + segmentSize + gapSize}deg`, // Gap

    // Quarter 4 (270 to 360 deg) - Top Left
    `${activeQuarters >= 3 ? activeColor : inactiveColor} ${270 + gapSize}deg ${
      270 + segmentSize
    }deg`,
    `${gapColor} ${270 + segmentSize}deg 360deg`, // Gap
  ].join(", ");

  const conicGradient = `conic-gradient(${gradientStops})`;

  return (
    <div
      className="group flex flex-col items-center p-4 rounded-2xl cursor-pointer
  transition-all duration-300 hover:scale-[1.04] hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-200"
    >
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
          <div className="w-full h-full -rotate-45 bg-white rounded-full flex flex-col items-center justify-center relative overflow-hidden">
            <img
              src={rewardImage}
              alt="Reward"
              className="w-24 h-24 -mt-6 animate-pulse object-contain opacity-90"
            />

            <p className=" -mt-6 bottom-10 text-xl font-semibold text-[#6955A5]">
              {points} {points === 1 ? "week" : "weeks"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Streaks = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { streakSummary, isLoading, isError } = useSelector(
    (state) => state.studentData
  );

  useEffect(() => {
    dispatch(getStreakSummary());
  }, []);

  const currentStreakWeeks = streakSummary?.monthly?.currentStreak || 0;

  const milestones = streakSummary?.monthly?.weeks?.map((w, index) => ({
    number: index + 1,
    weekLabel: w.weekLabel,
    cardsSent: w.cardsSent,
    streakEarned: w.streakEarned,
    icon: w.streakEarned ? Star : Shield,
    iconColor: w.streakEarned ? "text-green-500" : "text-gray-400",
  }));

  const rewardUsed = streakSummary?.rewardsUsed?.length || 0;

  const activeQuarters = Math.min(4, currentStreakWeeks);

  return (
    <div className="min-h-screen lg:ml-60 mt-14 bg-gray-50 px-4 sm:px-8 py-4 font-[Poppins]">
      <div className="">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#6955A5] flex items-center">
            {/* <Flame className="w-6 h-6 text-yellow-400 fill-yellow-400 mr-2" /> */}
            <img
              src="/flame.png"
              alt="Reward"
              className="w-11 h-11 -mt-1 -mr-2  object-contain"
            />
            Streaks
          </h1>
          <button
            onClick={() => navigate("/write-card")}
            className=" px-6 py-2 bg-[#7f63e6]  cursor-pointer text-white text-sm font-medium rounded-4xl hover:bg-violet-700 hover:scale-[1.02] transition duration-150 shadow-lg "
          >
            Write Card
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="flex flex-col gap-8 lg:col-span-1">
            <div className="flex flex-col gap-8 lg:col-span-1">
              {isLoading ? (
                <>
                  <div className="bg-white p-6 rounded-xl shadow-md space-y-5">
                    <Skeleton className="w-48 h-6" />
                    <Skeleton className="w-28 h-28 rounded-full mx-auto" />
                    <Skeleton className="w-40 h-4 mx-auto" />
                  </div>

                  <div className="bg-white px-6 py-8 rounded-xl shadow-md space-y-4">
                    <Skeleton className="w-32 h-5" />
                    <Skeleton className="w-40 h-4" />
                    <Skeleton className="w-36 h-4" />
                    <Skeleton className="w-36 h-4" />
                    <Skeleton className="w-28 h-4" />
                  </div>
                </>
              ) : (
                <>
                  {/* Your Streaks Card */}
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold text-[#05004E] mb-2">
                      Your Streaks:{" "}
                      <span>
                        {currentStreakWeeks}{" "}
                        {currentStreakWeeks === 1 ? "week" : "weeks"}
                      </span>
                    </h2>

                    <div className="flex flex-col items-center justify-center">
                      <RewardBadge
                        name="Streak Reward"
                        rewardImage="/flame.png"
                        points={currentStreakWeeks}
                        activeQuarters={4}
                      />
                      <p className="mt-2 text-sm text-gray-600">
                        You're doing amazing – keep it going!
                      </p>
                    </div>
                  </div>

                  {/* Your Stats Card */}
                  <div className="bg-white px-6 py-8 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      Your Stats
                    </h2>

                    <ul className="list-disc ml-5 space-y-2 text-gray-700">
                      <li className="text-sm">
                        <span className="font-semibold text-[#6955A5]">
                          Total Cards Sent:
                        </span>{" "}
                        {streakSummary?.monthly?.totalCardsThisMonth || 0}
                      </li>
                      <li className="text-sm">
                        <span className="font-semibold text-[#6955A5]">
                          Best streak:
                        </span>{" "}
                        {streakSummary?.monthly?.bestStreak || 0} weeks
                      </li>
                      <li className="text-sm">
                        <span className="font-semibold text-[#6955A5]">
                          Rewards used:
                        </span>{" "}
                        {rewardUsed || 0}
                      </li>
                     
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-md">
              {isLoading ? (
                <>
                  <Skeleton className="w-56 h-6 mb-4" />

                  <Skeleton className="w-full h-6 mb-4" />
                  <div className="space-y-4">
                    <Skeleton className="w-full h-14" />
                    <Skeleton className="w-full h-14" />
                    <Skeleton className="w-full h-14" />
                    <Skeleton className="w-full h-14" />
                    <Skeleton className="w-full h-14" />
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Milestones {streakSummary?.monthly?.monthLabel}
                  </h2>

                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr className="text-gray-500 border-b font-light border-b-gray-100">
                          <th className="py-2 w-8 text-center">#</th>
                          <th className="py-2 w-10 text-center"></th>
                          <th className="py-2 text-left">Week</th>
                          <th className="py-2 text-left">Cards Sent</th>
                          <th className="py-2 text-center pr-2">Streak</th>
                        </tr>
                      </thead>

                      <tbody>
                        {milestones && milestones.length > 0 ? (
                          milestones.map((m, index) => (
                            <MilestoneItem key={index} {...m} />
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="5"
                              className="text-center text-gray-500 py-10"
                            >
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Streaks;
