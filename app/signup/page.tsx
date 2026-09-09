"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, Sparkles, Eye, EyeOff, Loader2, Github } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!name || !email || !password) {
      setError("Please fill in all fields")
      return
    }

    if (!acceptTerms) {
      setError("You must accept the terms and conditions")
      return
    }

    // Simulate signup process
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Registration failed")
      }

      localStorage.setItem("auth_token", data.access_token)
      
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "An error occurred during signup. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignup = async (provider: string) => {
    setIsLoading(true)
    setError("")

    try {
      // In a real app, this would redirect to the OAuth provider
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful signup
      router.push("/dashboard")
    } catch (err) {
      setError(`Failed to sign up with ${provider}. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#e6e1ff]">
      {/* Top banner */}
      <div className="w-full bg-gradient-to-r from-yellow-100 to-green-100 py-3 text-center text-sm font-medium">
        <p className="flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          Start now with our AI-powered resume builder - 14-day money-back guarantee!
        </p>
      </div>

      <header className="border-b bg-[#e6e1ff]/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#6b46c1]">ResumeAI</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Already have an account?</span>
            <Link href="/login">
              <Button variant="outline" className="border-[#6b46c1] text-[#6b46c1] hover:bg-[#6b46c1]/10">
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container relative flex flex-col items-center justify-center py-12 md:py-24">
          {/* Decorative elements */}
          <div className="absolute left-1/4 top-12 text-[#6b46c1]/30">
            <Star className="h-8 w-8" />
          </div>
          <div className="absolute right-1/4 top-1/3 text-[#6b46c1]/30">
            <Sparkles className="h-10 w-10" />
          </div>
          <div className="absolute bottom-12 left-1/3 text-[#6b46c1]/30">
            <Sparkles className="h-6 w-6" />
          </div>

          <AnimatedSection className="w-full max-w-md">
            <Card className="border-gray-200 shadow-lg hover-lift">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                <CardDescription className="text-center">
                  Sign up to start building your professional resume
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="animate-shake">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading}
                      className="focus-visible:ring-[#6b46c1]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="focus-visible:ring-[#6b46c1]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        className="focus-visible:ring-[#6b46c1] pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                      className="data-[state=checked]:bg-[#6b46c1] data-[state=checked]:border-[#6b46c1]"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link href="/terms" className="text-[#6b46c1] hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-[#6b46c1] hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#6b46c1] hover:bg-[#5a3aa3] button-hover"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Sign up"
                    )}
                  </Button>
                </form>

                <div className="flex items-center gap-2 py-2">
                  <Separator className="flex-1" />
                  <span className="text-xs text-gray-500">OR CONTINUE WITH</span>
                  <Separator className="flex-1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="w-full border-gray-200 hover:bg-gray-50 hover:text-[#6b46c1] hover:border-[#6b46c1]/30 transition-colors"
                    onClick={() => handleSocialSignup("Google")}
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-200 hover:bg-gray-50 hover:text-[#6b46c1] hover:border-[#6b46c1]/30 transition-colors"
                    onClick={() => handleSocialSignup("GitHub")}
                    disabled={isLoading}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex flex-col gap-2">
            <span className="text-lg font-bold text-[#6b46c1]">ResumeAI</span>
            <p className="text-sm text-gray-500">Build professional resumes with AI assistance.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-gray-500 hover:text-[#6b46c1]">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-[#6b46c1]">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:text-[#6b46c1]">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

