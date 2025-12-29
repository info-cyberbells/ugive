import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSuperAdminDashboard } from "../../../features/superadminProfileSlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useToast } from "../../../context/ToastContext";
import { useNavigate } from "react-router-dom";


const SuperAdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { dashboardData, loading, error } = useSelector(
    (state) => state.superadmin
  );

  useEffect(() => {
    dispatch(getSuperAdminDashboard());
  }, [dispatch]);


  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error, showToast]);

  if (loading) {
    return (
      <div className="bg-[#F5F5F5] font-[Inter] min-h-screen mt-14 px-4 pt-6 pb-4 lg:ml-60">
        <div className="h-8 w-64 bg-gray-300 rounded mb-6 animate-pulse"></div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4">
              <div className="h-4 bg-gray-300 rounded w-24 mb-2 animate-pulse"></div>
              <div className="h-8 bg-gray-300 rounded w-16 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-300 rounded w-32 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm lg:col-span-2">
            <div className="h-6 bg-gray-300 rounded w-40 mb-4 animate-pulse"></div>
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="h-6 bg-gray-300 rounded w-40 mb-4 animate-pulse"></div>
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Bottom Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="h-6 bg-gray-300 rounded w-40 mb-4 animate-pulse"></div>
              <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="h-6 bg-gray-300 rounded w-48 mb-4 animate-pulse"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="bg-[#F5F5F5] font-[Inter] min-h-screen mt-14 px-4 pt-6 pb-4 lg:ml-60">
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">No data available</div>
        </div>
      </div>
    );
  }

  const { overview, userMetrics, cardMetrics, topPerformers, recentActivity } =
    dashboardData;

  // Stats cards data (5 cards now)
  const stats = [
    {
      title: "Total Students",
      value: overview.totalStudents,
      subtitle: `+${userMetrics.newUsersLast30Days} this month`,
      bgColor: "bg-[#E6C8FF]",
      link: "/manage-students",
    },
    {
      title: "Total Admins",
      value: overview.totalAdmins,
      subtitle: "System admins",
      bgColor: "bg-[#2D4CCA2B]",
      link: "/manage-admins",
    },
    {
      title: "Universities",
      value: overview.totalUniversities,
      subtitle: "Registered",
      bgColor: "bg-[#E6C8FF]",
      link: "/manage-universities",
    },
    {
      title: "Total Colleges",
      value: overview.totalColleges,
      subtitle: "Active campuses",
      bgColor: "bg-[#2D4CCA2B]",
      link: "/manage-colleges",
    },
    {
      title: "Total Rewards",
      value: overview.totalRewards,
      subtitle: "Available rewards",
      bgColor: "bg-[#E6C8FF]",
      link: "/manage-rewards",
    },
    {
      title: "Total Vendors",
      value: overview.totalVendors,
      subtitle: "Available vendors",
      bgColor: "bg-[#2D4CCA2B]",
      link: "/manage-vendors",
    },
  ];

  // University distribution data for pie chart
  const universityData =
    topPerformers.universitiesWithMostStudents?.map((uni) => ({
      name: uni.universityName,
      value: uni.studentCount,
    })) || [];

  const COLORS = ["#000000", "#7DBBFF", "#71DD8C", "#A0BCE8", "#C4A5FF"];

  // Card metrics for line chart
  const cardTrendData = [
    {
      name: "Today",
      cards: cardMetrics.cardsToday,
    },
    {
      name: "This Week",
      cards: cardMetrics.cardsLast7Days,
    },
    {
      name: "This Month",
      cards: cardMetrics.cardsLast30Days,
    },
  ];

  // Top card senders data
  const topSendersData =
    topPerformers.topCardSenders?.map((sender) => ({
      name: sender.name.split(" ")[0],
      cards: sender.cardsSent,
    })) || [];

  return (
    <div className="bg-[#F5F5F5] font-[Inter] min-h-screen mt-14 px-4 pt-6 pb-4 lg:ml-60">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
        Welcome Back, SuperAdmin
      </h2>

      {/* === TOP SECTION - Stats Cards (5 Cards) === */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            onClick={() => navigate(stat.link)}
            className={`${stat.bgColor} rounded-xl shadow-sm p-4 hover:shadow-md cursor-pointer transition-shadow`}
          >
            <p className="text-sm font-medium text-gray-700 mb-1">
              {stat.title}
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h2>
            <p className="text-xs text-gray-600">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* === MIDDLE SECTION === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Card Activity Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-800">
              Card Activity Trend
            </h4>
            <p className="text-sm text-gray-500">
              Cards sent over time • Growth: {cardMetrics.cardGrowthRate}%
            </p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={cardTrendData}  >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                 padding={{ right: 30 }}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="cards"
                stroke="#000000"
                strokeWidth={2}
                dot={{ fill: "#000000", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 flex gap-6 text-sm">
            <div>
              <span className="text-gray-500">Avg per Student:</span>
              <span className="ml-2 font-semibold text-gray-800">
                {cardMetrics.avgCardsPerStudent}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Total Streaks:</span>
              <span className="ml-2 font-semibold text-gray-800">
                {userMetrics.totalStreakRecords}
              </span>
            </div>
          </div>
        </div>

        {/* University Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Student Distribution
          </h4>
          {universityData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={universityData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={40}
                    paddingAngle={2}
                  >
                    {universityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {topPerformers.universitiesWithMostStudents.map(
                  (uni, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></span>
                        <span className="text-gray-700 truncate text-xs">
                          {uni.universityName.length > 25
                            ? uni.universityName.substring(0, 25) + "..."
                            : uni.universityName}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900 ml-2">
                        {uni.studentCount}
                      </span>
                    </div>
                  )
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">
              No data available
            </p>
          )}
        </div>
      </div>

      {/* === BOTTOM SECTION === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Card Senders */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Top Card Senders
          </h4>
          {topSendersData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topSendersData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                />
                <YAxis
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                />
                <Bar
                  dataKey="cards"
                  fill="#8BB7FF"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">
              No data available
            </p>
          )}
        </div>

        {/* Recent Cards */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Cards Sent
          </h4>
          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
            {recentActivity.recentCards?.length > 0 ? (
              recentActivity.recentCards.map((card) => (
                <div
                  key={card._id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900">
                        {card.sender?.name || "Unknown"}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {new Date(card.sent_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">To:</span>{" "}
                      {card.recipient_name}
                    </p>
                    <p className="text-xs text-gray-700 mt-1 italic line-clamp-2">
                      "{card.message}"
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-8">
                No recent cards
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Recently Registered Users
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 rounded-tl-lg">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  University
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  College
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 rounded-tr-lg">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.recentUsers?.length > 0 ? (
                recentActivity.recentUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index === recentActivity.recentUsers.length - 1
                      ? "border-b-0"
                      : ""
                      }`}
                  >
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-700">
                        {user.university?.name || "N/A"}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-700">
                        {user.college?.name || "N/A"}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-8 text-sm text-gray-500 text-center"
                  >
                    No recent users
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;