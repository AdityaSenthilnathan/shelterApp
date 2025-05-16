"use client"

import type React from "react"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/client"
import { Search, MapPin, Heart, List, MapIcon } from "lucide-react"
import Link from "next/link"

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-muted flex items-center justify-center">
      <p>Loading map...</p>
    </div>
  ),
})

export default function MapPage() {
  const [shelters, setShelters] = useState<any[]>([])
  const [filteredShelters, setFilteredShelters] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedShelterId, setSelectedShelterId] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get user's location if they allow it
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        () => {
          // Default to a central US location if user denies location access
          setUserLocation([39.8283, -98.5795])
        },
      )
    }

    // Fetch shelters from the database
    const fetchShelters = async () => {
      setIsLoading(true)
      const { data, error } = await supabase.from("shelters").select("*")

      if (error) {
        console.error("Error fetching shelters:", error)
      } else if (data) {
        setShelters(data)
        setFilteredShelters(data)
      }
      setIsLoading(false)
    }

    fetchShelters()
  }, [supabase])

  // Filter shelters based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredShelters(shelters)
    } else {
      const filtered = shelters.filter(
        (shelter) =>
          shelter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shelter.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shelter.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shelter.address.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredShelters(filtered)
    }
  }, [searchQuery, shelters])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // The filtering is already handled by the useEffect above
  }

  const handleShelterSelect = (shelterId: string) => {
    setSelectedShelterId(shelterId)
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Find Shelters</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, city, or address..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </div>
      </form>

      {/* Tabs for List and Map Views */}
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="map">
            <MapIcon className="h-4 w-4 mr-2" />
            Map View
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="h-4 w-4 mr-2" />
            List View
          </TabsTrigger>
        </TabsList>

        {/* Map View */}
        <TabsContent value="map" className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {userLocation ? (
                <MapComponent
                  shelters={filteredShelters}
                  userLocation={userLocation}
                  selectedShelterId={selectedShelterId}
                  onShelterSelect={handleShelterSelect}
                />
              ) : (
                <div className="w-full h-[600px] bg-muted flex items-center justify-center">
                  <p>Loading map...</p>
                </div>
              )}
            </div>
            <div className="h-[600px] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">
                {filteredShelters.length} {filteredShelters.length === 1 ? "Shelter" : "Shelters"} Found
              </h2>
              <div className="space-y-4">
                {isLoading ? (
                  <p>Loading shelters...</p>
                ) : filteredShelters.length > 0 ? (
                  filteredShelters.map((shelter) => (
                    <Card
                      key={shelter.id}
                      className={`cursor-pointer transition-all ${selectedShelterId === shelter.id ? "ring-2 ring-primary" : ""}`}
                      onClick={() => handleShelterSelect(shelter.id)}
                    >
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{shelter.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {shelter.city}, {shelter.state}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="p-4 pt-0">
                        <Link href={`/shelters/${shelter.id}`} className="w-full">
                          <Button variant="default" size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <p>No shelters found matching your search.</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* List View */}
        <TabsContent value="list">
          {isLoading ? (
            <p>Loading shelters...</p>
          ) : filteredShelters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShelters.map((shelter) => (
                <Card key={shelter.id}>
                  <CardHeader>
                    <CardTitle>{shelter.name}</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {shelter.address}, {shelter.city}, {shelter.state} {shelter.zip_code}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3 text-sm">{shelter.description || "No description available."}</p>
                    {shelter.phone && (
                      <p className="text-sm mt-2">
                        <strong>Phone:</strong> {shelter.phone}
                      </p>
                    )}
                    {shelter.email && (
                      <p className="text-sm">
                        <strong>Email:</strong> {shelter.email}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Link href={`/shelters/${shelter.id}`} className="w-full">
                      <Button variant="default" className="w-full">
                        <Heart className="mr-2 h-4 w-4" />
                        View Needs
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p>No shelters found matching your search.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
