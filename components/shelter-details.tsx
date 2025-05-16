"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Phone, Mail, Globe, Heart } from "lucide-react"
import { DonationForm } from "@/components/donation-form"
import { useAuth } from "@/context/auth"
import Link from "next/link"

interface ShelterDetailsProps {
  shelter: any
  needs: any[]
  highlightedNeed: any
}

export default function ShelterDetails({
  shelter,
  needs,
  highlightedNeed,
}: ShelterDetailsProps) {
  const { user } = useAuth()

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shelter Information */}
        <div className="lg:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">{shelter.name}</h1>
              <div className="flex items-center text-muted-foreground mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <p>
                  {shelter.address}, {shelter.city}, {shelter.state} {shelter.zip_code}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <a href={`/map?shelter=${shelter.id}`}>
                <Button variant="outline">View on Map</Button>
              </a>
            </div>
          </div>

          {/* Shelter Image */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
            <img
              src={shelter.image_url || "/placeholder.svg?height=400&width=800"}
              alt={shelter.name}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Shelter Description */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About This Shelter</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{shelter.description || "No description available for this shelter."}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {shelter.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{shelter.phone}</span>
                  </div>
                )}
                {shelter.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`mailto:${shelter.email}`} className="text-primary hover:underline">
                      {shelter.email}
                    </a>
                  </div>
                )}
                {shelter.website && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a
                      href={shelter.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {shelter.website}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Needs Section */}
          <Card>
            <CardHeader>
              <CardTitle>Current Needs</CardTitle>
              <CardDescription>
                Here are the items this shelter needs right now
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all">All Needs</TabsTrigger>
                  <TabsTrigger value="high-priority">High Priority</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <div className="space-y-4">
                    {needs.map((need) => (
                      <div
                        key={need.id}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          highlightedNeed?.id === need.id
                            ? "bg-primary/10"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <div>
                          <h3 className="font-medium">{need.item}</h3>
                          <p className="text-sm text-muted-foreground">
                            {need.description}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {need.priority === "high" ? "High Priority" : "Normal"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="high-priority">
                  <div className="space-y-4">
                    {needs
                      .filter((need) => need.priority === "high")
                      .map((need) => (
                        <div
                          key={need.id}
                          className={`flex items-center justify-between p-4 rounded-lg ${
                            highlightedNeed?.id === need.id
                              ? "bg-primary/10"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <div>
                            <h3 className="font-medium">{need.item}</h3>
                            <p className="text-sm text-muted-foreground">
                              {need.description}
                            </p>
                          </div>
                          <Badge variant="secondary">High Priority</Badge>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Donation Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Make a Donation</CardTitle>
              <CardDescription>
                Support this shelter with a donation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user ? (
                <DonationForm
                  shelterId={shelter.id}
                  shelterName={shelter.name}
                  needs={needs}
                  highlightedNeedId={highlightedNeed?.id}
                />
              ) : (
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Please sign in to make a donation
                  </p>
                  <Button asChild>
                    <Link href={`/login?redirect=/shelters/${shelter.id}`}>Sign In</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
