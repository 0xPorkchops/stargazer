export interface AstronomicalEvent {
    id: string;
    type: string;
    name: string;
    startDate: string;
    endDate: string;
    location: Location;
    description: string;
    visibility: string;
    intensity: string;
    frequency: string;
  }

interface Location{
    type: string;
    coordinates: number[];
  }