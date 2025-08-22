"use client"

import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { UploadCloud } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAppStore } from "@/store/useAppstore"
// import { Link } from "react-router-dom"
import logo from "@/assets/logo.png"
import axios from "axios";

type Status = "idle" | "processing" | "processed" | "failed"

export default function UploadPage() {
  const [status, setStatus] = useState<Status>("idle")
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()
  const setFilenames = useAppStore((state) => state.setFilenames);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      
      const selectedFiles = e.target.files;
      if (!selectedFiles || selectedFiles.length === 0) return;

      for (let i = 0; i < selectedFiles.length; i++) {
        if (selectedFiles[i].type !== "application/pdf") {
          // Reject non-PDFs, show error or return
          console.error("Only PDF files are allowed");
          setStatus("failed"); // if you want to update UI status
          return;
        }
      }


      setStatus("processing");
      setProgress(0);

      try {
        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append("files", selectedFiles[i]); 
        }

        const res=await axios.post("http://localhost:8000/protected/upload/", formData, {
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setProgress(percent);
          },
        });
        setFilenames(res.data.filenames);
        setStatus("processed");

      } catch (error) {
        console.error("Upload error:", error);
        setStatus("failed");
      }
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
            <img src={logo} alt="Company Logo" className="h-12 w-auto" />
        </div>

        {/* Upload Box */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl py-16 cursor-pointer hover:border-primary transition">
          <UploadCloud className="h-12 w-12 text-gray-500 mb-4" />
          <p className="text-gray-600">Click to upload a PDF file</p>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>

        {/* Status Bar */}
        {status !== "idle" && (
          <div className="mt-8 space-y-4">
            {status === "processing" && (
              <>
                <Progress value={progress} className="w-full" />
                <p className="text-gray-600">Processing your file...</p>
              </>
            )}

            {status === "processed" && (
              <>
                <Progress value={100} className="w-full" />
                <p className="text-green-600 font-medium">File processed successfully!</p>
                <Button className="w-full mt-4" onClick={()=>navigate("/chat")}>
                  Go to Chat
                </Button>
              </>
            )}

            {status === "failed" && (
              <p className="text-red-600 font-medium">Upload failed. Only PDF files are allowed.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
