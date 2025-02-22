
import { Link } from "react-router-dom";
import MainNav from "./MainNav";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import { UserButton } from "../user-button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
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
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
