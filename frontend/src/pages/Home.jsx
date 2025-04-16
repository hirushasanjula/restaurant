import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, Utensils, Calendar, ShoppingBag, Clock, Star, Coffee } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  
  // Food categories data with images
  const foodCategories = [
    { 
      name: "Appetizers", 
      path: "/menu",
      image: "/appetizers.jpg",
      description: "Start your meal right"
    },
    { 
      name: "Main Courses", 
      path: "/menu",
      image: "/main-courses.png",
      description: "Hearty entrees"
    },
    { 
      name: "Desserts", 
      path: "/menu",
      image: "/desserts.jpg",
      description: "Sweet endings"
    },
    { 
      name: "Beverages", 
      path: "/menu",
      image: "/beverages.avif",
      description: "Refreshing drinks"
    },
    { 
      name: "Pizza", 
      path: "/menu",
      image: "/pizza.jpg",
      description: "Handcrafted pizzas"
    },
    { 
      name: "Burgers", 
      path: "/menu",
      image: "/burgers.avif",
      description: "Gourmet burgers"
    },
  ];

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero Section with Improved Mobile Responsiveness */}
      <div className="relative h-64 sm:h-80 md:h-96 max-h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900 to-amber-700 opacity-90"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('/hero-image.jpg')", zIndex: "-1" }}
        ></div>
        <div className="max-w-7xl mx-auto h-full flex items-center px-4 sm:px-6 relative z-10">
          <div className="text-white w-full">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-3 drop-shadow-lg">
              A Culinary Journey <br />
              <span className="text-amber-300">For Your Senses</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg mb-3 sm:mb-5 max-w-2xl">
              Experience fine dining with our seasonal menu, crafted with locally-sourced ingredients 
              and passion for authentic flavors.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <Link
                to="/menu"
                className="flex items-center gap-1 sm:gap-2 bg-amber-500 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium hover:bg-amber-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <Utensils size={16} className="hidden sm:inline" />
                <Utensils size={14} className="sm:hidden" />
                Explore Menu
                <ChevronRight size={14} className="hidden sm:inline" />
              </Link>
              <Link
                to="/reservation"
                className="flex items-center gap-1 sm:gap-2 bg-white text-amber-800 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium hover:bg-amber-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <Calendar size={16} className="hidden sm:inline" />
                <Calendar size={14} className="sm:hidden" />
                Reserve Table
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Special Promotion - Responsive */}
      <div className="bg-amber-600 text-white py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-0 text-center sm:text-left">
              <Star size={16} className="text-amber-300" />
              <p className="text-sm sm:text-base font-medium">Special Offer: 20% off on all online orders this week!</p>
            </div>
            <Link
              to="/promotions"
              className="bg-white text-amber-600 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium hover:bg-amber-100 transition-colors duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Food Categories Section - 2 per row on mobile */}
      <div className="max-w-7xl mx-auto py-10 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-900">
            Explore Our <span className="text-amber-600">Menu Categories</span>
          </h2>
          <Link to="/menu" className="text-amber-600 font-medium flex items-center mt-2 md:mt-0 hover:text-amber-800 transition-colors">
            View Full Menu <ChevronRight size={16} />
          </Link>
        </div>
        
        {/* Updated grid to show 2 items per row on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {foodCategories.map((category, index) => (
            <Link to={category.path} key={index} className="group">
              <div className="relative h-40 sm:h-64 md:h-72 rounded-lg sm:rounded-xl overflow-hidden shadow-md sm:shadow-lg group-hover:shadow-xl transition-all duration-500">
                {/* Background Image with Zoom Effect */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${category.image}')` }}
                ></div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 group-hover:opacity-60 transition-opacity duration-300"></div>
                
                {/* Content - Smaller size for mobile */}
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-6 transform transition-transform duration-300 group-hover:translate-y-0">
                  <p className="text-amber-300 text-xs mb-0.5 sm:mb-1 sm:text-sm">{category.description}</p>
                  <h3 className="text-base sm:text-2xl font-bold text-white mb-1 sm:mb-3 drop-shadow-lg">{category.name}</h3>
                  <span className="inline-flex items-center gap-1 bg-amber-500 text-white px-2 sm:px-4 py-0.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-md group-hover:bg-amber-600 transition-colors duration-300">
                    <span className="hidden sm:inline">Explore</span> <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Chef's Recommendation - Responsive Layout */}
      <div className="bg-white py-10 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2">
              <div className="relative">
                <img 
                  src="/chef-special.jpg" 
                  alt="Chef's Special Dish" 
                  className="rounded-lg shadow-xl object-cover w-full h-64 sm:h-80 md:h-96"
                />
                <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-amber-600 text-white p-3 sm:p-4 rounded-lg shadow-lg">
                  <p className="font-bold text-sm sm:text-base">Chef's Special</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 mt-10 md:mt-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-900 mb-3 sm:mb-4">Chef's Recommendation</h2>
              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">
                Our head chef recommends the Grilled Salmon with Lemon Butter Sauce, 
                paired with seasonal vegetables and rosemary potatoes. This dish exemplifies
                our commitment to fresh ingredients and bold flavors.
              </p>
              <Link
                to="/menu/specials"
                className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-amber-200 transition-colors duration-300"
              >
                <Star size={18} />
                View Today's Specials
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Responsive */}
      <div className="max-w-7xl mx-auto py-10 sm:py-16 md:py-20 px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-amber-900 mb-8 sm:mb-12 md:mb-16">
          Why Guests <span className="text-amber-600">Choose Us</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {/* Feature 1 */}
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-amber-500">
            <div className="p-3 sm:p-4 bg-amber-100 rounded-full w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center mb-4 sm:mb-6 mx-auto">
              <Utensils size={24} className="text-amber-700" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-2 sm:mb-4 text-center">Exquisite Cuisine</h3>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              Our chefs create memorable dishes using premium ingredients and innovative cooking techniques 
              to deliver exceptional flavors in every bite.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-amber-500">
            <div className="p-3 sm:p-4 bg-amber-100 rounded-full w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center mb-4 sm:mb-6 mx-auto">
              <ShoppingBag size={24} className="text-amber-700" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-2 sm:mb-4 text-center">Easy Ordering</h3>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              Order your favorite dishes online for takeout or delivery with just a few clicks, 
              and enjoy our culinary creations at your convenience.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-amber-500 sm:col-span-2 md:col-span-1 sm:max-w-md sm:mx-auto md:max-w-none">
            <div className="p-3 sm:p-4 bg-amber-100 rounded-full w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center mb-4 sm:mb-6 mx-auto">
              <Clock size={24} className="text-amber-700" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-2 sm:mb-4 text-center">Open Hours</h3>
            <p className="text-sm sm:text-base text-gray-600 text-center">
              Visit us Monday to Friday from 11:00 AM to 10:00 PM, and weekends from 10:00 AM to 11:00 PM.
              Reservations recommended for dinner.
            </p>
          </div>
        </div>
      </div>

      {/* Customer Testimonials - Responsive */}
      <div className="bg-amber-900 py-10 sm:py-16 md:py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16">
            What Our <span className="text-amber-300">Guests Say</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Testimonial 1 */}
            <div className="bg-amber-800 p-6 sm:p-8 rounded-lg relative">
              <div className="absolute -top-5 sm:-top-6 left-6 sm:left-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-300 flex items-center justify-center">
                  <span className="text-amber-900 text-lg sm:text-xl font-bold">"</span>
                </div>
              </div>
              <p className="mt-4 mb-4 sm:mb-6 text-sm sm:text-base">
                The best dining experience I've had in years. The food was exceptional, and the service was impeccable. 
                I'll definitely be coming back!
              </p>
              <div className="flex items-center">
                <div className="mr-3 sm:mr-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-600"></div>
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base">Sarah Johnson</p>
                  <div className="flex text-amber-300">
                    <Star size={14} className="sm:hidden" />
                    <Star size={14} className="sm:hidden" />
                    <Star size={14} className="sm:hidden" />
                    <Star size={14} className="sm:hidden" />
                    <Star size={14} className="sm:hidden" />
                    <Star size={16} className="hidden sm:block" />
                    <Star size={16} className="hidden sm:block" />
                    <Star size={16} className="hidden sm:block" />
                    <Star size={16} className="hidden sm:block" />
                    <Star size={16} className="hidden sm:block" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-amber-800 p-6 sm:p-8 rounded-lg relative">
              <div className="absolute -top-5 sm:-top-6 left-6 sm:left-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-300 flex items-center justify-center">
                  <span className="text-amber-900 text-lg sm:text-xl font-bold">"</span>
                </div>
              </div>
              <p className="mt-4 mb-4 sm:mb-6 text-sm sm:text-base">
                I ordered takeout and was impressed by how well everything was packaged. The flavors were just as amazing 
                as dining in. Highly recommend their online ordering!
              </p>
              <div className="flex items-center">
                <div className="mr-3 sm:mr-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-600"></div>
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base">Michael Chen</p>
                  <div className="flex text-amber-300">
                    <Star size={14} className="sm:hidden" />
                    <Star size={14} className="sm:hidden" />
                    <Star size={14} className="sm:hidden" />
                    <Star size={14} className="sm:hidden" />
                    <Star size={14} className="sm:hidden" />
                    <Star size={16} className="hidden sm:block" />
                    <Star size={16} className="hidden sm:block" />
                    <Star size={16} className="hidden sm:block" />
                    <Star size={16} className="hidden sm:block" />
                    <Star size={16} className="hidden sm:block" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-amber-800 p-6 sm:p-8 rounded-lg relative md:col-span-2 lg:col-span-1 md:max-w-md md:mx-auto lg:max-w-none">
              <div className="absolute -top-5 sm:-top-6 left-6 sm:left-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-300 flex items-center justify-center">
                  <span className="text-amber-900 text-lg sm:text-xl font-bold">"</span>
                </div>
              </div>
              <p className="mt-4 mb-4 sm:mb-6 text-sm sm:text-base">
                We celebrated our anniversary here and they made it so special. The chef's tasting menu was a culinary journey 
                we won't forget. Perfect for special occasions!
              </p>
              <div className="flex items-center">
                <div className="mr-3 sm:mr-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-600"></div>
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base">Emily & David</p>
                  <div className="flex text-amber-300">
                    <Star size={14} className="sm:hidden" />
                    <Star size={14} className="sm:hidden" />
                    <Star size={14} className="sm:hidden" />
                    <Star size={14} className="sm:hidden" />
                    <Star size={14} className="sm:hidden" />
                    <Star size={16} className="hidden sm:block" />
                    <Star size={16} className="hidden sm:block" />
                    <Star size={16} className="hidden sm:block" />
                    <Star size={16} className="hidden sm:block" />
                    <Star size={16} className="hidden sm:block" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Responsive */}
      <div className="bg-amber-100 py-10 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-6 sm:p-10 md:p-16 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between">
            <div className="md:max-w-xl mb-6 md:mb-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-900 mb-3 sm:mb-4">Ready to Taste the Difference?</h2>
              <p className="text-base sm:text-lg text-amber-800 mb-0">
                Whether you're planning a special occasion, a casual meal with friends, or a quick takeout order,
                we're here to serve you with passion and excellence.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/order"
                className="bg-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium hover:bg-amber-700 transition-colors duration-300 shadow-md flex items-center justify-center gap-2"
              >
                <ShoppingBag size={18} />
                Order Online
              </Link>
              {!user ? (
                <Link
                  to="/auth"
                  className="bg-amber-100 text-amber-800 border border-amber-400 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium hover:bg-amber-200 transition-colors duration-300 shadow-md flex items-center justify-center gap-2"
                >
                  <Coffee size={18} />
                  Sign In / Register
                </Link>
              ) : (
                <Link
                  to="/account"
                  className="bg-amber-100 text-amber-800 border border-amber-400 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium hover:bg-amber-200 transition-colors duration-300 shadow-md flex items-center justify-center gap-2"
                >
                  <Coffee size={18} />
                  My Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;