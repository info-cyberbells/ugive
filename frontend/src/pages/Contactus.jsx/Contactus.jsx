import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../context/ToastContext";
import { sendFeedbackStudent } from "../../features/studentDataSlice";
import { sendFeedbackByAdmin } from "../../features/adminSlice";

const Contactus = () => {
  const { showToast } = useToast();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role?.toLowerCase();

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.studentData);
  const { isAdminLoading } = useSelector((state) => state.admin);

  const loading = role === "student" ? isLoading : isAdminLoading;

  const [feedback, setFeedback] = useState("");

  const handleSubmit = async () => {
    try {
      if (!feedback.trim()) {
        showToast("Please enter feedback", "error");
        return;
      }

      if (role === "student") {
        await dispatch(sendFeedbackStudent(feedback)).unwrap();
        showToast("Feedback submitted successfully!", "success");
        setFeedback("");
      } else if (role === "admin") {
        await dispatch(sendFeedbackByAdmin(feedback)).unwrap();
        showToast("Feedback submitted successfully!", "success");
        setFeedback("");
      }
    } catch (err) {
      showToast(err || "Unexpected error occurred", "error");
    }
  };

  return (
    <div className="bg-gray-50 lg:ml-60 mt-14 min-h-screen px-6 pt-2 mx-auto font-[Poppins]">
      <h2 className="p-4 text-2xl font-semibold text-[#6955A5]">Support</h2>
      <div className="bg-white p-8 rounded-3xl max-w-4xl">
        <div className="border-b border-gray-200 mb-2">
          <h2 className="text-[#6955A5] font-medium text-sm border-b-2 border-[#6955A5] w-fit pb-1">
            Contact Us
          </h2>
        </div>

        <div className=" pt-6">
          <h3 className="font-medium text-[#333B69] mb-3">Contact Support</h3>

          <div className="space-y-2">
            <p className="text-sm text-[#232323]">
              📞 <span className="font-medium">Phone:</span>{" "}
              <a
                href="tel:0412345678"
                className="text-[#6955A5] hover:underline"
              >
                0412 345 678
              </a>
            </p>
            <p className="text-sm text-[#232323]">
              ✉️ <span className="font-medium">Email:</span>{" "}
              <a
                href="mailto:ugive@gmail.com"
                className="text-[#6955A5] hover:underline"
              >
                ugive2025@gmail.com
              </a>
            </p>
          </div>
        </div>
        <div className="mt-8">
          <label className="block text-[#333B69] font-medium text-sm mb-2">
            Feedback
          </label>
          <textarea
            rows="3"
            placeholder="Rate your experience"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-600 focus:ring-1 focus:ring-blue-100 outline-none resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`bg-[#6955A5] text-white px-12 cursor-pointer py-2.5 rounded-xl text-sm transition ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.02]"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contactus;
