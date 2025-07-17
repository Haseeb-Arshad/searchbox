import { motion } from "framer-motion";
import EnhancedSearchBar from "../EnhancedSearchBar";
import { Search, ShoppingBag, Zap, Sparkles, TrendingUp, Shield, Clock, Star } from "lucide-react";

const HomePage = () => {
  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Smart Search",
      description: "Find products across multiple stores with intelligent search algorithms"
    },
    {
      icon: <ShoppingBag className="h-6 w-6" />,
      title: "Price Comparison",
      description: "Compare prices from different retailers to get the best deals"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Get results in milliseconds with our optimized search technology"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Smart Recommendations",
      description: "Discover products based on your preferences and search history"
    }
  ];

  const benefits = [
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Save Time",
      description: "Find what you need in seconds"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Trusted Sources",
      description: "Only verified retailers"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Best Deals",
      description: "Always competitive prices"
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Quality First",
      description: "Top-rated products only"
    }
  ];

  const stats = [
    { number: "10M+", label: "Products" },
    { number: "50K+", label: "Users" },
    { number: "1000+", label: "Stores" },
    { number: "99.9%", label: "Uptime" }
  ];

  return (
    <div className="pt-20">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center relative bg-gray-50 dark:bg-gray-900 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white">
                Find Everything
                <br />
                <span className="text-gray-600 dark:text-gray-400">Instantly</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
                Search across thousands of stores to find the best products at the best prices
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <EnhancedSearchBar />
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center p-4">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Why Choose QuickFind?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Powerful features designed to make your shopping experience better
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4 text-gray-700 dark:text-gray-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
                  Shop Smarter, Not Harder
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                  Join thousands of smart shoppers who save time and money with QuickFind.
                </p>
                
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-700 dark:text-gray-300 flex-shrink-0">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">
                          {benefit.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {benefit.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Search className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Ready to Start?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Search millions of products from thousands of stores
                  </p>
                  <button className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                    Start Searching
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
  );
};

export default HomePage;