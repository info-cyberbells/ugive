import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";




const notifications = [
  {
    _id: "1",
    title: "New Assignment Posted",
    message: "A new assignment for Module 3 has been uploaded. Please review it.",
    createdAt: "2025-01-10T10:30:00Z",
    isRead: false
  },
  {
    _id: "2",
    title: "Profile Updated",
    message: "Your profile information was successfully updated.",
    createdAt: "2025-01-09T14:15:00Z",
    isRead: true
  },
  {
    _id: "3",
    title: "Reminder",
    message: "Don't forget to complete your weekly progress report.",
    createdAt: "2025-01-08T09:00:00Z",
    isRead: false
  },
  {
    _id: "4",
    title: "System Maintenance",
    message: "Scheduled maintenance will occur tonight at 11:00 PM.",
    createdAt: "2025-01-07T21:45:00Z",
    isRead: true
  },
  {
    _id: "5",
    title: "New Message",
    message: "You received a new message from the admin team.",
    createdAt: "2025-01-07T18:20:00Z",
    isRead: false
  },
  {
    _id: "6",
    title: "Event Invitation",
    message: "You are invited to the annual community meetup on January 20th.",
    createdAt: "2025-01-06T12:10:00Z",
    isRead: true
  },
  {
    _id: "7",
    title: "Security Alert",
    message: "A new login was detected from an unknown device.",
    createdAt: "2025-01-05T07:55:00Z",
    isRead: false
  },
  {
    _id: "8",
    title: "Points Earned",
    message: "You earned 50 reward points for completing your streak.",
    createdAt: "2025-01-04T16:40:00Z",
    isRead: true
  }
];


const NotificationPage = () => {
 
    const navigate = useNavigate();
    
  const [visibility, setVisibility] = useState("everyone");

  const [visibleCount, setVisibleCount] = useState(4);

  

  const loadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const loadLess = () => {
    setVisibleCount((less) => less - 4);
  };


  return (
    <main className="mt-14 lg:ml-56 font-[Inter] min-h-screen bg-gray-50 p-8">
      <div className="flex gap-6">
        {/* ---------- LEFT FEED (3/4) ---------- */}
        <div className="w-5xl bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center mb-8">
            <div className="">
          <button
            onClick={() => navigate(-1)}
            className="p-2 mr-4 rounded-full cursor-pointer hover:bg-indigo-50 transition transform hover:scale-[1.10] duration-150"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
          </button>
        </div>
            <div>
              <h2 className="font-[Inter] text-[#303030] font-semibold">NEW</h2>
            </div>
          </div>
        

          {notifications.length === 0 && (
            <p className="text-center text-gray-500 text-sm mb-4">
              No notifications found
            </p>
          )}

          {
            notifications.slice(0, visibleCount).map((item) => (
              <div
                key={item._id}
                className="border-b border-gray-100 pb-6 pl-6 mb-6 flex justify-between items-start"
              >
                <div className="flex items-start gap-3">
                  {/* Default notification icon */}
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
                    alt="notification"
                    className="w-10 h-10 rounded-full bg-gray-100 p-1"
                  />
                  <div>
                    <p className="text-sm text-[#303030] font-bold">{item.title}</p>
                    <p className="text-sm text-[#303030] mt-1">{item.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-end gap-2">
                 {item.isRead === false && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full mb-[4px]"></span>
                  )}
                </div>
              </div>
            ))}

          {/* Load More / Load Less Buttons */}
          <div className="flex justify-center mt-6 gap-4">
            {visibleCount < notifications.length && (
              <button
                onClick={loadMore}
                className="border cursor-pointer border-gray-200 text-sm px-6 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <span className="text-gray-500"></span> Load more
              </button>
            )}

            {visibleCount > 4 && (
              <button
                onClick={loadLess}
                className="border cursor-pointer border-gray-200 text-sm px-6 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <span className="text-gray-500">↩</span> Load less
              </button>
            )}
          </div>
        </div>

      </div>
    </main>
  );
};

export default NotificationPage;
