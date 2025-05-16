"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useToast from "@/hooks/use-toast"
import { LogIn, UserPlus } from "lucide-react"
import { useAuth } from "@/context/auth"

interface User {
  id: string
  email?: string
  user_metadata: any
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("sign-in")

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user, isLoading: authLoading, signIn, signUp, signOut, resendVerification } = useAuth()
  const [authError, setAuthError] = useState<string | null>(null)
  const [showResendLink, setShowResendLink] = useState(false)
  const [resendStatus, setResendStatus] = useState<{ success?: boolean; message?: string }>({})

  // Get redirect URL from query params
  const redirectUrl = searchParams.get("redirect") || "/"

  // Check if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push(redirectUrl)
    }
  }, [user, authLoading, router, redirectUrl])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    setShowResendLink(false)
    setIsLoading(true)

    try {
      const result = await signIn(email, password)
      
      if (result && 'error' in result) {
        const error = result.error as Error & { message: string }
        if (error.message.includes('Email not confirmed')) {
          setAuthError('Please verify your email before signing in.')
          setShowResendLink(true)
        } else if (error.message.includes('Invalid login credentials')) {
          setAuthError('Invalid email or password. Please try again.')
        } else {
          setAuthError(error.message)
        }
        return
      }
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      })
      router.push(redirectUrl)
    } catch (error: any) {
      console.error('Sign in error:', error)
      setAuthError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError(null)
    setShowResendLink(false)
    setIsLoading(true)

    if (!fullName.trim()) {
      setAuthError('Please enter your full name')
      setIsLoading(false)
      return
    }

    try {
      const result = await signUp(email, password, { data: { full_name: fullName } })
      
      if (result && 'error' in result) {
        throw result.error
      }
      
      // Clear form
      setEmail("")
      setPassword("")
      setFullName("")
      
      // Show success message and switch to sign-in tab
      toast({
        title: "Success!",
        description: "Your account has been created! Please check your email to verify your account.",
      })
      
      setActiveTab("sign-in")
    } catch (error: any) {
      console.error('Sign up error:', error)
      setAuthError(error.message || 'Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!email) {
      setResendStatus({ success: false, message: 'Please enter your email address' })
      return
    }
    
    setResendStatus({})
    try {
      const result = await resendVerification(email)
      
      if (result && 'error' in result) {
        throw result.error
      }
      
      setResendStatus({
        success: true,
        message: 'Verification email sent! Please check your inbox.'
      })
      setShowResendLink(false)
    } catch (error: any) {
      console.error('Resend verification error:', error)
      setResendStatus({
        success: false,
        message: error.message || 'Failed to resend verification email.'
      })
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-16rem)] py-8">
      <Card className="w-full max-w-md">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="sign-in">
            <form onSubmit={handleSignIn}>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Enter your email and password to access your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    "Signing in..."
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="sign-up">
            <form onSubmit={handleSignUp}>
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>Sign up to track your donations and help those in need</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailSignup">Email</Label>
                  <Input
                    id="emailSignup"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordSignup">Password</Label>
                  <Input
                    id="passwordSignup"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
                </div>
              </CardContent>
              <CardFooter>
                {authError && (
                  <div className="text-sm text-red-500 mb-4">
                    {authError}
                    {showResendLink && (
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        className="ml-2 text-blue-600 hover:underline"
                        disabled={isLoading}
                      >
                        Resend verification email
                      </button>
                    )}
                  </div>
                )}
                {resendStatus.message && (
                  <div className={`text-sm mb-4 ${resendStatus.success ? 'text-green-600' : 'text-red-500'}`}>
                    {resendStatus.message}
                  </div>
                )}
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    "Creating account..."
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
