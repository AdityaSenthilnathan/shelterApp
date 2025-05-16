import { createClient } from "@/lib/server"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart } from "lucide-react"
import { DonationForm } from "@/components/donation-form"
import Image from "next/image"
import ShelterDetails from "@/components/shelter-details"

export default async function ShelterPage({
  params,
  searchParams,
}: { params: { id: string }; searchParams: { need?: string } }) {
  const supabase = createClient()

  // Fetch shelter details
  const { data: shelter, error: shelterError } = await supabase
    .from("shelters")
    .select("*")
    .eq("id", params.id)
    .single()

  if (shelterError || !shelter) {
    notFound()
  }

  // Fetch shelter needs
  const { data: needs, error: needsError } = await supabase
    .from("needs")
    .select("*")
    .eq("shelter_id", params.id)
    .order("priority", { ascending: false })

  // Get the highlighted need if specified in the URL
  const highlightedNeedId = searchParams.need
  const highlightedNeed = highlightedNeedId && needs ? needs.find((need) => need.id === highlightedNeedId) : null

  return (
    <ShelterDetails
      shelter={shelter}
      needs={needs || []}
      highlightedNeed={highlightedNeed}
    />
  )
}
