import { Github, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-stone-900 py-6">
      <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-gray-600 text-sm">
        
        {/* Left - GitHub Logo */}
        <a
          href="https://google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-blue-800 transition"
        >
          <Github className="h-5 w-5" />
          <span>GitHub</span>
        </a>

        {/* Right - Made with Love */}
        <p className="mt-4 sm:mt-0 flex items-center gap-1 hover:text-blue-800 transition">
          Made with <Heart className="h-4 w-4 text-red-500" /> by{" "}
          <span className="font-semibold">free_eagle53</span>
        </p>
      </div>
    </footer>
  )
}
