import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Home, ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-8">
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">About ShelterConnect</h1>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                ShelterConnect is a platform dedicated to connecting homeless shelters with donors who want to make a
                difference. Our mission is to streamline the donation process and help shelters receive the items and
                support they need most.
              </p>
            </div>
            <div className="mx-auto lg:mx-0 relative w-full max-w-[500px] aspect-video rounded-xl overflow-hidden">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Team of volunteers helping at a shelter"
                width={800}
                height={600}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Mission</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We believe that everyone deserves a safe place to call home and access to basic necessities.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Card>
              <CardHeader className="flex flex-col items-center text-center">
                <div className="p-2 bg-primary/10 rounded-full mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Support Those in Need</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p>
                  We connect donors directly with shelters to provide essential items and support to those experiencing
                  homelessness.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-col items-center text-center">
                <div className="p-2 bg-primary/10 rounded-full mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Build Community</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p>
                  We foster a community of compassionate individuals and organizations working together to address
                  homelessness.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-col items-center text-center">
                <div className="p-2 bg-primary/10 rounded-full mb-4">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Create Lasting Change</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p>
                  We aim to create sustainable solutions that help individuals transition from homelessness to stable
                  housing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How ShelterConnect Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform makes it easy for donors to find and support homeless shelters in their community.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Find Shelters Near You</h3>
                  <p className="text-muted-foreground">
                    Use our interactive map to locate homeless shelters in your area or search for specific locations.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">View Shelter Needs</h3>
                  <p className="text-muted-foreground">
                    Browse through the list of items and resources that shelters currently need, prioritized by urgency.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Make a Donation</h3>
                  <p className="text-muted-foreground">
                    Contribute items or funds directly to the shelters and track your donation history in your personal
                    dashboard.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Make an Impact</h3>
                  <p className="text-muted-foreground">
                    Your donations directly help individuals and families experiencing homelessness in your community.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="How ShelterConnect works"
                width={800}
                height={600}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Impact */}
      <section className="py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Impact</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Together, we're making a difference in the lives of those experiencing homelessness.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-4xl font-bold">5,000+</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Donations Made</CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-4xl font-bold">100+</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Shelters Supported</CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-4xl font-bold">2,500+</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Active Donors</CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-4xl font-bold">50+</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Cities Served</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Team</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Meet the passionate individuals behind ShelterConnect.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto relative w-24 h-24 rounded-full overflow-hidden mb-4">
                  <Image
                    src="/placeholder.svg?height=200&width=200"
                    alt="Team member"
                    width={200}
                    height={200}
                    className="object-cover"
                  />
                </div>
                <CardTitle>Sarah Johnson</CardTitle>
                <CardDescription>Founder & Executive Director</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Sarah has over 15 years of experience working with homeless services organizations.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto relative w-24 h-24 rounded-full overflow-hidden mb-4">
                  <Image
                    src="/placeholder.svg?height=200&width=200"
                    alt="Team member"
                    width={200}
                    height={200}
                    className="object-cover"
                  />
                </div>
                <CardTitle>Michael Chen</CardTitle>
                <CardDescription>Technology Director</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Michael leads our technology efforts to create an accessible platform for all users.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto relative w-24 h-24 rounded-full overflow-hidden mb-4">
                  <Image
                    src="/placeholder.svg?height=200&width=200"
                    alt="Team member"
                    width={200}
                    height={200}
                    className="object-cover"
                  />
                </div>
                <CardTitle>Aisha Williams</CardTitle>
                <CardDescription>Community Outreach Manager</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Aisha works directly with shelters to understand their needs and improve our services.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Make a Difference?
              </h2>
              <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join our community of donors and help those experiencing homelessness in your area.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/map">
                <Button size="lg" variant="secondary">
                  Find Shelters
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Create an Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
