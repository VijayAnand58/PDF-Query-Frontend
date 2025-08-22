import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import logo from "@/assets/logo.png"

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left side: Logo + Links */}
        <div className="flex items-center space-x-8">
          {/* Logo Placeholder */}
          <Link to="/">
          <div className="flex justify-center">
              <img src={logo} alt="Company Logo" className="h-12 w-auto" />
          </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-primary">
              Home
            </Link>
            <Link to="/about" className="text-sm font-medium text-gray-700 hover:text-primary">
              About Us
            </Link>
          </div>
        </div>

        {/* Right side: Auth Buttons */}
        <div className="flex items-center space-x-4">
          <Link to="/auth">
          <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/auth">
          <Button>Sign Up</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
