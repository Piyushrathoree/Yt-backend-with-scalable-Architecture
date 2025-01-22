import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft,
  Bell, 
  Bookmark,
  Heart,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  Settings,
  Share,
  User,
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

// Tweet Component
const Tweet = ({ tweet, index }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="border-b border-white/10 p-4 hover:bg-white/5 transition-colors"
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-white/10" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold truncate">{tweet.author}</span>
            <span className="text-white/40 text-sm">@{tweet.username}</span>
            <span className="text-white/40 text-sm">· {tweet.time}</span>
          </div>
          <p className="text-[15px] mb-3 whitespace-pre-wrap">{tweet.content}</p>
          {tweet.image && (
            <div className="mb-3 rounded-xl overflow-hidden">
              <img 
                src={tweet.image} 
                alt="Tweet media" 
                className="w-full h-auto"
              />
            </div>
          )}
          <div className="flex justify-between items-center text-white/40">
            <Button variant="ghost" size="icon" className="rounded-full hover:text-blue-400 hover:bg-blue-400/10">
              <MessageCircle className="w-4 h-4" />
              <span className="ml-2 text-sm">{tweet.replies}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`rounded-full ${isLiked ? 'text-red-500 hover:text-red-600' : 'hover:text-red-400 hover:bg-red-400/10'}`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="ml-2 text-sm">{tweet.likes + (isLiked ? 1 : 0)}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`rounded-full ${isBookmarked ? 'text-blue-500' : 'hover:text-blue-400 hover:bg-blue-400/10'}`}
              onClick={() => setIsBookmarked(!isBookmarked)}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:text-blue-400 hover:bg-blue-400/10">
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export  function TweetsPage() {
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false)
  const observer = useRef()
  const lastTweetRef = useRef()

  // Simulate fetching tweets
  const fetchTweets = async () => {
    setLoading(true)
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newTweets = Array(10).fill(0).map((_, i) => ({
      id: tweets.length + i,
      author: `User ${tweets.length + i + 1}`,
      username: `user${tweets.length + i + 1}`,
      content: `This is tweet number ${tweets.length + i + 1} with some interesting content about videos and creative work! #creativity #content`,
      time: '2h',
      likes: Math.floor(Math.random() * 1000),
      replies: Math.floor(Math.random() * 50),
      image: i % 3 === 0 ? 'https://placehold.co/600x400' : null
    }))

    setTweets(prev => [...prev, ...newTweets])
    setHasMore(tweets.length < 50) // Limit to 50 tweets for demo
    setLoading(false)
  }

  useEffect(() => {
    fetchTweets()
  }, [])

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    }

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchTweets()
      }
    }, options)

    if (lastTweetRef.current) {
      observer.current.observe(lastTweetRef.current)
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [tweets, hasMore, loading])

  const sidebarLinks = [
    { icon: <Home className="w-5 h-5" />, label: "Home" },
    { icon: <User className="w-5 h-5" />, label: "Your Tweets" },
    { icon: <Bookmark className="w-5 h-5" />, label: "Bookmarks" },
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
            <Button variant="ghost" size="icon" className="mr-auto">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
          <a href="/" className="text-2xl font-bold">VideoShare</a>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              >
                <Search className="w-5 h-5" />
              </Button>
              <AnimatePresence>
                {isSearchExpanded && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="absolute right-0 top-0"
                  >
                    <input 
                      className="w-full h-9 pl-10 pr-4 bg-white/10 border-white/20 rounded-full text-sm focus:outline-none focus:border-white/40"
                      placeholder="Search users..."
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
                    className="absolute right-0 mt-2 w-64 bg-black text-white rounded-md shadow-lg py-1 z-50"
                  >
                    <div className="px-4 py-2 font-semibold border-b border-white/10">Notifications</div>
                    <div className="px-4 py-2 text-sm">
                      <p>@user1 liked your tweet</p>
                      <p className="text-white/40">2h ago</p>
                    </div>
                    <div className="px-4 py-2 text-sm">
                      <p>@user2 commented on your tweet</p>
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
                    className="absolute right-0 mt-2 w-56 bg-black text-white rounded-md shadow-lg py-1 z-50"
                  >
                    <div className="px-4 py-2 flex items-center gap-3 border-b border-white/10">
                      <div className="w-10 h-10 rounded-full bg-white/10" />
                      <div>
                        <p className="font-semibold">John Doe</p>
                        <p className="text-sm text-white/40">@johndoe</p>
                      </div>
                    </div>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-white/10">Your Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-white/10">Settings</a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-white/10 text-red-500">Log Out</a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 bg-black/50 backdrop-blur-sm border-r border-white/10 transition-all duration-300 z-40 ${isSidebarExpanded ? 'w-64' : 'w-16'}`}>
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
                {link.icon}
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
      <main className={`pt-16 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-16'}`}>
        <div className="max-w-2xl mx-auto border-x border-white/10 min-h-screen">
          {tweets.map((tweet, index) => (
            <Tweet 
              key={tweet.id} 
              tweet={tweet} 
              index={index}
              ref={index === tweets.length - 1  ? lastTweetRef : null}
            />
          ))}
          {loading && (
            <div className="p-4 text-center text-white/60">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full mx-auto"
              />
              Loading more tweets...
            </div>
          )}
          {!hasMore && (
            <div className="p-4 text-center text-white/60">
              No more tweets to load
            </div>
          )}
        </div>
      </main>
    </div>
  )
}