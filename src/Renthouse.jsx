import React, { useState } from "react";

const properties = [
  "Bulla Sunnah",
  "Bulla Madina",
  "Bulla Mzuri",
  "Garissa Town"
];
const unitProperties = ["Bulla Sunnah", "Bulla Madina", "Bulla Mzuri"];
const unitOptions = ["Flat A", "Flat B", "Flat C", "Flat D"];

const RentalForm = () => {
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [formData, setFormData] = useState({
    tenantName: "",
    contact: "",
    email: "",
    rent: "",
    dueDate: "",
    duration: "",
    utilities: "",
    notes: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullData = {
      property: selectedProperty,
      unit: selectedUnit || null,
      ...formData
    };

    try {
      const res = await fetch("http://localhost:3001/rental", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(fullData)
      });

      if (res.ok) {
        alert("Rental form submitted!");
        setSelectedProperty("");
        setSelectedUnit("");
        setFormData({
          tenantName: "",
          contact: "",
          email: "",
          rent: "",
          dueDate: "",
          duration: "",
          utilities: "",
          notes: ""
        });
      } else {
        alert("Submission failed.");
      }
    } catch (err) {
      alert("Error submitting form.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Rental Application Form
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 space-y-6"
      >
        <div>
          <label className="block font-medium mb-1">Select Property</label>
          <select
            name="property"
            value={selectedProperty}
            onChange={(e) => {
              setSelectedProperty(e.target.value);
              setSelectedUnit("");
            }}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Choose property</option>
            {properties.map((property, idx) => (
              <option key={idx} value={property}>
                {property}
              </option>
            ))}
          </select>
        </div>

        {unitProperties.includes(selectedProperty) && (
          <div>
            <label className="block font-medium mb-1">Select Unit</label>
            <select
              name="unit"
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Choose a unit</option>
              {unitOptions.map((unit, idx) => (
                <option key={idx} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="tenantName" placeholder="Tenant Name" required className="p-2 border rounded" value={formData.tenantName} onChange={handleChange} />
          <input name="contact" placeholder="Contact Number" required className="p-2 border rounded" value={formData.contact} onChange={handleChange} />
          <input name="email" placeholder="Email" className="p-2 border rounded" value={formData.email} onChange={handleChange} />
          <input name="rent" type="number" placeholder="Monthly Rent (USD)" required className="p-2 border rounded" value={formData.rent} onChange={handleChange} />
          <input name="dueDate" type="date" placeholder="Due Date" required className="p-2 border rounded" value={formData.dueDate} onChange={handleChange} />
          <select name="duration" required className="p-2 border rounded" value={formData.duration} onChange={handleChange}>
            <option value="">Select duration</option>
            <option value="6 months">6 months</option>
            <option value="1 year">1 year</option>
            <option value="2 years">2 years</option>
          </select>
        </div>

        <textarea name="utilities" rows="2" className="w-full p-2 border rounded" placeholder="Included Utilities" value={formData.utilities} onChange={handleChange}></textarea>
        <textarea name="notes" rows="2" className="w-full p-2 border rounded" placeholder="Additional Notes" value={formData.notes} onChange={handleChange}></textarea>

        <div className="text-center">
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">Submit Rental Form</button>
        </div>
      </form>
    </div>
  );
};

export default RentalForm;
