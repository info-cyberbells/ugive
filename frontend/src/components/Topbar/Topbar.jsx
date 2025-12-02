import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { fetchSuperAdminProfile } from "../../features/superadminProfileSlice";
import { fetchProfile } from "../../features/studentDataSlice";
import { useDispatch, useSelector } from "react-redux";

const Topbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isMobile, setIsMobile] = useState(false);

  const dispatch = useDispatch();


  
  const { profile } = useSelector((state) => state.superadmin);
const { studentProfile } = useSelector((state) => state.studentData);

const role =
  profile?.role?.toLowerCase() ||
  studentProfile?.role?.toLowerCase();

const userData =
  profile || studentProfile || {};

    
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

  return (
    <header
      className="
  fixed left-60 top-0 right-0 h-[60px]
  bg-white border-b border-gray-200 z-[100]
  flex items-center justify-between px-5 pr-12
"
    >
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <div className="flex items-center w-sm bg-gray-50 rounded-lg px-4 py-2">
          {/* Search Icon */}
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="#193cb8"
            strokeWidth="2"
            className="text-blue-800"
          >
            <circle cx="6" cy="6" r="4" />
            <line x1="10" y1="10" x2="14" y2="14" />
          </svg>

          {!isMobile && (
            <input
              type="text"
              placeholder="Search..."
              className=" outline-none text-sm pl-2"
            />
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 md:gap-3">
       

      

  

      <button className="cursor-pointer bg-red-50 p-3 rounded-lg">
  <svg width="20" height="20" fill="none" stroke="#FACC15" strokeWidth="1">
    <path d="M4 8a6 6 0 0112 0c0 7 3 8 3 8H1s3-1 3-8z" />
    <circle cx="10" cy="18" r="1" />
  </svg>
</button>



        <div className="flex items-center gap-3">
          {/* User Image */}
          <div>
            <img
              src={
       userData?.profileImage ||
      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    }

              alt="User"
              className="w-12 h-12 rounded-md object-cover"
            />
          </div>

          {/* User Info */}
          <div>
            <h5 className="text-gray-800 font-semibold">     {userData?.name || "user"}
</h5>
            <h6 className="text-gray-500 text-sm">{role?.replace("_", " ") || "role"}</h6>
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
