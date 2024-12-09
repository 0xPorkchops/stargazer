import { useEffect, useState } from 'react';
import axios from 'axios';
import { GetGeolocation } from '../lib/utils';
import AddressAutoCompleteInput from '@/components/AddressSearchInput';
import LoadingContainer from '@/components/LoadingContainer';
import { AstronomicalEvent } from '@/interfaces/AstronomicalEvent';


export default function Events() {
    const [events, setEvents] = useState<AstronomicalEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number } | null>(null);
    const [selectedRadius, setRadius] = useState<number>(25000);

    // Fetch events from the API
    const fetchEvents = async (lat: number, lon: number, radius: number) => {
        try {
            const eventResponse = await axios.get('http://localhost:3000/api/events/near', {
                params: { paramLat: lat, paramLon: lon, paramRadius: radius },
            });
            console.log(lat, lon, radius);
            console.log(eventResponse.data);
            setEvents(eventResponse.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch events");
        } finally {
            setLoading(false);
        }
    };
    // Use geolocation as the initial location, then fetch weather data
    useEffect(() => {
        const loadInitialLocation = async () => {
            try {
                // First, get the user's geolocation
                const location = await GetGeolocation();
                
                // Set the location to be used later in the API request
                setSelectedLocation({ lat: location.userLat, lon: location.userLong });
            } catch (err) {
                setError("Unable to retrieve geolocation: " + err);
            }
        };
        loadInitialLocation();
    }, []);

    useEffect(() => {
        if (selectedLocation) {
            fetchEvents(selectedLocation.lat, selectedLocation.lon, selectedRadius);
        }
    }, [selectedLocation, selectedRadius]);

    // Conditional rendering for loading and error states
    if (loading) {
        return <LoadingContainer />
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <AddressAutoCompleteInput onLocationSelect={setSelectedLocation} />
            <div className="flex justify-center">
            <div className="events-container flex flex-col w-[90%]">
            <h1 className="text-2xl font-bold mb-2 text-center">Nearby Events</h1>
            <input
                className="justify-self-center bg-transparent border rounded mb-2"
                type="number"
                onChange={(e) => setRadius(Number(e.target.value))}
                placeholder="Enter radius"
            />
            {events.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="border rounded-lg shadow p-4 hover:shadow-lg transition"
                        >
                            <h2 className="text-xl font-semibold">{event.name}</h2>
                            <p className="text-gray-500">{new Date(event.startDate).toLocaleString()}</p>
                            <p className="my-2">{event.description}</p>
                            <p className="text-sm text-gray-500">Location: {event.location.coordinates.longitude.toFixed(6)} {event.location.coordinates.latitude.toFixed(6)}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No events found nearby.</p>
            )}
            </div>
            </div>
        </>
        
    );
}
