import { getGeolocation } from '../getGeolocation'
import { useState, useEffect } from 'react';
export default function LocationTest(){
    const [coordinates, setCoordinates] = useState<{latitude: number, longitude: number} | null >(null);
    
    useEffect(() => {
        const fetchGeoLocation = async () => {
          try {
            // Assuming getGeolocation returns an object with userLat and userLong
            const { userLat, userLong } = await getGeolocation();
            setCoordinates({ latitude: userLat, longitude: userLong });
          } catch (error) {
            console.error("Error fetching geolocation:", error);
          }
        };
    
        fetchGeoLocation();
      }, []);
    console.log(coordinates);
    return (<>
        <h1>Location Test</h1>
    </>)
}