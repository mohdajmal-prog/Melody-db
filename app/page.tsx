import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sprout,
  TruckIcon,
  Store,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Stunning Farm Background */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=7680&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/85" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-16">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl">
              <Sprout className="h-12 w-12 text-primary" strokeWidth={2.5} />
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-white">
              Melody
            </h1>
          </div>

          <p className="text-2xl md:text-4xl text-white mb-4 font-bold text-balance text-center">
            From Our Roots
          </p>
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto text-pretty text-center">
            Connect directly with verified local farmers. Order antibiotic-free
            meat, fresh milk, organic vegetables with live tracking, video
            verification & escrow-protected payments.
          </p>

          <div className="max-w-md mx-auto">
            <Card className="bg-white/95 backdrop-blur-md border-2 border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-10 text-center">
                <div className="w-28 h-28 mx-auto mb-8 rounded-3xl bg-primary flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-transform duration-300">
                  <Store className="h-14 w-14 text-white" strokeWidth={2.5} />
                </div>
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  Start Shopping Fresh
                </h2>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  Get fresh meat, milk & organic vegetables delivered from
                  verified local farmers
                </p>
                <a href="/auth">
                  <Button size="lg" className="w-full text-lg py-7 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 font-bold">
                    Login / Register
                  </Button>
                </a>
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-muted-foreground font-medium">
                    ✨ New user? Register in just 30 seconds
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <p className="text-white/80 text-sm mb-3">
                Want to sell your products or become a delivery partner?
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full">
                  <Sprout className="h-4 w-4 text-white/90" />
                  <span className="text-white text-sm font-medium">
                    Become a Farmer
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full">
                  <TruckIcon className="h-4 w-4 text-white/90" />
                  <span className="text-white text-sm font-medium">
                    Become a Driver
                  </span>
                </div>
              </div>
              <p className="text-white/60 text-xs mt-2">
                Register first, then upgrade from Settings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-balance">
            Why Choose Melody?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 - Transparency */}
            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-64 h-48 mx-auto mb-6 rounded-xl overflow-hidden bg-[url('/images/tractor-farm.jpeg')] bg-cover bg-center" />
                <h3 className="text-xl font-bold mb-3">100% Transparency</h3>
                <p className="text-muted-foreground">
                  Every farmer verified with KYC. Watch video proof of your
                  product before delivery. Track every step live on GPS.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 - Secure Payments */}
            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-48 h-32 sm:w-64 sm:h-48 mx-auto mb-6 rounded-xl overflow-hidden bg-[url('/images/delivery-concept.jpeg')] bg-cover bg-center" />
                <h3 className="text-lg sm:text-xl font-bold mb-3">
                  Escrow Protected
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Your money held safely in escrow. Released to farmer only
                  after confirmed delivery. Full refund for complaints.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 - Fast Delivery */}
            <Card className="border-2 hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-64 h-48 mx-auto mb-6 rounded-xl overflow-hidden bg-[url('/images/delivery-truck.jpeg')] bg-cover bg-center" />
                <h3 className="text-xl font-bold mb-3">Live GPS Tracking</h3>
                <p className="text-muted-foreground">
                  Know exactly where your order is. Real-time driver location,
                  ETA updates, and delivery notifications at every step.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sprout className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Melody</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Farm-to-Home delivery platform with complete transparency and
            verified farmers
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            2025 Melody. Built for demo presentation.
          </p>
        </div>
      </footer>
    </div>
  );
}
