import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  claimReward,
  getStudentRewards,
} from "../../features/studentRewardsSlice";
import { Gift, Send, Sparkles } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const RewardBadge = ({
  name,
  rewardImage,
  totalPoints,
  completedPoints,
  percentage,
  claimed,
  onClick,
}) => {
  const ICON_SIZE = "text-5xl";

  const activeColor = "#fbbf24";
  const inactiveColor = "#f59e0b20";
  const gapColor = "#ffffff";

  const activeQuarters = Math.round((percentage / 100) * 4);
  const segmentSize = 86;
  const gapSize = 4;

  
 const gradientStops = `
  ${activeColor} 0deg ${percentage * 3.6}deg,
  ${inactiveColor} ${percentage * 3.6}deg 360deg
`;

const conicGradient = `conic-gradient(from 90deg, ${gradientStops})`;

  return (
    <div
      onClick={!claimed ? onClick : undefined}
      className={`group flex flex-col items-center p-4 rounded-2xl
    transition-all duration-300
    ${
      claimed
        ? "cursor-not-allowed opacity-50 grayscale"
        : "cursor-pointer hover:scale-[1.04] hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-200"
    }
  `}
    >
      <div className="absolute top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg p-3 w-48 z-10 shadow-lg">
        <div className="space-y-1">
          <p>
            <span className="font-semibold">Total Points:</span> {totalPoints}
          </p>
          <p>
            <span className="font-semibold">Completed:</span> {completedPoints}
          </p>
          <p>
            <span className="font-semibold">Remaining:</span>{" "}
            {totalPoints - completedPoints}
          </p>
          <p>
            <span className="font-semibold">Progress:</span> {percentage}%
          </p>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
      </div>
      <div className="relative w-32 h-32 mb-4 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-[1.05]">
        {claimed && (
          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-30 pointer-events-none">
            <div
              className="bg-green-600 text-white text-[11px] animate-pulse font-bold py-1 text-center tracking-wider shadow-lg 
                    transform -rotate-6"
            >
              CLAIMED
            </div>
          </div>
        )}

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
            <img
              src={rewardImage}
              alt={name}
              className={`w-full h-full object-cover ${
                claimed ? "grayscale opacity-60" : ""
              }`}
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
              {totalPoints}
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

const ClaimRewardModal = ({ open, onClose, onConfirm, rewardName }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 shadow-lg">
        <h2 className="text-lg font-semibold text-[#6955A5]">Claim Reward</h2>
        <p className="text-sm text-gray-600 mt-2">
          Are you sure you want to claim{" "}
          <span className="font-medium">{rewardName}</span>?
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-1.5 cursor-pointer rounded-lg bg-gray-200 text-gray-700 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-1.5 cursor-pointer rounded-lg bg-[#6955A5] text-white text-sm"
          >
            Claim
          </button>
        </div>
      </div>
    </div>
  );
};

const RewardCatalogs = () => {
  const dispatch = useDispatch();
  const { rewards, isLoading } = useSelector((state) => state.studentReward);

  const { showToast } = useToast();

  useEffect(() => {
    dispatch(getStudentRewards());
  }, [dispatch]);

  const [selectedReward, setSelectedReward] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openClaimModal = (reward) => {
    setSelectedReward(reward);
    setIsModalOpen(true);
  };

  const claimRewardHandler = () => {
    if (!selectedReward) return;

    dispatch(claimReward(selectedReward.rewardId))
      .unwrap()
      .then((res) => {
        showToast(res.message, "success");

        dispatch(getStudentRewards());

        setIsModalOpen(false);
      })
      .catch((err) => {
        showToast(err, "error");
        setIsModalOpen(false);
      });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen lg:ml-60 font-[Poppins] mt-14 bg-gray-50 p-6">
        <h1 className="text-2xl font-medium text-purple-700 mb-4">
          Rewards Catalogue
        </h1>

        {/* Skeleton for the 3-step instruction section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 animate-pulse">
              <div className="p-2 rounded-xl bg-gray-300 w-10 h-10"></div>
              <div className="flex flex-col gap-2">
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
                <div className="h-3 w-44 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Skeleton for reward cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl w-full p-2 rounded-3xl mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center p-4 animate-pulse"
            >
              {/* Circle + star badge */}
              <div className="relative w-32 h-32 mb-4">
                <div className="w-full h-full rounded-full bg-gray-300"></div>

                <div className="absolute bottom-0 left-3/4 transform -translate-x-1/4 translate-y-1/8">
                  <div className="w-12 h-12 rounded-full bg-gray-400"></div>
                </div>
              </div>

              {/* Reward name placeholder */}
              <div className="h-5 w-24 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (rewards.length === 0) {
    return (
      <div className="min-h-screen lg:ml-60 font-[Poppins] mt-14 bg-gray-50 p-6">
        <h1 className="text-2xl font-medium text-purple-700 mb-0">
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
    <div className="min-h-screen lg:ml-60 font-[Poppins] mt-14 bg-gray-50 p-6">
      <h1 className="text-2xl font-medium text-purple-700 mb-4">
        Rewards Catalogue
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-6 text-sm text-gray-700">
        {/* Step 1 */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
            <Gift size={22} strokeWidth={1.8} />
          </div>
          <div>
            <p className="font-semibold">Receive Your Reward Card</p>
            <p className="text-gray-600">
              You’ll get a reward card assigned to your profile.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
            <Send size={22} strokeWidth={1.8} />
          </div>
          <div>
            <p className="font-semibold">Send the Card to Friends</p>
            <p className="text-gray-600">
              Share your card with friends to complete the activity.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-green-100 text-green-700">
            <Sparkles size={22} strokeWidth={1.8} />
          </div>
          <div>
            <p className="font-semibold">Claim Your Reward</p>
            <p className="text-gray-600">
              After sending all cards, instantly claim your reward.
            </p>
          </div>
        </div>
      </div>

      <div
        className="
        grid grid-cols-2 md:grid-cols-4 gap-8
        max-w-4xl w-full p-2 rounded-3xl
      "
      >
        {rewards.map((reward) => (
          <RewardBadge
            key={reward.rewardId}
            name={reward.rewardName}
            rewardImage={reward.rewardImage}
            totalPoints={reward.totalPoints}
            completedPoints={reward.completedPoints}
            percentage={reward.percentage}
            claimed={reward.claimed}
            onClick={() =>
              !reward.claimed &&
              (reward.percentage === 100 || reward.unlocked) &&
              openClaimModal(reward)
            }
          />
        ))}
      </div>
      <ClaimRewardModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={claimRewardHandler}
        rewardName={selectedReward?.rewardName}
      />
    </div>
  );
};

export default RewardCatalogs;
