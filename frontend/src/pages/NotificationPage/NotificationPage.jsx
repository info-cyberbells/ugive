import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuperAdminNotifications } from "../../features/superadminProfileSlice";
import { fetchStudentNotifications } from "../../features/studentDataSlice";

const SkeletonLoader = () => (
  <div className="animate-pulse">
    {[1, 2, 3, 4].map((item) => (
      <div key={item} className="border-b border-gray-100 pb-4 mb-4 flex items-start p-4">
        <div className="w-6 h-6 bg-gray-200 rounded-full mr-4"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    ))}
  </div>
);

const NotificationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role;

  // Get data based on role from Redux
  const superAdminData = useSelector((state) => state.superadmin);
  const studentData = useSelector((state) => state.studentData);

  const [activeTab, setActiveTab] = useState("notifications");
  const [visibleCount, setVisibleCount] = useState(4);

  // Fetch data based on user role
  useEffect(() => {
    if (userRole === "super_admin") {
      dispatch(fetchSuperAdminNotifications());
    } else if (userRole === "student") {
      dispatch(fetchStudentNotifications());
    }
  }, [dispatch, userRole]);

  // Reset visible count when switching tabs
  useEffect(() => {
    setVisibleCount(4);
  }, [activeTab]);

  // Get appropriate data based on role
  const loading = userRole === "super_admin" ? superAdminData.loading : studentData.isLoading;
  const error = userRole === "super_admin" ? superAdminData.error : studentData.isError;
  const notifications = userRole === "super_admin" ? superAdminData.notifications : studentData.notifications;
  const activities = userRole === "super_admin" ? superAdminData.activities : [];

  // Icon selector based on action type
  const getIcon = (action, type) => {
    if (type === "notification") {
      if (action === "card_sent") {
        return (
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      }
      if (action === "friend_request_accepted") {
        return (
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      }
      return (
        <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      );
    }

    // For activities (only for super_admin)
    if (action === "student_created") {
      return (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      );
    }
    if (action === "student_updated") {
      return (
        <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      );
    }
    if (action === "student_deleted") {
      return (
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      );
    }
    return (
      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  const currentData = activeTab === "notifications" ? notifications : activities;

  if (loading) {
    return (
      <main className="mt-14 lg:ml-56 font-[Inter] min-h-screen bg-gray-50 p-8">
        <div className="flex gap-6">
          <div className="w-full bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gray-200 rounded-full mr-4 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
            {userRole === "super_admin" && (
              <div className="flex gap-2 mb-6 border-b border-gray-200">
                <div className="h-12 bg-gray-200 rounded w-40 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded w-40 animate-pulse"></div>
              </div>
            )}
            <SkeletonLoader />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mt-14 lg:ml-56 font-[Inter] min-h-screen bg-gray-50 p-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Error: {typeof error === 'string' ? error : 'Failed to load data'}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mt-14 lg:ml-56 font-[Inter] min-h-screen bg-gray-50 p-8">
      <div className="flex gap-6">
        <div className="w-full bg-white rounded-2xl shadow-sm p-8">
          {/* Header with Back Button */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 mr-4 rounded-full cursor-pointer hover:bg-gray-100 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h2 className="font-[Inter] text-[#303030] text-2xl font-semibold">
              {userRole === "super_admin" ? "Notification & Activities" : "Notifications"}
            </h2>
          </div>

          {/* Tab Buttons - Only show for super_admin */}
          {userRole === "super_admin" && (
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("notifications")}
                className={`px-6 py-3 font-medium transition ${activeTab === "notifications"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 cursor-pointer"
                  }`}
              >
                Notifications ({notifications?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("activities")}
                className={`px-6 py-3 font-medium transition ${activeTab === "activities"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 cursor-pointer"
                  }`}
              >
                Activities ({activities?.length || 0})
              </button>
            </div>
          )}

          {/* Content */}
          {!currentData || currentData.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">
              No {userRole === "super_admin" ? activeTab : "notifications"} found
            </p>
          ) : (
            <>
              {currentData.slice(0, visibleCount).map((item) => (
                <div
                  key={item._id}
                  className="border-b border-gray-100 pb-4 mb-4 flex justify-between items-start hover:bg-gray-50 p-4 rounded-lg transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getIcon(item.action, item.type)}</div>
                    <div>
                      <p className="text-sm text-[#303030] font-semibold">
                        {item.action?.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{item.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {(userRole === "student" || activeTab === "notifications") && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                  )}
                </div>
              ))}

              {/* Load More / Show Less */}
              <div className="flex justify-center mt-6 gap-3">
                {visibleCount < currentData.length && (
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 4)}
                    className="border border-gray-300 text-sm px-6 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  >
                    Load more
                  </button>
                )}
                {visibleCount > 4 && (
                  <button
                    onClick={() => setVisibleCount(4)}
                    className="border border-gray-300 text-sm px-6 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  >
                    Show less
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default NotificationPage;