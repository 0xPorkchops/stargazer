const locations = {
    northAmerica: [
      { city: "New York, USA", latitude: 40.7128, longitude: -74.0060 },
      { city: "Los Angeles, USA", latitude: 34.0522, longitude: -118.2437 },
      { city: "Chicago, USA", latitude: 41.8781, longitude: -87.6298 },
      { city: "Toronto, Canada", latitude: 43.651070, longitude: -79.347015 },
      { city: "Vancouver, Canada", latitude: 49.2827, longitude: -123.1207 },
      { city: "Mexico City, Mexico", latitude: 19.4326, longitude: -99.1332 },
      { city: "Cancun, Mexico", latitude: 21.1743, longitude: -86.8466 }
    ],
    
    southAmerica: [
      { city: "Buenos Aires, Argentina", latitude: -34.6037, longitude: -58.3816 },
      { city: "Rio de Janeiro, Brazil", latitude: -22.9068, longitude: -43.1729 },
      { city: "São Paulo, Brazil", latitude: -23.5505, longitude: -46.6333 },
      { city: "Lima, Peru", latitude: -12.0464, longitude: -77.0428 },
      { city: "Bogotá, Colombia", latitude: 4.7110, longitude: -74.0721 },
      { city: "Quito, Ecuador", latitude: -0.1807, longitude: -78.4678 },
      { city: "Amazon Rainforest, Brazil", latitude: -3.4653, longitude: -62.2159 },
      { city: "Machu Picchu, Peru", latitude: -13.1631, longitude: -72.5450 }
    ],
    
    europe: [
      { city: "London, United Kingdom", latitude: 51.5074, longitude: -0.1278 },
      { city: "Paris, France", latitude: 48.8566, longitude: 2.3522 },
      { city: "Berlin, Germany", latitude: 52.52, longitude: 13.4050 },
      { city: "Madrid, Spain", latitude: 40.4168, longitude: -3.7038 },
      { city: "Rome, Italy", latitude: 41.9028, longitude: 12.4964 },
      { city: "Amsterdam, Netherlands", latitude: 52.3676, longitude: 4.9041 },
      { city: "Stockholm, Sweden", latitude: 59.3293, longitude: 18.0686 },
      { city: "Athens, Greece", latitude: 37.9838, longitude: 23.7275 },
      { city: "Oslo, Norway", latitude: 59.9139, longitude: 10.7522 },
      { city: "Istanbul, Turkey", latitude: 41.0082, longitude: 28.9784 }
    ],
    
    africa: [
      { city: "Cairo, Egypt", latitude: 30.0444, longitude: 31.2357 },
      { city: "Cape Town, South Africa", latitude: -33.9249, longitude: 18.4241 },
      { city: "Nairobi, Kenya", latitude: -1.2864, longitude: 36.8172 },
      { city: "Lagos, Nigeria", latitude: 6.5244, longitude: 3.3792 },
      { city: "Accra, Ghana", latitude: 5.6037, longitude: -0.1870 }
    ],
    
    asia: [
      { city: "Tokyo, Japan", latitude: 35.6762, longitude: 139.6503 },
      { city: "Beijing, China", latitude: 39.9042, longitude: 116.4074 },
      { city: "Seoul, South Korea", latitude: 37.5665, longitude: 126.9780 },
      { city: "Singapore, Singapore", latitude: 1.3521, longitude: 103.8198 },
      { city: "Delhi, India", latitude: 28.6139, longitude: 77.2090 },
      { city: "Mumbai, India", latitude: 19.0760, longitude: 72.8777 },
      { city: "Hong Kong, China", latitude: 22.3193, longitude: 114.1694 },
      { city: "Bangkok, Thailand", latitude: 13.7563, longitude: 100.5018 },
      { city: "Kuala Lumpur, Malaysia", latitude: 3.1390, longitude: 101.6869 },
      { city: "Mount Everest, Nepal", latitude: 27.9881, longitude: 86.9250 }
    ],
    
    oceania: [
      { city: "Sydney, Australia", latitude: -33.8688, longitude: 151.2093 },
      { city: "Melbourne, Australia", latitude: -37.8136, longitude: 144.9631 },
      { city: "Auckland, New Zealand", latitude: -36.8485, longitude: 174.7633 },
      { city: "Wellington, New Zealand", latitude: -41.2867, longitude: 174.7762 },
      { city: "Suva, Fiji", latitude: -18.1416, longitude: 178.4419 },
      { city: "Great Barrier Reef, Australia", latitude: -18.2871, longitude: 147.6992 }
    ],
    
    middleEast: [
      { city: "Dubai, UAE", latitude: 25.276987, longitude: 55.296249 },
      { city: "Tel Aviv, Israel", latitude: 32.0853, longitude: 34.7818 },
      { city: "Doha, Qatar", latitude: 25.276987, longitude: 55.296249 },
      { city: "Baghdad, Iraq", latitude: 33.3152, longitude: 44.3661 }
    ],
    
    others: [
      { city: "Antarctica Research Station", latitude: -90.0000, longitude: 0.0000 }
    ]
  };
  