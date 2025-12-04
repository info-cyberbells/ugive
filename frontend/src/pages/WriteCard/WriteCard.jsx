import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import card from "/card.svg";
import coffeeCup from "/coffeeCup.svg";
import pizzaSlice from "/pizzaSlice.svg";
import { useDispatch, useSelector } from "react-redux";
import { getUniversities, getColleges } from "../../features/studentSlice";
import { sendStudentCard } from "../../features/studentCardSlice";

const CardForm = ({ onSubmit }) => {
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();
  const dispatch = useDispatch();

  const { universities, colleges } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUniversities());
  }, [dispatch]);

  const navigate = useNavigate();

  // State to hold form data
  const [formData, setFormData] = useState({
    name: "",
    recipientName: "",
    // recipientLastName: '',
    recipientEmail: "",
    collegeHouse: "",
    message: "",
    university: "",
    college: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleUniversityChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      university: value,
      college: "",
    }));

    setErrors((prev) => ({ ...prev, university: false, college: false }));

    if (value) {
      dispatch(getColleges(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) newErrors[key] = true;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Please fill all required fields!", "error");
      return;
    }

    if (!formData.university) {
      setErrors((prev) => ({ ...prev, university: true }));
      showToast("Please select a university.", "error");
      return;
    }

    if (!formData.college) {
      setErrors((prev) => ({ ...prev, college: true }));
      showToast("Please select a college.", "error");
      return;
    }

    const email = formData.recipientEmail;
    const emailRegex = /^[^\s@]+@usq\.edu\.au$/;

    if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, recipientEmail: true }));
      showToast("Only @usq.edu.au email is allowed.", "error");
      return;
    }

    setErrors({});

    const cardData = {
      recipient_name: formData.recipientName,
      recipient_email: formData.recipientEmail,
      college: formData.college,
      message: formData.message,
      type: "card",
    };

    dispatch(sendStudentCard(cardData))
      .unwrap()
      .then(() => {
        showToast("Card sent successfully!", "success");
        onSubmit();
      })
      .catch((error) => {
        showToast(error || "Failed to send card", "error");
      });
  };

  const inputClass =
    "w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-indigo-400 focus:border-indigo-500 transition duration-150 ";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="relative">
      <img src={coffeeCup} className="absolute left-190 top-10 z-1" alt="" />
      <div className="max-w-4xl font-[Poppins] px-8 pt-6 relative">
        <div className="flex items-center mb-4 text-indigo-800">
          <button
            onClick={() => navigate(-1)}
            className="p-2 mr-4 rounded-full cursor-pointer hover:bg-indigo-50 transition hover:scale-[1.10] duration-150"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
          </button>
          <h1 className="text-2xl font-medium text-[#5D3F87]">
            One card a week keeps the smiles going!
          </h1>
        </div>
        <div className="bg-white p-6 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6 pr-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* UNIVERSITY FIELD */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  University
                </label>

                <div className="relative">
                  <select
                    name="university"
                    value={formData.university || ""}
                    onChange={handleUniversityChange}
                    className={`${inputClass} appearance-none pr-10 ${
                      errors.university ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Select University</option>
                    {universities.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name}
                      </option>
                    ))}
                  </select>

                  {/* Dropdown Arrow */}
                  <svg
                    className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* COLLEGE FIELD */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  College
                </label>

                <div className="relative">
                  <select
                    name="college"
                    value={formData.college || ""}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none pr-10 ${
                      errors.college ? "border-red-500" : ""
                    }`}
                    disabled={!formData.university}
                  >
                    {!formData.university && (
                      <option value="">Select a university first</option>
                    )}

                    {formData.university && colleges.length === 0 && (
                      <option value="">No colleges available</option>
                    )}

                    {formData.university && colleges.length > 0 && (
                      <>
                        <option value="">Select College</option>
                        {colleges.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>

                  {/* Dropdown Arrow */}
                  <svg
                    className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <label htmlFor="name" className={labelClass}>
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your Name"
                  className={`${inputClass} ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
              </div>

              <div>
                <label htmlFor="recipientName" className={labelClass}>
                  Recipient's Name
                </label>
                <input
                  type="text"
                  id="recipientName"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                  placeholder="Enter Recipient's Name"
                  className={`${inputClass} ${
                    errors.recipientName ? "border-red-500" : ""
                  }`}
                />
              </div>

              {/* <div>
                            <label htmlFor="recipientLastName" className={labelClass}>Recipient's Last Name</label>
                            <input
                                type="text"
                                id="recipientLastName"
                                name="recipientLastName"
                                value={formData.recipientLastName}
                                onChange={handleChange}
                                placeholder="Enter Recipient's Last Name"
                                className={`${inputClass} ${errors.recipientLastName ? "border-red-500" : ""}`}
                            />
                        </div> */}

              <div className="md:col-span-2" >
                <label htmlFor="recipientEmail" className={labelClass}>
                  Recipient's Email
                </label>
                <input
                  type="email"
                  id="recipientEmail"
                  name="recipientEmail"
                  value={formData.recipientEmail}
                  onChange={handleChange}
                  placeholder="Enter Recipient's Email"
                  className={`${inputClass} ${
                    errors.recipientEmail ? "border-red-500" : ""
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="collegeHouse" className={labelClass}>
                  Recipient's College House
                </label>
                <input
                  type="text"
                  id="collegeHouse"
                  name="collegeHouse"
                  value={formData.collegeHouse}
                  onChange={handleChange}
                  placeholder="Type to search"
                  className={`${inputClass} ${
                    errors.collegeHouse ? "border-red-500" : ""
                  }`}
                />
              </div>
            </div>

            <div className="">
              <label htmlFor="message" className={labelClass}>
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter Your Message"
                className={`${inputClass} ${
                  errors.message ? "border-red-500" : ""
                }`}
              />
            </div>

            <div className="flex justify-center pt-8 relative z-10">
              <img
                src={pizzaSlice}
                className="relative -left-30 -top-6"
                alt=""
              />
              <button
                type="submit"
                className="w-full md:w-50 h-14 bg-[#6955A59A] text-gray-100 cursor-pointer font-semibold text-lg rounded-full hover:bg-[#6955A5] transition duration-300 transform hover:scale-[1.01] active:scale-[0.99]"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const SuccessMessage = ({ onGoBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const navigate = useNavigate();

  return (
    <>
      <div className=" pt-6 pl-4 text-indigo-800">
        <button
          // onClick={onGoBack}
          onClick={openModal}
          className="p-2 mr-4 rounded-full cursor-pointer hover:bg-indigo-50 transition duration-150"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
        </button>
      </div>
      <div className="flex justify-center">
        <div className="max-w-xl text-center">
          <h2 className=" text-2xl font-semibold font-[Poppins] text-[#6955A5] mb-6">
            Your Card is on its way!
          </h2>

          <p className="text-[#000000] font-semibold italic mb-8 max-w-sm mx-auto">
            Note: Cards are delivered each Thursday with a Tuesday evening
            cutoff to allow time for printing.
          </p>
          <div className="flex justify-center">
            <img src={card} className="h-52" alt="" />
          </div>
          <h3 className="text-xl font-semibold text-[#000000] tracking-tight mt-8 mb-8">
            Thank you for making a difference in someone's world today!
          </h3>

          <button
            // onClick={()=> navigate("/student-dashboard")}
            onClick={openModal}
            className="w-48 h-12 bg-[#E9B243] text-white font-bold text-lg border-3 border-white cursor-pointer rounded-full shadow-lg hover:bg-yellow-600 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Let's go!
          </button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex font-[Poppins] items-center justify-center bg-black/80">
      <div
        className="w-11/12 max-w-sm overflow-hidden rounded-xl bg-white px-6 py-10 shadow-2xl transition-all duration-300 transform scale-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="text-center">
          {/* Title */}
          <h2
            id="modal-title"
            className="text-xl font-bold tracking-tight text-black mb-6"
          >
            You're on a break!
          </h2>

          <p className="text-lg italic tracking-tight font-medium text-black mb-12">
            <p>Thanks for sending last card.</p>
            You can send another card from
            <span className="text-[#E8BD93] ml-1">next week</span>
          </p>

          {/* Action Button */}
          <button
            // onClick={()=> navigate("/student-dashboard")}
            onClick={onClose}
            className="w-full h-12 bg-[#E9B243] text-white font-normal text-lg border-3 border-white cursor-pointer rounded-full shadow-lg hover:bg-yellow-600 transition duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Let's go!
          </button>
        </div>
      </div>
    </div>
  );
};

const WriteCard = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmission = () => {
    setIsSubmitted(true);
  };

  const handleGoBack = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen ml-60 mt-14 bg-gray-50 flex items-start justify-center pb-20 font-sans">
      <div className="w-full max-w-7xl">
        {isSubmitted ? (
          <SuccessMessage onGoBack={handleGoBack} />
        ) : (
          <CardForm onSubmit={handleSubmission} />
        )}
      </div>
    </div>
  );
};

export default WriteCard;
