import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SignupLoginPage from "./pages/Signup"
import UploadPage from "./pages/PDFUpload"
import ChatPage from "./pages/Chatpage"

export default function App() {
  return (
    <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<SignupLoginPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
    </Router>
  )
}
