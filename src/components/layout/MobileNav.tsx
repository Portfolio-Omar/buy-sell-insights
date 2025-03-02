
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  User,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

const MobileNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: location.pathname === "/",
    },
    {
      href: "/products",
      label: "Products",
      icon: Package,
      active: location.pathname === "/products",
    },
    {
      href: "/sales",
      label: "Sales",
      icon: ShoppingCart,
      active: location.pathname === "/sales",
    },
    {
      href: "/reports",
      label: "Reports",
      icon: BarChart3,
      active: location.pathname === "/reports",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: location.pathname === "/settings",
    },
  ];

  // Add profile route if user is logged in
  if (user) {
    routes.push({
      href: "/profile",
      label: "Profile",
      icon: User,
      active: location.pathname === "/profile",
    });
  } else {
    routes.push({
      href: "/auth",
      label: "Login",
      icon: User,
      active: location.pathname === "/auth",
    });
  }

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[80%] sm:w-[350px]">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-left text-lg font-bold">Inventory Pro</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col space-y-2">
            {routes.map((route) => (
              <SheetClose asChild key={route.href}>
                <Link
                  to={route.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-3 text-sm font-medium transition-colors",
                    route.active
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <route.icon className="mr-3 h-5 w-5" />
                  <span>{route.label}</span>
                </Link>
              </SheetClose>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
