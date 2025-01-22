import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bell, 
  Clock, 
  Heart,
  Home,
  Menu,
  Search,
  Settings,
  
  ThumbsUp,
  User,
  Video,
  X
} from 'lucide-react'

// Button Component
const Button = ({ children, variant = "default", size = "default", className = "", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
    outline: "border border-white/20 bg-transparent hover:bg-white/10",
    ghost: "hover:bg-white/10"
  }
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-6 text-lg"
  }
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// Input Component
const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

export  function VideosPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const sidebarLinks = [
    { icon: <Home className="w-5 h-5" />, label: "Home" },
   
    { icon: <Clock className="w-5 h-5" />, label: "Watch History" },
    { icon: <ThumbsUp className="w-5 h-5" />, label: "Liked Videos" },
  ]

  const videos = [
    {
      id: 1,
      thumbnail: "https://placehold.co/400x225",
      title: "Creating Amazing Video Content",
      channel: "VideoShare Tips",
      views: "120K views",
      timestamp: "2 hours ago"
    },
    // Repeat for more videos...
  ].concat(Array(11).fill(0).map((_, i) => ({
    id: i + 2,
    thumbnail: "https://placehold.co/400x225",
    title: "How to Make Professional Videos",
    channel: "Creator Academy",
    views: "50K views",
    timestamp: "1 day ago"
  })))

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/10 bg-black/50 backdrop-blur-sm z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="p-2" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <a href="/" className="text-2xl font-bold">VideoShare</a>
          </div>
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Input 
                className="w-full h-10 pl-10 pr-4 bg-white/10 border-white/20 rounded-full"
                placeholder="Search videos..."
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="p-2">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" className="p-2">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" className="p-2">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-black/50 backdrop-blur-sm border-r border-white/10 transition-transform duration-300 z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="p-4">
          <div className="space-y-2">
            {sidebarLinks.map((link, index) => (
              <motion.a
                key={index}
                href="#"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {link.icon}
                <span>{link.label}</span>
              </motion.a>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="px-3 mb-4 text-sm font-semibold text-white/40">Subscriptions</h3>
            {Array(5).fill(0).map((_, index) => (
              <motion.a
                key={index}
                href="#"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (index + 4) * 0.1 }}
              >
                <div className="w-6 h-6 rounded-full bg-white/10" />
                <span>Channel {index + 1}</span>
              </motion.a>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="p-6">
          {/* Categories */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {["All", "Gaming", "Music", "Education", "Entertainment", "Sports", "Technology", "Travel"].map((category, index) => (
              <motion.button
                key={index}
                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors whitespace-nowrap"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {category}
              </motion.button>
            ))}
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                className="group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="aspect-video rounded-lg overflow-hidden bg-white/5 mb-3">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1 line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-white/60">{video.channel}</p>
                    <p className="text-sm text-white/60">{video.views} • {video.timestamp}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}