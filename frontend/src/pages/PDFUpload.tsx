"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppstore";
// import { Link } from "react-router-dom"
import logo from "@/assets/logo.png";
import axios from "axios";

type Status = "idle" | "processing" | "processed" | "failed";

// Allowed MIME types
const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "audio/mpeg",  // .mp3
    "audio/wav",   // .wav
    "audio/x-wav", // sometimes used for .wav
    "audio/mp4",   // .m4a may sometimes use this
    "audio/x-m4a",
    "audio/aac",
  ];

export default function UploadPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const setFilenames = useAppStore((state) => state.setFilenames);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    for (let i = 0; i < selectedFiles.length; i++) {
      // allow only specific file types
      const file = selectedFiles[i];
      if (!allowedTypes.includes(file.type)) {  
        console.error(`Unsupported file type: ${file.name} (${file.type})`);
        setStatus("failed"); // update your UI if needed
        return;
    }
  }
    // Check total size (10 MB = 10 * 1024 * 1024 bytes)
    const totalSize = Array.from(selectedFiles).reduce(
      (acc, file) => acc + file.size,
      0
    );
    if (totalSize > 20 * 1024 * 1024) {
      console.error("Total file size must be less than 20 MB");
      setStatus("failed");
      return;
    }

    setStatus("processing");
    setProgress(0);

    try {
      const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("files", selectedFiles[i]);
      }

      const res = await axios.post(
        "https://pdf-quey.azurewebsites.net/protected/upload/",
        formData,
        {
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setProgress(percent);
          },
        }
      );
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
            <p className="text-gray-600 text-center">
              Click to upload a file <br />
              <span className="text-sm text-gray-500">(PDF, DOCX, MP3, WAV, M4A, AAC)</span>
            </p>
            <input
              type="file"
              accept=".pdf,.docx,.mp3,.wav,.m4a,.aac"
              multiple
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
                <p className="text-green-600 font-medium">
                  File processed successfully!
                </p>
                <Button
                  className="w-full mt-4"
                  onClick={() => navigate("/chat")}
                >
                  Go to Chat
                </Button>
              </>
            )}

            {status === "failed" && (
              <p className="text-red-600 font-medium">
                Upload failed. Please try again.
                Probable reasons: Unsupported file type or total size exceeds 20 MB.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
