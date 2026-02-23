"use client";

import { Badge } from "@/components/ui/badge";
import { MapPin, ShieldCheck, Package } from "lucide-react";

interface QuickFiltersProps {
  onFilterChange: (filter: string) => void;
  activeFilters: string[];
}

export function QuickFilters({ onFilterChange, activeFilters }: QuickFiltersProps) {
  const filters = [
    { id: "nearby", label: "Nearby", icon: MapPin },
    { id: "verified", label: "Verified", icon: ShieldCheck },
    { id: "bulk", label: "Bulk Available", icon: Package },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => (
        <Badge
          key={filter.id}
          variant={activeFilters.includes(filter.id) ? "default" : "outline"}
          className="cursor-pointer whitespace-nowrap flex items-center gap-1 px-3 py-1.5"
          onClick={() => onFilterChange(filter.id)}
        >
          <filter.icon className="h-3 w-3" />
          {filter.label}
        </Badge>
      ))}
    </div>
  );
}
