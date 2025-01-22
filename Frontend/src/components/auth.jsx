import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight} from 'lucide-react'

// Button Component
const Button = ({ children, variant = "default", size = "default", className = "", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
  const variants = {
    default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
    outline: "border border-white/20 bg-transparent hover:bg-white/10",
    ghost: "hover:bg-white/10",
    google: "bg-white text-black hover:bg-gray-100",
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
      className={`flex h-12 w-full rounded-md border border-white/20 bg-white/5 px-4 py-2 text-white shadow-sm transition-colors placeholder:text-white/50 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

export  function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Animated background gradient */}
      <div 
        className="fixed inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(124, 58, 237, 0.5), transparent 25%)`
        }}
      />
      
      {/* Animated shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-3xl"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Auth Container */}
      <motion.div 
        className="relative w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="backdrop-blur-xl bg-black/40 rounded-2xl border border-white/10 p-8">
          <div className="text-center mb-8">
            <motion.h1 
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isLogin ? "Welcome back" : "Create account"}
            </motion.h1>
            <motion.p 
              className="text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {isLogin ? "Sign in to continue to VideoShare" : "Sign up to get started with VideoShare"}
            </motion.p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4 mb-6">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm text-white/70">Full Name</label>
                    <Input type="text" placeholder="Enter your name" />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Email</label>
                  <Input type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-white/70">Password</label>
                  <Input type="password" placeholder="Enter your password" />
                </div>
              </div>

              <div className="space-y-4">
                <Button className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                  {isLogin ? "Sign In" : "Sign Up"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-black/40 text-white/60">Or continue with</span>
                  </div>
                </div>

                <Button variant="google" className="w-full" size="lg">
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 text-center text-sm">
            <span className="text-white/60">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            {" "}
            <button
              className="text-purple-400 hover:text-purple-300 font-medium"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-16 -right-16 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-16 -left-16 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />
      </motion.div>
    </div>
  )
}