"use client"

import { set, z } from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusAlert } from "@/components/alert"
import { useNavigate } from "react-router-dom"
import logo from "@/assets/logo.png"
import API from "@/lib/api"

// ----------------- Validation Schemas -----------------

const loginSchema = z.object({
  email_id: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const signupSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email_id: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>
type SignupFormValues = z.infer<typeof signupSchema>

// ----------------- Main Component -----------------
export default function SignupLoginPage() {
  const [alert, setAlert] = useState<{ type: "default" | "destructive"; title: string; message: string } | null>(null)
  const [alertVisible, setAlertVisible] = useState(false);
  const navigate = useNavigate()

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email_id: "", password: "" },
  })

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { first_name: "", last_name: "", email_id: "", password: "" },
  })

  const handleLogin = async(values: LoginFormValues) => {
    console.log("Login values:", values)
    try {
    const res = await API.post("/login", values)
    console.log("Login successful:", res.data)
    setAlert({ type: "default", title: "Success", message: "Login successful! Redirecting..." })
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
      navigate("/upload")
    }, 5000) // go to upload page after login
  } catch (err: any) {
    console.error("Login error:", err.response?.data || err.message)
    setAlert({ type: "destructive", title: "Error", message: err.response?.data || "Login failed" }) 
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
      navigate("/")
    }, 5000)
  }
  }

  const handleSignup = async(values: SignupFormValues) => {
    console.log("Signup values:", values)
    try {
    const res = await API.post("/register/user", values)
    console.log("Signup successful:", res.data)
    setAlert({ type: "default", title: "Success", message: "Signup successful! Redirecting..." })
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
      navigate("/")
    }, 2000); // maybe redirect straight after signup
  } catch (err: any) {
    console.error("Signup error:", err.response?.data || err.message)
    setAlert({ type: "destructive", title: "Error", message: err.response?.data || "Signup failed" })
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
      navigate("/")
    }, 2000) // go to home page after signup
  }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Company Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Company Logo" className="h-12 w-auto" />
        </div>
        {/* Alert Message */}
        {alertVisible && alert && (
          StatusAlert({ type: alert.type, title: alert.title, message: alert.message })
        )}

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* -------- Login Form -------- */}
          <TabsContent value="login">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Login</Button>
              </form>
            </Form>
          </TabsContent>

          {/* -------- Signup Form -------- */}
          <TabsContent value="signup">
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="email_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">Sign Up</Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
