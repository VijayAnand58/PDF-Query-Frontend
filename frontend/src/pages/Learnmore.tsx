"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
import architectureImage from "@/assets/architecture.png";
import Navbar from "@/components/Navbarcomp"; // placeholder, replace with your image path
import Footer from "@/components/Footer";

export default function LearnMorePage() {
  const steps = [
    {
      title: "Upload PDFs",
      description: "Users upload multiple PDFs that need to be processed.",
    },
    {
      title: "Parsing",
      description:
        "Text & images are extracted using PyMuPDF for downstream processing.",
    },
    {
      title: "Embedding",
      description:
        "Text is embedded with HuggingFace embeddings, and images are embedded with OpenAI CLIP.",
    },
    {
      title: "Storage",
      description:
        "All embeddings are stored efficiently in ChromaDB for fast retrieval.",
    },
    {
      title: "Query Processing",
      description:
        "LangChain + LangGraph are used to retrieve the most relevant context for the query.",
    },
    {
      title: "FastAPI Backend",
      description:
        "Handles the logic and serves the processed results to the frontend.",
    },
    {
      title: "Authentication",
      description: "User credentials are securely stored in MongoDB.",
    },
  ];
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">How It Works</h1>

        {/* Main section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
          {/* Left - Architecture Diagram */}
          <Card className="flex items-center justify-center p-4">
            <img
              src={architectureImage}
              alt="Architecture Diagram"
              className="rounded-xl shadow-md max-h-[400px] object-contain"
            />
          </Card>

          {/* Right - Detailed Explanation */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-center">
                Our Process Explained
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* <ScrollArea className="h-[400px] pr-4"> */}
              <div className="grid grid-cols-1  gap-4">
                {steps.map((step, idx) => (
                  <div key={idx}>
                    <div className="font-bold">{step.title}</div>
                    <div className="font-semibold text-gray-600">
                      {step.description}
                    </div>
                  </div>
                ))}
              </div>
              {/* </ScrollArea> */}
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 max-w-4xl w-full">
          <h2 className="text-2xl font-bold mb-4">FAQs</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How is my data kept private?</AccordionTrigger>
              <AccordionContent>
                All uploaded data and embeddings are deleted when you log out.
                Nothing is stored permanently.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Can I search images as well?</AccordionTrigger>
              <AccordionContent>
                Yes. We embed images using OpenAI CLIP and allow image-based
                retrieval.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>What models power the system?</AccordionTrigger>
              <AccordionContent>
                HuggingFace embeddings for text, OpenAI CLIP for images, and
                LangChain + LangGraph for retrieval.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <Footer />
    </>
  );
}
