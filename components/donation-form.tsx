"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import useToast from "@/hooks/use-toast"
import { createClient } from "@/lib/client"
import { useAuth } from "@/context/auth"
import { initializeDatabase, createDonation } from "@/lib/db-utils"

interface DonationFormProps {
  shelterId: string
  shelterName: string
  needs: any[] | null
  highlightedNeedId?: string
}

export function DonationForm({ shelterId, shelterName, needs, highlightedNeedId }: DonationFormProps) {
  const [donationType, setDonationType] = useState<"item" | "money">("item")
  const [selectedNeedId, setSelectedNeedId] = useState<string | null>(highlightedNeedId || null)
  const [amount, setAmount] = useState<string>("")
  const [itemDescription, setItemDescription] = useState<string>("")
  const [quantity, setQuantity] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading: authLoading } = useAuth()
  const supabase = createClient()

  // Show loading state while auth is being checked
  if (authLoading) {
    return <div>Loading...</div>
  }

  // Restore form data after login
  useEffect(() => {
    if (user) {
      const savedFormData = sessionStorage.getItem('donationFormData')
      if (savedFormData) {
        try {
          const formData = JSON.parse(savedFormData)
          // Check if the saved data is recent (less than 5 minutes old)
          const savedTime = new Date(formData.timestamp).getTime()
          const currentTime = new Date().getTime()
          
          if (currentTime - savedTime < 5 * 60 * 1000) { // 5 minutes
            setDonationType(formData.donationType)
            setSelectedNeedId(formData.selectedNeedId)
            setAmount(formData.amount)
            setItemDescription(formData.itemDescription)
            setQuantity(formData.quantity)
            
            // Clear the saved data
            sessionStorage.removeItem('donationFormData')
            
            // Show a message that the form has been restored
            toast({
              title: 'Welcome back!',
              description: 'Your donation form has been restored.',
            })
          } else {
            // Remove expired data
            sessionStorage.removeItem('donationFormData')
          }
        } catch (e) {
          console.error('Error restoring form data:', e)
          sessionStorage.removeItem('donationFormData')
        }
      }
    }
  }, [user, toast])

  // Set the highlighted need if provided
  useEffect(() => {
    if (highlightedNeedId) {
      setSelectedNeedId(highlightedNeedId)
    }
  }, [highlightedNeedId])

  // Handle donation type change
  const handleDonationTypeChange = (type: "item" | "money") => {
    setDonationType(type)
    setSelectedNeedId(null)
    setItemDescription("")
    setQuantity("")
  }

  // Handle need selection
  const handleNeedSelect = (needId: string) => {
    setSelectedNeedId(needId)
    const need = needs?.find((n) => n.id === needId)
    if (need) {
      setItemDescription(need.description || "")
      setQuantity(need.quantity ? need.quantity.toString() : "")
    }
  }

  const validateForm = (): { isValid: boolean; error?: string } => {
    if (donationType === 'money' && (!amount || isNaN(Number(amount)) || Number(amount) <= 0)) {
      return { isValid: false, error: 'Please enter a valid donation amount' }
    }
    
    if (donationType === 'item') {
      if (!itemDescription?.trim()) {
        return { isValid: false, error: 'Please describe the items you are donating' }
      }
      if (quantity && isNaN(Number(quantity))) {
        return { isValid: false, error: 'Please enter a valid quantity' }
      }
    }
    
    return { isValid: true }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      // Store the current form data in session storage before redirecting
      const formData = {
        donationType,
        selectedNeedId,
        amount,
        itemDescription,
        quantity,
        timestamp: new Date().toISOString()
      }
      sessionStorage.setItem('donationFormData', JSON.stringify(formData))
      
      router.push(`/login?redirect=/shelters/${shelterId}${highlightedNeedId ? `?need=${highlightedNeedId}` : ''}`)
      return
    }

    // Validate form
    const { isValid, error: validationError } = validateForm()
    if (!isValid) {
      toast({
        title: 'Validation Error',
        description: validationError || 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Initialize database and ensure tables exist
      const initResult = await initializeDatabase()
      if ('error' in initResult) {
        console.warn('Database initialization warning:', initResult.error)
      }

      // Prepare donation data
      const donationData = {
        user_id: user.id,
        shelter_id: shelterId,
        need_id: selectedNeedId || null,
        donation_type: donationType,
        amount: donationType === 'money' ? Number(amount) : null,
        item_description: donationType === 'item' ? itemDescription : null,
        quantity: donationType === 'item' && quantity ? Number(quantity) : null,
        status: 'pending' as const,
      }


      // Create donation record
      const { data, error } = await createDonation(donationData)

      if (error) {
        console.error('Database error:', error)
        throw error
      }

      console.log('Donation created successfully:', data)

      // Show success message
      toast({
        title: 'Donation Submitted',
        description: `Thank you for your donation to ${shelterName}!`,
      })

      // Reset form
      setAmount('')
      setItemDescription('')
      setQuantity('')

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard?donation=success')
      }, 1500)
    } catch (error: any) {
      console.error('Error submitting donation:', error)
      
      let errorMessage = 'Failed to submit donation. Please try again.'
      
      // Handle specific error cases
      if (error.code === '23505') {
        errorMessage = 'A similar donation already exists.'
      } else if (error.code === '42501') {
        errorMessage = 'You do not have permission to perform this action.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Donation Type</Label>
        <RadioGroup
          value={donationType}
          onValueChange={(value) => setDonationType(value as "item" | "money")}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="item" id="item" />
            <Label htmlFor="item" className="cursor-pointer">
              Item Donation
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="money" id="money" />
            <Label htmlFor="money" className="cursor-pointer">
              Monetary Donation
            </Label>
          </div>
        </RadioGroup>
      </div>

      {needs && needs.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="need">Select a Specific Need (Optional)</Label>
          <Select value={selectedNeedId || ""} onValueChange={setSelectedNeedId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a need" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">General Donation</SelectItem>
              {needs
                .filter((need) => (donationType === "money" ? need.category === "Money" : need.category !== "Money"))
                .map((need) => (
                  <SelectItem key={need.id} value={need.id}>
                    {need.title} {need.priority === "urgent" ? "(Urgent)" : ""}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {donationType === "money" && (
        <div className="space-y-2">
          <Label htmlFor="amount">Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter donation amount"
            required
          />
        </div>
      )}

      {donationType === "item" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="itemDescription">Item Description</Label>
            <Textarea
              id="itemDescription"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              placeholder="Describe the items you wish to donate"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (Optional)</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
            />
          </div>
        </>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Donation"}
      </Button>

      {!user && (
        <p className="text-sm text-muted-foreground text-center mt-2">
          You'll need to sign in to complete your donation.
        </p>
      )}
    </form>
  )
}
