import { useState } from "react";

export default function EventForm({ onSubmit, initialData = {}, submitLabel = "Save Event" }) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    date: initialData.date || "",
    location: initialData.location || "",
    capacity: initialData.capacity || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white shadow-md rounded-lg"
    >
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1">Event Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-400"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-400"
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-400"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-400"
        />
      </div>

      {/* Capacity */}
      <div>
        <label className="block text-sm font-medium mb-1">Capacity</label>
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          min="1"
          required
          className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-400"
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        {submitLabel}
      </button>
    </form>
  );
}
