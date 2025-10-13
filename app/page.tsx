"use client";

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ArrowRight,
  Play,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  Star,
  Heart,
  Brain,
  Wind,
  Scale,
  Award,
  Shield,
  Timer,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function WellnessLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [registrationCount, setRegistrationCount] = useState(87);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 44,
    seconds: 29,
  });
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [animatedStats, setAnimatedStats] = useState({
    participants: 0,
    success: 0,
    satisfaction: 0,
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Animated stats effect
  useEffect(() => {
    const animateStats = () => {
      const targets = { participants: 6900, success: 92, satisfaction: 98 };
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setAnimatedStats({
          participants: Math.floor(targets.participants * progress),
          success: Math.floor(targets.success * progress),
          satisfaction: Math.floor(targets.satisfaction * progress),
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);
    };

    animateStats();
  }, []);

  // Simulated registration counter
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && registrationCount < 97) {
        setRegistrationCount(prev => prev + 1);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [registrationCount]);

  const features = [
    {
      icon: Brain,
      title: "Stress Management",
      description: "Learn scientifically-proven techniques to reduce cortisol and find inner peace",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Wind,
      title: "Breathing Mastery",
      description: "Master ancient breathing techniques that activate your body's natural healing",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: Heart,
      title: "Emotional Balance",
      description: "Develop emotional intelligence and resilience for lasting mental wellness",
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      icon: Scale,
      title: "Natural Weight Loss",
      description: "Achieve sustainable weight loss without counting calories or strict diets",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  const learningPoints = [
    {
      icon: Brain,
      title: "Why it's never about calories",
      description: "Discover the real science behind sustainable weight loss",
    },
    {
      icon: Wind,
      title: "Activate natural fat-burning",
      description: "Learn yogic breathing techniques that reset your metabolism",
    },
    {
      icon: Heart,
      title: "3 key daily habits",
      description: "Simple changes that reset your hormones for effortless weight loss",
    },
    {
      icon: Calendar,
      title: "5-day transformation plan",
      description: "A clear roadmap to start seeing visible changes immediately",
    },
  ];

  const testimonials = [
    {
      name: "Ramesh K.",
      result: "Lost 9kg in 2 weeks",
      content: "I finally feel energetic after years of feeling drained. This approach is completely different from anything I've tried.",
      rating: 5,
    },
    {
      name: "Priya S.",
      result: "Sleep improved in 7 days",
      content: "No medicine, just simple yoga and breathwork. I'm sleeping through the night for the first time in months.",
      rating: 5,
    },
    {
      name: "Anjali M.",
      result: "Stress levels dropped significantly",
      content: "My stress levels dropped significantly",
      rating: 5,
    },
    {
      name: "Vikram K.",
      result: "No more back pain after 30 days",
      content: "No more back pain after just 30 days",
      rating: 5,
    },
    {
      name: "Neha R.",
      result: "Feel lighter and more energized",
      content: "I feel lighter and more energized",
      rating: 5,
    },
    {
      name: "Suresh T.",
      result: "Breathing techniques changed everything",
      content: "The breathing techniques changed everything",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "Is this suitable for beginners?",
      answer: "Absolutely! Our program is designed for all levels, from complete beginners to experienced practitioners. We provide modifications for every technique.",
    },
    {
      question: "How much time do I need to commit daily?",
      answer: "Just 20-30 minutes per day. The beauty of this approach is that small, consistent changes create massive transformations.",
    },
    {
      question: "Will this really work without counting calories?",
      answer: "Yes! When you address the root causes of weight gain (stress, poor sleep, hormonal imbalance), your body naturally returns to its optimal weight.",
    },
    {
      question: "What if I can't attend the live webinar?",
      answer: "No problem! All registered participants receive lifetime access to the recorded session and bonus materials.",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">AryaFlow</h1>
            </div>

            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#about" className="text-foreground transition-colors hover:text-primary">About</a>
                <a href="#webinar" className="text-foreground transition-colors hover:text-primary">Webinar</a>
                <a href="#testimonials" className="text-foreground transition-colors hover:text-primary">Success Stories</a>
                <a href="#faq" className="text-foreground transition-colors hover:text-primary">FAQ</a>
              </div>
            </nav>

            <div className="hidden md:block">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Join Free Webinar
              </Button>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-foreground hover:text-primary"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden">
              <div className="space-y-1 border-t border-border px-2 pb-3 pt-2 sm:px-3">
                <a href="#about" className="block px-3 py-2 text-foreground hover:text-primary">About</a>
                <a href="#webinar" className="block px-3 py-2 text-foreground hover:text-primary">Webinar</a>
                <a href="#testimonials" className="block px-3 py-2 text-foreground hover:text-primary">Success Stories</a>
                <a href="#faq" className="block px-3 py-2 text-foreground hover:text-primary">FAQ</a>
                <div className="px-3 py-2">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Join Free Webinar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-32 xl:py-40">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50"></div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto max-w-7xl text-center">
            <div className="mb-4 sm:mb-6 inline-flex items-center rounded-full bg-green-100 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-green-800">
              <Users className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Hosted by Certified Yoga Instructor Arjunsyoga</span>
              
            </div>

            <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight text-foreground">
              Lose Weight Naturally in{" "}
              <span className="text-green-600">2 Weeks</span>{" "}
              <span className="block sm:inline">Without Counting Calories</span>
            </h1>

            <p className="mx-auto mb-6 sm:mb-8 max-w-xl lg:max-w-2xl xl:max-w-3xl text-base sm:text-lg lg:text-xl leading-relaxed text-muted-foreground px-4 sm:px-0">
              Join the 60-minute Yoga Webinar that's helping busy people lose weight, sleep better, and feel calm again.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-green-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg text-white hover:bg-green-700 hover:scale-105 transform transition-all duration-200"
              >
                <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Reserve My Spot
              </Button>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center">
                <Star className="mr-1 h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                <span>100% evidence-based</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-center sm:text-left">7,500+ people joined our program</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Stats Section */}
      <section className="bg-muted/30 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="text-center bg-background/50 rounded-lg p-4 sm:p-6 shadow-sm">
              <div className="mb-2 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-green-600">
                {animatedStats.participants.toLocaleString()}+
              </div>
              <div className="text-sm sm:text-base lg:text-lg text-muted-foreground">Lives Transformed</div>
            </div>
            <div className="text-center bg-background/50 rounded-lg p-4 sm:p-6 shadow-sm">
              <div className="mb-2 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-green-600">
                {animatedStats.success}%
              </div>
              <div className="text-sm sm:text-base lg:text-lg text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center bg-background/50 rounded-lg p-4 sm:p-6 shadow-sm">
              <div className="mb-2 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-green-600">
                {animatedStats.satisfaction}%
              </div>
              <div className="text-sm sm:text-base lg:text-lg text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-black text-foreground sm:text-4xl">
              You don't need another diet —{" "}
              <span className="text-green-600">you need balance</span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              Most people gain weight not because of calories, but because of stress, poor sleep, and imbalanced routines. 
              This webinar shows how 20% changes in your lifestyle can create 80% transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <Brain className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">Stress</h3>
              <p className="text-muted-foreground">Increases cortisol, leading to stubborn belly fat</p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">Poor Sleep</h3>
              <p className="text-muted-foreground">Disrupts hunger hormones, making you crave junk food</p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                  <Scale className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">Imbalance</h3>
              <p className="text-muted-foreground">Throws your metabolism off, preventing natural weight loss</p>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Section */}
      <section id="webinar" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-black text-foreground sm:text-4xl">
              What You'll Learn in the Webinar
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {learningPoints.map((point, index) => (
              <Card 
                key={index} 
                className="border-border transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardHeader>
                  <div className="mb-4 flex items-center">
                    <div className={`mr-4 flex h-12 w-12 items-center justify-center rounded-lg ${
                      hoveredFeature === index ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600'
                    } transition-all duration-300`}>
                      <point.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-bold">{point.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {point.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-black text-foreground sm:text-4xl">
              Real People, Real Results
            </h2>
            <p className="text-xl text-muted-foreground">
              Join hundreds who've transformed their lives
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {testimonials.slice(0, 2).map((testimonial, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-6">
                  <div className="mb-4 flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="mb-4 text-lg font-medium text-foreground">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="border-t border-border pt-4">
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-green-600 font-medium">{testimonial.result}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {testimonials.slice(2).map((testimonial, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 text-sm text-muted-foreground">
                  "{testimonial.result}"
                </div>
                <div className="text-xs text-muted-foreground">— {testimonial.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Receive Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-black text-foreground sm:text-4xl">
              Here's What You'll Receive
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to start your transformation journey
            </p>
          </div>

          <div className="mx-auto max-w-4xl grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Live-Style Pre-Recorded Webinar
                </h3>
                <p className="text-muted-foreground">
                  60-70 minute comprehensive session on YouTube Live
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  5-Day Kickstart Workbook
                </h3>
                <p className="text-muted-foreground">
                  Downloadable guide to begin your transformation
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Community Access
                </h3>
                <p className="text-muted-foreground">
                  Guidance and accountability from fellow practitioners
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  ₹99 Fully Credited
                </h3>
                <p className="text-muted-foreground">
                  Complete credit toward any future yoga program
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-black text-foreground sm:text-4xl">
              Because We Focus on What{" "}
              <span className="text-green-600">Truly Causes</span> Weight Gain
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              We don't count calories. We balance your mind, breath, and body. Once stress drops and sleep improves, 
              the body starts healing — naturally.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-8 md:flex-row md:space-y-0 md:space-x-8">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Mind</h3>
              <p className="text-sm text-muted-foreground">Stress management</p>
            </div>

            <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90 md:rotate-0" />

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Wind className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Breath</h3>
              <p className="text-sm text-muted-foreground">Metabolic activation</p>
            </div>

            <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90 md:rotate-0" />

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                  <Heart className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Body</h3>
              <p className="text-sm text-muted-foreground">Natural healing</p>
            </div>

            <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90 md:rotate-0" />

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Scale className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Balance</h3>
              <p className="text-sm text-muted-foreground">Sustainable results</p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Card className="mx-auto max-w-md border-green-200 bg-green-50">
              <CardContent className="p-6">
                <h3 className="mb-2 text-xl font-bold text-green-800">The Result?</h3>
                <p className="text-green-700 font-medium">Natural, Sustainable Weight Loss</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-black text-foreground sm:text-4xl">
              Meet Arjun — Your Yoga Guide
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="mb-8 text-lg text-muted-foreground">
                Certified Yoga Instructor with over 5 years of self-practice and 3 years of teaching experience. 
                Arjun's mission is simple — to help people live healthier, stress-free lives without depending on medicines.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Award className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Certified Professional</h3>
                    <p className="text-sm text-muted-foreground">
                      Registered yoga instructor with international certification
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">8+ Years Experience</h3>
                    <p className="text-sm text-muted-foreground">
                      5 years of dedicated self-practice, 3 years teaching students
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Heart className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Holistic Approach</h3>
                    <p className="text-sm text-muted-foreground">
                      Focuses on natural healing through mind-body balance
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <img 
                src="/images/Arjun.jpg"
                alt="Arjun"
                className="rounded-lg shadow-lg max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-black text-foreground sm:text-4xl">
              Limited to 100 Participants Only
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              We focus deeply on each participant. Once the seats fill, registration closes. 
              You can attend the next webinar later, but why wait when transformation can start now?
            </p>
          </div>

          <div className="mx-auto max-w-md text-center">
            <div className="mb-8 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-green-100 p-4">
                <div className="text-3xl font-bold text-green-600">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-green-700">Hours</div>
              </div>
              <div className="rounded-lg bg-green-100 p-4">
                <div className="text-3xl font-bold text-green-600">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-green-700">Minutes</div>
              </div>
              <div className="rounded-lg bg-green-100 p-4">
                <div className="text-3xl font-bold text-green-600">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-green-700">Seconds</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 text-center mb-8">
              <div>
                <Users className="mx-auto mb-2 h-8 w-8 text-green-600" />
                <p className="text-sm text-muted-foreground">Only 100 seats available for focused attention</p>
              </div>
              <div>
                <Shield className="mx-auto mb-2 h-8 w-8 text-green-600" />
                <p className="text-sm text-muted-foreground">Secured payment via Razorpay</p>
              </div>
              <div>
                <Timer className="mx-auto mb-2 h-8 w-8 text-green-600" />
                <p className="text-sm text-muted-foreground">Register now, start transforming today</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-black text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-border">
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => setSelectedFaq(selectedFaq === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                    {selectedFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                {selectedFaq === index && (
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-black text-foreground sm:text-4xl">
              Join the 2-Week Transformation Journey
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
              Register now and start your journey to a lighter body and calmer mind
            </p>

            <Card className="mx-auto max-w-lg border-green-200 bg-green-50">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="mb-2 text-sm text-green-700">Investment for Your Health</div>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-green-800">₹99</span>
                    <span className="ml-2 text-lg text-green-600">only</span>
                  </div>
                </div>

                <div className="mb-6 space-y-2 text-left">
                  <div className="flex items-center text-green-700">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    60-min comprehensive webinar
                  </div>
                  <div className="flex items-center text-green-700">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    5-Day Kickstart Workbook
                  </div>
                  <div className="flex items-center text-green-700">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Community access & support
                  </div>
                </div>

                <div className="space-y-4">
                  
                  <Button className="w-full bg-green-600 py-3 text-lg text-white hover:bg-green-700 hover:scale-105 transform transition-all duration-200">
                    Secure My Spot Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>

                <p className="mt-4 text-xs text-green-600">
                  <Star className="mr-1 inline h-3 w-3 fill-current" />
                  Seats filling fast - ₹99 fully credited toward any future yoga plan
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="mb-4 text-2xl font-bold text-primary">AryaFlow</h3>
            <p className="mb-6 text-muted-foreground">
              Empowering natural wellness through ancient wisdom and modern science
            </p>
            <div className="mb-4 text-sm text-muted-foreground">
              © 2025 AryaFlow. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <a href="/aryaflow_privacy_policy.html" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </a>
              <a href="/aryaflow_terms_conditions.html" className="text-sm text-muted-foreground hover:text-primary">
                Terms & Conditions
              </a>
              <a href="/aryaflow_cancellation_refunds.html" className="text-sm text-muted-foreground hover:text-primary">
                Cancellation & Refunds
              </a>
              <a href="/aryaflow_contact_us.html" className="text-sm text-muted-foreground hover:text-primary">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
