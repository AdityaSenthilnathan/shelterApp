import { createClient } from "@/lib/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createClient()

  try {
    // Sample shelter data
    const shelters = [
      {
        name: "Hope Haven",
        description:
          "Hope Haven provides emergency shelter, meals, and support services to individuals and families experiencing homelessness.",
        address: "123 Main Street",
        city: "San Francisco",
        state: "CA",
        zip_code: "94105",
        phone: "(415) 555-1234",
        email: "info@hopehaven.org",
        website: "https://www.hopehaven.org",
        latitude: 37.7749,
        longitude: -122.4194,
        image_url: "/placeholder.svg?height=400&width=800",
      },
      {
        name: "Sunrise Shelter",
        description:
          "Sunrise Shelter offers a safe place for those in need with comprehensive services to help rebuild lives.",
        address: "456 Oak Avenue",
        city: "Los Angeles",
        state: "CA",
        zip_code: "90001",
        phone: "(213) 555-6789",
        email: "contact@sunriseshelter.org",
        website: "https://www.sunriseshelter.org",
        latitude: 34.0522,
        longitude: -118.2437,
        image_url: "/placeholder.svg?height=400&width=800",
      },
      {
        name: "New Beginnings",
        description:
          "New Beginnings is dedicated to helping homeless individuals transition to permanent housing and self-sufficiency.",
        address: "789 Pine Road",
        city: "Seattle",
        state: "WA",
        zip_code: "98101",
        phone: "(206) 555-4321",
        email: "help@newbeginnings.org",
        website: "https://www.newbeginnings.org",
        latitude: 47.6062,
        longitude: -122.3321,
        image_url: "/placeholder.svg?height=400&width=800",
      },
      {
        name: "Harmony House",
        description:
          "Harmony House provides shelter, food, and supportive services to homeless families with children.",
        address: "101 Cedar Lane",
        city: "Chicago",
        state: "IL",
        zip_code: "60601",
        phone: "(312) 555-8765",
        email: "info@harmonyhouse.org",
        website: "https://www.harmonyhouse.org",
        latitude: 41.8781,
        longitude: -87.6298,
        image_url: "/placeholder.svg?height=400&width=800",
      },
      {
        name: "Restoration Center",
        description:
          "Restoration Center offers comprehensive services to help individuals overcome homelessness and rebuild their lives.",
        address: "202 Maple Street",
        city: "New York",
        state: "NY",
        zip_code: "10001",
        phone: "(212) 555-9876",
        email: "contact@restorationcenter.org",
        website: "https://www.restorationcenter.org",
        latitude: 40.7128,
        longitude: -74.006,
        image_url: "/placeholder.svg?height=400&width=800",
      },
    ]

    // Insert shelters
    const { data: sheltersData, error: sheltersError } = await supabase.from("shelters").insert(shelters).select()

    if (sheltersError) {
      throw sheltersError
    }

    // Sample needs data
    const needs = []

    // Hope Haven needs
    if (sheltersData && sheltersData[0]) {
      needs.push(
        {
          shelter_id: sheltersData[0].id,
          title: "Winter Coats",
          description: "We need warm winter coats for adults of all sizes. New or gently used coats are welcome.",
          category: "Clothing",
          quantity: 50,
          is_fulfilled: false,
          priority: "urgent",
        },
        {
          shelter_id: sheltersData[0].id,
          title: "Canned Food",
          description:
            "Non-perishable canned goods for our food pantry. Especially needed: soups, vegetables, and proteins.",
          category: "Food",
          quantity: 200,
          is_fulfilled: false,
          priority: "medium",
        },
        {
          shelter_id: sheltersData[0].id,
          title: "Toiletry Kits",
          description: "Personal hygiene items including toothbrushes, toothpaste, soap, shampoo, and deodorant.",
          category: "Hygiene",
          quantity: 100,
          is_fulfilled: false,
          priority: "high",
        },
        {
          shelter_id: sheltersData[0].id,
          title: "Emergency Funding",
          description:
            "Financial support for our emergency services program that helps individuals with immediate needs.",
          category: "Money",
          is_fulfilled: false,
          priority: "urgent",
        },
      )
    }

    // Sunrise Shelter needs
    if (sheltersData && sheltersData[1]) {
      needs.push(
        {
          shelter_id: sheltersData[1].id,
          title: "Blankets",
          description: "Clean, warm blankets for our overnight guests. Twin size preferred.",
          category: "Bedding",
          quantity: 75,
          is_fulfilled: false,
          priority: "high",
        },
        {
          shelter_id: sheltersData[1].id,
          title: "Children's Books",
          description: "Books for children ages 3-12 for our family reading program.",
          category: "Education",
          quantity: 100,
          is_fulfilled: false,
          priority: "low",
        },
        {
          shelter_id: sheltersData[1].id,
          title: "Volunteer Cooks",
          description: "We need volunteers to help prepare meals for our residents on weekends.",
          category: "Volunteers",
          is_fulfilled: false,
          priority: "medium",
        },
      )
    }

    // New Beginnings needs
    if (sheltersData && sheltersData[2]) {
      needs.push(
        {
          shelter_id: sheltersData[2].id,
          title: "Professional Clothing",
          description: "Business attire for job interviews. Men's and women's clothing in all sizes needed.",
          category: "Clothing",
          is_fulfilled: false,
          priority: "medium",
        },
        {
          shelter_id: sheltersData[2].id,
          title: "Laptop Computers",
          description:
            "Working laptops for our job search and education center. Used laptops in good condition are welcome.",
          category: "Technology",
          quantity: 10,
          is_fulfilled: false,
          priority: "high",
        },
        {
          shelter_id: sheltersData[2].id,
          title: "Transportation Funds",
          description:
            "Funding to provide bus passes and transportation assistance for residents attending job interviews.",
          category: "Money",
          is_fulfilled: false,
          priority: "urgent",
        },
      )
    }

    // Harmony House needs
    if (sheltersData && sheltersData[3]) {
      needs.push(
        {
          shelter_id: sheltersData[3].id,
          title: "Diapers and Baby Supplies",
          description: "Diapers (all sizes), baby wipes, formula, and baby food for families with infants.",
          category: "Baby Items",
          is_fulfilled: false,
          priority: "urgent",
        },
        {
          shelter_id: sheltersData[3].id,
          title: "School Supplies",
          description: "Backpacks, notebooks, pencils, and other school supplies for children in our shelter.",
          category: "Education",
          is_fulfilled: false,
          priority: "high",
        },
        {
          shelter_id: sheltersData[3].id,
          title: "Children's Clothing",
          description: "New or gently used clothing for children ages 2-12, all seasons.",
          category: "Clothing",
          is_fulfilled: false,
          priority: "medium",
        },
      )
    }

    // Restoration Center needs
    if (sheltersData && sheltersData[4]) {
      needs.push(
        {
          shelter_id: sheltersData[4].id,
          title: "Mental Health Services",
          description: "Funding for our mental health counseling program that serves shelter residents.",
          category: "Money",
          is_fulfilled: false,
          priority: "high",
        },
        {
          shelter_id: sheltersData[4].id,
          title: "Sleeping Bags",
          description: "Durable sleeping bags for our outreach program to unsheltered individuals.",
          category: "Bedding",
          quantity: 50,
          is_fulfilled: false,
          priority: "urgent",
        },
        {
          shelter_id: sheltersData[4].id,
          title: "Non-prescription Medications",
          description: "Over-the-counter medications like pain relievers, cold medicine, and first aid supplies.",
          category: "Health",
          is_fulfilled: false,
          priority: "medium",
        },
      )
    }

    // Insert needs
    const { error: needsError } = await supabase.from("needs").insert(needs)

    if (needsError) {
      throw needsError
    }

    return NextResponse.json({
      success: true,
      message: "Sample data seeded successfully",
      sheltersCount: sheltersData.length,
      needsCount: needs.length,
    })
  } catch (error: any) {
    console.error("Error seeding data:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error seeding data",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
