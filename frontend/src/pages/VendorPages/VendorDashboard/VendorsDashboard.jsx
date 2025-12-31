import React, { useEffect } from "react";
import {
  Download,
  FileDown,
  DollarSign,
  ShoppingCart,
  PackageCheck,
  Users,
  School,
  CreditCard,
  Ticket,
  Send,
  Trophy,
  Printer,
  MessageSquare,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { getAdminDashboardData } from "../../../features/adminSlice";
import { getVendorDashBoard } from "../../../features/venderSlice";

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

const VendorsDashboard = () => {
  const dispatch = useDispatch();

  const { vendorDashBoard, isLoading } = useSelector((state) => state.vendor);

  useEffect(() => {
    dispatch(getVendorDashBoard());
  }, [dispatch]);

  const overview = vendorDashBoard?.overview || {};
  const todayStats = vendorDashBoard?.todayStats || {};
  const recentPrintedCards =
    vendorDashBoard?.recentActivity?.recentPrintedCards || [];

  const recentDeliveredCards =
    vendorDashBoard?.recentActivity?.recentDeliveredCards || [];

  const recentStudents = vendorDashBoard?.recentActivity?.recentStudents || [];

  const weeklySummary = [
    {
      title: "Total Rewards",
      value: overview?.totalRewards ?? 0,
      diff: "",
      color: "bg-[#FFE2E5]",
      icon: Trophy,
    },
    {
      title: "Total Cards",
      value: overview?.totalCards ?? 0,
      diff: "",
      color: "bg-[#FFF4DE]",
      icon: Ticket,
    },
    {
      title: "Total Printed",
      value: overview?.printedCards ?? 0,
      diff: "",
      color: "bg-[#DCFCE7]",
      icon: Printer,
    },
    {
      title: "Total Deliveries",
      value: overview?.deliveredCards ?? 0,
      diff: "",
      color: "bg-[#F3E8FF]",
      icon: PackageCheck,
    },
  ];

  const DashboardSkeleton = () => (
    <div className="lg:ml-60 mt-14 p-6 min-h-screen bg-gray-50 animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Overview */}
      <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-md">
        <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-100">
              <div className="h-6 w-6 bg-gray-300 rounded mb-3" />
              <div className="h-6 w-12 bg-gray-300 rounded mb-2" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Today Stats */}
      <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-md">
        <div className="h-5 w-28 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-100">
              <div className="h-5 w-5 bg-gray-300 rounded mb-3" />
              <div className="h-6 w-10 bg-gray-300 rounded mb-2" />
              <div className="h-3 w-24 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Printed Cards */}
      <div className="lg:col-span-6 bg-white p-6 rounded-xl shadow-lg">
        <div className="h-5 w-40 bg-gray-200 rounded mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-28 bg-gray-200 rounded hidden md:block" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Delivered Cards */}
      <div className="lg:col-span-6 bg-white p-6 rounded-xl shadow-lg">
        <div className="h-5 w-44 bg-gray-200 rounded mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-28 bg-gray-200 rounded hidden md:block" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className=" lg:ml-60 mt-14 p-2 sm:p-6 font-[Poppins] bg-gray-50 min-h-[calc(100vh-56px)] grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 bg-white p-6 rounded-xl lg:max-h-[250px] shadow-md">
        <header className="flex justify-between items-center">
          <div>
            <h2 className="text-lg text-[#05004E] font-semibold">Overview</h2>
          </div>
        </header>
        {/* Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 mt-4 gap-4">
          {weeklySummary.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={index}
                className={`p-4 rounded-xl shadow-sm ${card.color}`}
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

      <div className="lg:col-span-4 bg-white p-6 rounded-xl lg:max-h-[250px] shadow-md">
        <h2 className="text-lg font-semibold mb-4">Today Stats</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#DCFCE7] rounded-xl p-4">
            <Printer className="mb-2 text-[#166534]" size={28} />
            <h3 className="text-xl font-semibold">
              {todayStats?.cardsPrintedToday ?? 0}
            </h3>
            <p className="text-sm text-[#166534] font-medium">
              Cards Printed 
            </p>
          </div>

          <div className="bg-[#F3E8FF] rounded-xl p-4">
            <Send className="mb-2 text-[#6B21A8]" size={28} />
            <h3 className="text-xl font-semibold">
              {todayStats?.cardsDeliveredToday ?? 0}
            </h3>
            <p className="text-sm text-[#6B21A8] font-medium">
              Deliveries  </p>
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
            data={activeStatus}
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
              dataKey="last"
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
              dataKey="last"
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

      {/* Recent Students Table */}
      <div className="lg:col-span-6 bg-white sm:p-6 rounded-xl shadow-lg">
        <h2 className="text-xl text-[#05004E] px-3 py-2 sm:px-0 sm:py-0 font-semibold sm:mb-6">
          Recent Printed Cards
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="text-sm text-[#737791] border-b-2 border-gray-100">
              <tr>
                <th className="px-6 py-3 font-medium text-left">Name</th>
                <th className="px-6 py-3 font-medium text-left hidden md:table-cell">
                  Message
                </th>
                <th className="px-6 py-3 font-medium text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentPrintedCards.length > 0 ? (
                recentPrintedCards.map((card, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">
                      <Users size={14} className="inline mr-2 text-gray-400" />
                      {card.recipient_name || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm truncate text-gray-500 hidden md:table-cell">
                      {card.message || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(card.updatedAt).toLocaleDateString() || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-500">
                    No recent printed cards.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:col-span-6 bg-white sm:p-6 rounded-xl shadow-lg">
        <h2 className="text-xl text-[#05004E] px-3 py-2 sm:px-0 sm:py-0 font-semibold mb-6">
          Recent Delivered Cards{" "}
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="text-sm text-[#737791] border-b-2 border-gray-100">
              <tr>
                <th className="px-6 py-3 font-medium text-left">Name</th>
                <th className="px-6 py-3 font-medium text-left hidden md:table-cell">
                  Message
                </th>
                <th className="px-6 py-3 font-medium text-left">
                  Delivered On
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentDeliveredCards.length > 0 ? (
                recentDeliveredCards.map((card, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">
                      <PackageCheck
                        size={14}
                        className="inline mr-2 text-green-500"
                      />
                      {card.recipient_name || "Not found"}
                    </td>
                    <td className="px-6 py-4 text-sm truncate text-gray-500 hidden md:table-cell">
                      {card.message || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(card.updatedAt).toLocaleDateString() || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-500">
                    No recent delivered cards.
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
export default VendorsDashboard;
