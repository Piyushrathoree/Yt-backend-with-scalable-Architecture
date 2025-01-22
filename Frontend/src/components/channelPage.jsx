import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft,
  Bell, 
  ChevronDown,
  Clock, 
  Heart,
  Home,
  Menu,
  PlaySquare,
  Search,
  Share2,
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
    lg: "h-12 px-6 text-lg",
    icon: "h-9 w-9"
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

// Tab Component
const Tab = ({ children, isActive, onClick }) => {
  return (
    <button
      className={`px-4 py-2 font-medium transition-colors ${
        isActive ? 'text-white border-b-2 border-primary' : 'text-white/60 hover:text-white'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export  function ChannelPage() {
  const [activeTab, setActiveTab] = useState('videos')
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false)

  const channelData = {
    name: "TechMaster",
    username: "@techmaster",
    avatar: "https://placehold.co/100x100",
    banner: "https://placehold.co/1200x300",
    subscribers: 1000000,
    totalViews: 50000000,
    totalLikes: 2000000,
    totalVideos: 500,
    joinDate: "Jan 1, 2015",
    description: "Welcome to TechMaster! We create engaging content about the latest in technology, software development, and digital innovation. Join us on this exciting journey through the world of tech!",
  }

  const videos = Array(12).fill(0).map((_, i) => ({
    id: i + 1,
    thumbnail: "https://placehold.co/400x225",
    title: `Amazing Tech Video ${i + 1}`,
    views: `${Math.floor(Math.random() * 1000)}K views`,
    timestamp: `${Math.floor(Math.random() * 12) + 1} months ago`
  }))

  const playlists = [
    { id: 1, name: "Web Development Basics", videoCount: 20 },
    { id: 2, name: "Advanced JavaScript Techniques", videoCount: 15 },
    { id: 3, name: "Mobile App Development", videoCount: 25 },
    { id: 4, name: "Data Science and Machine Learning", videoCount: 30 },
  ]

  const sidebarLinks = [
    { icon: <Home className="w-5 h-5" />, label: "Home" },
    { icon: <Clock className="w-5 h-5" />, label: "History" },
    { icon: <PlaySquare className="w-5 h-5" />, label: "Your Videos" },
    { icon: <ThumbsUp className="w-5 h-5" />, label: "Liked Videos" },
  ]

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/10 bg-black/50 backdrop-blur-sm z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="lg:hidden"
              onClick={toggleSidebar}
            >
              {isSidebarExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <a href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">VideoShare</a>
          </div>
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <input 
                className="w-full h-9 pl-9 pr-4 bg-white/10 border border-white/20 rounded-full text-sm focus:outline-none focus:border-primary transition-colors"
                placeholder="Search..."
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Video className="w-5 h-5" />
            </Button>
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
              >
                <Bell className="w-5 h-5" />
              </Button>
              <AnimatePresence>
                {isNotificationDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-gray-900 text-white rounded-md shadow-lg py-1 z-50 border border-white/10"
                  >
                    <div className="px-4 py-2 font-semibold border-b border-white/10">Notifications</div>
                    <div className="px-4 py-2 text-sm hover:bg-white/5">
                      <p>@user1 liked your video</p>
                      <p className="text-white/40">2h ago</p>
                    </div>
                    <div className="px-4 py-2 text-sm hover:bg-white/5">
                      <p>@user2 commented on your video</p>
                      <p className="text-white/40">5h ago</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                <User className="w-5 h-5" />
              </Button>
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-gray-900 text-white rounded-md shadow-lg py-1 z-50 border border-white/10"
                  >
                    <div className="px-4 py-2 flex items-center gap-3 border-b border-white/10">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500" />
                      <div>
                        <p className="font-semibold">John Doe</p>
                        <p className="text-sm text-white/40">@johndoe</p>
                      </div>
                    </div>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-white/5">Your Channel</a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-white/5">Settings</a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-white/5 text-red-500">Log Out</a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 bg-transparent  border-r border-white/10 transition-all duration-300 z-40 ${isSidebarExpanded ? 'w-64' : 'w-16'}`}>
        <nav className="p-4 h-full flex flex-col">
          <div className="space-y-2 flex-grow">
            {sidebarLinks.map((link, index) => (
              <motion.a
                key={index}
                href="#"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors ${isSidebarExpanded ? '' : 'justify-center'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`${isSidebarExpanded ? '' : 'w-10 h-10 flex items-center justify-center'}`}>
                  {link.icon}
                </div>
                {isSidebarExpanded && <span>{link.label}</span>}
              </motion.a>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="self-start mt-auto"
            onClick={toggleSidebar}
            aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${isSidebarExpanded ? 'lg:ml-64' : 'lg:ml-16'}`}>
        {/* Channel Header */}
        <div className="relative">
          <img src={channelData.banner} alt="Channel Banner" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-6">
            <img src={channelData.avatar} alt={channelData.name} className="w-24 h-24 rounded-full border-4 border-black" />
            <div className="flex-grow">
              <h1 className="text-3xl font-bold">{channelData.name}</h1>
              <p className="text-white/60">{channelData.username}</p>
              <div className="flex items-center gap-4 mt-2">
                <span>{channelData.subscribers.toLocaleString()} subscribers</span>
                <span>{channelData.totalVideos.toLocaleString()} videos</span>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white">Subscribe</Button>
          </div>
        </div>

        {/* Channel Tabs */}
        <div className="border-b border-white/10 bg-transparent">
          <div className="flex overflow-x-auto max-w-screen-xl mx-auto">
            <Tab isActive={activeTab === 'videos'} onClick={() => setActiveTab('videos')}>Videos</Tab>
            
            <Tab isActive={activeTab === 'playlists'} onClick={() => setActiveTab('playlists')}>Playlists</Tab>
            <Tab isActive={activeTab === 'about'} onClick={() => setActiveTab('about')}>About</Tab>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-w-screen-xl mx-auto">
          {activeTab === 'videos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <motion.div
                  key={video.id}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="aspect-video rounded-lg overflow-hidden bg-white/5 mb-3 relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <PlaySquare className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <h3 className="font-medium mb-1 line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h3>
                  <p className="text-sm text-white/60">{video.views} • {video.timestamp}</p>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'playlists' && (
            <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {playlists.map((playlist) => (
                <motion.div
                  key={playlist.id}
                  className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-medium mb-2 text-lg">{playlist.name}</h3>
                  <p className="text-sm text-white/60">{playlist.videoCount} videos</p>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'about' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-2xl font-bold mb-4">About {channelData.name}</h2>
              <p className="mb-6 text-lg leading-relaxed">{channelData.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 rounded-lg p-6">
                <div>
                  <h3 className="font-medium mb-2 text-xl">Stats</h3>
                  <p className="mb-2">Joined {channelData.joinDate}</p>
                  <p className="mb-2">{channelData.totalViews.toLocaleString()} views</p>
                  <p>{channelData.totalLikes.toLocaleString()} likes</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2 text-xl">Details</h3>
                  <p className="mb-2">{channelData.totalVideos} videos</p>
                  <p>{channelData.subscribers.toLocaleString()} subscribers</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}