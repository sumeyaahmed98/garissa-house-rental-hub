import { motion } from 'framer-motion';

function About() {
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

  const locations = [
    { name: "Bulla Sunnah", properties: "120+", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
    { name: "Bulla Madina", properties: "85+", image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
    { name: "Bulla Mzuri", properties: "65+", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
    { name: "Bulla Hagar", properties: "90+", image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
    { name: "Garissa Town", properties: "200+", image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" }
  ];

  return (
    <div className="bg-teal-900">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            className="object-cover w-full h-full"
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Beautiful modern house interior"
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-teal-900/40"></div>

        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-6 lg:px-12 xl:px-16">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-4xl"
            >
              <motion.h1 
                variants={slideUp}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
              >
                Discover <span className="text-amber-400">Exceptional Rentals</span> Across Garissa
              </motion.h1>
              
              <motion.p 
                variants={slideUp}
                className="mt-8 text-xl md:text-2xl text-gray-100 max-w-3xl"
              >
                Find beautiful and affordable spaces for weddings and living experiences throughout the region.
              </motion.p>

              <motion.div 
                variants={slideUp}
                className="mt-12"
              >
                <button className="px-10 py-4 text-xl font-medium text-teal-900 bg-amber-400 rounded-lg hover:bg-amber-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-500/50">
                  Explore Locations
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="w-full py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12 xl:px-16">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Our <span className="text-teal-600">Coverage</span> Areas
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              We serve all major neighborhoods in Garissa with verified properties
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {locations.map((location, index) => (
              <motion.div
                key={index}
                variants={slideUp}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-2xl shadow-xl h-96"
              >
                <img 
                  src={location.image} 
                  alt={location.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <h3 className="text-3xl font-bold text-white">{location.name}</h3>
                    <div className="mt-2 px-4 py-2 bg-amber-400 text-teal-900 font-bold rounded-full inline-block">
                      {location.properties} properties
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-20 bg-teal-800">
        <div className="container mx-auto px-6 lg:px-12 xl:px-16">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <motion.div 
              variants={slideUp}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 text-center"
            >
              <div className="text-5xl font-bold text-amber-400">500+</div>
              <div className="mt-4 text-xl font-medium text-white">Happy Clients</div>
            </motion.div>
            <motion.div 
              variants={slideUp}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 text-center"
            >
              <div className="text-5xl font-bold text-amber-400">120+</div>
              <div className="mt-4 text-xl font-medium text-white">Wedding Venues</div>
            </motion.div>
            <motion.div 
              variants={slideUp}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 text-center"
            >
              <div className="text-5xl font-bold text-amber-400">300+</div>
              <div className="mt-4 text-xl font-medium text-white">Rental Homes</div>
            </motion.div>
            <motion.div 
              variants={slideUp}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 text-center"
            >
              <div className="text-5xl font-bold text-amber-400">24/7</div>
              <div className="mt-4 text-xl font-medium text-white">Support</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-amber-400">
        <div className="container mx-auto px-6 lg:px-12 xl:px-16 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-teal-900 mb-8">
              Ready to Find Your Perfect Space?
            </h2>
            <p className="text-xl md:text-2xl text-teal-800 max-w-4xl mx-auto mb-12">
              Join hundreds of satisfied clients who found their ideal venue or home through our platform.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 text-xl font-bold text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition-colors duration-300 shadow-lg"
            >
              Browse Listings Now
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default About;