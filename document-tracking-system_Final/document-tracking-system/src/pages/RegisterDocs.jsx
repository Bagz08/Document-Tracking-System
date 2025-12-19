import { useState } from "react";
import { Save } from "lucide-react";

export default function RegisterDocs() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    docType: "",
    sendTo: "",
    notify: "",
    poNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get user info from localStorage (from login)
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("You must be logged in to register documents.");
      return;
    }

    try {
      const res = await fetch("http://172.20.10.2:5000/api/docs/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          docType: formData.docType,
          registered_by: user.id, // from logged-in user
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Server error:", data);
        alert(data.error || "Failed to register document");
        return;
      }

      const aiInfo = data.aiCategory 
        ? `\n🤖 AI Category: ${data.aiCategory} (${Math.round(data.aiConfidence * 100)}% confidence)`
        : '';
      alert(`✅ Document registered successfully! DTS No: ${data.dtsNumber}${aiInfo}`);
      setFormData({
        title: "",
        description: "",
        docType: "",
        sendTo: "",
        notify: "",
        poNumber: "",
      });
    } catch (err) {
      console.error("Request failed:", err);
      alert("Error connecting to server.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800 border-l-4 border-orange-500 pl-2">
        Register Docs
      </h1>

      {/* Form Card */}
      <div className="bg-[#fff8f7] p-8 rounded-2xl shadow-md w-full max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#540000]"
              placeholder="Enter document title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#540000]"
              placeholder="Enter description"
              required
            ></textarea>
          </div>

          {/* Doc Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Doc Type
            </label>
            <select
              name="docType"
              value={formData.docType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#540000]"
              required
            >
              <option value="">-- Doc Type --</option>
              <option value="Academics">Academics</option>
              <option value="Research and Extension">Research and Extension</option>
              <option value="Student Services">Student Services</option>
              <option value="Planning and Development">Planning and Development</option>
              <option value="Administration and Finance">Administration and Finance</option>
              <option value="Institute">Institute</option>
            </select>
          </div>

          {/* Send To Office */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Send to Office
            </label>
            <input
              type="text"
              name="sendTo"
              value={formData.sendTo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#540000]"
              placeholder="Enter target office"
            />
          </div>

          {/* People to Notify */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              People to Notify
            </label>
            <input
              type="text"
              name="notify"
              value={formData.notify}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#540000]"
              placeholder="Enter people to notify"
            />
          </div>

          {/* PO Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              PO Number
            </label>
            <input
              type="text"
              name="poNumber"
              value={formData.poNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#540000]"
              placeholder="Enter PO number"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 bg-sky-200 hover:bg-sky-300 text-[#540000] font-semibold px-5 py-2 rounded-md shadow transition"
            >
              <Save size={18} />
              Save & Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
