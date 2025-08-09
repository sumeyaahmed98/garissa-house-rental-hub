import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [rentals, setRentals] = useState([]);
  const [properties, setProperties] = useState([]);
  const [activeTab, setActiveTab] = useState("rentals");
  const [editingProperty, setEditingProperty] = useState(null);
  const [editingRental, setEditingRental] = useState(null);
  const [propertyForm, setPropertyForm] = useState({
    title: "",
    description: "",
    image: "",
    alt: ""
  });
  const [rentalForm, setRentalForm] = useState({
    property: "",
    unit: "",
    tenantName: "",
    contact: "",
    email: "",
    rent: "",
    dueDate: "",
    duration: ""
  });

  // Fetch rentals and properties
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("http://localhost:3000/rental")
      .then((res) => res.json())
      .then((data) => setRentals(data))
      .catch((err) => console.error("Error fetching rentals", err));

    fetch("http://localhost:3000/properties")
      .then(res => res.json())
      .then(data => setProperties(data))
      .catch(err => console.error("Error fetching properties", err));
  };

  // Property CRUD operations
  const deleteProperty = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/properties/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProperties(properties.filter(property => property.id !== id));
        alert('Property deleted successfully!');
      } else {
        alert('Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Error deleting property');
    }
  };

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setPropertyForm({
      title: property.title,
      description: property.description,
      image: property.image,
      alt: property.alt
    });
  };

  const handlePropertyInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyForm({
      ...propertyForm,
      [name]: value
    });
  };

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingProperty) {
        // Update existing property
        response = await fetch(`http://localhost:3000/properties/${editingProperty.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(propertyForm),
        });
      } else {
        // Add new property
        response = await fetch('http://localhost:3000/properties', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(propertyForm),
        });
      }
      
      if (response.ok) {
        const updatedProperty = await response.json();
        if (editingProperty) {
          setProperties(properties.map(p => p.id === updatedProperty.id ? updatedProperty : p));
        } else {
          setProperties([...properties, updatedProperty]);
        }
        setEditingProperty(null);
        setPropertyForm({ title: "", description: "", image: "", alt: "" });
        alert(`Property ${editingProperty ? 'updated' : 'added'} successfully!`);
      } else {
        alert(`Failed to ${editingProperty ? 'update' : 'add'} property`);
      }
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Error saving property');
    }
  };

  // Rental CRUD operations
  const deleteRental = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/rental/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setRentals(rentals.filter(rental => rental.id !== id));
        alert('Rental deleted successfully!');
      } else {
        alert('Failed to delete rental');
      }
    } catch (error) {
      console.error('Error deleting rental:', error);
      alert('Error deleting rental');
    }
  };

  const handleEditRental = (rental) => {
    setEditingRental(rental);
    setRentalForm({
      property: rental.property,
      unit: rental.unit || "",
      tenantName: rental.tenantName,
      contact: rental.contact,
      email: rental.email,
      rent: rental.rent,
      dueDate: rental.dueDate,
      duration: rental.duration
    });
  };

  const handleRentalInputChange = (e) => {
    const { name, value } = e.target;
    setRentalForm({
      ...rentalForm,
      [name]: value
    });
  };

  const handleRentalSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingRental) {
        // Update existing rental
        response = await fetch(`http://localhost:3000/rental/${editingRental.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rentalForm),
        });
      } else {
        // Add new rental
        response = await fetch('http://localhost:3000/rental', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(rentalForm),
        });
      }
      
      if (response.ok) {
        const updatedRental = await response.json();
        if (editingRental) {
          setRentals(rentals.map(r => r.id === updatedRental.id ? updatedRental : r));
        } else {
          setRentals([...rentals, updatedRental]);
        }
        setEditingRental(null);
        setRentalForm({
          property: "",
          unit: "",
          tenantName: "",
          contact: "",
          email: "",
          rent: "",
          dueDate: "",
          duration: ""
        });
        alert(`Rental ${editingRental ? 'updated' : 'added'} successfully!`);
      } else {
        alert(`Failed to ${editingRental ? 'update' : 'add'} rental`);
      }
    } catch (error) {
      console.error('Error saving rental:', error);
      alert('Error saving rental');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Admin Dashboard
      </h2>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-300 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === "rentals" ? "text-green-600 border-b-2 border-green-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("rentals")}
        >
          Rental Submissions
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === "properties" ? "text-green-600 border-b-2 border-green-600" : "text-gray-600"}`}
          onClick={() => setActiveTab("properties")}
        >
          Property Management
        </button>
      </div>

      {/* Rental Submissions Tab */}
      {activeTab === "rentals" && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Rental Submissions</h3>
          
          {/* Rental Form */}
          {editingRental && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h4 className="text-lg font-medium mb-4">
                {editingRental ? "Edit Rental" : "Add New Rental"}
              </h4>
              <form onSubmit={handleRentalSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Property</label>
                    <input
                      type="text"
                      name="property"
                      value={rentalForm.property}
                      onChange={handleRentalInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Unit</label>
                    <input
                      type="text"
                      name="unit"
                      value={rentalForm.unit}
                      onChange={handleRentalInputChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Tenant Name</label>
                    <input
                      type="text"
                      name="tenantName"
                      value={rentalForm.tenantName}
                      onChange={handleRentalInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Contact</label>
                    <input
                      type="text"
                      name="contact"
                      value={rentalForm.contact}
                      onChange={handleRentalInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={rentalForm.email}
                      onChange={handleRentalInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Rent ($)</label>
                    <input
                      type="number"
                      name="rent"
                      value={rentalForm.rent}
                      onChange={handleRentalInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={rentalForm.dueDate}
                      onChange={handleRentalInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Duration (months)</label>
                    <input
                      type="number"
                      name="duration"
                      value={rentalForm.duration}
                      onChange={handleRentalInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingRental(null);
                      setRentalForm({
                        property: "",
                        unit: "",
                        tenantName: "",
                        contact: "",
                        email: "",
                        rent: "",
                        dueDate: "",
                        duration: ""
                      });
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    {editingRental ? "Update Rental" : "Add Rental"}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-xl">
              <thead>
                <tr className="bg-green-200 text-left text-sm uppercase font-semibold text-gray-700">
                  <th className="p-3">Property</th>
                  <th className="p-3">Unit</th>
                  <th className="p-3">Tenant</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Rent</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((rental) => (
                  <tr key={rental.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{rental.property}</td>
                    <td className="p-3">{rental.unit || "-"}</td>
                    <td className="p-3">{rental.tenantName}</td>
                    <td className="p-3">{rental.contact}</td>
                    <td className="p-3">{rental.email}</td>
                    <td className="p-3">${rental.rent}</td>
                    <td className="p-3">{rental.dueDate}</td>
                    <td className="p-3">{rental.duration}</td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditRental(rental)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteRental(rental.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Property Management Tab */}
      {activeTab === "properties" && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Property Management</h3>
          
          {/* Property Form */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h4 className="text-lg font-medium mb-4">
              {editingProperty ? "Edit Property" : "Add New Property"}
            </h4>
            <form onSubmit={handlePropertySubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={propertyForm.title}
                    onChange={handlePropertyInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={propertyForm.image}
                    onChange={handlePropertyInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={propertyForm.description}
                  onChange={handlePropertyInputChange}
                  className="w-full p-2 border rounded"
                  rows="3"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Image Alt Text</label>
                <input
                  type="text"
                  name="alt"
                  value={propertyForm.alt}
                  onChange={handlePropertyInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                {editingProperty && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProperty(null);
                      setPropertyForm({ title: "", description: "", image: "", alt: "" });
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {editingProperty ? "Update Property" : "Add Property"}
                </button>
              </div>
            </form>
          </div>
          
          {/* Properties Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-xl">
              <thead>
                <tr className="bg-green-200 text-left text-sm uppercase font-semibold text-gray-700">
                  <th className="p-3">ID</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Image</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{property.id}</td>
                    <td className="p-3">{property.title}</td>
                    <td className="p-3">{property.description}</td>
                    <td className="p-3">
                      <img 
                        src={property.image} 
                        alt={property.alt} 
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProperty(property)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProperty(property.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;