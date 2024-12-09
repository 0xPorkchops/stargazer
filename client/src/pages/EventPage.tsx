import { useEffect, useState } from 'react';
import axios from 'axios';
import { GetGeolocation } from '../lib/utils';
import AddressAutoCompleteInput from '@/components/AddressSearchInput';
import LoadingContainer from '@/components/LoadingContainer';
import { AstronomicalEvent } from '@/interfaces/AstronomicalEvent';
import '../css/event.css';

export default function Events() {
    const [events, setEvents] = useState<AstronomicalEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number } | null>(null);
    const [selectedRadius, setRadius] = useState<number>(50);
    const [sortPreference, setSortPreference] = useState<'byLocation' | 'byTime'>('byLocation'); // New state

    // Function to sort events by location
    function sortbyLocation(
        events: AstronomicalEvent[],
        selectedLocation: { lat: number; lon: number } | null
    ): AstronomicalEvent[] {
        if (!selectedLocation) return events;

        const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
            const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
            const earthRadius = 6371; // Radius of the Earth in kilometers

            const dLat = toRadians(lat2 - lat1);
            const dLon = toRadians(lon2 - lon1);

            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRadians(lat1)) *
                    Math.cos(toRadians(lat2)) *
                    Math.sin(dLon / 2) *
                    Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            return earthRadius * c;
        };

        return events.sort((a, b) => {
            const distanceA = calculateDistance(
                selectedLocation.lat,
                selectedLocation.lon,
                a.location.coordinates[0],
                a.location.coordinates[1]
            );
            const distanceB = calculateDistance(
                selectedLocation.lat,
                selectedLocation.lon,
                b.location.coordinates[0],
                b.location.coordinates[1]
            );
            return distanceA - distanceB;
        });
    }

    // Function to sort events by time
    function sortByTime(events: AstronomicalEvent[]): AstronomicalEvent[] {
        return events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    }

    // Fetch events from the API
    const fetchEvents = async (lat: number, lon: number, radius: number) => {
        try {
            const eventResponse = await axios.get('/api/events/near', {
                params: { paramLat: lat, paramLon: lon, paramRadius: radius },
            });
            setEvents(eventResponse.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch events");
        } finally {
            setLoading(false);
        }
    };

    // Use geolocation as the initial location, then fetch events
    useEffect(() => {
        const loadInitialLocation = async () => {
            try {
                const location = await GetGeolocation();
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
        return <LoadingContainer />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Determine the sorted events based on the user's preference
    const sortedEvents =
        sortPreference === 'byLocation'
            ? sortbyLocation(events, selectedLocation)
            : sortByTime(events);

    return (
        <>
            <AddressAutoCompleteInput onLocationSelect={setSelectedLocation} className="flex justify-center w-[100%] md:w-[45%] justify-self-center my-8"/>
            <div className="flex justify-center">
                <div className="events-container flex flex-col w-[90%]">
                    <h1 className="text-2xl font-bold mb-2 text-center">Nearby Events</h1>
                    <div className="flex justify-between mb-4">
                        <div className="flex">
                            <p className="me-2">Radius: </p>
                            <input
                                className="placeholder-[hsl(var(--foreground))] placeholder-opacity-50r w-1/8 bg-transparent border rounded mb-2 px-2"
                                type="number"
                                onChange={(e) => setRadius(Number(e.target.value))}
                                placeholder="50"
                            />
                        </div>
                        <div className="flex">
                            <p className="me-2">Sort By: </p>
                            <select
                                value={sortPreference}
                                onChange={(e) => setSortPreference(e.target.value as 'byLocation' | 'byTime')}
                                className="placeholder-[hsl(var(--foreground))] placeholder-opacity-50r bg-transparent border rounded mb-2"
                            >
                                <option value="byLocation">Location</option>
                                <option value="byTime">Time</option>
                            </select>
                        </div>
                    </div>
                    {sortedEvents.length > 0 ? (
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {sortedEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="border rounded-lg shadow p-4 hover:shadow-lg transition"
                                >
                                    <h2 className="text-xl font-semibold">{event.name}</h2>
                                    <p className="text-gray-500">
                                        Start: {new Date(event.startDate).toLocaleString()}
                                    </p>
                                    <p className="text-gray-500">
                                        End: {new Date(event.endDate).toLocaleString()}
                                    </p>
                                    <p className="my-2">{event.description}</p>
                                    <p className="text-sm text-gray-500">
                                        Location: {event.location.coordinates[0]?.toFixed(6)}{", "}
                                        {event.location.coordinates[1]?.toFixed(6)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Frequency: {event.frequency}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Intensity : {event.intensity}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <p className="text-lg">No events found nearby.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
