import React from "react";
import {
  Download,
  FileDown,
  DollarSign,
  ShoppingCart,
  PackageCheck,
  Users,
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

// Dummy Data
const weeklySummary = [
  {
    title: "Total Sales",
    value: "$1k",
    diff: "+8%",
    color: "bg-[#FFE2E5]",
    icon: DollarSign,
  },
  {
    title: "Total Order",
    value: "300",
    diff: "+5%",
    color: "bg-[#FFF4DE]",
    icon: ShoppingCart,
  },
  {
    title: "Product Sold",
    value: "5",
    diff: "+1.2%",
    color: "bg-[#DCFCE7]",
    icon: PackageCheck,
  },
  {
    title: "New Customers",
    value: "8",
    diff: "0.5%",
    color: "bg-[#F3E8FF]",
    icon: Users,
  },
];

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
  return (
    <div className=" lg:ml-60 mt-14 p-6 font-[Poppins] bg-gray-50 min-h-screen grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-md">
        <header className="flex justify-between items-center">
          <div>
            <h2 className="text-lg text-[#05004E] font-semibold">
              Total cards sent this week
            </h2>
            <h4 className="text-[#737791]">Sales Summary</h4>
          </div>

          <button className="border flex items-center border-[#C3D3E2] px-4 py-1 cursor-pointer rounded-xl">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
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
                <p className="text-blue-500 text-xs">
                  {card.diff} from yesterday
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Streaks */}
      <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-2">Active Streaks</h2>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={universityParticipation}>
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis dataKey="day" />
            <Bar
              dataKey="online"
              fill="#FFE2E5"
              barSize={20}
              radius={[30, 30, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* University Participation */}
      <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">University Participation</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={universityParticipation}>
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
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
      </div>

      {/* Active Status */}
      <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">
          Active Status of University
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={activeStatus}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              {/* Shadow for Last */}
              <linearGradient id="shadowLast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D2AFF97A" stopOpacity="0.75" />
                <stop offset="70%" stopColor="#8B78D0" stopOpacity="0" />
              </linearGradient>

              {/* Shadow for Current */}
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
      </div>

      <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-md">
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
      </div>

      {/* Weekly Activity */}
      <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-md">
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
      </div>
    </div>
  );
};
export default AdminDashboard;
