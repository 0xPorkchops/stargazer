const event = {
    "id": "event_001",
    "type": "Meteor Shower",
    "name": "Perseid Meteor Shower",
    "startDate": "2024-08-10T00:00:00Z",
    "endDate": "2024-08-13T00:00:00Z",
    "location": {
      "type": "Point",
      "coordinates": [ -122.4194, 37.7749 ] // Coordinates for San Francisco
    },
    "description": "The Perseid meteor shower is an annual meteor shower associated with the comet Swift-Tuttle.",
    "visibility": "Best visible after midnight",
    "intensity": "High",
    "frequency": "Annual"
  };

  export function getEvents(){
    return event;
  }