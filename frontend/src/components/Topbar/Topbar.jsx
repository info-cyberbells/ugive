import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Topbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isMobile, setIsMobile] = useState(false);

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
        <ul className="flex items-center gap-3">
          {!isMobile && (
            <>
              {/* Window Icon */}
              <li>
                <svg width="18" height="18" fill="none" stroke="#666" strokeWidth="2">
                  <rect x="2" y="2" width="14" height="14" rx="2" />
                  <line x1="2" y1="7" x2="16" y2="7" />
                </svg>
              </li>

              {/* Favorite Icon */}
              <li>
                <svg width="18" height="18" fill="none" stroke="#666" strokeWidth="2">
                  <path d="M9 13.5l-4 2.5 1-4.5L3 7.5l4.5-.5L9 3l1.5 4 4.5.5-3 3.5 1 4.5-4-2.5z" />
                </svg>
              </li>

              <li className="text-gray-400 text-sm">Dashboard</li>
              <li className="text-gray-400 text-sm">/</li>
            </>
          )}

          {/* Active Page */}
          <li className="text-black font-medium text-sm">Default</li>
        </ul>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 md:gap-3">
        {/* Search Box */}
        <div className="flex items-center bg-gray-200 rounded-full px-2 py-[3px]">
          {/* Search Icon */}
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="#555"
            strokeWidth="2"
            className="text-gray-500"
          >
            <circle cx="6" cy="6" r="4" />
            <line x1="10" y1="10" x2="14" y2="14" />
          </svg>

          {!isMobile && (
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm pl-2"
            />
          )}
        </div>

        {/* Desktop Icons */}
        {!isMobile && (
          <>
            {/* Theme Icon (Sun) */}
            <svg width="20" height="20" fill="none" stroke="#333" strokeWidth="2">
              <circle cx="10" cy="10" r="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="10" y1="16" x2="10" y2="19" />
              <line x1="1" y1="10" x2="4" y2="10" />
              <line x1="16" y1="10" x2="19" y2="10" />
              <line x1="4" y1="4" x2="6" y2="6" />
              <line x1="14" y1="14" x2="16" y2="16" />
              <line x1="4" y1="16" x2="6" y2="14" />
              <line x1="14" y1="6" x2="16" y2="4" />
            </svg>

            {/* History Icon */}
            <svg width="20" height="20" fill="none" stroke="#333" strokeWidth="2">
              <circle cx="10" cy="10" r="7" />
              <polyline points="10,5 10,10 14,12" />
            </svg>
          </>
        )}

        {/* Notification Icon */}
        <svg width="20" height="20" fill="none" stroke="#333" strokeWidth="2">
          <path d="M4 8a6 6 0 0112 0c0 7 3 8 3 8H1s3-1 3-8z" />
          <circle cx="10" cy="18" r="1" />
        </svg>

        {/* Settings Icon */}
        <svg width="16" height="16" fill="none" stroke="#333" strokeWidth="2">
          <circle cx="8" cy="8" r="3" />
          <path d="M2 8h2M12 8h2M8 2v2M8 12v2M3.5 3.5l1.5 1.5M11 11l1.5 1.5M3.5 12.5l1.5-1.5M11 5l1.5-1.5" />
        </svg>

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
