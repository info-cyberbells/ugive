import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import card from "/card.svg";
import coffeeCup from "/coffeeCup.svg";
import pizzaSlice from "/pizzaSlice.svg";
import { useDispatch, useSelector } from "react-redux";
import { getUniversities, getColleges } from "../../features/studentSlice";
import {
  sendStudentCard,
  checkCardEligibility,
  checkBanWords,
  getAdminPushNotification,
} from "../../features/studentCardSlice";
import {
  getFriendsList,
} from "../../features/friendsSlice";
import { getAllRewards } from "../../features/rewardSlice";
import { getStudentRewards } from "../../features/studentRewardsSlice";

const CardForm = ({ onSubmit }) => {
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { universities, colleges } = useSelector((state) => state.auth);
  const { rewards } = useSelector((state) => state.studentReward);
  const { friends } = useSelector((state) => state.friends);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFromFriendsList, setIsFromFriendsList] = useState(false);

  useEffect(() => {
    dispatch(getStudentRewards());
    dispatch(getFriendsList()); const universityId = localStorage.getItem("universityId");
    if (universityId) {
      dispatch(getColleges(universityId));
    }
  }, [dispatch]);

  // State to hold form data
  const [formData, setFormData] = useState({
    name: "",
    recipientName: "",
    recipientLastName: "",
    recipientEmail: "",
    collegeHouse: "",
    reward: "",
    message: "",
    university: "",
    college: "",
  });

  //   const filteredRewards = rewards.filter(
  //   (r) => String(r.university) === String(formData.university)
  // );

  const filteredRewards = rewards;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleRecipientNameChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({ ...prev, recipientName: value }));
    setErrors((prev) => ({ ...prev, recipientName: false }));

    if (isFromFriendsList && value.trim() === '') {
      setIsFromFriendsList(false);
    }

    if (value.trim().length > 0) {
      const filtered = friends.filter(friend =>
        friend.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsFromFriendsList(false);
    }
  };


  const handleSelectFriend = (friend) => {
    setFormData({
      ...formData,
      recipientName: friend.name.split(' ')[0],
      recipientLastName: friend.name.split(' ').slice(1).join(' '),
      recipientEmail: friend.email,
      collegeHouse: friend.college?.name || '',
    });
    setShowSuggestions(false);
    setSuggestions([]);
    setIsFromFriendsList(true);
  };
  const handleUniversityChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      university: value,
      college: "",
    }));

    setErrors((prev) => ({ ...prev, university: false, college: false }));

    if (value) {
      dispatch(getColleges(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    const requiredFields = [
      "name",
      "recipientName",
      // "reward",
      "recipientLastName",
      "collegeHouse",
      "recipientEmail",
      "message",
    ];

    requiredFields.forEach((key) => {
      if (!formData[key]?.trim()) {
        newErrors[key] = true;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Please fill all required fields!", "error");
      return;
    }

    if (formData.message.length < 150 || formData.message.length > 600) {
      setErrors((prev) => ({ ...prev, message: true }));
      showToast("Message must be between 150 and 600 characters.", "error");
      return;
    }


    const email = formData.recipientEmail;
    const emailRegex = /^[^\s@]+@usq\.edu\.au$/;

    if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, recipientEmail: true }));
      showToast("Only @usq.edu.au email is allowed.", "error");
      return;
    }

    setErrors({});

    let finalMessage = formData.message;

    try {
      const result = await dispatch(checkBanWords(formData.message)).unwrap();

      if (result?.clean_text && result.clean_text !== result.original) {
        finalMessage = result.clean_text;

        setFormData((prev) => ({
          ...prev,
          message: result.clean_text,
        }));

        showToast(
          "Inappropriate words detected. We cleaned the message for you.",
          "info"
        );
      }
    } catch (error) {
      showToast("Message validation failed. Please try again.", "error");
      return;
    }

    const cardData = {
      sender_name: formData.name,
      recipient_name: formData.recipientName,
      recipient_last_name: formData.recipientLastName,
      recipient_email: formData.recipientEmail,
      reward: formData.reward || null,
      college_name: formData.collegeHouse,
      message: finalMessage,
    };

    dispatch(sendStudentCard(cardData))
      .unwrap()
      .then(() => {
        showToast("Card sent successfully!", "success");
        onSubmit();
      })
      .catch((error) => {
        showToast(error || "Failed to send card", "error");
      });
  };

  const inputClass =
    "w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-indigo-400 focus:border-indigo-500 transition duration-150 ";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="relative">
      <img
        src={coffeeCup}
        className="absolute w-20 md:w-28 lg:w-auto right-4 lg:left-190 top-14 md:top-8 lg:top-10 z-1"
        alt=""
      />
      <div className="max-w-4xl font-[Poppins] px-4 sm:px-8 pt-6 relative">
        <div className="flex items-center mb-4 text-indigo-800">
          <button
            onClick={() => navigate(-1)}
            className="p-2 mr-4 rounded-full cursor-pointer hover:bg-indigo-50 transition hover:scale-[1.10] duration-150"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
          </button>
          <h1 className="text-sm sm:text-2xl font-medium text-[#5D3F87]">
            One card a week keeps the smiles going!
          </h1>
        </div>
        <div className="bg-white p-6 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6 sm:pr-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-6">

              <div>
                <label htmlFor="name" className={labelClass}>
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your Name"
                  className={`${inputClass} ${errors.name ? "border-red-500" : ""
                    }`}
                />
              </div>

              <div className="relative">
                <label htmlFor="recipientName" className={labelClass}>
                  Recipient's First Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="recipientName"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleRecipientNameChange}
                    placeholder="Start typing friend's name..."
                    className={`${inputClass} ${errors.recipientName ? "border-red-500" : ""}`}
                  />

                  {formData.recipientName && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isFromFriendsList ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          From Friends
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                          Manual Entry
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-90 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((friend) => (
                      <div
                        key={friend.id}
                        onClick={() => handleSelectFriend(friend)}
                        className="p-2.5 hover:bg-indigo-50 cursor-pointer border-b last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            {friend.profileImage ? (
                              <img src={friend.profileImage} alt="" className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <span className="text-indigo-600 font-semibold text-sm">
                                {friend.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">{friend.name}</div>
                            <div className="text-xs text-gray-500 truncate">{friend.email}</div>
                            <div className="text-xs text-gray-400 truncate">{friend.college?.name}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {formData.recipientName && !isFromFriendsList && !showSuggestions && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Not in your friends list - enter details manually
                  </p>
                )}

              </div>

              <div className="">
                <label htmlFor="recipientLastName" className={labelClass}>
                  Recipient's Last Name
                </label>
                <input
                  type="text"
                  id="recipientLastName"
                  name="recipientLastName"
                  value={formData.recipientLastName}
                  onChange={handleChange}
                  placeholder="Enter Recipient's Last Name"
                  className={`${inputClass} ${errors.recipientLastName ? "border-red-500" : ""
                    }`}
                />
              </div>

              <div className="">
                <label htmlFor="recipientEmail" className={labelClass}>
                  Recipient's Email
                </label>
                <input
                  type="email"
                  id="recipientEmail"
                  name="recipientEmail"
                  value={formData.recipientEmail}
                  onChange={handleChange}
                  placeholder="Enter Recipient's Email"
                  className={`${inputClass} ${errors.recipientEmail ? "border-red-500" : ""
                    }`}
                />
              </div>

              <div className="">
                <label htmlFor="collegeHouse" className={labelClass}>
                  Recipients’s College/House
                </label>
                {/* <input
                  type="text"
                  id="collegeHouse"
                  name="collegeHouse"
                  value={formData.collegeHouse}
                  onChange={handleChange}
                  placeholder="Enter Recipient's College/House"
                  className={`${inputClass} ${errors.collegeHouse ? "border-red-500" : ""
                    }`}
                /> */}

                <select
                  id="collegeHouse"
                  name="collegeHouse"
                  value={formData.collegeHouse}
                  onChange={handleChange}
                  className={`${inputClass} ${errors.collegeHouse ? "border-red-500" : ""}`}
                >
                  <option value="">Select College / House</option>

                  {colleges && colleges.length > 0 ? (
                    colleges.map((college) => (
                      <option key={college._id} value={college.name}>
                        {college.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No colleges found</option>
                  )}
                </select>

              </div>

              <div>
                <label htmlFor="reward" className={labelClass}>
                  Reward
                </label>
                <div className="relative">
                  <select
                    id="reward"
                    name="reward"
                    value={formData.reward}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none pr-10 ${errors.reward ? "border-red-500" : ""
                      }`}
                  >
                    <option value="">Select Reward</option>

                    {filteredRewards.length > 0 ? (
                      filteredRewards.map((reward) => (
                        <option
                          key={reward.rewardId}
                          value={reward.rewardId}
                          disabled={!reward.claimed || reward.sent}
                          className={
                            reward.sent
                              ? "text-red-500 cursor-not-allowed"
                              : !reward.claimed
                                ? "text-gray-400 cursor-not-allowed"
                                : ""
                          }
                        >
                          {reward.rewardName}
                          {!reward.unlocked && " (Locked)"}
                          {reward.unlocked && !reward.claimed && !reward.sent && " (Not Claimed Yet)"}
                          {reward.unlocked && reward.claimed && !reward.sent && " (✓ Ready to Send)"}
                          {reward.sent && " (Already Sent)"}
                        </option>

                      ))
                    ) : (
                      <option key="no-rewards" value="">
                        No rewards available
                      </option>
                    )}
                  </select>

                  {/* Dropdown Arrow */}
                  <svg
                    className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="">
              <label htmlFor="message" className={labelClass}>
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter Your Message"
                maxLength={600}
                className={`${inputClass} ${errors.message ? "border-red-500" : ""
                  }`}
              />
              <div className="mt-1 flex justify-between text-sm">
                <span
                  className={
                    formData.message.length < 150
                      ? "text-red-500"
                      : "text-green-600"
                  }
                >
                  {formData.message.length < 150
                    ? `${150 - formData.message.length} characters needed`
                    : "Minimum reached"}
                </span>

                <span className="text-gray-500">
                  {formData.message.length} / 600
                </span>
              </div>

            </div>

            <div className="flex justify-center pt-8 relative z-10">
              <img
                src={pizzaSlice}
                className="relative sm:-left-30 -top-6"
                alt=""
              />
              <button
                type="submit"
                className="w-full md:w-50 h-14 bg-[#8573bb] text-gray-100 cursor-pointer font-semibold text-lg rounded-full hover:bg-[#6955A5] transition duration-300 transform hover:scale-[1.01] active:scale-[0.99]"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const SuccessMessage = ({ onGoBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const { adminPushNotification, adminNotificationLoading } = useSelector((state) => state.studentCard);

  const activeNotification = adminPushNotification?.find(n => n.isActive);

  const navigate = useNavigate();

  return (
    <>
      <div className=" pt-6 pl-4 text-indigo-800">
        <button
          // onClick={onGoBack}
          onClick={openModal}
          className="p-2 mr-4 rounded-full cursor-pointer hover:bg-indigo-50 transition duration-150"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
        </button>
      </div>
      <div className="flex justify-center">
        <div className="max-w-xl text-center">
          <h2 className=" text-2xl font-semibold font-[Poppins] text-[#6955A5] mb-6">
            Your Card is on its way!
          </h2>

          <p className="text-[#000000] font-semibold italic mb-8 max-w-sm mx-auto">
            Note: {
              adminNotificationLoading
                ? "Loading notification..."
                : activeNotification?.message ||
                "Cards are delivered each Thursday with a Tuesday evening cutoff to allow time for printing."
            }
          </p>
          <div className="flex justify-center">
            <img src={card} className="h-52" alt="" />
          </div>
          <h3 className="text-xl font-semibold text-[#000000] tracking-tight mt-8 mb-8">
            Thank you for making a difference in someone's world today!
          </h3>

          <button
            // onClick={()=> navigate("/student-dashboard")}
            onClick={openModal}
            className="w-48 h-12 bg-[#E9B243] text-white font-bold text-lg border-3 border-white cursor-pointer rounded-full shadow-lg hover:bg-yellow-600 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Let's go!
          </button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

const Modal = ({ isOpen, onClose, message, nextDate }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex font-[Poppins] items-center justify-center bg-black/80">
      <div
        className="w-11/12 max-w-sm overflow-hidden rounded-xl bg-white px-6 py-10 shadow-2xl transition-all duration-300 transform scale-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="text-center">
          <h2
            id="modal-title"
            className="text-xl font-bold tracking-tight text-black mb-6"
          >
            You're on a break!
          </h2>

          <p className="text-lg italic tracking-tight font-medium text-black mb-0">
            {"Thanks for sending last card."}
          </p>

          {nextDate && (
            <p className="text-lg italic tracking-tight font-medium text-black mb-5">
              You can send another card from
              <span className="text-[#E8BD93] ml-1"> {nextDate}</span>
            </p>
          )}

          <button
            onClick={() => navigate("/student-dashboard")}
            className="w-full h-12 bg-[#E9B243] text-white font-normal text-lg border-3 mt-3 border-white cursor-pointer rounded-full shadow-lg hover:bg-yellow-600 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

const WriteCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { eligibility, isLoading } = useSelector((state) => state.studentCard);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);

  // Check eligibility on mount
  useEffect(() => {
    dispatch(checkCardEligibility())
      .unwrap()
      .then((data) => {
        if (!data.eligible) {
          setShowEligibilityModal(true);
        }
      })
      .catch(() => {
        setShowEligibilityModal(true);
      });
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAdminPushNotification());
  }, [dispatch]);

  const handleSubmission = () => {
    setIsSubmitted(true);
  };

  const handleGoBack = () => {
    setIsSubmitted(false);
  };

  const handleCloseEligibilityModal = () => {
    setShowEligibilityModal(false);
    navigate("/student-dashboard");
  };

  // Show loading
  if (isLoading) {
    return (
      <div className="min-h-screen lg:ml-60 mt-14 bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="inline-block w-16 h-16 border-4 border-[#E9B243] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">
            Checking eligibility...
          </p>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:ml-60 mt-14 bg-gray-50 flex items-start justify-center pb-20 font-sans">
      <div className="w-full max-w-7xl">
        {isSubmitted ? (
          <SuccessMessage onGoBack={handleGoBack} />
        ) : eligibility?.eligible ? (
          <CardForm onSubmit={handleSubmission} />
        ) : null}
      </div>

      {/* Show eligibility modal */}
      <Modal
        isOpen={showEligibilityModal}
        onClose={handleCloseEligibilityModal}
        message={eligibility?.message}
        nextDate={eligibility?.next_available_date}
      />
    </div>
  );
};

export default WriteCard;
