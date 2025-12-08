import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  Filter,
  MoreVertical,
} from "lucide-react";

const mockFriends = [
  {
    id: 1,
    name: "John Doe",
    handle: "@johndoe",
    type: "People",
    college: "College A",
    university: "University 1",
    status: "connected",
  },
  {
    id: 2,
    name: "Jane Smith",
    handle: "@janesmith",
    type: "People",
    college: "College B",
    university: "University 2",
    status: "connected",
  },
  {
    id: 3,
    name: "Alex Johnson",
    handle: "@alexj",
    type: "People",
    college: "College C",
    university: "University 1",
    status: "connected",
  },
  {
    id: 4,
    name: "Emily Brown",
    handle: "@emilyb",
    type: "People",
    college: "College A",
    university: "University 3",
    status: "connected",
  },
];

const mockRequests = [
  {
    id: 5,
    name: "Robert Green",
    handle: "@robertg",
    type: "People",
    college: "College D",
    university: "University 4",
    status: "pending",
  },
  {
    id: 6,
    name: "Maria Lee",
    handle: "@marialee",
    type: "People",
    college: "College B",
    university: "University 2",
    status: "pending",
  },
  {
    id: 7,
    name: "Chris Evans",
    handle: "@chrise",
    type: "People",
    college: "College A",
    university: "University 1",
    status: "pending",
  },
  {
    id: 8,
    name: "Chris Evans",
    handle: "@chrise",
    type: "People",
    college: "College A",
    university: "University 1",
    status: "pending",
  },
];

const ProfileAvatar = () => (
   <div className="w-12 h-14 rounded-2xl bg-[#F3B11C] flex items-center justify-center">
                <svg className="w-20 h-20 text-purple-800" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
              </div>
);

const FriendsListContent = () => {
  return (
    <div className="space-y-1">
        <div className="flex justify-around">
                <h2>People</h2>
                <h2>College</h2>
                <h2>University</h2>
        </div>
      {mockFriends.map((friend) => (
        <div
          key={friend.id}
          className=" p-2 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <ProfileAvatar />
            <div>
              <h2 className="text-md font-semibold text-gray-800">
                {friend.name}
              </h2>
              <p className="text-sm text-gray-500">{friend.handle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const FriendRequestsContent = () => {
  return (
    <div className="space-y-1">
      {mockRequests.map((req) => (
        <div
          key={req.id}
          className=" p-2 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <ProfileAvatar />
            <div>
              <h2 className="text-md font-semibold text-gray-800">
                {req.name}
              </h2>
              <p className="text-sm text-gray-500">{req.handle}</p>
              
            </div>
          </div>

          <div className="flex gap-3">
            <button
                className="px-4 py-1.5 cursor-pointer bg-[#F3B11C] font-medium hover:scale-[1.03] text-white border-2 border-white rounded-4xl  transition shadow-md"
                >
                Connect
            </button>
            <button
            className="px-4 py-1.5 cursor-pointer font-medium bg-gray-300 hover:scale-[1.04] hover:text-gray-400 text-white border-2 border-white rounded-4xl  transition shadow-md"
            >
                Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};


const Friends = () => {
  const [viewMode, setViewMode] = useState("friends"); 

  return (
    <div className="min-h-[calc(100vh-3.5rem)] ml-60 mt-14 font-[Poppins] bg-gray-50">
      <div className=" rounded-xl p-4 sm:p-6">
        <h1 className="text-2xl font-semibold text-[#6955A5] mb-6">Friends</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
          <div className="relative flex-1 w-full sm:w-auto min-w-0">
            <div className="relative w-[22rem] max-w-full">
              <input
                type="text"
                placeholder={
                  viewMode === "friends" ? "Search friends" : "Search requests"
                }
                className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-3xl 
                 focus:ring-yellow-500 focus:border-yellow-500 text-gray-800 
                 transition bg-[#ECE6F0]"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 pointer-events-none" />
            </div>
          </div>

          <div className="flex-shrink-0 flex bg-gray-100 rounded-full p-1 shadow-inner">
            <button
              onClick={() => {
                setViewMode("friends");
              }}
              className={`px-4 py-2 text-sm font-medium tracking-wider rounded-full transition duration-300 ${
                viewMode === "friends"
                  ? "bg-yellow-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-white/50 cursor-pointer"
              }`}
            >
              Friend List
            </button>
            <button
              onClick={() => {
                setViewMode("requests");
              }}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition duration-300 ${
                viewMode === "requests"
                  ? "bg-yellow-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-white/50 cursor-pointer"
              }`}
            >
              Friend Requests ({mockRequests.length})
            </button>
          </div>

          {/* Filter and More */}
          <div className="flex space-x-2 flex-shrink-0">
            <button className="flex items-center px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
              <Filter className="h-4 w-4 mr-2" />
              Filter
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>
            <button className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="w-full max-w-2xl">
          {viewMode === "friends" ? (
            <FriendsListContent  />
          ) : (
            <FriendRequestsContent  />
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;
