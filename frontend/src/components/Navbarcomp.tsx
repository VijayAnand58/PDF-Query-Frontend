import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left side: Logo + Nav Links */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <Link to="/">
            <div className="flex justify-center">
              <img src={logo} alt="Company Logo" className="h-12 w-auto" />
            </div>
          </Link>

          {/* Desktop Nav Links (right beside logo) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-sm font-medium text-gray-700 hover:text-primary"
            >
              Home
            </Link>
            {/* future additions  */}
            {/* <Link
              to="/about"
              className="text-sm font-medium text-gray-700 hover:text-primary"
            >
              About Us
            </Link> */}
          </div>
        </div>

        {/* Right side: Auth Buttons (desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/auth">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/auth">
            <Button>Sign Up</Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 hover:text-primary focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 border-t" : "max-h-0"
        } bg-white`}
      >
        <div className="flex flex-col space-y-3 px-4 py-4">
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 hover:text-primary"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-gray-700 hover:text-primary"
          >
            About Us
          </Link>
          <Link to="/auth">
            <Button variant="ghost" className="w-full">
              Login
            </Button>
          </Link>
          <Link to="/auth">
            <Button className="w-full">Sign Up</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
