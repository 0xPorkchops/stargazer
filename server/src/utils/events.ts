import { v4 as uuidv4 } from 'uuid';

interface Location {
  type: string;
  coordinates: number[];
}

export interface AstronomicalEvent {
  id: string;
  type: string;
  name: string;
  startDate: Date;
  endDate: Date;
  location: Location;
  description: string;
  visibility: string;
  intensity: string;
  frequency: string;
}

const eventCoordinateRanges = {
  'Meteor Shower': {
    latRange: [-90, 90],
    lonRange: [-180, 180],
  },
  'Solar Eclipse': {
    latRange: [-60, 60],
    lonRange: [-180, 180],
  },
  'Lunar Eclipse': {
    latRange: [-90, 90],
    lonRange: [-180, 180],
  },
  'Planetary Alignment': {
    latRange: [-30, 30],
    lonRange: [-180, 180],
  },
  'Supermoon': {
    latRange: [-90, 90],
    lonRange: [-180, 180],
  },
  'Comet Sighting': {
    latRange: [30, 90],
    lonRange: [-180, 180],
  },
  'Asteroid Flyby': {
    latRange: [-90, -30],
    lonRange: [-180, 180],
  },
};

const eventTypes = [
  'Meteor Shower',
  'Solar Eclipse',
  'Lunar Eclipse',
  'Planetary Alignment',
  'Supermoon',
  'Comet Sighting',
  'Asteroid Flyby',
] as const;

const eventNames = {
  'Meteor Shower': [
    'Perseids Meteor Shower',
    'Leonids Meteor Shower',
    'Geminids Meteor Shower',
    'Orionids Meteor Shower',
    'Lyrids Meteor Shower',
    'Eta Aquariids Meteor Shower',
    'Draconids Meteor Shower',
  ],
  'Solar Eclipse': [
    'Total Solar Eclipse',
    'Partial Solar Eclipse',
    'Annular Solar Eclipse',
    'Hybrid Solar Eclipse',
    'Ring of Fire Eclipse',
    'Shadow Crossing Eclipse',
  ],
  'Lunar Eclipse': [
    'Total Lunar Eclipse',
    'Partial Lunar Eclipse',
    'Penumbral Lunar Eclipse',
    'Blood Moon Eclipse',
    'Harvest Moon Eclipse',
    'Hunter’s Moon Eclipse',
  ],
  'Planetary Alignment': [
    'Great Conjunction',
    'Triangular Conjunction',
    'Venus-Mars Alignment',
    'Jupiter-Saturn Alignment',
    'Inner Planet Alignment',
    'Celestial Parade',
  ],
  'Supermoon': [
    'Pink Supermoon',
    'Strawberry Supermoon',
    'Blue Supermoon',
    'Hunter’s Supermoon',
    'Snow Supermoon',
    'Harvest Supermoon',
  ],
  'Comet Sighting': [
    'Comet Halley',
    'Comet NEOWISE',
    'Comet Lovejoy',
    'Comet Hale-Bopp',
    'Comet Encke',
    'Comet Machholz',
  ],
  'Asteroid Flyby': [
    'Asteroid Apophis Flyby',
    'Asteroid Bennu Encounter',
    'Asteroid Ryugu Observation',
    'Asteroid 2011 AG5 Close Pass',
    'Asteroid Florence Flyby',
    'Asteroid Itokawa Sighting',
  ],
};

const visibilityOptions = [
  'Best visible after midnight',
  'Visible throughout the night',
  'Best viewed at dawn',
  'Visible with a telescope',
  'Visible to the naked eye',
];

const intensities = ['Low', 'Medium', 'High', 'Extreme'];

const frequencies = ['Annual', 'Biennial', 'Once-in-a-lifetime', 'Occasional', 'Rare'];

const descriptions = [
  'is an annual meteor shower with high visibility.',
  'is a rare solar eclipse, visible in specific regions.',
  'is a total lunar eclipse with clear visibility across many locations.',
  'is a spectacular planetary alignment visible to the naked eye.',
  'will make the Moon appear larger and brighter than usual.',
  'marks a rare sighting of a bright comet.',
  'marks an asteroid flying by Earth at a safe distance.',
];

const randomDate = (startDate = new Date(), daysOffsetMin = 1, daysOffsetMax = 7) => {
    // Create a copy of the start date
    const date = new Date(startDate);
  
    // Randomize the number of days to offset
    const daysOffset = Math.floor(Math.random() * (daysOffsetMax - daysOffsetMin + 1)) + daysOffsetMin;
  
    // Add the random days offset
    date.setDate(date.getDate() + daysOffset);
  
    // Randomize the time (hours, minutes, seconds, milliseconds)
    date.setHours(Math.floor(Math.random() * 24)); // Random hour (0-23)
    date.setMinutes(Math.floor(Math.random() * 60)); // Random minute (0-59)
    date.setSeconds(Math.floor(Math.random() * 60)); // Random second (0-59)
    date.setMilliseconds(Math.floor(Math.random() * 1000)); // Random millisecond (0-999)
  
    return date;
  };
  

export const generateRandomCoord = (
  coordinateRange: { latRange: number[]; lonRange: number[] }
): Coordinates => {
  const latRangeStart = coordinateRange.latRange[0],
    latRangeEnd = coordinateRange.latRange[1];
  const lonRangeStart = coordinateRange.lonRange[0],
    lonRangeEnd = coordinateRange.lonRange[1];

  const latDifference = latRangeEnd - latRangeStart;
  const lonDifference = lonRangeEnd - lonRangeStart;

  return [
    lonRangeStart + Math.random() * lonDifference, 
    latRangeStart + Math.random() * latDifference
  ] 
};

export const generateRandomAstronomicalEvent = (): AstronomicalEvent => {
  // Randomly select the event type
  const eventIndex = Math.floor(Math.random() * eventTypes.length);
  const eventType: typeof eventTypes[number] = eventTypes[eventIndex];

  // Select the corresponding coordinate range for this event type
  const coordinateRange = eventCoordinateRanges[eventType];

  // Generate random coordinates within the range
  const coordinates = generateRandomCoord(coordinateRange);

  // Select random event name, visibility, intensity, and frequency
  const eventName =
    eventNames[eventType][Math.floor(Math.random() * eventNames[eventType].length)];
  const visibility = visibilityOptions[Math.floor(Math.random() * visibilityOptions.length)];
  const intensity = intensities[Math.floor(Math.random() * intensities.length)];
  const frequency = frequencies[Math.floor(Math.random() * frequencies.length)];

  // Generate start and end dates for the event
  const startDate = randomDate();
  const endDate = randomDate(new Date(startDate), 1, 5); // event lasts 1-5 days

  let description = `The ${eventName} ${descriptions[eventIndex]}` || 'An unknown astronomical event.';

  // Generate event object
  const event: AstronomicalEvent = {
    id: uuidv4(), // Use UUID v4 for unique ID
    type: eventType,
    name: eventName,
    startDate: startDate,
    endDate: endDate,
    location: {
      type: 'Point',
      coordinates: coordinates, // Use the generated coordinates
    },
    description: description,
    visibility: visibility,
    intensity: intensity,
    frequency: frequency,
  };

  return event;
};

export const getDailyEvents = (): AstronomicalEvent[] => {
  const randomNumber = Math.floor(Math.random() * (10 - 3 + 1)) + 3;
  console.log(randomNumber);
  const events: AstronomicalEvent[] = [];
  for (let i = 0; i < randomNumber; i++) {
    events.push(generateRandomAstronomicalEvent());
  }
  return events;
};
