import { useState, useEffect } from 'react';

function Property() {
  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState({
    title: '',
    description: '',
    image: '',
    alt: ''
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('http://localhost:3000/properties');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProperty(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProperty),
      });

      if (!response.ok) {
        throw new Error(`Failed to add property. Status: ${response.status}`);
      }

      fetchProperties(); 
      setNewProperty({ title: '', description: '', image: '', alt: '' });
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

  return (
    <section className="py-10 bg-gray-900 sm:py-16 lg:py-24">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
            Trusted by hosts & guests across Garissa County
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Connecting property owners with those seeking quality venues and living spaces
          </p>
        </div>

        {/* Add Property Form */}
        <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto text-white">
          {['title', 'description', 'image', 'alt'].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              value={newProperty[field]}
              onChange={handleInputChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="block w-full p-2 mb-4 text-black rounded"
              required={field !== 'alt'}
            />
          ))}
          <button
            type="submit"
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
          >
            Add Property
          </button>
        </form>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 mt-12 lg:mt-24 gap-y-12 md:grid-cols-3 gap-x-6">
          {properties.map((property, index) => (
            <div key={property.id || index} className="md:px-4 lg:px-10">
              <img
                className={`${index % 2 === 0 ? '-rotate-1' : 'rotate-1'} rounded-lg border-2 border-gray-700`}
                src={property.image || 'https://via.placeholder.com/300'}
                alt={property.alt || property.title || 'Property image'}
              />
              <h3 className="mt-8 text-xl font-semibold leading-tight text-white">
                {property.title}
              </h3>
              <p className="mt-4 text-base text-gray-300">{property.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Property;
