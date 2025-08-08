"use client"

import { useState } from "react"
import { ArrowRight, Check, Star, Zap, Shield, Brain, Rocket, Users, BarChart3, Clock, Menu, X, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const features = [
  {
    icon: Brain,
    title: "Neural Task Processing",
    description: "AI-powered task prioritization that learns from your workflow patterns and optimizes productivity."
  },
  {
    icon: Zap,
    title: "Quantum Speed Interface",
    description: "Lightning-fast performance with real-time synchronization across all your devices."
  },
  {
    icon: Shield,
    title: "Military-Grade Security",
    description: "End-to-end encryption ensures your data remains secure in the digital matrix."
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Deep insights into your productivity patterns with predictive performance metrics."
  },
  {
    icon: Users,
    title: "Team Synchronization",
    description: "Seamless collaboration tools that keep your team connected in the neural network."
  },
  {
    icon: Rocket,
    title: "Infinite Scalability",
    description: "From personal projects to enterprise operations, scales with your ambitions."
  }
]

const testimonials = [
  {
    name: "Alex Chen",
    role: "Tech Lead at NeuralCorp",
    content: "This platform revolutionized how our team manages complex projects. The AI insights are incredible.",
    rating: 5,
    avatar: "/tech-professional.png"
  },
  {
    name: "Sarah Martinez",
    role: "Product Manager",
    content: "The cyberpunk aesthetic isn't just beautiful—it actually makes me more focused and productive.",
    rating: 5,
    avatar: "/product-manager-brainstorm.png"
  },
  {
    name: "David Kim",
    role: "Startup Founder",
    content: "Finally, a task manager that feels like it's from the future. Our productivity increased 300%.",
    rating: 5,
    avatar: "/startup-founder.png"
  }
]

const pricingPlans = [
  {
    name: "Neural Basic",
    price: "Free",
    description: "Perfect for individual users starting their digital transformation",
    features: [
      "Up to 50 tasks",
      "Basic AI insights",
      "Standard security",
      "Mobile sync",
      "Community support"
    ],
    popular: false
  },
  {
    name: "Quantum Pro",
    price: "$12",
    period: "/month",
    description: "Advanced features for power users and small teams",
    features: [
      "Unlimited tasks",
      "Advanced AI analytics",
      "Team collaboration",
      "Priority support",
      "Custom integrations",
      "Advanced security"
    ],
    popular: true
  },
  {
    name: "Matrix Enterprise",
    price: "Custom",
    description: "Full-scale solution for large organizations",
    features: [
      "Everything in Pro",
      "Dedicated support",
      "Custom deployment",
      "Advanced admin controls",
      "SLA guarantee",
      "White-label options"
    ],
    popular: false
  }
]

export default function CyberpunkLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Animated background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      
      {/* Floating particles effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                <Brain className="h-6 w-6 text-cyan-400" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                TASKS APP
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Features
              </Link>
              <Link href="#testimonials" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Testimonials
              </Link>
              <Link href="#pricing" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Pricing
              </Link>
              <Link href="/login" className="text-gray-300 hover:text-cyan-400 transition-colors">
                Login
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-cyan-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 p-4 bg-slate-800/50 rounded-lg border border-cyan-500/30 backdrop-blur-sm">
              <div className="flex flex-col gap-4">
                <Link href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  Features
                </Link>
                <Link href="#testimonials" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  Testimonials
                </Link>
                <Link href="#pricing" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  Pricing
                </Link>
                <Link href="/login" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  Login
                </Link>
                <Link href="/register">
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              Tasks App v2.0 Now Available
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Task Management
              </span>
              <br />
              <span className="text-white">
                From The Future
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Experience the next evolution of productivity with AI-powered task management, 
              quantum-speed performance, and a cyberpunk interface that makes work feel like play.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/25 px-8 py-4 text-lg">
                  <Rocket className="h-5 w-5 mr-2" />
                  Start Your Journey
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 px-8 py-4 text-lg">
                <Clock className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-400 mt-12">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Neural Capabilities
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powered by advanced AI and designed for the digital age
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-8 max-w-md mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 group">
                <CardHeader>
                  <div className="p-3 rounded-full bg-cyan-500/20 border border-cyan-500/30 w-fit group-hover:bg-cyan-500/30 transition-colors">
                    <feature.icon className="h-6 w-6 text-cyan-400" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Tasks App Feedback
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              What digital pioneers are saying about the Tasks App
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-8 max-w-md mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img 
                      src={testimonial.avatar || "/placeholder.svg"} 
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full border border-cyan-500/30"
                    />
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Tasks App Access Levels
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose your path to digital transformation
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-8 max-w-md mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`bg-slate-800/50 border-cyan-500/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300 relative ${
                plan.popular ? 'ring-2 ring-cyan-500/50 shadow-lg shadow-cyan-500/20' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-400">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm">
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0' 
                      : 'border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400'
                  }`} variant={plan.popular ? 'default' : 'outline'}>
                    {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20">
          <Card className="bg-gradient-to-r from-slate-800/50 to-blue-900/50 border-cyan-500/30 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Ready to Enter the Tasks App?
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of digital pioneers who have already transformed their productivity. 
                Your neural journey begins now.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/25 px-8 py-4 text-lg">
                    <Brain className="h-5 w-5 mr-2" />
                      Get Started Now!
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 px-8 py-4 text-lg">
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 border-t border-cyan-500/30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                  <Brain className="h-5 w-5 text-cyan-400" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  TASKS APP
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                The future of task management, powered by neural networks and quantum computing.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-cyan-400 transition-colors">API</Link></li>
                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Integrations</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-cyan-400 transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Security</Link></li>
                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Compliance</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-cyan-500/30 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Tasks App. All rights reserved. Powered by quantum computing.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
