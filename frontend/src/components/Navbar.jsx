// src/components/Navbar.jsx
import { useApp } from '../context/AppContext'
import { MapPin, Wifi, WifiOff, Loader } from 'lucide-react'

export default function Navbar({ title = 'Analyze Item' }) {
  const { apiConnected, userLocation, locationLoading } = useApp()

  return (
    <header className="h-14 bg-white border-b border-stone-200 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-sm font-semibold text-stone-700">{title}</h1>

      <div className="flex items-center gap-3">

        {/* Location badge */}
        <span className="flex items-center gap-1.5 text-xs text-stone-500 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-full">
          {locationLoading ? (
            <Loader size={11} className="animate-spin" />
          ) : (
            <MapPin size={11} className="text-green-600" />
          )}
          {userLocation
            ? `${userLocation.city}, ${userLocation.country}`
            : 'Detecting location...'}
        </span>

        {/* API connection badge */}
        {apiConnected === null && (
          <span className="flex items-center gap-1.5 text-xs text-stone-400 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse" />
            Connecting...
          </span>
        )}
        {apiConnected === true && (
          <span className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full font-medium">
            <Wifi size={11} />
            API Connected
          </span>
        )}
        {apiConnected === false && (
          <span className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full font-medium">
            <WifiOff size={11} />
            API Offline
          </span>
        )}

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center">
          RI
        </div>
      </div>
    </header>
  )
}
