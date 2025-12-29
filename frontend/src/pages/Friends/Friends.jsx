import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Filter,
  MoreVertical,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  searchUsers,
  getFriendsList,
  sendFriendRequest,
  acceptFriendRequest,
  deleteFriendRequest,
  unfriend,
  getReceivedRequests,
  getSentRequests,
  clearSearchResults,
  clearMessages,
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

const FriendSkeleton = () => (
  <div className="p-2 flex items-center justify-between animate-pulse">
    <div className="flex items-center gap-4 flex-1">
      <div className="w-12 h-14 rounded-2xl bg-gray-300"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-48"></div>
      </div>
    </div>
    <div className="hidden sm:flex gap-8">
      <div className="h-3 bg-gray-200 rounded w-20"></div>
      <div className="h-3 bg-gray-200 rounded w-24"></div>
    </div>
  </div>
);

const FriendsListContent = ({ friends, loading, onUnfriend }) => {
  const friendsList = Array.isArray(friends) ? friends : [];

  if (loading) {
    return (
      <div className="space-y-1">
        <div className="p-2 flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12"></div>
            <h2 className="font-semibold text-gray-600">Friend Name</h2>
          </div>
          <div className="hidden sm:flex gap-6 text-sm sm:min-w-[400px]">
            <h2 className="font-semibold text-gray-600 w-32">College</h2>
            <h2 className="font-semibold text-gray-600 w-64">University</h2>
          </div>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <FriendSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (friendsList.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No friends yet. Start searching to add friends!</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="p-2 flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12"></div>
          <h2 className="font-semibold text-gray-600">Friend Name</h2>
        </div>
        <div className=" hidden sm:flex gap-6 text-sm min-w-[400px]">
          <h2 className="font-semibold text-gray-600 w-32">College</h2>
          <h2 className="font-semibold text-gray-600 w-64">University</h2>
        </div>
      </div>
      {friendsList.map((friend) => (
        <div
          key={friend.id || friend._id}
          className="p-2 flex items-center justify-between hover:bg-gray-50 rounded-lg transition relative group"
        >
          <div className="flex items-center gap-4">
            <ProfileAvatar src={friend.profileImage} name={friend.name} />
            <div>
              <h2 className="text-md font-semibold text-gray-800">
                {friend.name || "Unknown"}
              </h2>
              <p className="text-sm text-gray-500">
                {friend.email || "No email"}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex gap-6 text-sm text-gray-600 min-w-[400px]">
            <span className="w-32 truncate">
              {friend.college?.name || "N/A"}
            </span>
            <span className="w-64 truncate">
              {friend.university?.name || "N/A"}
            </span>
          </div>
          {/* Unfriend button - shows on hover */}
          <button
            onClick={() => onUnfriend(friend)}
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-100 lg:opacity-0 cursor-pointer group-hover:opacity-100 px-3 py-1 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
          >
            Unfriend
          </button>
        </div>
      ))}
    </div>
  );
};

const SentRequestsContent = ({ requests, loading }) => {
  const requestsList = Array.isArray(requests) ? requests : [];

  if (loading) {
    return (
      <div className="space-y-1">
        {[1, 2, 3].map((i) => (
          <FriendSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (requestsList.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No pending sent requests.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {requestsList.map((req) => (
        <div
          key={req.id || req._id}
          className="p-2 flex items-center justify-between hover:bg-gray-50 rounded-lg transition"
        >
          <div className="flex items-center gap-4">
            <ProfileAvatar
              src={req.receiver?.profileImage}
              name={req.receiver?.name}
            />
            <div>
              <h2 className="text-md font-semibold text-gray-800">
                {req.receiver?.name || "Unknown"}
              </h2>
              <p className="text-sm text-gray-500">
                {req.receiver?.email || "No email"}
              </p>
            </div>
          </div>
          <span className="text-sm text-gray-500 ">Pending...</span>
        </div>
      ))}
    </div>
  );
};

const FriendRequestsContent = ({
  requests,
  loading,
  onAccept,
  onDelete,
  acceptingId,
  deletingId,
}) => {
  const requestsList = Array.isArray(requests) ? requests : [];

  if (loading) {
    return (
      <div className="space-y-1">
        {[1, 2, 3].map((i) => (
          <FriendSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (requestsList.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No friend requests at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {requestsList.map((req) => (
        <div
          key={req.id || req._id}
          className="p-2 flex items-center justify-between hover:bg-gray-50 rounded-lg transition"
        >
          <div className="flex items-center gap-4">
            <ProfileAvatar
              src={req.sender?.profileImage}
              name={req.sender?.name}
            />
            <div>
              <h2 className="text-md font-semibold text-gray-800">
                {req.sender?.name || "Unknown"}
              </h2>
              <p className="text-sm text-gray-500">
                {req.sender?.email || "No email"}
              </p>
            </div>
          </div>

          <div className="flex sm:gap-3">
            <button
              onClick={() => onAccept(req.id || req._id)}
              disabled={acceptingId === (req.id || req._id)}
              className="px-4 py-1.5 cursor-pointer bg-[#F3B11C] font-medium hover:scale-[1.03] text-white border-2 border-white rounded-full transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {acceptingId === (req.id || req._id) ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Accepting...
                </>
              ) : (
                "Accept"
              )}
            </button>
            <button
              onClick={() => onDelete(req.id || req._id)}
              disabled={deletingId === (req.id || req._id)}
              className="px-4 py-1.5 cursor-pointer font-medium bg-gray-300 hover:scale-[1.04] hover:bg-gray-400 text-white border-2 border-white rounded-full transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {deletingId === (req.id || req._id) ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const Friends = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const {
    friends,
    searchResults,
    receivedRequests,
    sentRequests,
    loading,
    searchLoading,
    receivedRequestsLoading,
    sentRequestsLoading,
    searchError,
  } = useSelector((state) => state.friends);

  const [viewMode, setViewMode] = useState("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [sendingToUserId, setSendingToUserId] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [unfriendingId, setUnfriendingId] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showUnfriendModal, setShowUnfriendModal] = useState(false);
  const [friendToUnfriend, setFriendToUnfriend] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.allSettled([
        dispatch(getFriendsList()).unwrap(),
        dispatch(getReceivedRequests()).unwrap(),
        dispatch(getSentRequests()).unwrap(),
      ]);

      // Show individual errors
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          const messages = [
            "Failed to load friends list",
            "Failed to load friend requests",
            "Failed to load sent requests",
          ];
          showToast(messages[index], "error");
        }
      });
    };

    fetchAll();
  }, [dispatch]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Handle search input change with debouncing
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

  // Sort friends based on filter
  const getSortedFriends = () => {
    const list = [...friends];

    switch (sortOrder) {
      case "oldest":
        return list.reverse();
      case "a-z":
        return list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      case "z-a":
        return list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
      case "newest":
      default:
        return list;
    }
  };

  // Handle send friend request
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
      dispatch(getSentRequests());
    } catch (error) {
      showToast(error || "Failed to send friend request", "error");
    } finally {
      setSendingToUserId(null);
    }
  };

  // Handle unfriend
  const handleUnfriendClick = (friend) => {
    setFriendToUnfriend(friend);
    setShowUnfriendModal(true);
  };

  const handleUnfriendConfirm = async () => {
    if (!friendToUnfriend) return;

    const friendId = friendToUnfriend.id || friendToUnfriend._id;
    setUnfriendingId(friendId);
    try {
      const result = await dispatch(unfriend(friendId)).unwrap();
      showToast(result.message || "Unfriended successfully", "success");
      setShowUnfriendModal(false);
      setFriendToUnfriend(null);
    } catch (error) {
      showToast(error || "Failed to unfriend", "error");
    } finally {
      setUnfriendingId(null);
    }
  };

  const handleUnfriendCancel = () => {
    setShowUnfriendModal(false);
    setFriendToUnfriend(null);
  };

  // Handle accept friend request
  const handleAcceptRequest = async (requestId) => {
    setAcceptingId(requestId);
    try {
      const result = await dispatch(acceptFriendRequest(requestId)).unwrap();
      showToast(result.message || "Friend request accepted", "success");
      // Refresh friends list
      dispatch(getFriendsList());
    } catch (error) {
      showToast(error || "Failed to accept friend request", "error");
    } finally {
      setAcceptingId(null);
    }
  };

  // Handle delete friend request
  const handleDeleteRequest = async (requestId) => {
    setDeletingId(requestId);
    try {
      const result = await dispatch(deleteFriendRequest(requestId)).unwrap();
      showToast(result.message || "Friend request deleted", "success");
    } catch (error) {
      showToast(error || "Failed to delete friend request", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // Unfriend Confirmation Modal
  const UnfriendModal = () => {
    if (!showUnfriendModal || !friendToUnfriend) return null;

    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Remove Friend?
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to remove{" "}
            <span className="font-semibold">{friendToUnfriend.name}</span> from
            your friends list?
          </p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={handleUnfriendCancel}
              disabled={unfriendingId}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleUnfriendConfirm}
              disabled={unfriendingId}
              className="px-4 py-2 text-white bg-[#6955A5] hover:scale-[1.02] rounded-lg transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {unfriendingId ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Removing...
                </>
              ) : (
                "Yes, Remove"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] lg:ml-60 mt-14 font-[Poppins] bg-gray-50">
      <div className="rounded-xl p-4 sm:p-6">
        <h1 className="text-2xl font-semibold text-[#6955A5] mb-6">Friends</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
          {/* Search Input with Results Dropdown */}
          <div className="relative flex-1 w-full sm:w-auto min-w-0">
            <div className="relative w-[22rem] max-w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={
                  viewMode === "friends" ? "Search friends" : "Search requests"
                }
                className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-3xl 
                 focus:ring-yellow-500 focus:border-yellow-500 text-gray-800 
                 transition bg-[#ECE6F0]"
              />
              {searchLoading ? (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 animate-spin" />
              ) : (
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 pointer-events-none" />
              )}

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
    ${
      sendingToUserId === (user.id || user._id)
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

          {/* View Mode Toggle */}
          <div className="flex-shrink-0 flex bg-gray-100 rounded-full p-1 shadow-inner">
            <button
              onClick={() => setViewMode("friends")}
              className={`px-4 py-2 text-sm font-medium tracking-wider rounded-full transition duration-300 ${
                viewMode === "friends"
                  ? "bg-yellow-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-white/50 cursor-pointer"
              }`}
            >
              Friend List
            </button>
            <button
              onClick={() => setViewMode("requests")}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition duration-300 ${
                viewMode === "requests"
                  ? "bg-yellow-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-white/50 cursor-pointer"
              }`}
            >
              Friend Requests ({receivedRequests.length})
            </button>
            <button
              onClick={() => setViewMode("sent")}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition duration-300 ${
                viewMode === "sent"
                  ? "bg-yellow-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-white/50 cursor-pointer"
              }`}
            >
              Sent Requests
            </button>
          </div>

          {/* Filter and More */}
          <div className="flex space-x-2 flex-shrink-0">
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center px-4 py-2 text-sm cursor-pointer font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>

              {showFilterMenu && (
                <div className="absolute sm:right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <button
                    onClick={() => {
                      setSortOrder("newest");
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                      sortOrder === "newest"
                        ? "bg-yellow-50 text-yellow-700"
                        : ""
                    }`}
                  >
                    Oldest First
                  </button>
                  <button
                    onClick={() => {
                      setSortOrder("oldest");
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                      sortOrder === "oldest"
                        ? "bg-yellow-50 text-yellow-700"
                        : ""
                    }`}
                  >
                    Newest First
                  </button>
                  <button
                    onClick={() => {
                      setSortOrder("a-z");
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                      sortOrder === "a-z" ? "bg-yellow-50 text-yellow-700" : ""
                    }`}
                  >
                    A-Z
                  </button>
                  <button
                    onClick={() => {
                      setSortOrder("z-a");
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 rounded-b-lg ${
                      sortOrder === "z-a" ? "bg-yellow-50 text-yellow-700" : ""
                    }`}
                  >
                    Z-A
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full max-w-2xl">
          {viewMode === "friends" ? (
            <FriendsListContent
              friends={getSortedFriends()}
              loading={loading}
              onUnfriend={handleUnfriendClick}
            />
          ) : viewMode === "requests" ? (
            <FriendRequestsContent
              requests={receivedRequests}
              loading={receivedRequestsLoading}
              onAccept={handleAcceptRequest}
              onDelete={handleDeleteRequest}
              acceptingId={acceptingId}
              deletingId={deletingId}
            />
          ) : (
            <SentRequestsContent
              requests={sentRequests}
              loading={sentRequestsLoading}
            />
          )}
        </div>
      </div>
      <UnfriendModal />
    </div>
  );
};

export default Friends;
