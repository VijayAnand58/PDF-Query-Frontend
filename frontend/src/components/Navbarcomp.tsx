import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left side: Logo + Links */}
        <div className="flex items-center space-x-8">
          {/* Logo Placeholder */}
        <div className="flex justify-center">
            <img src="/src/assets/logo.png" alt="Company Logo" className="h-12 w-auto" />
        </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-sm font-medium text-gray-700 hover:text-primary">
              Home
            </a>
            <a href="/about" className="text-sm font-medium text-gray-700 hover:text-primary">
              About Us
            </a>
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
