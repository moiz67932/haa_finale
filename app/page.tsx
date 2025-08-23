"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Car,
  Bell,
  Shield,
  Users,
  Smartphone,
  Star,
  ChevronDown,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Categorized hero image sets. Drop image files into /public/carousels/ with the
// names below (see README in the change summary after this edit).
const heroImages = {
  all: [
    "/carousels/homepage-1.png",
    "/carousels/homepage-2.png",
    "/carousels/homepage-3.png",
    "/carousels/homepage-4.png",
    "/carousels/homepage-5.png",
    "/carousels/homepage-6.png",
  ],
  home: [
    "/carousels/home-1.png",
    "/carousels/home-2.png",
    "/carousels/home-3.png",
  ],
  auto: [
    "/carousels/auto-1.png",
    "/carousels/auto-2.png",
    "/carousels/auto-3.png",
  ],
};
// Default landing page category (change to 'home' or 'auto' if desired)
const heroCategory: keyof typeof heroImages = "all";
const activeHeroImages = heroImages[heroCategory];

const features = [
  {
    icon: Home,
    title: "Home & Vehicle Profiles",
    description:
      "Keep specs, paint colours, tyre sizes and more in one tidy card.",
    bgColor: "bg-blue-500",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Automated alerts based on dates or mileage.",
    bgColor: "bg-orange-500",
  },
  {
    icon: Shield,
    title: "Receipts Vault",
    description: "Upload receipts & auto-extract warranty details.",
    bgColor: "bg-green-500",
  },
  {
    icon: Users,
    title: "Service Pro Finder",
    description: "Book rated electricians, plumbers and mechanics.",
    bgColor: "bg-purple-500",
  },
  {
    icon: Users,
    title: "Community",
    description: "Share projects, ask questions, get inspired.",
    bgColor: "bg-blue-400",
  },
  {
    icon: Smartphone,
    title: "Multi-Device",
    description: "100% responsive and PWA-ready.",
    bgColor: "bg-gray-600",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Homeowner & Car Enthusiast",
    content:
      '"HAA has completely transformed how I manage my home maintenance and vehicle care. I never miss a service appointment or lose a warranty again! The reminders are a lifesaver."',
    rating: 5,
  },
  {
    name: "Mike Rodriguez",
    role: "Property Manager",
    content:
      '"Managing multiple properties used to be a nightmare. HAA makes it simple to track everything from repairs to warranties across all my units. I\'m never going broke in maintenance!"',
    rating: 5,
  },
  {
    name: "Jennifer Chen",
    role: "Busy Professional",
    content:
      '"As someone with a hectic schedule, HAA keeps me organized. The receipt vault and automatic warranty extraction save me hours every month. It\'s like having a personal assistant!"',
    rating: 5,
  },
];

const faqs = [
  {
    question: "How does HAA help me track my home and vehicle maintenance?",
    answer:
      "HAA provides a centralized platform where you can log all maintenance activities, set reminders based on dates or mileage, and track warranties. You'll never miss important maintenance again.",
  },
  {
    question: "Can I upload and store receipts in HAA?",
    answer:
      "Yes! HAA includes a secure receipts vault where you can upload and store all your purchase receipts and warranty documents. Our system can even auto-extract warranty information.",
  },
  {
    question: "How does the Service Pro Finder work?",
    answer:
      "Our Service Pro Finder connects you with local service professionals like electricians, plumbers, and contractors. You can view ratings, read reviews, and contact them directly through the platform.",
  },
  {
    question: "Is my data secure with HAA?",
    answer:
      "Absolutely. We use bank-level encryption to protect your data and ensure your personal information and documents are completely secure.",
  },
  {
    question: "Can I access HAA on my mobile device?",
    answer:
      "Yes! HAA is fully responsive and works great on all devices. We also offer a Progressive Web App (PWA) for mobile users.",
  },
];

