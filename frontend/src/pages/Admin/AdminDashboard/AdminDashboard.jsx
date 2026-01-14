import React, { useEffect } from "react";
import {
  Users, School, CreditCard, Calendar, Send,
  MessageSquare, Printer,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminDashboardData } from "../../../features/adminSlice";
import { useNavigate } from "react-router-dom";





const universityParticipation = [
  { day: "Mon", online: 15000, offline: 12000 },
  { day: "Tue", online: 10000, offline: 15000 },
  { day: "Wed", online: 20000, offline: 25000 },
  { day: "Thu", online: 17000, offline: 14000 },
  { day: "Fri", online: 13000, offline: 16000 },
  { day: "Sat", online: 9000, offline: 8000 },
  { day: "Sun", online: 11000, offline: 9000 },
];

const activeStatus = [
  { month: "Jan", last: 1500, current: 2500 },
  { month: "Feb", last: 1800, current: 2600 },
  { month: "Mar", last: 1700, current: 3000 },
  { month: "Apr", last: 2400, current: 3400 },
  { month: "May", last: 2500, current: 3300 },
  { month: "Jun", last: 2200, current: 3500 },
];

const activityGraphData = [
  { month: "Jan", loyal: 300, new: 260, unique: 250, value: 300 },
  { month: "Feb", loyal: 340, new: 280, unique: 290, value: 400 },
  { month: "Mar", loyal: 310, new: 240, unique: 310, value: 400 },
  { month: "Apr", loyal: 250, new: 180, unique: 270, value: 400 },
  { month: "May", loyal: 200, new: 220, unique: 200, value: 400 },
  { month: "Jun", loyal: 280, new: 280, unique: 250, value: 400 },
  { month: "Jul", loyal: 320, new: 370, unique: 330, value: 400 },
  { month: "Aug", loyal: 350, new: 300, unique: 360, value: 400 },
  { month: "Sept", loyal: 520, new: 270, unique: 320, value: 400 },
  { month: "Oct", loyal: 260, new: 200, unique: 260, value: 400 },
  { month: "Nov", loyal: 200, new: 160, unique: 220, value: 400 },
  { month: "Dec", loyal: 250, new: 200, unique: 200, value: 400 },
];

