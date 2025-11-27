import React from "react";
import { BookOpen, Users, Award, Clock } from "lucide-react";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const StudentDashboard = () => {
  const stats = [
    {
      title: "Courses Enrolled",
      value: 8,
      change: "+ 2 this month",
      icon: <BookOpen size={24} />,
      color: "bg-[#E6C8FF]",
    },
    {
      title: "Study Hours",
      value: "124h",
      change: "+ 18h this week",
      icon: <Clock size={24} />,
      color: "bg-[#2D4CCA2B]",
    },
    {
      title: "Assignments",
      value: 12,
      change: "3 pending",
      icon: <Award size={24} />,
      color: "bg-[#E6C8FF]",
    },
    {
      title: "Study Groups",
      value: 5,
      change: "+ 1 new group",
      icon: <Users size={24} />,
      color: "bg-[#2D4CCA2B]",
    },
  ];

  const studyProgressData = [
    { month: "Jan", hours: 80 },
    { month: "Feb", hours: 95 },
    { month: "Mar", hours: 110 },
    { month: "Apr", hours: 105 },
    { month: "May", hours: 120 },
    { month: "Jun", hours: 124 },
  ];

  const gradeData = [
    { subject: "Mathematics", grade: 85 },
    { subject: "Physics", grade: 78 },
    { subject: "Chemistry", grade: 92 },
    { subject: "English", grade: 88 },
    { subject: "Computer Science", grade: 95 },
    { subject: "History", grade: 82 },
  ];

  const assignmentData = [
    { name: "Completed", value: 45, color: "#87D88E" },
    { name: "Pending", value: 12, color: "#FFB84D" },
    { name: "Overdue", value: 3, color: "#FF6B6B" },
  ];

  const coursePerformance = [
    { subject: "Math", A: 85, fullMark: 100 },
    { subject: "Physics", A: 78, fullMark: 100 },
    { subject: "Chemistry", A: 92, fullMark: 100 },
    { subject: "English", A: 88, fullMark: 100 },
    { subject: "CS", A: 95, fullMark: 100 },
  ];

  const upcomingAssignments = [
    {
      title: "Physics Lab Report",
      course: "Physics 101",
      dueDate: "Dec 2, 2024",
      status: "Pending",
    },
    {
      title: "Math Problem Set",
      course: "Calculus II",
      dueDate: "Dec 5, 2024",
      status: "In Progress",
    },
    {
      title: "Essay: World War II",
      course: "History",
      dueDate: "Dec 8, 2024",
      status: "Not Started",
    },
    {
      title: "Chemistry Quiz",
      course: "Organic Chemistry",
      dueDate: "Dec 10, 2024",
      status: "Not Started",
    },
  ];

  return (
    <div className="bg-[#F5F5F5] font-[Inter] min-h-screen mt-14 px-4 pt-6 pb-4 lg:ml-60">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
        Welcome Back, Student!
      </h2>

      {/* === TOP STATS === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} rounded-xl shadow p-5 transition-transform hover:scale-105`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="bg-white/30 p-2 rounded-lg">{stat.icon}</div>
            </div>
            <p className="text-sm font-normal text-gray-700 mb-1">
              {stat.title}
            </p>
            <div className="flex justify-between items-end">
              <h2 className="text-3xl font-semibold text-gray-900">
                {stat.value}
              </h2>
              <p className="text-xs text-gray-600">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* === MIDDLE SECTION === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Study Progress */}
        <div className="bg-white p-5 rounded-2xl shadow-sm lg:col-span-2">
          <h4 className="font-semibold text-gray-800 mb-4">
            Monthly Study Progress
          </h4>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={studyProgressData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="month"
                tick={{ fill: "#6B7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: "#8B5CF6", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Assignment Status */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-4">
            Assignment Status
          </h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={assignmentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={50}
                paddingAngle={5}
              >
                {assignmentData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {assignmentData.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === BOTTOM SECTION === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Grades */}
        <div className="bg-white p-5 rounded-2xl shadow-sm lg:col-span-2">
          <h4 className="font-semibold text-gray-800 mb-4">
            Course Performance
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gradeData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis
                dataKey="subject"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="grade" radius={[8, 8, 0, 0]} fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming Assignments */}
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-4">
            Upcoming Assignments
          </h4>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {upcomingAssignments.map((assignment, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <h5 className="font-semibold text-sm text-gray-800 mb-1">
                  {assignment.title}
                </h5>
                <p className="text-xs text-gray-600 mb-2">{assignment.course}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Due: {assignment.dueDate}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${assignment.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : assignment.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {assignment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;