// import React from "react";

const RightPanel = () => {
  // ---------------------- NOTIFICATIONS -----------------------
  const notifications = [
    {
      img: "https://cdn-icons-png.flaticon.com/512/992/992651.png", // bug icon
      text: "You fixed a bug.",
      time: "Just now",
    },
    {
      img: "https://cdn-icons-png.flaticon.com/512/456/456212.png", // user add
      text: "New user registered.",
      time: "59 minutes ago",
    },
    {
      img: "https://cdn-icons-png.flaticon.com/512/992/992651.png",
      text: "You fixed a bug.",
      time: "12 hours ago",
    },
    {
      img: "https://cdn-icons-png.flaticon.com/512/907/907717.png", // subscribe icon
      text: "Andi Lane subscribed to you.",
      time: "Today, 11:59 AM",
    },
  ];

  // ---------------------- ACTIVITIES --------------------------
  const activities = [
    {
      img: "https://randomuser.me/api/portraits/women/1.jpg",
      text: "Changed the style.",
      time: "Just now",
    },
    {
      img: "https://randomuser.me/api/portraits/men/2.jpg",
      text: "Released a new version.",
      time: "59 minutes ago",
    },
    {
      img: "https://randomuser.me/api/portraits/women/3.jpg",
      text: "Submitted a bug.",
      time: "12 hours ago",
    },
    {
      img: "https://randomuser.me/api/portraits/men/4.jpg",
      text: "Modified A data in Page X.",
      time: "Today, 11:59 AM",
    },
    {
      img: "https://randomuser.me/api/portraits/women/5.jpg",
      text: "Deleted a page in Project X.",
      time: "Feb 2, 2025",
    },
  ];

  // ---------------------- CONTACTS ----------------------------
  const contacts = [
    { img: "https://randomuser.me/api/portraits/women/8.jpg", name: "Natali Craig" },
    { img: "https://randomuser.me/api/portraits/men/9.jpg", name: "Drew Cano" },
    { img: "https://randomuser.me/api/portraits/women/10.jpg", name: "Andi Lane" },
    { img: "https://randomuser.me/api/portraits/men/11.jpg", name: "Koray Okumus" },
    { img: "https://randomuser.me/api/portraits/women/12.jpg", name: "Kate Morrison" },
    { img: "https://randomuser.me/api/portraits/women/13.jpg", name: "Melody Macy" },
  ];

  return (
    <div className="w-60 min-h-screen bg-white border-l border-gray-200 p-4 overflow-y-auto">

      {/* ------------------ NOTIFICATIONS ------------------ */}
      <section>
        <h3 className="text-sm font-semibold text-gray-600 mb-3">
          Notifications
        </h3>

        <div className="flex flex-col gap-3">
          {notifications.map((n, i) => (
            <div key={i} className="flex items-start gap-3">
              <img src={n.img} className="w-6 h-6" alt="icon" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-900">{n.text}</span>
                <span className="text-xs text-gray-400">{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-gray-200 my-4"></div>

      {/* ------------------ ACTIVITIES ------------------ */}
      <section>
        <h3 className="text-sm font-semibold text-gray-600 mb-3">
          Activities
        </h3>

        <div className="flex flex-col gap-3">
          {activities.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <img src={a.img} className="w-7 h-7 rounded-full" alt="avatar" />
              <div>
                <div className="text-xs text-gray-900">{a.text}</div>
                <div className="text-xs text-gray-400">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-gray-200 my-4"></div>

      {/* ------------------ CONTACTS ------------------ */}
      <section>
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Contacts</h3>

        <div className="flex flex-col gap-3">
          {contacts.map((c, i) => (
            <div key={i} className="flex items-center gap-3">
              <img src={c.img} className="w-7 h-7 rounded-full" alt="avatar" />
              <span className="text-xs text-gray-800">{c.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RightPanel;
