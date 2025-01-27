"use client"

import { useEffect, useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { debounce } from 'lodash'

interface LocationData {
  coordinates: [number, number]
  place_name: string
  address: string
  city: string
  region: string
  country: string
  postal_code: string | null
  context: {
    neighborhood: string | null
    district: string | null
    [key: string]: string | null
  }
}

interface MapboxFeature {
  id: string
  type: string
  place_type: string[]
  text: string
  place_name: string
  center: [number, number]
  properties: {
    address?: string
    [key: string]: string | undefined
  }
  context?: Array<{
    id: string
    text: string
    [key: string]: string | undefined
  }>
}

interface LocationInputProps {
  value: string
  onChange: (value: string, locationData?: LocationData) => void
  className?: string
  placeholder?: string
}

export function LocationInput({
  value,
  onChange,
  className,
  placeholder = "Enter a location..."
}: LocationInputProps) {
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Update local input value when prop value changes
  useEffect(() => {
    setInputValue(value)
  }, [value])

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([])
      return
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        new URLSearchParams({
          access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',
          types: 'address,place',
          country: 'IT', // Limit to Italy
          language: 'it,en', // Italian and English results
          limit: '5'
        })
      )

      const data: { features: MapboxFeature[] } = await response.json()
      setSuggestions(data.features || [])
    } catch (error) {
      console.error('Error fetching location suggestions:', error)
      setSuggestions([])
    }
  }

  const debouncedFetch = debounce(fetchSuggestions, 300)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setShowSuggestions(true)
    debouncedFetch(newValue)
    onChange(newValue) // Update parent with raw input value
  }

  const handleSuggestionClick = (suggestion: MapboxFeature) => {
    const locationData: LocationData = {
      coordinates: suggestion.center,
      place_name: suggestion.place_name,
      address: suggestion.properties?.address || suggestion.text,
      city: suggestion.context?.find(c => c.id.startsWith('place'))?.text || '',
      region: suggestion.context?.find(c => c.id.startsWith('region'))?.text || '',
      country: suggestion.context?.find(c => c.id.startsWith('country'))?.text || 'Italy',
      postal_code: suggestion.context?.find(c => c.id.startsWith('postcode'))?.text || null,
      context: {
        neighborhood: suggestion.context?.find(c => c.id.startsWith('neighborhood'))?.text || null,
        district: suggestion.context?.find(c => c.id.startsWith('district'))?.text || null,
      }
    }

    setInputValue(suggestion.place_name)
    setShowSuggestions(false)
    setSuggestions([])
    onChange(suggestion.place_name, locationData)
  }

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        className={className}
        placeholder={placeholder}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
          <ul className="py-1">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.place_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
} 