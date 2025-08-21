import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, FileText, Search, Brain, Layers, Lock } from "lucide-react"

const features = [
  {
    title: "AI-Powered Answers",
    description: "Get accurate and intelligent responses from your documents instantly.",
    icon: Brain,
  },
  {
    title: "Context-Only Responses",
    description: "Answers are generated only from the provided files — nothing made up.",
    icon: FileText,
  },
  {
    title: "Multiple PDF Uploads",
    description: "Upload and manage multiple PDFs in one place seamlessly.",
    icon: Layers,
  },
  {
    title: "Image Search",
    description: "Search inside your documents for images and get relevant results.",
    icon: Search,
  },
  {
    title: "Flexible Chat Modes",
    description: "Choose to chat with all PDFs, a subset, or even a single page.",
    icon: Shield,
  },
  {
    title: "Privacy Focused",
    description: "All your files are deleted securely after logout — your data stays yours.",
    icon: Lock,
  },
]

export default function FeaturesSection() {
  return (
    <section className="w-full bg-white py-10">
      <div className="container mx-auto px-6 md:px-12 text-center">
        {/* Section Header */}
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Powerful Features
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Everything you need to unlock knowledge from your documents — fast, reliable, and private.
        </p>

        {/* Feature Cards Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <Card key={idx} className="shadow-sm hover:shadow-md transition">
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-4 mx-auto" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
