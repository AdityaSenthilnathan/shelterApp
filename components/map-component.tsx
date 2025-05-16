"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useRouter } from "next/navigation"

// Define the props for the MapComponent
interface MapComponentProps {
  shelters: any[]
  userLocation: [number, number]
  selectedShelterId: string | null
  onShelterSelect: (shelterId: string) => void
}

export default function MapComponent({
  shelters,
  userLocation,
  selectedShelterId,
  onShelterSelect,
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<{ [key: string]: L.Marker }>({})
  const router = useRouter()

  useEffect(() => {
    // Initialize the map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView(userLocation, 10)

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current)

      // Add user location marker
      const userIcon = L.divIcon({
        html: `<div class="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>`,
        className: "user-location-marker",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      L.marker(userLocation, { icon: userIcon }).addTo(mapRef.current).bindPopup("Your Location")
    }

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => {
      if (mapRef.current) {
        mapRef.current.removeLayer(marker)
      }
    })
    markersRef.current = {}

    // Add shelter markers
    shelters.forEach((shelter) => {
      if (mapRef.current && shelter.latitude && shelter.longitude) {
        const isSelected = selectedShelterId === shelter.id

        // Create custom marker icon
        const markerIcon = L.divIcon({
          html: `<div class="w-6 h-6 rounded-full flex items-center justify-center ${
            isSelected ? "bg-primary" : "bg-red-500"
          } text-white border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>`,
          className: "shelter-marker",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        })

        // Create marker and add to map
        const marker = L.marker([shelter.latitude, shelter.longitude], { icon: markerIcon })
          .addTo(mapRef.current)
          .bindPopup(`
            <div class="text-center">
              <strong>${shelter.name}</strong><br>
              ${shelter.address}, ${shelter.city}<br>
              <button class="view-details-btn bg-blue-500 text-white px-2 py-1 rounded text-xs mt-2">
                View Details
              </button>
            </div>
          `)
          .on("click", () => {
            onShelterSelect(shelter.id)
          })

        // Add event listener to the popup content after it's added to the DOM
        marker.on("popupopen", () => {
          const button = document.querySelector(".view-details-btn")
          if (button) {
            button.addEventListener("click", () => {
              router.push(`/shelters/${shelter.id}`)
            })
          }
        })

        markersRef.current[shelter.id] = marker
      }
    })

    // If a shelter is selected, pan to it and open its popup
    if (selectedShelterId && markersRef.current[selectedShelterId] && mapRef.current) {
      const marker = markersRef.current[selectedShelterId]
      const position = marker.getLatLng()
      mapRef.current.panTo(position)
      marker.openPopup()
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [shelters, userLocation, selectedShelterId, onShelterSelect, router])

  return <div id="map" className="w-full h-[600px] rounded-lg overflow-hidden" />
}
