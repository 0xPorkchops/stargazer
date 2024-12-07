import { useEffect, useRef } from 'react';
import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';

interface AddressAutoCompleteInputProps {
    onLocationSelect: (location: { lat: number; lon: number }) => void;
}

export default function AddressAutoCompleteInput({ onLocationSelect }: AddressAutoCompleteInputProps) {
    const autocompleteInitialized = useRef(false);
    const autocompleteRef = useRef<GeocoderAutocomplete | null>(null); // Store autocomplete instance

    useEffect(() => {
        if (autocompleteInitialized.current) return; // Prevent re-initialization

        const element = document.getElementById("autocomplete");
        if (element && !autocompleteRef.current) {
            const autocomplete = new GeocoderAutocomplete(
                element,
                import.meta.env.VITE_AUTOCOMPLETE_API_KEY, // API key
                {}
            );
            autocompleteRef.current = autocomplete; // Store instance

            // Add event listener for 'select'
            autocomplete.on('select', (location) => {
                if (location?.properties) {
                    const { lat, lon } = location.properties;
                    console.log("Selected location:", { lat, lon });
                    onLocationSelect({ lat, lon });
                }
            });

            autocompleteInitialized.current = true;
        }
    }, [onLocationSelect]); // Only rerun if onLocationSelect changes

    return <div id="autocomplete" className="autocomplete-container flex justify-center pt-8"></div>;
}
