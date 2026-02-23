"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Video,
  Home,
  Beef,
  Milk,
  Carrot,
  ChefHat,
  Heart,
  Settings,
  Plus,
  Minus,
  X,
  Users,
  Calendar,
  Package,
  Filter,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { Farmer } from "@/lib/cart-utils";
import { FloatingCartButton } from "@/components/floating-cart-button";
import { FarmerCardSkeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/hooks/use-favorites";
import { QuickFilters } from "@/components/quick-filters";
import { SortDropdown } from "@/components/sort-dropdown";

export default function CustomerPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [quickFilters, setQuickFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("distance");
  const [currentScreen, setCurrentScreen] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const bannerImages = [
    "/banner-1.jpeg",
    "/banner-2.jpeg",
    "/banner-3.jpeg",
    "/banner-4.jpeg",
  ];

  const placeholders = [
    "Search for chicken...",
    "Search for mutton...",
    "Search for milk...",
    "Search for vegetables...",
    "Search for dairy products...",
    "Search for nuts...",
  ];

  useEffect(() => {
    const userData = localStorage.getItem("melody_current_user");
    if (!userData) {
      router.push("/auth");
    } else {
      setUser(JSON.parse(userData));
      setLoading(false);
    }

    const handleNavigateToByProducts = () => {
      setCurrentScreen(1);
    };

    window.addEventListener('navigateToByProducts', handleNavigateToByProducts);
    return () => window.removeEventListener('navigateToByProducts', handleNavigateToByProducts);
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState({
    productTypes: [] as string[],
    keyword: "",
    weightMin: 0,
    weightMax: 50,
    priceMin: 0,
    priceMax: 1000,
    nearbyOnly: false,
    bulkOnly: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const {
    cartSummary,
    addToCart,
    increaseQuantityByProduct,
    decreaseQuantityByProduct,
    getItemQuantity,
    canAddItem,
  } = useCart();

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentScreen < 2) {
      setCurrentScreen(currentScreen + 1);
    }
    if (isRightSwipe && currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const farmTypes = [
    { id: "goat", name: "Goat Farm", icon: Beef, image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&h=300&fit=crop", bgColor: "#fef3c7" },
    { id: "chicken", name: "Poultry Farm", icon: ChefHat, image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=300&fit=crop", bgColor: "#ffedd5" },
    { id: "dairy", name: "Dairy Farm", icon: Milk, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop", bgColor: "#e0f2fe" },
    { id: "vegetables", name: "Vegetable Farm", icon: Carrot, image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop", bgColor: "#dcfce7" },
  ];

  const byProducts = [
    { id: "meat", name: "Meats", image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop", bgColor: "#d1f4e0", items: ["Ready to Cook Mutton", "Ready to Cook Chicken", "Marinated Meat", "Curry Cut Meat"] },
    { id: "vegetables", name: "Vegetables", image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&h=300&fit=crop", bgColor: "#d1f4e0", items: ["Dried Tomatoes", "Dried Leafy Greens", "Dehydrated Vegetables", "Sun-Dried Veggies"] },
    { id: "dried-fruits", name: "Dried Fruits", image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop", bgColor: "#d1f4e0" },
    { id: "eggs", name: "Country Eggs", image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop", bgColor: "#d1f4e0" },
    { id: "dried-fish", name: "Dried Fish", image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&h=300&fit=crop", bgColor: "#d1f4e0" },
    { id: "dairy", name: "Dairy Products", image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=300&fit=crop", bgColor: "#d1f4e0", items: ["Organic Ghee", "Fresh Paneer", "Natural Yogurt", "Farm Cheese", "Fresh Butter", "Buttermilk"] },
  ];

  const categories = [
    { id: "all", name: "All Products", icon: Home, image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=200&h=200&fit=crop", bgColor: "#f1f5f9" },
    { id: "chicken", name: "Desi Chicken", icon: ChefHat, image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=200&h=200&fit=crop", bgColor: "#ffedd5" },
    { id: "mutton", name: "Organic Mutton", icon: Beef, image: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=200&h=200&fit=crop", bgColor: "#fef3c7" },
    { id: "milk", name: "Fresh Milk", icon: Milk, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop", bgColor: "#e0f2fe" },
    { id: "dairy", name: "Dairy Products", icon: Milk, image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&h=200&fit=crop", bgColor: "#e0f2fe" },
    { id: "vegetables", name: "Vegetables", icon: Carrot, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=200&fit=crop", bgColor: "#dcfce7" },
    { id: "nuts", name: "Nuts & By-Products", icon: Package, image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=200&h=200&fit=crop", bgColor: "#f3e8ff" },
    { id: "bulk", name: "Function Halls", icon: ShoppingCart, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=200&h=200&fit=crop", bgColor: "#fef3c7" },
  ];

  const farmers = useMemo(
    () => [
      {
        id: 1,
        name: "Raju Goats",
        village: "Chevella",
        distance: 12,
        rating: 4.8,
        verified: true,
        location: { lat: 17.3064, lng: 78.3381 },
        products: [
          {
            type: "Goat",
            breed: "Osmanabadi",
            weightRangeMin: 22,
            weightRangeMax: 28,
            age: "8 months",
            available: 8,
            price: 650,
            category: "mutton",
            bulkAvailable: true,
          },
          {
            type: "Mutton ",
            breed: "ready to cook",
            weightRangeMin: 1,
            weightRangeMax: 1,
            age: "Daily Fresh",
            available: 25,
            price: 650,
            category: "mutton",
            bulkAvailable: false,
          },
        ],
        image: "/healthy-goat-farm-india.jpg",
      },
      {
        id: 2,
        name: "Lakshmi Farms",
        village: "Shankarpally",
        distance: 8,
        rating: 4.9,
        verified: true,
        location: { lat: 17.4563, lng: 78.1234 },
        products: [
          {
            type: "Desi Chicken",
            breed: "Country Chicken",
            weightRangeMin: 1.2,
            weightRangeMax: 1.8,
            age: "6 months",
            available: 25,
            price: 350,
            category: "chicken",
            bulkAvailable: false,
          },
        ],
        image: "/desi-country-chicken-farm.jpg",
      },
      {
        id: 3,
        name: "Krishna Dairy",
        village: "Moinabad",
        distance: 15,
        rating: 4.7,
        verified: true,
        location: { lat: 17.2345, lng: 78.5678 },
        products: [
          {
            type: "Cow Milk",
            breed: "Desi Cow",
            weightRangeMin: 1,
            weightRangeMax: 1,
            age: "Fresh Daily",
            available: 50,
            price: 60,
            category: "milk",
            bulkAvailable: true,
          },
        ],
        image: "/dairy-buffalo-milk-farm.jpg",
      },
      {
        id: 4,
        name: "Srinivas Organic",
        village: "Vikarabad",
        distance: 20,
        rating: 4.6,
        verified: true,
        location: { lat: 17.3456, lng: 77.9012 },
        products: [
          {
            type: "Mixed Vegetables",
            breed: "Organic",
            weightRangeMin: 1,
            weightRangeMax: 1,
            age: "Fresh Harvest",
            available: 100,
            price: 40,
            category: "vegetables",
            bulkAvailable: false,
          },
        ],
        image: "/organic-vegetable-farm-india.jpg",
      },
      {
        id: 6,
        name: "Pure Dairy Farms",
        village: "Sangareddy",
        distance: 18,
        rating: 4.8,
        verified: true,
        location: { lat: 17.4567, lng: 78.9012 },
        products: [
          {
            type: "Organic Ghee",
            breed: "Cow Ghee",
            weightRangeMin: 0.5,
            weightRangeMax: 5,
            age: "Fresh Made",
            available: 30,
            price: 600,
            category: "dairy",
            bulkAvailable: true,
          },
          {
            type: "Fresh Paneer",
            breed: "Cow Milk",
            weightRangeMin: 0.25,
            weightRangeMax: 2,
            age: "Daily Fresh",
            available: 50,
            price: 400,
            category: "dairy",
            bulkAvailable: false,
          },
          {
            type: "Natural Yogurt",
            breed: "Cow Milk",
            weightRangeMin: 0.5,
            weightRangeMax: 5,
            age: "Daily Fresh",
            available: 40,
            price: 70,
            category: "dairy",
            bulkAvailable: true,
          },
          {
            type: "Farm Cheese",
            breed: "Cow Milk",
            weightRangeMin: 0.25,
            weightRangeMax: 1,
            age: "Aged 2 weeks",
            available: 25,
            price: 500,
            category: "dairy",
            bulkAvailable: false,
          },
          {
            type: "Fresh Butter",
            breed: "Cow Milk",
            weightRangeMin: 0.25,
            weightRangeMax: 2,
            age: "Fresh Made",
            available: 35,
            price: 450,
            category: "dairy",
            bulkAvailable: true,
          },
          {
            type: "Buttermilk",
            breed: "Cow Milk",
            weightRangeMin: 0.5,
            weightRangeMax: 5,
            age: "Daily Fresh",
            available: 60,
            price: 40,
            category: "dairy",
            bulkAvailable: true,
          },
        ],
        image: "/dairy-buffalo-milk-farm.jpg",
      },
      {
        id: 5,
        name: "Sheep Valley",
        village: "Medchal",
        distance: 6,
        rating: 4.5,
        verified: false,
        location: { lat: 17.6789, lng: 78.3456 },
        products: [
          {
            type: "Sheep",
            breed: "Nellore",
            weightRangeMin: 15,
            weightRangeMax: 25,
            age: "7 months",
            available: 12,
            price: 550,
            category: "mutton",
            bulkAvailable: true,
          },
        ],
        image: "/healthy-goat-farm-india.jpg",
      },
      {
        id: 7,
        name: "Groundnut Farms",
        village: "Nalgonda",
        distance: 25,
        rating: 4.7,
        verified: true,
        location: { lat: 17.1234, lng: 79.5678 },
        products: [
          {
            type: "Groundnut",
            breed: "Organic",
            weightRangeMin: 1,
            weightRangeMax: 10,
            age: "Fresh Harvest",
            available: 200,
            price: 140,
            category: "nuts",
            bulkAvailable: true,
          },
          {
            type: "Peanut Butter",
            breed: "Organic",
            weightRangeMin: 0.5,
            weightRangeMax: 5,
            age: "Fresh Made",
            available: 50,
            price: 380,
            category: "nuts",
            bulkAvailable: false,
          },
        ],
        image: "https://tse4.mm.bing.net/th/id/OIP.Jaom5CRHXHFrl1w0QWogygHaE8?pid=Api&P=0&h=180",
      },
      {
        id: 8,
        name: "Dried Meat Products",
        village: "Tandur",
        distance: 22,
        rating: 4.6,
        verified: true,
        location: { lat: 17.2456, lng: 77.5789 },
        products: [
          {
            type: "Dried Goat Meat",
            breed: "Sun Dried",
            weightRangeMin: 0.5,
            weightRangeMax: 5,
            age: "Preserved",
            available: 30,
            price: 850,
            category: "nuts",
            bulkAvailable: true,
          },
          {
            type: "Dried Chicken",
            breed: "Smoked",
            weightRangeMin: 0.5,
            weightRangeMax: 3,
            age: "Preserved",
            available: 25,
            price: 750,
            category: "nuts",
            bulkAvailable: false,
          },
        ],
        image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&h=600&fit=crop",
      },
      {
        id: 9,
        name: "Organic Dried Vegetables",
        village: "Zaheerabad",
        distance: 28,
        rating: 4.5,
        verified: true,
        location: { lat: 17.6789, lng: 77.6012 },
        products: [
          {
            type: "Dried Tomatoes",
            breed: "Organic",
            weightRangeMin: 0.25,
            weightRangeMax: 2,
            age: "Sun Dried",
            available: 40,
            price: 320,
            category: "nuts",
            bulkAvailable: true,
          },
          {
            type: "Dried Leafy Greens",
            breed: "Organic",
            weightRangeMin: 0.1,
            weightRangeMax: 1,
            age: "Dehydrated",
            available: 35,
            price: 350,
            category: "nuts",
            bulkAvailable: false,
          },
          {
            type: "Dried Onions",
            breed: "Organic",
            weightRangeMin: 0.25,
            weightRangeMax: 1.5,
            age: "Dehydrated",
            available: 30,
            price: 280,
            category: "nuts",
            bulkAvailable: true,
          },
          {
            type: "Dried Garlic",
            breed: "Organic",
            weightRangeMin: 0.1,
            weightRangeMax: 1,
            age: "Sun Dried",
            available: 25,
            price: 420,
            category: "nuts",
            bulkAvailable: false,
          },
          {
            type: "Dried Carrots",
            breed: "Organic",
            weightRangeMin: 0.25,
            weightRangeMax: 1.5,
            age: "Dehydrated",
            available: 35,
            price: 300,
            category: "nuts",
            bulkAvailable: true,
          },
          {
            type: "Dried Beetroot",
            breed: "Organic",
            weightRangeMin: 0.25,
            weightRangeMax: 1,
            age: "Sun Dried",
            available: 28,
            price: 340,
            category: "nuts",
            bulkAvailable: false,
          },
        ],
        image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&h=600&fit=crop",
      },
      {
        id: 10,
        name: "Country Eggs Farm",
        village: "Pargi",
        distance: 19,
        rating: 4.8,
        verified: true,
        location: { lat: 17.1234, lng: 78.4567 },
        products: [
          {
            type: "Country Eggs",
            breed: "Free Range",
            weightRangeMin: 1,
            weightRangeMax: 1,
            age: "Fresh Daily",
            available: 100,
            price: 7,
            category: "nuts",
            bulkAvailable: true,
          },
          {
            type: "Duck Eggs",
            breed: "Farm Fresh",
            weightRangeMin: 1,
            weightRangeMax: 1,
            age: "Fresh Daily",
            available: 50,
            price: 10,
            category: "nuts",
            bulkAvailable: false,
          },
        ],
        image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&h=600&fit=crop",
      },
      {
        id: 11,
        name: "Groundnut Haulms Supply",
        village: "Kodangal",
        distance: 30,
        rating: 4.4,
        verified: true,
        location: { lat: 17.0123, lng: 77.8901 },
        products: [
          {
            type: "Groundnut Haulms",
            breed: "Cattle Fodder",
            weightRangeMin: 10,
            weightRangeMax: 100,
            age: "Dried",
            available: 500,
            price: 30,
            category: "nuts",
            bulkAvailable: true,
          },
          {
            type: "Groundnut Cake",
            breed: "Animal Feed",
            weightRangeMin: 5,
            weightRangeMax: 50,
            age: "Processed",
            available: 200,
            price: 50,
            category: "nuts",
            bulkAvailable: true,
          },
        ],
        image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=800&h=600&fit=crop",
      },
      {
        id: 13,
        name: "Dried Fruits Farm",
        village: "Anantapur",
        distance: 32,
        rating: 4.6,
        verified: true,
        location: { lat: 14.6819, lng: 77.6006 },
        products: [
          {
            type: "Dried Mango",
            breed: "Organic",
            weightRangeMin: 0.1,
            weightRangeMax: 0.5,
            age: "Sun Dried",
            available: 40,
            price: 35,
            category: "nuts",
            bulkAvailable: true,
          },
          {
            type: "Dried Banana",
            breed: "Natural",
            weightRangeMin: 0.1,
            weightRangeMax: 0.5,
            age: "Dehydrated",
            available: 35,
            price: 28,
            category: "nuts",
            bulkAvailable: false,
          },
          {
            type: "Dried Papaya",
            breed: "Organic",
            weightRangeMin: 0.1,
            weightRangeMax: 0.5,
            age: "Sun Dried",
            available: 30,
            price: 32,
            category: "nuts",
            bulkAvailable: true,
          },
          {
            type: "Dried Figs",
            breed: "Premium",
            weightRangeMin: 0.1,
            weightRangeMax: 0.5,
            age: "Naturally Dried",
            available: 25,
            price: 55,
            category: "nuts",
            bulkAvailable: false,
          },
          {
            type: "Dried Dates",
            breed: "Medjool",
            weightRangeMin: 0.1,
            weightRangeMax: 0.5,
            age: "Premium Quality",
            available: 45,
            price: 48,
            category: "nuts",
            bulkAvailable: true,
          },
          {
            type: "Dried Apricots",
            breed: "Turkish",
            weightRangeMin: 0.1,
            weightRangeMax: 0.5,
            age: "Sun Dried",
            available: 30,
            price: 52,
            category: "nuts",
            bulkAvailable: false,
          },
          {
            type: "Raisins",
            breed: "Seedless",
            weightRangeMin: 0.1,
            weightRangeMax: 0.5,
            age: "Premium",
            available: 50,
            price: 24,
            category: "nuts",
            bulkAvailable: true,
          },
          {
            type: "Dried Pineapple",
            breed: "Organic",
            weightRangeMin: 0.1,
            weightRangeMax: 0.5,
            age: "Dehydrated",
            available: 28,
            price: 38,
            category: "nuts",
            bulkAvailable: false,
          },
        ],
        image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800&h=600&fit=crop",
      },
      {
        id: 12,
        name: "Coastal Dried Fish",
        village: "Nellore",
        distance: 35,
        rating: 4.7,
        verified: true,
        location: { lat: 14.4426, lng: 79.9865 },
        products: [
          {
            type: "Dried Bombil (Bombay Duck)",
            breed: "Sun Dried",
            weightRangeMin: 0.25,
            weightRangeMax: 2,
            age: "Preserved",
            available: 50,
            price: 280,
            category: "nuts",
            bulkAvailable: true,
          },
          {
            type: "Dried Nethili (Anchovy)",
            breed: "Salted",
            weightRangeMin: 0.25,
            weightRangeMax: 1,
            age: "Preserved",
            available: 40,
            price: 220,
            category: "nuts",
            bulkAvailable: false,
          },
          {
            type: "Dried Ayala (Mackerel)",
            breed: "Sun Dried",
            weightRangeMin: 0.5,
            weightRangeMax: 2,
            age: "Preserved",
            available: 35,
            price: 320,
            category: "nuts",
            bulkAvailable: true,
          },
          {
            type: "Dried Eral (Prawns)",
            breed: "Salted",
            weightRangeMin: 0.25,
            weightRangeMax: 1,
            age: "Preserved",
            available: 30,
            price: 450,
            category: "nuts",
            bulkAvailable: false,
          },
          {
            type: "Dried Mathi (Sardines)",
            breed: "Sun Dried",
            weightRangeMin: 0.25,
            weightRangeMax: 1.5,
            age: "Preserved",
            available: 45,
            price: 250,
            category: "nuts",
            bulkAvailable: true,
          },
          {
            type: "Dried Vala (Ribbon Fish)",
            breed: "Salted",
            weightRangeMin: 0.5,
            weightRangeMax: 2,
            age: "Preserved",
            available: 25,
            price: 350,
            category: "nuts",
            bulkAvailable: false,
          },
        ],
        image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=800&h=600&fit=crop",
      },
    ],
    []
  );

  const filteredFarmers = useMemo(() => {
    let filtered = farmers.filter((farmer) => {
      if (!farmer.products) return false;
      // Product type filter
      if (filters.productTypes.length > 0) {
        const hasMatchingProduct = farmer.products.some((p) =>
          filters.productTypes.includes(p.type)
        );
        if (!hasMatchingProduct) return false;
      }

      // Keyword search
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        const matchesKeyword =
          farmer.name.toLowerCase().includes(keyword) ||
          farmer.village.toLowerCase().includes(keyword) ||
          farmer.products.some(
            (p) =>
              p.type.toLowerCase().includes(keyword) ||
              p.breed.toLowerCase().includes(keyword)
          );
        if (!matchesKeyword) return false;
      }

      // Weight range filter
      const hasWeightMatch = farmer.products.some(
        (p) =>
          ((p as any).weightRangeMax ?? (p as any).weightMax ?? 0) >=
            filters.weightMin &&
          ((p as any).weightRangeMin ?? (p as any).weightMin ?? 0) <=
            filters.weightMax
      );
      if (!hasWeightMatch) return false;

      // Price range filter
      const hasPriceMatch = farmer.products.some(
        (p) => p.price >= filters.priceMin && p.price <= filters.priceMax
      );
      if (!hasPriceMatch) return false;

      // Nearby filter (mock distance < 10km)
      if (filters.nearbyOnly && farmer.distance >= 10) return false;

      // Bulk only filter
      if (filters.bulkOnly) {
        const hasBulkProduct = farmer.products.some((p) => p.bulkAvailable);
        if (!hasBulkProduct) return false;
      }

      return true;
    });

    // Prioritization: verified first, then in-stock, nearest distance, best price
    filtered.sort((a, b) => {
      // Verified farmers first
      if (a.verified && !b.verified) return -1;
      if (!a.verified && b.verified) return 1;

      // In-stock items first (farmers with available > 0)
      const aInStock = a.products.some((p) => p.available > 0);
      const bInStock = b.products.some((p) => p.available > 0);
      if (aInStock && !bInStock) return -1;
      if (!aInStock && bInStock) return 1;

      // Nearest distance
      if (a.distance !== b.distance) return a.distance - b.distance;

      // Best price (lowest average price)
      const aAvgPrice =
        a.products.reduce((sum, p) => sum + p.price, 0) / a.products.length;
      const bAvgPrice =
        b.products.reduce((sum, p) => sum + p.price, 0) / b.products.length;
      return aAvgPrice - bAvgPrice;
    });

    return filtered;
  }, [filters, farmers]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-primary/90 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="h-12 bg-white/20 rounded animate-pulse" />
          </div>
        </header>
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <FarmerCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/90 shadow-lg rounded-b-xl relative">
        <div className="absolute inset-0 bg-white rounded-b-xl" style={{ zIndex: -1, transform: 'scale(1.01)' }}></div>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/customer/settings">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Melody</h1>
                <p className="text-sm text-white/90 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Hyderabad Area
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Filters"
                className="relative text-white hover:bg-white/20"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5" />
                {Object.values(filters).some((v) =>
                  Array.isArray(v)
                    ? v.length > 0
                    : v !== "" && v !== false && v !== 0 && v !== 50 && v !== 1000
                ) && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-secondary rounded-full flex items-center justify-center text-xs text-white font-bold">
                    !
                  </span>
                )}
              </Button>
              <Link href="/customer/services">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open services"
                  className="relative text-white hover:bg-white/20"
                >
                  <Users className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/customer/butcher">
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer shadow-lg p-0.5 hover:shadow-[0_0_20px_rgba(255,248,220,0.8)]">
                  <img 
                    src="/butcher-icon.png" 
                    alt="Butcher"
                    className="w-[110%] h-[110%] object-contain drop-shadow-[0_0_12px_rgba(255,248,220,0.9)]"
                  />
                </div>
              </Link>
            </div>
          </div>

          {/* Search Bar and Filters */}
          <div className="mt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
              <Input
                placeholder={placeholders[placeholderIndex]}
                className="pl-10 bg-white border-white/20"
                value={filters.keyword}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, keyword: e.target.value }))
                }
              />
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <Card className="p-4">
                <div className="space-y-4">
                  {/* Product Types */}
                  <div>
                    <Label className="text-sm font-medium">Product Types</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Goat", "Sheep", "Desi Chicken"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={filters.productTypes.includes(type)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters((prev) => ({
                                  ...prev,
                                  productTypes: [...prev.productTypes, type],
                                }));
                              } else {
                                setFilters((prev) => ({
                                  ...prev,
                                  productTypes: prev.productTypes.filter(
                                    (t) => t !== type
                                  ),
                                }));
                              }
                            }}
                          />
                          <Label htmlFor={type} className="text-sm">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Weight Range */}
                  <div>
                    <Label className="text-sm font-medium">
                      Weight Range: {filters.weightMin} - {filters.weightMax} kg
                    </Label>
                    <Slider
                      value={[filters.weightMin, filters.weightMax]}
                      onValueChange={([min, max]) =>
                        setFilters((prev) => ({
                          ...prev,
                          weightMin: min,
                          weightMax: max,
                        }))
                      }
                      max={50}
                      min={0}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <Label className="text-sm font-medium">
                      Price Range: ₹{filters.priceMin} - ₹{filters.priceMax}
                    </Label>
                    <Slider
                      value={[filters.priceMin, filters.priceMax]}
                      onValueChange={([min, max]) =>
                        setFilters((prev) => ({
                          ...prev,
                          priceMin: min,
                          priceMax: max,
                        }))
                      }
                      max={1000}
                      min={0}
                      step={10}
                      className="mt-2"
                    />
                  </div>

                  <Separator />

                  {/* Additional Filters */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="nearby"
                        checked={filters.nearbyOnly}
                        onCheckedChange={(checked) =>
                          setFilters((prev) => ({
                            ...prev,
                            nearbyOnly: !!checked,
                          }))
                        }
                      />
                      <Label htmlFor="nearby" className="text-sm">
                        {"Nearby farmers (< 10km)"}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="bulk"
                        checked={filters.bulkOnly}
                        onCheckedChange={(checked) =>
                          setFilters((prev) => ({
                            ...prev,
                            bulkOnly: !!checked,
                          }))
                        }
                      />
                      <Label htmlFor="bulk" className="text-sm">
                        Bulk/function hall supply available
                      </Label>
                    </div>
                  </div>

                  {/* Clear All Filters */}
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilters({
                        productTypes: [],
                        keyword: "",
                        weightMin: 0,
                        weightMax: 50,
                        priceMin: 0,
                        priceMax: 1000,
                        nearbyOnly: false,
                        bulkOnly: false,
                      })
                    }
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </header>

      {/* Category Pills */}
      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {currentScreen === 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 w-[90px] h-[100px] rounded-[16px] flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? "border-2 border-[#16a34a] shadow-[0_0_20px_rgba(22,163,74,0.3)]"
                      : "border-2 border-transparent shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:scale-105"
                  }`}
                  style={{ backgroundColor: cat.bgColor }}
                >
                  <div className="w-14 h-14 flex items-center justify-center overflow-hidden rounded-xl">
                    <img 
                      src={cat.image} 
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-medium text-center leading-tight px-1">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          {currentScreen === 1 && (
            <div className="py-2">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">By-Products & Value-Added</h2>
                <p className="text-sm text-muted-foreground">Premium farm by-products for your needs</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {byProducts.map((product) => (
                  <div key={product.id} className="h-full">
                    <Card 
                      className="h-full hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 cursor-pointer border-2 border-gray-200 overflow-hidden group flex flex-col" 
                      style={{ backgroundColor: product.bgColor }}
                      onClick={() => {
                        router.push(`/customer/by-products?category=${product.id}`);
                      }}
                    >
                      <CardContent className="p-0 flex flex-col h-full">
                        <div className="relative w-full h-40 overflow-hidden flex-shrink-0">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-4 text-center flex flex-col flex-grow justify-between">
                          <p className="font-bold text-base mb-3">{product.name}</p>
                          <Button size="sm" className="w-full shadow-lg hover:shadow-xl transition-all">
                            View Products →
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentScreen === 2 && (
            <div className="py-2">
              <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Services & Subscriptions</h2>
              <div className="space-y-4">
                <Link href="/customer/bulk">
                  <Card className="hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer bg-gradient-to-br from-green-50 via-white to-green-100 border-2 border-green-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-xl">
                          <Calendar className="h-10 w-10 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1">Function / Event Booking</h3>
                          <p className="text-sm text-muted-foreground">Meat, Vegetables, Workers</p>
                          <p className="text-xs text-green-600 font-semibold mt-1">One-click instant booking</p>
                        </div>
                        <Button size="lg" className="shadow-xl hover:shadow-2xl">Book Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/customer/apartment">
                  <Card className="hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer bg-gradient-to-br from-green-50 via-white to-green-100 border-2 border-green-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-xl">
                          <Home className="h-10 w-10 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1">Apartment Subscription</h3>
                          <p className="text-sm text-muted-foreground">Milk, Meat, Vegetables, Eggs</p>
                          <p className="text-xs text-green-600 font-semibold mt-1">Monthly/Weekly auto-delivery</p>
                        </div>
                        <Button size="lg" className="shadow-xl hover:shadow-2xl">Subscribe</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          )}

          {/* Screen Indicators */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentScreen(Math.max(0, currentScreen - 1))}
              disabled={currentScreen === 0}
              className="bg-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Button>
            <div className="flex gap-2">
              {[0, 1, 2].map((screen) => (
                <button
                  key={screen}
                  onClick={() => setCurrentScreen(screen)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentScreen === screen ? "w-8 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentScreen(Math.min(2, currentScreen + 1))}
              disabled={currentScreen === 2}
              className="bg-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="relative w-full h-[200px] rounded-[20px] overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.08)] group cursor-pointer hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-shadow duration-300">
            {bannerImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Banner ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                style={{ opacity: currentBannerIndex === index ? 1 : 0 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Farmers List */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {selectedCategory === "all"
              ? "All Farmers"
              : categories.find((c) => c.id === selectedCategory)?.name}
          </h2>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {filteredFarmers.length} farmers
            </p>
            <SortDropdown onSortChange={setSortBy} currentSort={sortBy} />
          </div>
        </div>

        <QuickFilters
          onFilterChange={(filter) => {
            setQuickFilters((prev) =>
              prev.includes(filter)
                ? prev.filter((f) => f !== filter)
                : [...prev, filter]
            );
          }}
          activeFilters={quickFilters}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarmers.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                No matching stock found
              </h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Try adjusting your filters or search terms to find more farmers
                and products.
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  setFilters({
                    productTypes: [],
                    keyword: "",
                    weightMin: 0,
                    weightMax: 50,
                    priceMin: 0,
                    priceMax: 1000,
                    nearbyOnly: false,
                    bulkOnly: false,
                  })
                }
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            filteredFarmers.map((farmer) => (
              <Card
                key={farmer.id}
                className="hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer bg-white border border-gray-200 hover:border-primary/50 hover:scale-[1.02] rounded-xl"
                onClick={() => {
                  const firstProduct = farmer.products[0];
                  router.push(`/customer/product?farmerId=${farmer.id}&productType=${encodeURIComponent(firstProduct.type)}&breed=${encodeURIComponent(firstProduct.breed)}`);
                }}
              >
                {/* Farmer Image */}
                <div className="relative h-36 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <img
                    src={farmer.image || "/placeholder.svg"}
                    alt={farmer.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(farmer.id.toString());
                    }}
                    className="absolute top-2 right-2 bg-white/95 hover:bg-white rounded-full p-1.5 transition-all hover:scale-110 shadow-md z-20"
                  >
                    <Heart
                      className={`h-4 w-4 transition-all ${
                        isFavorite(farmer.id.toString())
                          ? "fill-red-500 text-red-500 scale-110"
                          : "text-gray-600"
                      }`}
                    />
                  </button>
                  {farmer.verified && (
                    <Badge className="absolute top-2 left-2 bg-green-500 text-white gap-1 px-2 py-0.5 text-xs shadow-md z-20 border-0">
                      <ShieldCheck className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-md z-20">
                    <MapPin className="h-3 w-3 text-primary" />
                    <span className="text-xs font-semibold text-gray-700">{farmer.village}</span>
                    <span className="text-xs text-gray-500">• {farmer.distance}km</span>
                  </div>
                </div>

                <CardHeader className="pb-2 pt-3 px-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base font-bold text-gray-800 group-hover:text-primary transition-colors">{farmer.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-amber-700">
                        {farmer.rating}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2 pb-3 px-3">
                  {farmer.products.map((product, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-lg p-2.5 bg-gradient-to-br from-gray-50 to-white hover:shadow-sm transition-all duration-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 text-sm">
                            {product.type}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {product.breed}
                          </p>
                        </div>
                        <div className="text-right bg-green-50 px-2 py-1 rounded-md border border-green-200">
                          <p className="text-sm font-bold text-green-700">
                            {farmer.name === "Raju Goats" ? (
                              <>₹{product.price}</>
                            ) : (
                              <>₹{product.price}/kg</>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 mb-2">
                        <div className="bg-white rounded-md p-1.5 border border-gray-100">
                          <span className="text-xs text-gray-500 block">Weight</span>
                          <span className="text-xs font-semibold text-gray-700">
                            {farmer.name === "Raju Goats"
                              ? product.weightRangeMin === product.weightRangeMax
                                ? `${product.weightRangeMin}kg`
                                : `${product.weightRangeMin}-${product.weightRangeMax}kg`
                              : `${product.weightRangeMin}-${
                                  product.weightRangeMax
                                }${product.category === "milk" ? "L" : "kg"}`}
                          </span>
                        </div>
                        <div className="bg-white rounded-md p-1.5 border border-gray-100">
                          <span className="text-xs text-gray-500 block">Age</span>
                          <span className="text-xs font-semibold text-gray-700">{product.age}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 mb-2 bg-blue-50 rounded-md p-1.5 border border-blue-100">
                        <Package className="h-3 w-3 text-blue-600" />
                        <span className="text-xs text-gray-600">Stock:</span>
                        <span className="text-xs font-bold text-blue-700">
                          {product.available}
                        </span>
                        {product.bulkAvailable && (
                          <Badge className="ml-auto text-xs gap-0.5 bg-green-100 text-green-700 border-green-200 px-1.5 py-0">
                            <ChefHat className="h-2.5 w-2.5" />
                            Bulk
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex-1 flex items-center justify-center gap-1">
                          {(() => {
                            const currentQuantity = getItemQuantity(
                              farmer.id.toString(),
                              product.type,
                              product.breed
                            );
                            const canAdd = canAddItem(
                              farmer.id.toString(),
                              product.type,
                              product.breed,
                              product.available
                            );
                            const canIncrease =
                              currentQuantity < product.available;
                            const canDecrease = currentQuantity > 0;

                            if (currentQuantity === 0) {
                              return (
                                <Button
                                  size="sm"
                                  className="w-full font-semibold shadow-sm hover:shadow-md transition-all hover:scale-105 rounded-lg text-xs h-8"
                                  disabled={!canAdd}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Adding to cart:', {
                                      farmerId: farmer.id.toString(),
                                      productType: product.type,
                                      breed: product.breed,
                                      price: product.price,
                                      available: product.available
                                    });
                                    addToCart({
                                      farmerId: farmer.id.toString(),
                                      productType: product.type,
                                      breed: product.breed || 'Standard',
                                      price: product.price,
                                      weight:
                                        product.weightRangeMin &&
                                        product.weightRangeMax
                                          ? `${product.weightRangeMin}-${product.weightRangeMax}kg`
                                          : undefined,
                                      minimumGuaranteedWeight:
                                        product.weightRangeMin,
                                    });
                                  }}
                                >
                                  <ShoppingCart className="h-3 w-3 mr-1" />
                                  {canAdd ? "Add" : "Out"}
                                </Button>
                              );
                            }

                            return (
                              <div className="flex items-center gap-1 bg-green-50 rounded-lg p-1 w-full border border-green-200">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 hover:bg-green-100 rounded-md"
                                  disabled={!canDecrease}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Decreasing quantity');
                                    decreaseQuantityByProduct(
                                      farmer.id.toString(),
                                      product.type,
                                      product.breed
                                    );
                                  }}
                                >
                                  <Minus className="h-4 w-4 text-green-700" />
                                </Button>
                                <span className="flex-1 text-center font-bold text-sm text-green-700">
                                  {currentQuantity}
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 hover:bg-green-100 rounded-md"
                                  disabled={!canIncrease}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Increasing quantity');
                                    increaseQuantityByProduct(
                                      farmer.id.toString(),
                                      product.type,
                                      product.breed
                                    );
                                  }}
                                >
                                  <Plus className="h-4 w-4 text-green-700" />
                                </Button>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Bulk Order CTA */}
        {selectedCategory === "all" && (
          <Card className="mt-8 border-0 shadow-luxury-lg overflow-hidden relative group">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=7680&auto=format&fit=crop" 
                alt="Function Hall"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
            <CardContent className="p-10 md:p-12 text-center relative z-10">
              <div className="inline-block px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <span className="text-white text-sm font-semibold tracking-wide flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  PREMIUM BULK SERVICE
                </span>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
                Function Hall Bulk Orders
              </h3>
              <p className="text-white/95 mb-8 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                Need 20-80kg of fresh meat for weddings, ceremonies or events?
                Get special pricing with live cutting, video verification and
                guaranteed delivery.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-white">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Verified Quality</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Video className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Live Cutting</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Truck className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Fast Delivery</span>
                </div>
              </div>
              <Link href="/customer/bulk">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/95 hover:scale-105 font-bold text-lg px-10 py-7 rounded-full shadow-2xl transition-all duration-300 group"
                >
                  <ShoppingCart className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                  Place Bulk Order Now
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
      <FloatingCartButton />
    </div>
  );
}
