import { v4 as uuidv4 } from 'uuid';

export const generateRandomAstronomicalEvent = (coordinates : {latitude: number, longitude: number}) => {
    // List of possible event types
    const eventTypes = [
        'Meteor Shower',
        'Solar Eclipse',
        'Lunar Eclipse',
        'Planetary Alignment',
        'Supermoon',
        'Comet Sighting',
        'Asteroid Flyby',
    ];

    // List of possible event names
    const eventNames = [
        'Perseid Meteor Shower',
        'Geminid Meteor Shower',
        'Total Solar Eclipse',
        'Partial Lunar Eclipse',
        'Great Planetary Alignment',
        'Blue Supermoon',
        'Halley\'s Comet Sighting',
        'Asteroid 99942 Apophis Flyby',
    ];

    // List of possible visibility descriptions
    const visibilityOptions = [
        'Best visible after midnight',
        'Visible throughout the night',
        'Best viewed at dawn',
        'Visible with a telescope',
        'Visible to the naked eye',
    ];

    // List of possible intensities
    const intensities = [
        'Low',
        'Medium',
        'High',
        'Extreme',
    ];

    // List of possible frequencies
    const frequencies = [
        'Annual',
        'Biennial',
        'Once-in-a-lifetime',
        'Occasional',
        'Rare',
    ];

    // Helper function to generate random date within the next year
    const randomDate = (startDate = new Date(), daysOffset = 1) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + daysOffset);
        return date.toISOString();
    };

    // Randomly select the event type, name, visibility, intensity, and frequency
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const eventName = eventNames[Math.floor(Math.random() * eventNames.length)];
    const visibility = visibilityOptions[Math.floor(Math.random() * visibilityOptions.length)];
    const intensity = intensities[Math.floor(Math.random() * intensities.length)];
    const frequency = frequencies[Math.floor(Math.random() * frequencies.length)];

    // Generate start and end dates for the event
    const startDate = randomDate();
    const endDate = randomDate(new Date(startDate), Math.floor(Math.random() * 5) + 1); // event lasts 1-5 days

    // Generate a description based on the event type
    let description = '';
    switch (eventType) {
        case 'Meteor Shower':
            description = `The ${eventName} is an annual meteor shower with high visibility.`;
            break;
        case 'Solar Eclipse':
            description = `The ${eventName} is a rare solar eclipse, visible in specific regions.`;
            break;
        case 'Lunar Eclipse':
            description = `The ${eventName} is a total lunar eclipse with clear visibility across many locations.`;
            break;
        case 'Planetary Alignment':
            description = `The ${eventName} is a spectacular planetary alignment visible to the naked eye.`;
            break;
        case 'Supermoon':
            description = `The ${eventName} will make the Moon appear larger and brighter than usual.`;
            break;
        case 'Comet Sighting':
            description = `The ${eventName} marks a rare sighting of a bright comet.`;
            break;
        case 'Asteroid Flyby':
            description = `The ${eventName} marks an asteroid flying by Earth at a safe distance.`;
            break;
        default:
            description = `An unknown astronomical event.`;
    }

    // Generate event object
    const event = {
        id: uuidv4(), // Use UUID v4 for unique ID
        type: eventType,
        name: eventName,
        startDate: startDate,
        endDate: endDate,
        location: {
            type: 'Point',
            coordinates: coordinates, // Use the provided coordinates
        },
        description: description,
        visibility: visibility,
        intensity: intensity,
        frequency: frequency,
    };

    return event;
};

// Example usage:
export const randomEvent = generateRandomAstronomicalEvent({latitude: 1, longitude: 1});

