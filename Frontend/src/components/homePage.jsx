import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { ArrowRight, Play, Search, Upload, Video, Wand2 } from "lucide-react";

// Button Component
const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
    outline: "border border-white/20 bg-transparent hover:bg-white/10",
    ghost: "hover:bg-white/10",
  };
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-6 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Input Component
const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

// Card Component
const Card = ({ className = "", children, ...props }) => {
  return (
    <div
      className={`rounded-lg border border-white/10 bg-card text-card-foreground shadow ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export function HomePage() {
  const { scrollYProgress } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Animated background gradient */}
        <div
          className="fixed inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(124, 58, 237, 0.5), transparent 25%)`,
            transform: `translateY(${backgroundY})`,
          }}
        />

        <header className="fixed top-0 w-full z-50 border-b border-white/10 backdrop-blur-sm">
          <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold">
              VideoShare
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost"><a href="./auth.jsx">Sign In</a></Button>
              <Button>Sign Up</Button>
            </div>
          </nav>
        </header>

        <main>
          {/* Hero Section */}
          <section className="min-h-screen flex items-center justify-center pt-16">
            <div className="container px-4 text-center">
              <motion.h1
                className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                What would you like to create?
              </motion.h1>
              <motion.div
                className="max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative">
                  <Input
                    className="w-full h-14 pl-12 pr-4 bg-white/10 border-white/20 text-lg rounded-full"
                    placeholder="Describe your video idea..."
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
                </div>
              </motion.div>
              <motion.div
                className="flex flex-wrap justify-center gap-2 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {[
                  "Create a travel vlog",
                  "Edit my gaming montage",
                  "Make a product review",
                ].map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="rounded-full"
                  >
                    {suggestion}
                  </Button>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-32 relative">
            <div className="container px-4">
              <motion.h2
                className="text-3xl sm:text-5xl font-bold text-center mb-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Create videos like never before
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Upload className="w-8 h-8" />,
                    title: "Easy Upload",
                    description:
                      "Drag and drop your videos or upload directly from your device",
                  },
                  {
                    icon: <Wand2 className="w-8 h-8" />,
                    title: "AI Enhancement",
                    description:
                      "Automatically enhance your videos with our AI-powered tools",
                  },
                  {
                    icon: <Video className="w-8 h-8" />,
                    title: "Live Streaming",
                    description:
                      "Go live and connect with your audience in real-time",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/60">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Demo Section */}
          <section className="py-32 relative">
            <div className="container px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl sm:text-5xl font-bold mb-6">
                    Start creating amazing videos today
                  </h2>
                  <p className="text-white/60 mb-8">
                    Join thousands of creators who are already using our
                    platform to share their stories with the world.
                  </p>
                  <Button size="lg" className="rounded-full">
                    Get Started <ArrowRight className="ml-2" />
                  </Button>
                </motion.div>
                <motion.div
                  className="relative aspect-video rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-20" />
                  <img
                    src="/placeholder.svg"
                    alt="Video creation demo"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full"
                    >
                      <Play className="mr-2" /> Watch Demo
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-32 relative">
            <div className="container px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { number: "10M+", label: "Creators" },
                  { number: "100M+", label: "Videos" },
                  { number: "1B+", label: "Views" },
                  { number: "150+", label: "Countries" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="text-4xl font-bold mb-2">{stat.number}</div>
                    <div className="text-white/60">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-32 relative">
            <div className="container px-4">
              <Card className="p-8 md:p-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-white/10 backdrop-blur-sm">
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl sm:text-5xl font-bold mb-6">
                    Ready to start creating?
                  </h2>
                  <p className="text-white/60 mb-8 max-w-2xl mx-auto">
                    Join our community of creators and start sharing your
                    stories with the world.
                  </p>
                  <Button size="lg" className="rounded-full">
                    Get Started Now <ArrowRight className="ml-2" />
                  </Button>
                </motion.div>
              </Card>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 py-8">
          <div className="container px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-white/60 text-sm">
                © 2024 VideoShare. All rights reserved.
              </div>
              <div className="flex gap-4">
                {["Terms", "Privacy", "Contact"].map((link) => (
                  <Link
                    key={link}
                    to="#"
                    className="text-sm text-white/60 hover:text-white"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
