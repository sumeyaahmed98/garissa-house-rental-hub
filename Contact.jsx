import { motion } from 'framer-motion';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full py-24 bg-teal-700 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-teal-700/80"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-teal-600/20 transform skew-x-12 -translate-x-1/4"></div>
        <div className="relative container mx-auto px-6 lg:px-12 xl:px-16">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1 
              variants={slideUp}
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            >
              Contact <span className="text-amber-400">Our Team</span>
            </motion.h1>
            <motion.p 
              variants={slideUp}
              className="text-xl md:text-2xl text-gray-100"
            >
              We're here to help you find your perfect rental or answer any questions you may have.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="relative w-full py-20">
        <div className="container mx-auto px-6 lg:px-12 xl:px-16">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {/* Contact Form */}
            <motion.div 
              variants={slideUp}
              className="bg-white rounded-xl shadow-2xl p-10"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a message</h2>
              {submitted && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-4 bg-green-100 text-green-700 rounded-lg"
                >
                  Thank you for your message! We'll get back to you soon.
                </motion.div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-lg font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-lg font-medium text-gray-700 mb-2">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Property Question">Property Question</option>
                    <option value="Booking">Booking</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Complaint">Complaint</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-lg font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  ></textarea>
                </div>
                <div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-300 shadow-lg"
                  >
                    Send Message
                  </motion.button>
                </div>
              </form>
            </motion.div>

            {/* Contact Information */}
            <div className="space-y-8">
              <motion.div 
                variants={slideUp}
                className="bg-white rounded-xl shadow-2xl p-10"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-teal-100 p-4 rounded-xl">
                      📍
                    </div>
                    <div className="ml-6">
                      <h3 className="text-xl font-bold text-gray-900">Our Address</h3>
                      <p className="mt-2 text-lg text-gray-600">Support Property</p>
                      <p className="text-lg text-gray-600">Garissa, Kenya</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-teal-100 p-4 rounded-xl">
                      📞
                    </div>
                    <div className="ml-6">
                      <h3 className="text-xl font-bold text-gray-900">Phone</h3>
                      <p className="mt-2 text-lg text-gray-600">+254720676025</p>
                      <p className="text-lg text-gray-600">Mon-Fri: 8am-6pm</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-teal-100 p-4 rounded-xl">
                      ✉️
                    </div>
                    <div className="ml-6">
                      <h3 className="text-xl font-bold text-gray-900">Email</h3>
                      <p className="text-lg text-gray-600">support@propertyrentals.com</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Map */}
              <motion.div 
                variants={slideUp}
                className="bg-white rounded-xl shadow-2xl overflow-hidden h-96"
              >
                <iframe
                  title="Our Location"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src="https://maps.google.com/maps?q=Garissa%2C%20Kenya&z=15&ie=UTF8&iwloc=&output=embed"
                  className="border-0"
                  allowFullScreen
                ></iframe>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
