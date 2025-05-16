import { createClient } from "@/lib/server"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Heart, ArrowRight, Search } from "lucide-react"

export default async function Home() {
  const supabase = createClient()

  // Fetch featured shelters
  const { data: shelters } = await supabase.from("shelters").select("*").limit(3)

  // Fetch urgent needs
  const { data: urgentNeeds } = await supabase
    .from("needs")
    .select(`
      *,
      shelters (
        id,
        name,
        city,
        state
      )
    `)
    .eq("priority", "urgent")
    .eq("is_fulfilled", false)
    .limit(4)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Connect, Donate, Make a Difference
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Help homeless shelters meet their needs by donating items or funds. Find shelters near you and see
                  what they need most.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/map">
                  <Button size="lg">
                    <MapPin className="mr-2 h-4 w-4" />
                    Find Shelters Near Me
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto lg:mx-0 relative w-full max-w-[500px] aspect-video rounded-xl overflow-hidden">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Volunteers helping at a shelter"
                width={800}
                height={600}
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Shelters Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Shelters</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                These shelters are actively seeking donations and support from the community.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {shelters && shelters.length > 0 ? (
              shelters.map((shelter) => (
                <Card key={shelter.id} className="overflow-hidden">
                  <div className="relative w-full aspect-video">
                    <Image
                      src={shelter.image_url || "/placeholder.svg?height=300&width=500"}
                      alt={shelter.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{shelter.name}</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {shelter.city}, {shelter.state}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3">
                      {shelter.description || "This shelter is seeking support from the community."}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/shelters/${shelter.id}`} className="w-full">
                      <Button variant="default" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p>No shelters found. Please check back later.</p>
              </div>
            )}
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/map">
              <Button variant="outline" size="lg">
                View All Shelters
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Urgent Needs Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Urgent Needs</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                These items are urgently needed by shelters in your area.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {urgentNeeds && urgentNeeds.length > 0 ? (
              urgentNeeds.map((need) => (
                <Card key={need.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="line-clamp-1">{need.title}</CardTitle>
                      <Badge variant="destructive">Urgent</Badge>
                    </div>
                    <CardDescription>
                      {need.shelters?.name} • {need.shelters?.city}, {need.shelters?.state}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3 text-sm">{need.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/shelters/${need.shelter_id}?need=${need.id}`} className="w-full">
                      <Button variant="default" className="w-full">
                        <Heart className="mr-2 h-4 w-4" />
                        Donate
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-4 text-center py-12">
                <p>No urgent needs found at the moment. Please check back later.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Making a difference is easy with ShelterConnect.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Find Shelters</h3>
              <p className="text-muted-foreground">
                Use our interactive map to locate homeless shelters in your area or search for specific locations.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">View Needs</h3>
              <p className="text-muted-foreground">
                Browse through the list of items and resources that shelters currently need.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Make Donations</h3>
              <p className="text-muted-foreground">
                Contribute items or funds directly to the shelters and track your donation history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Help?</h2>
              <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join our community of donors and make a difference in the lives of those experiencing homelessness.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/map">
                <Button size="lg" variant="secondary">
                  Find Shelters
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Sign Up to Donate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
