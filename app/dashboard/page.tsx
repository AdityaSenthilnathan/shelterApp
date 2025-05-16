"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/client"
import { Heart, MapPin, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { useAuth } from "@/context/auth"
import { toast } from "@/components/ui/use-toast"

type Donation = {
  id: string
  donation_type: 'item' | 'money'
  amount: number | null
  item_description: string | null
  quantity: number | null
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
  shelter_id: string
  shelter?: {
    id: string
    name: string
    city: string
    state: string
  }
  need?: {
    id: string
    name: string
  }
  user_id: string
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [donations, setDonations] = useState<Donation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Check for donation success message
  const donationSuccess = searchParams.get("donation") === "success"

  useEffect(() => {
    if (donationSuccess) {
      toast({
        title: "Donation Successful!",
        description: "Thank you for your generous donation.",
      })
      // Remove the success param from URL without refreshing
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('donation')
      window.history.replaceState({}, '', newUrl.toString())
    }
  }, [donationSuccess])

  useEffect(() => {
    const fetchDonations = async () => {
      if (!user) {
        console.log('No user found, skipping donations fetch');
        return;
      }
      
      console.log('Starting to fetch donations for user:', user.id, 'with tab:', activeTab);
      setIsLoading(true);
      
      try {
        // First, let's verify the donations table exists by making a simple query
        console.log('Checking donations table access...');
        const { data: testData, error: testError } = await supabase
          .from('donations')
          .select('id')
          .limit(1);
          
        if (testError) {
          console.error('Error accessing donations table:', testError);
          throw new Error(`Database error: ${testError.message}`);
        }
        
        console.log('Successfully accessed donations table, fetching user donations...');
        
        // First, get the donations with shelter info
        const { data: donationsData, error: donationsError } = await supabase
          .from('donations')
          .select(`
            *,
            shelter:shelter_id (id, name, city, state)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (donationsError) {
          console.error('Error fetching donations:', donationsError);
          throw new Error(`Failed to fetch donations: ${donationsError.message}`);
        }
        
        console.log('Fetched donations:', donationsData);
        
        // If we have donations, try to fetch need info for each one that has a need_id
        if (donationsData && donationsData.length > 0) {
          const donationsWithNeeds = await Promise.all(
            donationsData.map(async (donation) => {
              if (!donation.need_id) return donation;
              
              const { data: needData, error: needError } = await supabase
                .from('needs')
                .select('id, title as name')
                .eq('id', donation.need_id)
                .single();
                
              if (needError) {
                console.error(`Error fetching need ${donation.need_id}:`, needError);
                return donation; // Return donation without need info if there's an error
              }
              
              return {
                ...donation,
                need: needData
              };
            })
          );
          
          console.log('Donations with needs:', donationsWithNeeds);
          
          // Filter by active tab if needed
          const filteredDonations = activeTab === 'all' 
            ? donationsWithNeeds 
            : donationsWithNeeds.filter(d => d.status === activeTab);
            
          setDonations(filteredDonations);
        } else {
          setDonations([]);
        }
        
      } catch (error: any) {
        const errorMessage = error?.message || 'Unknown error occurred';
        console.error('Error in fetchDonations:', {
          error: errorMessage,
          name: error?.name,
          stack: error?.stack,
          ...error
        });
        
        toast({
          title: "Error",
          description: `Failed to load donations: ${errorMessage}`,
          variant: "destructive",
        });
        
        // Set empty array to prevent UI errors
        setDonations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, [user, activeTab, supabase]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/dashboard")
    }
  }, [authLoading, user, router])

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Confirmed
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredDonations = donations.filter(donation => {
    if (activeTab === 'all') return true
    return donation.status === activeTab
  })

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null // Will be redirected by the useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          <p className="text-muted-foreground">Manage your donations and shelters in one place</p>
        </div>
        <Link href="/shelters">
          <Button>Find Shelters</Button>
        </Link>
      </div>

      <Tabs defaultValue="donations" className="w-full">
        <TabsList>
          <TabsTrigger value="donations">My Donations</TabsTrigger>
          <TabsTrigger value="shelters">My Shelters</TabsTrigger>
          <TabsTrigger value="settings">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="donations" className="mt-6">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={activeTab === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveTab('all')}
              >
                All
              </Button>
              <Button 
                variant={activeTab === 'pending' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveTab('pending')}
              >
                Pending
              </Button>
              <Button 
                variant={activeTab === 'confirmed' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveTab('confirmed')}
              >
                Confirmed
              </Button>
              <Button 
                variant={activeTab === 'completed' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveTab('completed')}
              >
                Completed
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredDonations.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No donations found</h3>
              <p className="text-muted-foreground mt-1">
                {activeTab === 'all' 
                  ? "You haven't made any donations yet."
                  : `You don't have any ${activeTab} donations.`}
              </p>
              <div className="mt-6">
                <Link href="/shelters">
                  <Button>Find a shelter to donate</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDonations.map((donation) => (
                <Card key={donation.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">
                            {donation.donation_type === 'money' 
                              ? `$${donation.amount} Donation` 
                              : donation.item_description || 'Item Donation'}
                            {donation.quantity && donation.quantity > 1 && ` (${donation.quantity})`}
                          </h3>
                          {getStatusBadge(donation.status)}
                        </div>
                        
                        {donation.shelter && (
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                            <span className="truncate">
                              {donation.shelter.name}, {donation.shelter.city}, {donation.shelter.state}
                            </span>
                          </div>
                        )}
                        
                        {donation.need && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            For: {donation.need.name}
                          </div>
                        )}
                        
                        <div className="mt-2 text-sm text-muted-foreground">
                          {format(new Date(donation.created_at), 'MMMM d, yyyy \a\t h:mm a')}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/shelters/${donation.shelter_id}`}>
                            View Shelter
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="shelters" className="mt-6">
          <div className="text-center py-12 border rounded-lg">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No shelters managed</h3>
            <p className="text-muted-foreground mt-1 max-w-md mx-auto">
              You're not currently managing any shelters. Would you like to create one?
            </p>
            <div className="mt-6">
              <Button>Create Shelter</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Update your account information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Email</h4>
                <p className="text-sm text-muted-foreground">{user?.email || 'Not available'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Account Created</h4>
                <p className="text-sm text-muted-foreground">
                  {user?.created_at ? format(new Date(user.created_at), 'MMMM d, yyyy') : 'N/A'}
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button variant="outline">Update Profile</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
