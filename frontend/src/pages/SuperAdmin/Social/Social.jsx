import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Upload } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addSocialLink,
  deleteSocialLink,
  getSocialLinks,
  updateSocialLink,
} from "../../../features/studentSlice";
import { useToast } from "../../../context/ToastContext";

export default function SocialLinksManager() {

    const {showToast} = useToast();

  const [links, setLinks] = useState([]);
  const [form, setForm] = useState({ name: "", img: "", link: "" });

  const [editingId, setEditingId] = useState(null);

  const dispatch = useDispatch();
  const { social, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getSocialLinks());
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setForm({
        ...form,
        img: preview,
        file: file,
      });
    }
  };

  const handleAdd = async () => {
  if (!form.name || !form.file || !form.link) return;

  try {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("link", form.link);
    formData.append("icon", form.file);

    await dispatch(addSocialLink(formData)).unwrap();

    showToast("Link Added Successfully", "success");

    setForm({ name: "", img: "", file: "", link: "" });

  } catch (error) {
    showToast(error || "Failed to add link", "error");
  }
};


  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      link: item.link,
      img: item.icon, 
      file: null, 
    });
  };

  const handleUpdate = async () => {
  if (!editingId) return;

  try {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("link", form.link);

    // Append file only if changed
    if (form.file) {
      formData.append("icon", form.file);
    }

    await dispatch(updateSocialLink({ id: editingId, formData })).unwrap();

    showToast("Link Updated Successfully", "success");

    // Reset form
    setForm({ name: "", img: "", file: "", link: "" });
    setEditingId(null);

  } catch (error) {
    showToast(error || "Failed to update link", "error");
  }
};


  const handleDelete = async (id) => {
  try {
    await dispatch(deleteSocialLink(id)).unwrap();
    showToast("Link Deleted Successfully", "success");
  } catch (error) {
    showToast(error || "Failed to delete link", "error");
  }
};


  return (
    <div className="min-h-screen font-[Poppins] ml-60 mt-14 pt-4 pb-24 px-4 space-y-5">
      <header className="">
        <h1 className="text-2xl font-semibold text-gray-900">
          Social Link Manager
        </h1>
      </header>

      <div className="bg-white p-6 rounded-xl border border-gray-100/50 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {" "}
          {editingId ? "Update Link" : "Add New Link"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          {/* Platform Name Input */}
          <div className="col-span-1">
            <label
              htmlFor="name"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Platform Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. LinkedIn, Instagram"
              className="w-full border border-gray-300 bg-white rounded-lg px-4 py-2 text-sm shadow-sm 
                  focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          {/* Image Upload Field */}
          <div className="col-span-1">
            <label
              htmlFor="img-upload"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Upload Icon
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                id="img-upload"
                name="img-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <label
                htmlFor="img-upload"
                className="cursor-pointer flex-grow border border-gray-300 bg-gray-50 text-gray-700 
                     rounded-lg px-3 py-2 text-sm shadow-sm hover:bg-gray-100 transition flex items-center 
                     justify-center h-[40px]"
                title={form.img ? "Image Selected" : "Click to select file"}
              >
                {form.img ? (
                  <span className="text-xs text-indigo-600 font-medium">
                    Image Selected
                  </span>
                ) : (
                  <span className="flex items-center space-x-1">
                    <Upload className="h-4 w-4" />
                    <span>Choose File</span>
                  </span>
                )}
              </label>

              {form.img && (
                <img
                  src={form.img}
                  alt="Preview"
                  className="h-9 w-9 object-cover border border-gray-300"
                />
              )}
            </div>
          </div>

          {/* Profile Link Input */}
          <div className="col-span-2">
            <label
              htmlFor="link"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Profile Link
            </label>
            <input
              id="link"
              name="link"
              value={form.link}
              onChange={handleChange}
              placeholder="e.g., https://linkedin.com/in/my-profile"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm 
                  focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          {editingId ? (
            <div className="flex flex-col md:flex-row gap-3 md:col-span-1">
              <button
                onClick={handleUpdate}
                className="w-full cursor-pointer px-6 py-2.5 text-xs font-medium bg-yellow-600 text-white 
                 rounded-lg shadow-md hover:bg-yellow-700 transition"
              >
                Update
              </button>

              <button
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "", img: "", file: "", link: "" });
                }}
                className="cursor-pointer px-6 py-2.5 text-xs font-semibold bg-gray-400 text-white 
                 rounded-lg shadow-md hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
  onClick={handleAdd}
  disabled={!form.name || !form.file || !form.link}
  className={`w-full md:col-span-1 px-6 py-2.5 text-sm font-semibold rounded-lg shadow-md transition 
    ${!form.name || !form.file || !form.link
      ? "bg-indigo-300 text-white cursor-not-allowed" 
      : "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
    }`
  }
>
  Add Link
</button>

          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100/50 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Your Current Links
        </h2>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Link
                </th>
                <th className="px-6 py-4 text-center font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {social?.map((item) => (
                <tr
                  key={item._id}
                  className="bg-white border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {item.name}
                  </td>

                  <td className="px-6 py-4">
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="h-10 w-10 object-cover rounded-md hover:scale-[1.05]"
                    />
                  </td>

                  <td className="px-6 py-4">
                    <a href={item.link} className="text-blue-600">
                      {item.link}
                    </a>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 cursor-pointer text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 cursor-pointer text-gray-500 hover:text-red-600 hover:bg-red-50 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {social?.length === 0 && (
                <tr key="no-data">
                  <td colSpan="4" className="text-center py-10 text-gray-500">
                    No social links found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
