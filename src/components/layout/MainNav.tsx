
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings 
} from "lucide-react";

const MainNav = () => {
  const location = useLocation();

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

  return (
    <nav className="flex items-center space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          to={route.href}
          className={cn(
            "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
            route.active ? 
              "text-black dark:text-white" : 
              "text-muted-foreground"
          )}
        >
          <route.icon className="h-4 w-4" />
          <span>{route.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
