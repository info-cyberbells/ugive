import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSentCards } from "../../features/studentCardSlice";
import { ChevronDown, Mail, Award, Landmark, Calendar } from "lucide-react";

const CardReadingPage = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(null);
  const { sentCards, isLoading } = useSelector((state) => state.studentCard);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSentCards());
  }, [dispatch]);

  const toggleCard = (cardId) => {
    setIsOpen(isOpen === cardId ? null : cardId);
  };

  const CardDetailRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start text-sm md:text-base text-gray-700">
      <Icon className="w-5 h-5 text-indigo-500 mr-3 mt-1 flex-shrink-0" />
      <div>
        <span className="font-semibold">{label}:</span> {value}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen ml-60 mt-14 font-[Poppins] bg-gray-50 p-8">
      <div className=" w-full max-w-6xl">
        <div className="flex justify-between mb-4 text-indigo-800">
          <div className="flex items-center">
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
            <h1 className="text-2xl font-medium text-[#5D3F87]">
              Sent Cards
            </h1>
          </div>
          <div>
            <button
              onClick={() => navigate('/write-card')}
              className="mt-4 px-6 py-2 bg-[#7f63e6]  cursor-pointer text-white text-sm font-medium rounded-4xl hover:bg-violet-700 transition duration-150 shadow-lg ">
              Write Card
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl items-start">
          {isLoading &&
            [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 w-full animate-pulse"
              >
                {/* Title skeleton */}
                <div className="h-5 w-40 bg-gray-200 rounded mb-4"></div>

                {/* Date skeleton */}
                <div className="h-4 w-28 bg-gray-200 rounded mb-4"></div>

                {/* Button skeleton */}
                <div className="h-10 w-full bg-gray-200 rounded"></div>
              </div>
            ))}


          {!isLoading &&
            sentCards.map((card) => (
              <div
                key={card._id}
                className="w-full bg-white rounded-xl shadow-sm hover:shadow-xl hover:scale-[1.0001] transition duration-300 border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleCard(card._id)}
                  className="flex cursor-pointer flex-col sm:flex-row items-center justify-between w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-opacity-50"
                >
                  <div className="flex flex-col items-center sm:items-start mb-3 sm:mb-0">
                    <h1 className="text-xl text-[#7B5EA6] font-medium">
                      Card To{" "}
                      <span className="text-[#7B5EA6] font-semibold">
                        {card.recipient_name}{" "}
                      </span>
                    </h1>
                    <p className="text-sm font-medium text-gray-500 flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-1 text-[#7B5EA6] " />
                      Sent on {card.date}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm mr-2 text-[#7B5EA6]">
                      {isOpen === card._id ? "Hide Details" : "View Details"}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 text-[#7B5EA6]`}
                      style={{
                        transform:
                          isOpen === card._id
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                      }}
                    />
                  </div>
                </button>

                {isOpen === card._id && (
                  <div className="p-6 pt-0 border-t border-gray-100 bg-gray-50 transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-6 mt-4 bg-white border border-gray-200 p-4 rounded-lg">
                      <CardDetailRow
                        icon={Landmark}
                        label="House"
                        value={card.college_name}
                      />
                      <CardDetailRow
                        icon={Award}
                        label="Reward"
                        value={card.reward || "N/A"}
                      />
                      <div className="md:col-span-2">
                        <CardDetailRow
                          icon={Mail}
                          label="Recipient Email"
                          value={card.recipient_email}
                        />
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-300 border-l-5 border-l-[#7B5EA6]">
                      <p className="text-base font-bold mb-2 text-[#7B5EA6]">
                        Message:
                      </p>
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed italic">
                        "{card.message}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

          {!isLoading && sentCards.length === 0 && (
            <div className="text-center p-10 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl w-full">
              No cards have been sent yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardReadingPage;
