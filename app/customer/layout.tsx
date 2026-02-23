import BottomNavigation from "@/components/bottom-navigation";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="pb-16">{children}</div>
      <BottomNavigation />
    </div>
  );
}