const AdminDashboard = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate();

  const { adminDashboard, isAdminLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAdminDashboardData());
  }, [dispatch])

  const overview = adminDashboard?.overview;
  const cardStats = adminDashboard?.cardStats;
  const recentCards = adminDashboard?.recentActivity?.recentCards || [];
  const recentStudents = adminDashboard?.recentActivity?.recentStudents || [];





  const weeklySummary = [
    {
      title: "Total Students",
      value: overview?.totalStudents ?? 0,
      diff: "",
      color: "bg-[#FFE2E5]",
      icon: Users,
    },
    {
      title: "Total Colleges",
      value: overview?.totalColleges ?? 0,
      diff: "",
      color: "bg-[#FFF4DE]",
      icon: School,
    },
    {
      title: "Total Cards",
      value: overview?.totalCards ?? 0,
      diff: "",
      color: "bg-[#DCFCE7]",
      icon: CreditCard,
    },
    {
      title: "Cards (Last 7 Days)",
      value: cardStats?.cardsLast7Days ?? 0,
      diff: "",
      color: "bg-[#F3E8FF]",
      icon: Calendar,
    },
  ];

  const AdminDashboardSkeleton = () => (
    <div className="lg:ml-60 mt-14 p-6 min-h-screen bg-gray-50 grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">

      {/* Overview */}
      <div className="lg:col-span-12 bg-white p-6 rounded-xl shadow-md">
        <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-100">
              <div className="h-6 w-6 bg-gray-300 rounded mb-3" />
              <div className="h-6 w-12 bg-gray-300 rounded mb-2" />
              <div className="h-4 w-28 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Students */}
      <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-lg">
        <div className="h-5 w-40 bg-gray-200 rounded mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-48 bg-gray-200 rounded hidden md:block" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Cards Sent */}
      <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-lg">
        <div className="h-5 w-36 bg-gray-200 rounded mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 bg-gray-100 rounded-xl">
              <div className="flex justify-between mb-2">
                <div className="h-4 w-32 bg-gray-300 rounded" />
                <div className="h-3 w-16 bg-gray-300 rounded" />
              </div>
              <div className="h-3 w-full bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );

  if (isAdminLoading) {
    return <AdminDashboardSkeleton />;
  }


  return (
    <div className=" lg:ml-60 mt-14 p-6 font-[Poppins] bg-gray-50 min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-md">
        <header className="flex justify-between items-center">
          <div>
            <h2 className="text-lg text-[#05004E] font-semibold">
              Overview
            </h2>
            {/* <h4 className="text-[#737791]"> Summary</h4> */}
          </div>

          {/* <button className="border flex items-center border-[#C3D3E2] px-4 py-1 cursor-pointer rounded-xl">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button> */}
        </header>
        {/* Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 mt-4 gap-4">
          {weeklySummary.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={index}
                onClick={() => {
                  if (card.title === "Total Students") navigate("/admin-students");
                  if (card.title === "Total Colleges") navigate("/admin-colleges");
                  if (card.title === "Total Cards") navigate("/admin-cards");
                  if (card.title === "Cards (Last 7 Days)") navigate("/admin-cards");
                }}
                className={`p-4 rounded-xl cursor-pointer shadow-sm ${card.color}`}
              >
                <Icon size={28} className="mb-2 text-[#3E3E3E]" />
                <h2 className="text-xl font-semibold">{card.value}</h2>
                <p className="text-[#425166] font-medium text-sm">
                  {card.title}
                </p>
                {/* <p className="text-blue-500 text-xs">
                  {card.diff} from yesterday
                </p> */}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Streaks */}
      <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Cards Stats</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#DCFCE7] rounded-xl p-4">
            <Printer className="mb-2 text-[#166534]" size={22} />
            <h3 className="text-xl font-semibold">
              {cardStats?.printedCards ?? 0}
            </h3>
            <p className="text-sm text-[#166534] font-medium">
              Cards Printed
            </p>
          </div>

          <div className="bg-[#F3E8FF] rounded-xl p-4">
            <Send className="mb-2 text-[#6B21A8]" size={22} />
            <h3 className="text-xl font-semibold">
              {cardStats?.deliveredCards ?? 0}
            </h3>
            <p className="text-sm text-[#6B21A8] font-medium">
              Cards Delivered
            </p>
          </div>
        </div>
      </div>
      {/* University Participation */}
      {/* <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">University Participation</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={universityParticipation}>
            <CartesianGrid
              stroke="#E5E7EB"
              vertical={false}
              horizontal={true}
            />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="online" fill="#C1B7E2" barSize={20} />
            <Bar dataKey="offline" fill="#FFE5A9" barSize={20} />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </div> */}

      {/* Active Status */}
      {/* <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">
          Active Status of University
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={statusChartData}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="shadowLast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D2AFF97A" stopOpacity="0.75" />
                <stop offset="70%" stopColor="#8B78D0" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="shadowCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FA5A7D" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#FFA559" stopOpacity="0" />
              </linearGradient>
            </defs>

            <Tooltip
              cursor={{
                stroke: "#cbd5e1",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
              contentStyle={{
                borderRadius: "0.5rem",
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            />

            <Area
              type="monotone"
              dataKey="printed"
              stroke="none"
              fill="url(#shadowLast)"
              legendType="none"
            />
            <Area
              type="monotone"
              dataKey="current"
              stroke="none"
              fill="url(#shadowCurrent)"
              legendType="none"
            />

            <Line
              type="monotone"
              dataKey="printed"
              stroke="#8B78D0"
              strokeWidth={1}
              dot={{
                  r: 3, 
                  fill: "#8B78D0", 
                }}
              activeDot={{
                r: 4,
                fill: "#8B78D0",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              name="Last Month"
            />

            <Line
              type="monotone"
              dataKey="current"
              stroke="#FCA5A5"
              strokeWidth={1}
              dot={{
                r:3,
                fill: "#FCA5A5"
              }}
              activeDot={{
                r: 4,
                fill: "#FCA5A5",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              name="This Month"
            />
            <Legend />
          </AreaChart>
        </ResponsiveContainer>
      </div> */}


      {/* <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Activity Graph</h2>
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <LineChart
              data={activityGraphData}
              margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
            >
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[0, 700]}
                ticks={[0, 100, 200, 300, 400, 500, 600, 700]}
                tick={{ fill: "#6B7280", fontSize: 14 }}
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                padding={{ left: 20, right: 20 }}
                tick={{ fill: "#6B7280", fontSize: 14 }}
              />

              <Tooltip
                cursor={{ stroke: "#9CA3AF", strokeDasharray: "3 3" }}
                contentStyle={{
                  borderRadius: "0.5rem",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #E5E7EB",
                }}
              />

              <Line
                type="natural"
                dataKey="loyal"
                stroke={"#C4B5FD"}
                strokeWidth={3}
                dot={false}
                name="Loyal Customers"
              />

              <Line
                type="natural"
                dataKey="new"
                stroke={"#FCA5A5"}
                strokeWidth={3}
                dot={false}
                name="New Customers"
              />

              <Line
                type="natural"
                dataKey="unique"
                stroke={"#A7F3D0"}
                strokeWidth={3}
                dot={false}
                name="Unique Customers"
              />

              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="square"
                wrapperStyle={{ paddingTop: "5px" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div> */}

      {/* Weekly Activity */}
      {/* <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Weekly Activity</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Home Decor</span>
            <span className="text-gray-500">45</span>
          </div>
          <div className="flex justify-between">
            <span>Disney Princess Pink</span>
            <span className="text-gray-500">29</span>
          </div>
          <div className="flex justify-between">
            <span>Bathroom</span>
            <span className="text-gray-500">18</span>
          </div>
        </div>
      </div> */}
      {/* Recent Students Table */}
      <div className="lg:col-span-8 bg-white sm:p-6 rounded-xl shadow-lg">
        <h2 className="text-xl text-[#05004E] px-3 py-2 sm:px-0 sm:py-0 font-semibold sm:mb-6">Recent Students</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="text-sm text-[#737791] border-b-2 border-gray-100">
              <tr>
                <th className="px-6 py-3 font-medium text-left">Name</th>
                <th className="px-6 py-3 font-medium text-left hidden md:table-cell">Email</th>
                <th className="px-6 py-3 font-medium text-left">Joined On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentStudents.length > 0 ? (
                recentStudents.slice(0, 5).map((student) => (
                  <tr
                    key={student._id}
                    className="text-gray-800 transition-colors duration-150 hover:bg-[#F9F7FF] hover:shadow-sm" // Highlight hover
                  >
                    <td className="px-6 py-4 font-medium text-[#05004E] flex items-center">
                      <Users size={16} className="text-gray-400 mr-2" />
                      {student.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{student.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-500">No recent student records available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- IMPROVED RECENT CARDS PANEL --- */}
      <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl text-[#05004E] font-semibold mb-6">Recent Cards Sent</h2>

        <div className="space-y-4">
          {recentCards.length > 0 ? (
            recentCards.slice(0, 3).map((card) => (
              <div
                key={card._id}
                className="bg-gray-50 rounded-xl p-4 text-sm transition duration-200 hover:shadow-lg hover:border-b-4 hover:border-[#8B78D0] border-2 border-gray-100" // Added more distinct styling
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-gray-800 flex items-center">
                    <Send size={14} className="text-[#8B78D0] mr-2" />
                    {card.sender?.name || 'Anonymous'} → {card.recipient_name}
                  </p>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(card.sent_at).toLocaleDateString()}
                  </p>
                </div>

                <p className="text-gray-700 italic truncate text-sm border-t pt-2 border-gray-200">
                  <MessageSquare size={12} className="inline-block mr-1 text-gray-500 mb-1" />
                  “{card.message}”
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500 text-sm">No recent cards found.</div>
          )}
        </div>
      </div>


    </div>
  );
};
export default AdminDashboard;
