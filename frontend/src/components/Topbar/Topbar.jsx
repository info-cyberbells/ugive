import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  Filter,
  MoreVertical,
  Loader2,
} from "lucide-react";
import { fetchSuperAdminProfile } from "../../features/superadminProfileSlice";
import { fetchProfile } from "../../features/studentDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  searchUsers,
  sendFriendRequest,
  clearSearchResults,
} from "../../features/friendsSlice";
import { useToast } from "../../context/ToastContext";

const ProfileAvatar = ({ src, name }) =>
  src ? (
    <img src={src} alt={name} className="w-12 h-14 rounded-2xl object-cover" />
  ) : (
    <div className="w-12 h-14 rounded-2xl bg-[#F3B11C] flex items-center justify-center">
      <svg
        className="w-20 h-20 text-purple-800"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );

const Topbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isMobile, setIsMobile] = useState(false);
  const { showToast } = useToast();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { friends, searchResults, searchLoading, searchError } = useSelector(
    (state) => state.friends
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [sendingToUserId, setSendingToUserId] = useState(null);

  const { profile } = useSelector((state) => state.superadmin);
  const { studentProfile } = useSelector((state) => state.studentData);

  const role =
    profile?.role?.toLowerCase() || studentProfile?.role?.toLowerCase();

  const userData = profile || studentProfile || {};

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedRole = storedUser?.role?.toLowerCase();

    if (storedRole === "super_admin") dispatch(fetchSuperAdminProfile());
    if (storedRole === "student") dispatch(fetchProfile());
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleProfileClick = () => {
    if (role === "student") {
      navigate("/my-profile");
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (value.length < 2) {
      setShowSearchResults(false);
      dispatch(clearSearchResults());
      return;
    }

    const timer = setTimeout(() => {
      dispatch(searchUsers({ name: value, email: "" }));
      setShowSearchResults(true);
    }, 500);

    setDebounceTimer(timer);
  };

  const handleSendRequest = async (receiverId) => {
    setSendingToUserId(receiverId);
    try {
      const result = await dispatch(sendFriendRequest(receiverId)).unwrap();
      showToast(
        result.message || "Friend request sent successfully",
        "success"
      );
      setShowSearchResults(false);
      setSearchQuery("");
      dispatch(clearSearchResults());
    } catch (error) {
      showToast(error || "Failed to send friend request", "error");
    } finally {
      setSendingToUserId(null);
    }
  };

  return (
    <header
      className={`
    fixed top-0 h-[60px] bg-white border-b border-gray-200 z-[100]
    flex items-center justify-between px-5 lg:pr-12
    ${isMobile ? "left-0 right-0" : "left-60 right-0"}   // <-- CHANGED
  `}
    >
      {/* Left Section */}
      <div className="flex items-center gap-2">
        {role === "super_admin" && !isMobile && (
          <div className="flex items-center w-sm bg-gray-50 rounded-lg px-4 py-2">
            <div className="relative w-[22rem] max-w-full" >
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 pointer-events-none" />
              <input
                type="text"
                placeholder="Search.."
                className="w-full ml-6 text-gray-800 border-none outline-none focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
        )}




        {role === "student" && (
          <div className="flex items-center w-48 sm:w-sm bg-gray-50 rounded-lg px-4 py-2">

            <div className="relative w-[22rem] max-w-full">
              {searchLoading ? (
                <Loader2 className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 animate-spin" />
              ) : (
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 pointer-events-none" />
              )}
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search friends"
                className="w-full ml-6 text-gray-800 border-none outline-none focus:ring-0 focus:outline-none"
              />

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                // <div className="absolute top-full mt-2 w-full bg-white shadow-xl rounded-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                <div className="absolute top-full mt-2 left-0 bg-white shadow-xl rounded-lg border border-gray-200 z-50 max-h-96 overflow-y-auto min-w-[22rem] sm:min-w-[30rem]">
                  {searchResults.map((user) => (
                    <div
                      key={user.id || user._id}
                      className="p-3 flex justify-between items-center hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <ProfileAvatar
                          src={user.profileImage}
                          name={user.name}
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSendRequest(user.id || user._id)}
                        disabled={
                          sendingToUserId === (user.id || user._id) ||
                          user.friendshipStatus === "connected" ||
                          user.friendshipStatus === "requested_by_me"
                        }
                        className={`
                         px-4 py-1.5 rounded-full transition flex items-center gap-2
                         ${sendingToUserId === (user.id || user._id)
                            ? "bg-[#F3B11C] text-white cursor-wait"
                            : user.friendshipStatus === "connected"
                              ? "bg-gray-300 text-gray-700 cursor-default"
                              : user.friendshipStatus === "requested_by_me"
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-[#F3B11C] text-white hover:bg-yellow-500 cursor-pointer"
                          }
                       `}
                      >
                        {sendingToUserId === (user.id || user._id) ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : user.friendshipStatus === "connected" ? (
                          "Friend"
                        ) : user.friendshipStatus === "requested_by_me" ? (
                          "Requested"
                        ) : (
                          "Add Friend"
                        )}
                      </button>

                    </div>
                  ))}
                </div>
              )}

              {/* No Results Message */}
              {showSearchResults &&
                searchResults.length === 0 &&
                !searchLoading && (
                  <div className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-lg border border-gray-200 z-50 p-4 text-center text-gray-500">
                    No users found
                  </div>
                )}

              {/* Search Error */}
              {searchError && showSearchResults && (
                <div className="absolute top-full mt-2 w-full bg-red-50 shadow-lg rounded-lg border border-red-200 z-50 p-4 text-center text-red-600">
                  {searchError}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 md:gap-3">
        <button
          onClick={() => navigate("/notifications")}
          className="cursor-pointer bg-red-50 p-1 lg:p-3 rounded-lg">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="#FACC15"
            strokeWidth="1"
          >
            <path d="M4 8a6 6 0 0112 0c0 7 3 8 3 8H1s3-1 3-8z" />
            <circle cx="10" cy="18" r="1" />
          </svg>
        </button>

        <div
          className="flex items-center gap-1 lg:gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
          onClick={handleProfileClick}
        >
          {/* User Image */}
          <div>
            {userData?.profileImage ? (
              <img
                src={userData.profileImage}
                alt="User"
                className="w-8 h-8 lg:w-12 lg:h-12 rounded-md object-cover"
              />
            ) : (
              <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-md bg-[#E9B243] flex items-center justify-center">
                <svg
                  className="w-20 h-20 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>

          {/* User Info */}
          <div>
            <h5 className="text-[8px] sm:text-xs lg:text-sm text-gray-800 font-semibold">
              {" "}
              {userData?.name || "user"}
            </h5>
            <h6 className="text-xs lg:text-sm text-gray-500">
              {role?.replace("_", " ") || "role"}
            </h6>
          </div>
        </div>

        {/* Mobile Toggle */}
        {isMobile && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
      </div>
    </header>
  );
};

export default Topbar;
