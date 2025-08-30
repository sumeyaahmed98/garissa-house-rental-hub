import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiHome, FiMapPin, FiDollarSign, FiCheck, FiStar, FiUser, FiHeart } from 'react-icons/fi';
import { FaHome, FaStar } from 'react-icons/fa';


const Home = () => {
  const [activeTab, setActiveTab] = useState('rent');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [propertyType, setPropertyType] = useState('all');

  // Sample property data
  const properties = [
    {
      id: 1,
      title: 'Modern Downtown Apartment',
      location: 'garissa',
      price: 250,
      beds: 2,
      baths: 1,
      sqft: 950,
      type: 'apartment',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      featured: true
    },
    {
      id: 2,
      title: 'Luxury Beachfront Villa',
      location: 'daru-salam',
      price: 450,
      beds: 4,
      baths: 3,
      sqft: 2200,
      type: 'house',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      featured: true
    },
    {
      id: 3,
      title: 'Cozy  Cabin',
      location: 'al waqof',
      price: 180,
      beds: 3,
      baths: 2,
      sqft: 1200,
      type: 'cabin',
      image: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      featured: true
    },
    {
      id: 4,
      title: 'Chic Urban Loft',
      location: 'garissa',
      price: 200,
      beds: 1,
      baths: 1,
      sqft: 850,
      type: 'apartment',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 5,
      title: 'Historic Townhouse',
      location: 'motown, Mo',
      price: 320,
      beds: 3,
      baths: 2.5,
      sqft: 1800,
      type: 'house',
      image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 6,
      title: 'Seaside Cottage',
      location: 'San Diego, ',
      price: 275,
      beds: 2,
      baths: 1,
      sqft: 1100,
      type: 'cottage',
      image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Yussuf Hussein',
      role: 'Frequent Traveler',
      content: 'This platform made finding my perfect vacation rental so easy. The verification process gave me peace of mind, and the properties exceeded expectations!',
      rating: 5,
      image: '/images/yuu.png'
    },
    {
      id: 2,
      name: 'Fardowsa Adan',
      role: 'Business Professional',
      content: 'As someone who travels monthly for work, I appreciate the consistent quality and easy booking process. The customer support is exceptional.',
      rating: 4,
       image: '/images/suu.png'
    },
    {
      id: 3,
      name: 'Hamza Hassan',
      role: 'Property Owner',
      content: 'Listing my property was straightforward, and I had bookings within days. The platform handles payments securely and makes the whole process worry-free.',
      rating: 5,
       image: '/images/hamza.png'
    }
  ];

  const stats = [
    { value: '500+', label: 'Happy Renters' },
    { value: '300+', label: 'Verified Properties' },
    { value: '50+', label: 'Cities Worldwide' },
    { value: '24/7', label: 'Customer Support' }
  ];

  const steps = [
    {
      title: 'Find Your Perfect Place',
      description: 'Browse thousands of verified listings with high-quality photos and detailed descriptions.',
      icon: <FiSearch className="w-8 h-8" />
    },
    {
      title: 'Book With Confidence',
      description: 'Secure booking with our trusted payment system and transparent cancellation policies.',
                    icon: <FiCheck className="w-8 h-8" />
    },
    {
      title: 'Enjoy Your Stay',
      description: 'Arrive to a clean, comfortable space with 24/7 support available if you need anything.',
      icon: <FiHome className="w-8 h-8" />
    }
  ];

  const benefits = [
    'Verified listings with quality standards',
    'Secure online payments',
    '24/7 customer support',
    'Transparent pricing with no hidden fees',
    'Flexible cancellation options'
  ];

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    // In a real implementation, this would call your backend API
    console.log('Search submitted:', { location, priceRange, propertyType });
    alert('Search functionality will be connected to your backend later');
  };

  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Beautiful modern house exterior"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-teal-900 opacity-40"></div>
        </div>

        {/* Hero content */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl w-full"
        >
          <div className="text-center">
            <motion.h1 
              variants={slideUp}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
            >
              Find Your Perfect <span className="text-amber-400">Home Away From Home</span>
            </motion.h1>
            <motion.p 
              variants={slideUp}
              className="text-xl text-white max-w-3xl mx-auto mb-12"
            >
              Discover thousands of verified rentals worldwide for your next vacation, business trip, or extended stay.
            </motion.p>
          </div>

          {/* Search bar */}
          <motion.div 
            variants={slideUp}
            className="bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto"
          >
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('rent')}
                className={`px-4 py-2 font-medium ${activeTab === 'rent' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'}`}
              >
                Rent a Property
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`px-4 py-2 font-medium ${activeTab === 'list' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'}`}
              >
                List Your Property
              </button>
            </div>

            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    aria-label="Search by location"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiHome className="text-gray-400" />
                  </div>
                  <select
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    aria-label="Select property type"
                  >
                    <option value="all">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="cabin">Cabin</option>
                    <option value="cottage">Cottage</option>
                  </select>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="text-gray-400" />
                  </div>
                  <select
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    aria-label="Select price range"
                  >
                    <option value="0,5000">Any Price</option>
                    <option value="0,100">$0 - $100</option>
                    <option value="100,200">$100 - $200</option>
                    <option value="200,300">$200 - $300</option>
                    <option value="300,5000">$300+</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  aria-label="Search properties"
                >
                  Search
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="animate-bounce text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Handpicked selections of our most exceptional rentals</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {properties.filter(p => p.featured).map((property) => (
              <motion.div 
                key={property.id}
                variants={slideUp}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-amber-400 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </div>
                  <button className="absolute top-4 left-4 bg-white p-2 rounded-full text-gray-800 hover:text-amber-500 transition-colors duration-300">
                    <FiHeart className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{property.title}</h3>
                    <span className="text-lg font-bold text-teal-600">${property.price}<span className="text-gray-500 text-sm font-normal">/night</span></span>
                  </div>
                  <p className="text-gray-600 mb-4 flex items-center">
                    <FiMapPin className="mr-1 text-teal-500" /> {property.location}
                  </p>
                  <div className="flex justify-between text-gray-500 border-t border-gray-100 pt-4">
                    <span>{property.beds} beds</span>
                    <span>{property.baths} baths</span>
                    <span>{property.sqft} sqft</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="text-center mt-12"
          >
            <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-8 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
              View All Properties
            </button>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Renting your perfect space has never been easier</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                variants={slideUp}
                className="bg-gray-50 rounded-lg p-8 text-center hover:bg-teal-50 transition-colors duration-300"
              >
                <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                <div className="mt-4 text-teal-600 font-medium">{index + 1}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Property Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Our Properties</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Find the perfect rental for your next adventure</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {properties.map((property) => (
              <motion.div 
                key={property.id}
                variants={slideUp}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <button className="absolute top-3 left-3 bg-white p-2 rounded-full text-gray-800 hover:text-amber-500 transition-colors duration-300">
                    <FiHeart className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.title}</h3>
                    <span className="text-md font-bold text-teal-600">${property.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2 flex items-center">
                    <FiMapPin className="mr-1 text-teal-500" /> {property.location}
                  </p>
                  <div className="flex justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                    <span>{property.beds} beds</span>
                    <span>{property.baths} baths</span>
                    <span>{property.sqft} sqft</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                variants={slideUp}
                className="p-4"
              >
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-teal-100">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Our Platform</h2>
              <p className="text-lg text-gray-600 mb-8">
                We're committed to providing the best rental experience with verified properties, secure payments, and exceptional customer service.
              </p>
              
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <FiCheck className="text-teal-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <button className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-8 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
                  Learn More About Us
                </button>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                  alt="Happy family in rental property" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/70 via-teal-900/30 to-transparent"></div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg w-3/4">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="text-amber-400 w-5 h-5" />
                  ))}
                </div>
                <p className="text-gray-800 font-medium mb-2">"Best rental experience we've ever had!"</p>
                <p className="text-gray-600 text-sm">The Johnson Family</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Don't just take our word for it - hear from our satisfied renters and property owners</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial) => (
              <motion.div 
                key={testimonial.id}
                variants={slideUp}
                className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="text-amber-400" />
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (
                    <FiStar key={i + testimonial.rating} className="text-gray-300" />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Rental?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">Join thousands of happy renters who found their ideal home away from home through our platform.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-teal-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-md transition duration-300"
              >
                Browse Properties
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-amber-400 hover:bg-amber-500 text-white font-medium py-3 px-8 rounded-md transition duration-300 border border-amber-400"
              >
                List Your Property
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-8"
          >
            <p className="text-gray-500 uppercase text-sm font-medium">Trusted by partners worldwide</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center"
          >
            <motion.div variants={slideUp} className="flex justify-center">
              <FaHome className="text-gray-700 w-24 h-24 opacity-70 hover:opacity-100 transition-opacity" />
            </motion.div>
            <motion.div variants={slideUp} className="flex justify-center">
              {/* <SiBookingdotcom className="text-gray-700 w-20 h-20 opacity-70 hover:opacity-100 transition-opacity" /> */}
            </motion.div>
            <motion.div variants={slideUp} className="flex justify-center">
              <FaStar className="text-gray-700 w-20 h-20 opacity-70 hover:opacity-100 transition-opacity" />
            </motion.div>
            <motion.div variants={slideUp} className="flex justify-center">
              <div className="text-gray-700 text-xl font-bold opacity-70 hover:opacity-100 transition-opacity">VRBO</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;