import React from "react";
import { Bell } from "lucide-react";
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

const SuperAdminDashboard = () => {
  const stats = [
    {
      title: "Views",
      value: 7265,
      change: "+ 11.01%",
      arrow: "↑",
    },
    {
      title: "Visits",
      value: "1,024",
      change: "+ 8.32%",
      arrow: "↑",
    },
    {
      title: "New Users",
      value: 89,
      change: "+ 3.15%",
      arrow: "↑",
    },
    {
      title: "Active Users",
      value: 412,
      change: "+ 5.04%",
      arrow: " ↑",
    },
  ];

  const projectionData = [
    { month: "Jan", projection: 8000, actual: 12000 },
    { month: "Feb", projection: 10000, actual: 11000 },
    { month: "Mar", projection: 12000, actual: 11000 },
    { month: "Apr", projection: 15000, actual: 18000 },
    { month: "May", projection: 17000, actual: 16000 },
    { month: "Jun", projection: 21000, actual: 22000 },
  ];

  const activityData = [
    { name: "Jan", current: 7680, previous: 5360 },
    { name: "Feb", current: 16575, previous: 10990 },
    { name: "Mar", current: 9000, previous: 9000 },
    { name: "Apr", current: 12546, previous: 9000 },
    { name: "May", current: 15000, previous: 20000 },
    { name: "Jun", current: 22000, previous: 25000 },
  ];

  const summaryData = [
    {
      name: "ASOS Ridley High Waist",
      price: 79.49,
      quantity: 82,
      amount: 6518.18,
    },
    {
      name: "Marco Lightweight Shirt",
      price: 128.5,
      quantity: 37,
      amount: 4754.5,
    },
    { name: "Half Sleeve Shirt", price: 39.99, quantity: 64, amount: 2559.36 },
    { name: "Lightweight Jacket", price: 20.0, quantity: 184, amount: 3680.0 },
    { name: "Marco Shoes", price: 79.49, quantity: 64, amount: 1965.81 },
  ];

  const data = [
    { name: "Linux", value: 15000, color: "#A0BCE8" },
    { name: "Mac", value: 25000, color: "#8CE3D4" },
    { name: "iOS", value: 20000, color: "#000000" },
    { name: "Window", value: 30000, color: "#8BB7FF" },
    { name: "Android", value: 12000, color: "#C4A5FF" },
    { name: "Other", value: 25000, color: "#87D88E" },
  ];

  const performanceData = [
    { name: "Unitied States", value: 300.56 },
    { name: "Canada", value: 135.18 },
    { name: "Mexico", value: 78.02 },
    { name: "Others", value: 48.96 },
  ];

  const COLORS = ["url(#blackGradient)", "#7DBBFF", "#71DD8C", "#A0BCE8"];

  return (
    <div className="bg-[#F5F5F5] font-[Inter] min-h-screen mt-14 px-4 pt-6 pb-4 lg:ml-60">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
        Welcome Back, SuperAdmin
      </h2>

      {/* === TOP SECTION === */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-4">
        {/* Left 2 cols - cards */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`flex-1 max-w-xs rounded-xl shadow p-4 ${index === 1 || index === 3 ? "bg-[#2D4CCA2B]" : "bg-[#E6C8FF]"
                }`}
            >
              <p className="font-normal not-italic text-[14px] leading-[20px] tracking-[0px]">
                {stat.title}
              </p>
              <div className="flex justify-between items-center mt-2">
                <h2 className="text-2xl font-medium text-white">
                  {stat.value}
                </h2>
                <p className="text-[12px] leading-[16px] font-normal">
                  {stat.change} {stat.arrow}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === MIDDLE SECTION === */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Recent Activity */}
        <div className="bg-[#F9F9FA] p-5 rounded-2xl shadow-sm lg:col-span-3">
          <div className="flex gap-6">
            <h4 className="font-semibold text-gray-700 mb-3">Total Users</h4>
            <h4>|</h4>
            <li className="ml-4 text-sm mt-0.5 font-medium">
              Total Projects{" "}
            </li>
            <li className="ml-4 text-sm mt-0.5 font-medium">
              Operating status
            </li>
          </div>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={activityData}>
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis
                dataKey="name"
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                padding={{ left: 20, right: 20 }}
              />

              <YAxis
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#000000"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="previous"
                stroke="#A0BCE8"
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Jobs by Location */}
        <div className="bg-[#F9F9FA] min-h-80 p-5 rounded-2xl shadow-sm">
          <h2>Traffic By Website</h2>
        </div>
      </div>

      {/* === BOTTOM SECTION === */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* My Summary */}
        <div className="bg-[#F9F9FA] p-5 rounded-2xl shadow-sm overflow-x-auto lg:col-span-2">
          <h4 className="font-semibold font-[Poppins] text-black mb-3">
            Traffic By device
          </h4>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={data} barCategoryGap="25%">
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                opacity={0.1}
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#828282", fontSize: 12 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#828282", fontSize: 12 }}
              />

              <Tooltip cursor={{ fill: "transparent" }} />

              <Bar
                dataKey="value"
                radius={[10, 10, 10, 10]}
                shape={(props) => {
                  const { x, y, width, height, fill } = props;
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={fill}
                      rx={10}
                      ry={10}
                    />
                  );
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Summary */}
        <div className="bg-[#F9F9FA] lg:col-span-2 p-5 rounded-2xl shadow-sm">
          <h4 className="font-bold text-sm text-black mb-3">
            Trafic By Location
          </h4>
          <div className="flex">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <defs>
                  <linearGradient
                    id="blackGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#000000" />
                    <stop offset="100%" stopColor="rgba(28,28,28,0.6)" />
                  </linearGradient>
                </defs>
                <Pie
                  data={performanceData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={70}
                  innerRadius={40}
                  paddingAngle={3}
                  startAngle={-270}
                  endAngle={-720}
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                {/* ✅ Tooltip on hover */}
                <Tooltip
                  formatter={(value, name) => [`$${value.toFixed(2)}`, name]}
                  contentStyle={{
                    // color: "white",
                    backgroundColor: "black",
                    border: "1px solid #E5E7EB",
                    borderRadius: "18px",
                    padding: "6px 10px",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "white" }}
                  labelStyle={{ color: "white" }}
                />
              </PieChart>
            </ResponsiveContainer>

            <ul className="text-sm mt-4 space-y-2 text-gray-700">
              {performanceData.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full bg-black inline-block"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  <span className="flex-1">{item.name}</span>
                  <span className="font-semibold">
                    ${item.value.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
