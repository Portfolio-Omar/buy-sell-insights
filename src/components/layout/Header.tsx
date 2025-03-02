
import { Link } from "react-router-dom";
import MainNav from "./MainNav";
import MobileNav from "./MobileNav";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "../user-button";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <MobileNav />
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Inventory Pro
            </span>
          </Link>
          <MainNav />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex items-center space-x-4">
            <ModeToggle />
            {!isLoading && (user ? <UserButton /> : <Link to="/auth"><UserButton /></Link>)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