export default function LandingPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % activeHeroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image src="/Logo.jpg" alt="HAA" width={110} height={110} />
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="#home"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Home
              </Link>
              <Link
                href="#features"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Pricing
              </Link>
              <Link
                href="#about"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                About Us
              </Link>
              <Link
                href="#contact"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Contact
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:bg-[#f1f5f9] hover:text-[#186bbf]"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6">
                  Join Us for Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent"
      >
        {/* Background Images */}
        <div className="absolute inset-0 z-0">
          {activeHeroImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`Hero ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* subtle overlay to keep text readable while preserving image colors */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/20 via-black/8 to-black/20" />

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 lg:text-6xl">
              TRACK EVERY FIX,
              <br />
              EVERY MILE,
              <br />
              <span className="text-orange-500">EVERY WARRANTY</span>
            </h1>

            {/* Prominent tagline */}
            <p className="text-lg sm:text-2xl md:text-3xl text-white/95 font-semibold italic mb-6 max-w-3xl mx-auto leading-tight">
              <span className="text-orange-500 font-bold">
                Home and Auto Assistant
              </span>
              <span className="text-white/90">
                {" "}
                — because keeping track is no laughing matter.
              </span>
            </p>

            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="bg-white rounded-full px-6 py-2">
                <span className="text-blue-600 font-semibold">HOME</span>
              </div>
              <div className="w-2 h-2 bg-white/50 rounded-full" />
              <div className="bg-orange-500 rounded-full px-6 py-2">
                <span className="text-white font-semibold">AUTO</span>
              </div>
              <div className="w-2 h-2 bg-white/50 rounded-full" />
              <div className="bg-white rounded-full px-6 py-2">
                <span className="text-blue-600 font-semibold">ORGANIZED</span>
              </div>
            </div>

            <p className="text-xl text-white mb-4 max-w-2xl mx-auto">
              All your home and vehicle info—safe, searchable, and always
              up-to-date.
            </p>
            <p className="text-orange-500 font-semibold text-lg mb-8">
              IT'S ALL ABOUT ORGANIZATION
            </p>

            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg rounded-full">
              Join Us for Free
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {activeHeroImages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImageIndex ? "bg-orange-500" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Stay Organized
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From property maintenance to vehicle tracking, HAA provides all
              the tools you need in one organized platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow bg-white border border-gray-200 rounded-2xl">
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              About Home & Auto Assistant
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Born from the frustration of lost warranties, missed maintenance,
              and scattered paperwork,{" "}
              <span className="text-blue-600">
                HAA was created by homeowners and vehicle enthusiasts
              </span>{" "}
              who knew there had to be a better way to stay organized.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center mb-16 px-3 mx-auto max-w-6xl">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                Our Story
              </h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  It started with a simple question: "Where did I put that
                  warranty?" After spending countless hours searching through
                  boxes of receipts and folders of documents, our founders
                  realized that managing home and vehicle information shouldn't
                  be this complicated.
                </p>
                <p>
                  We built HAA to be the solution we wished existed – a single,
                  secure place where all your property and vehicle information
                  lives, with smart reminders that actually work and data that
                  save you time and money.
                </p>
                <p>
                  Today, thousands of homeowners and vehicle owners trust HAA to
                  keep their most valuable assets organized and well-maintained.
                  We're just getting started.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="bg-white rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:rotate-2 transform">
                <div className="w-full h-90 bg-white rounded-xl flex items-center justify-center">
                  <div className="text-gray-400 text-6xl">
                    <Image
                      src="/Pic5.png"
                      alt="Story"
                      className="rounded-xl"
                      width={250}
                      height={250}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-3 text-slate-800">Our Mission</h4>
              <p className="text-sm text-gray-600">
                To simplify property and vehicle management for everyone, making
                organization effortless and accessible.
              </p>
            </Card>

            <Card className="text-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-3 text-slate-800">Our Team</h4>
              <p className="text-sm text-gray-600">
                A passionate group of developers, designers, and home/auto
                enthusiasts dedicated to solving real problems.
              </p>
            </Card>

            <Card className="text-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-3 text-slate-800">
                Our Commitment
              </h4>
              <p className="text-sm text-gray-600">
                We're committed to building tools that save you time, money, and
                stress while protecting your investments.
              </p>
            </Card>

            <Card className="text-center p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-3 text-slate-800">Our Values</h4>
              <p className="text-sm text-gray-600">
                Privacy-first, user-focused, and community-driven. Your data is
                yours, and your success is our success.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Provider Callout */}
      <section className="py-20 bg-slate-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Are You a Service Professional?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Get new leads for as low as{" "}
            <span className="text-orange-500 font-semibold">$15/mo</span>.
            Connect with homeowners and vehicle owners in your area who need
            your expertise.
          </p>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-3">
            Claim Your Listing
          </Button>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-gray-600">
              Start free and upgrade as your needs grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <Card className="border border-gray-200 rounded-2xl shadow-sm bg-white">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-slate-800">
                    Starter
                  </h3>
                  <div className="text-4xl font-bold text-slate-800">$0</div>
                  <p className="text-gray-600">Free Forever</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Perfect for getting started
                  </p>
                </div>
                <ul className="space-y-3 mb-8 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Up to 2 properties</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Up to 2 vehicles</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Basic reminders</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">
                      Receipt storage (50MB)
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Mobile app access</span>
                  </li>
                </ul>
                <Button className="w-full bg-slate-800 hover:bg-slate-900 text-white rounded-full">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Owner Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="scale-105 z-10" // Added scale-105 and z-10
            >
              <Card className="border-2 border-orange-500 rounded-2xl relative shadow-lg">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-orange-500 text-white px-4 py-1 rounded-full font-medium">
                    MOST POPULAR
                  </Badge>
                </div>
                <CardContent className="p-8  rounded-2xl bg-[rgba(255,254,253,1)]">
                  {" "}
                  {/* Removed bg-[rgba(255,254,253,1)] from here */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-slate-800">
                      Pro Owner
                    </h3>
                    <div className="text-4xl font-bold text-slate-800">$5</div>
                    <p className="text-gray-600">/per month</p>
                    <p className="text-sm text-gray-500 mt-1">
                      For serious property & vehicle owners
                    </p>
                  </div>
                  <ul className="space-y-3 mb-8 text-sm">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">
                        Unlimited properties & vehicles
                      </span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">
                        Smart reminders & alerts
                      </span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">
                        Unlimited receipt storage
                      </span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">
                        Service provider booking
                      </span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">Community access</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">Priority support</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">Warranty tracking</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">
                        Maintenance scheduling
                      </span>
                    </li>
                  </ul>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full">
                    Start Pro Trial
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Provider Plan */}
            <Card className="border border-gray-200 rounded-2xl shadow-sm">
              <CardContent className="p-8 bg-white rounded-2xl ">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-slate-800">
                    Provider
                  </h3>
                  <div className="text-4xl font-bold text-slate-800">$15</div>
                  <p className="text-gray-600">/per month</p>
                  <p className="text-sm text-gray-500 mt-1">
                    For service professionals
                  </p>
                </div>
                <ul className="space-y-3 mb-8 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">
                      Everything in Pro Owner
                    </span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Professional listing</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Lead generation</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Customer management</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Booking calendar</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Payment processing</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Review management</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Analytics dashboard</span>
                  </li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                  Claim Your Listing
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by Homeowners and Vehicle Owners
            </h2>
            <p className="text-lg text-blue-600">
              Join thousands who trust HAA with their most valuable assets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {Array.from({ length: testimonial.rating }, (_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic leading-relaxed">
                      {testimonial.content}
                    </p>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonial.role}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 stats-gradient text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              HAA by the Numbers
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-white/80">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-white/80">Properties Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">25,000+</div>
              <div className="text-white/80">Vehicles Managed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">$2M+</div>
              <div className="text-white/80">In Warranties Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about HAA
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-gray-200 rounded-2xl px-6 bg-white"
                >
                  <AccordionTrigger className="flex items-center justify-between w-full text-left hover:no-underline py-6 group">
                    <div className="flex items-center justify-between w-full px-5">
                      <span className="font-medium text-slate-800">
                        {faq.question}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-500 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Want to Learn More?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have questions, feedback, or
            just want to say hello.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3">
              Contact Us
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-3">
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/Logo.jpg" alt="HAA" width={110} height={110} />
              </div>
              <p className="text-gray-400 mb-4">
                Track every fix, every mile, every warranty. Your complete home
                and auto assistant.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.854 8.252 8.252 0 01-6.113 2.13 11.626 11.626 0 006.652.458z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.479 1.492-3.835 3.75-3.835 1.098 0 2.253.194 2.253.194v2.458h-1.538c-1.21 0-1.488.741-1.488 1.49v1.938h2.626l-.405 2.712h-2.22V21.88a9.92 9.92 0 008.41-9.88z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C7.691 2 4 5.691 4 10v4c0 4.309 3.691 8 8 8s8-3.691 8-8V10c0-4.309-3.691-8-8-8zm0 2c3.314 0 6 2.686 6 6v4c0 3.314-2.686 6-6 6s-6-2.686-6-6V10c0-3.314 2.686-6 6-6zm5.293 3.293a1 1 0 011.414 1.414l-1.414 1.414a1 1 0 01-1.414-1.414l1.414-1.414zm-8.586 0a1 1 0 011.414 0l1.414 1.414a1 1 0 01-1.414 1.414l-1.414-1.414a1 1 0 010-1.414zM12 14a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Our Team
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Updates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            &copy; {new Date().getFullYear()} HAA. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
