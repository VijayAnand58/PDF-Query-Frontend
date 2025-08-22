import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
export default function HeroSection() {
  return (
    <section className="w-full bg-gray-50 py-20">
      <div className="container mx-auto flex flex-col items-center text-center px-6 md:px-12">
        
        {/* Heading */}
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
          Talk with Your PDFs <span className="text-primary">Smarter</span>
        </h1>

        {/* Subtext */}
        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          Upload your documents and start an AI-powered conversation instantly.  
          Extract insights, summaries, and answers from your files effortlessly.
        </p>

        {/* Call to action buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link to="/auth">
          <Button size="lg">Get Started</Button>
          </Link>
          <Link to="/learnmore">
          <Button size="lg" variant="outline">Learn More</Button>
          </Link>
        </div>

        {/* Optional Hero Image / Illustration */}
      </div>
    </section>
  )
}
