import { useState, useEffect } from 'react';

function EventsPage() {
  const [events, setEvents] = useState(["No events at the moment!", "N/A"]);
  const [statusMessage, setStatusMessage] = useState(''); 

  const authString = btoa(
    `fae035fe-50ae-4b4a-9ff2-57736802a25a:bd42fe2afe2024a3c401a501746f1960b30bf77972c6e31cf32827b58c4d81e61b0f90cbe2eebf16c0ffb92f54622dd14f362592b6a444bc51494c29820246734e1c608a33802d0f10a9173b907fc278e4f835ee1adcde573fac0d2cc45d9fa594ff053b86628ef3cb4adffd8f8d5c11`
  );


  const fetchEvents = async (lat: number, lon: number) => {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      elevation: '0',
      from_date: '2025-01-01',
      to_date: '2026-01-01',
      time: '18:30:00',
      output: 'rows'
    }).toString();
    const lunarRes = await fetch(`https://api.astronomyapi.com/api/v2/bodies/events/moon?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": 'application/json',
          Authorization: `Basic ${authString}`,
        }
    });
    const year = "2025";
    const solarRes = await fetch(`https://aa.usno.navy.mil/api/eclipses/solar/year?year=${year}`)
  
    if (lunarRes.ok && solarRes.ok) {
      setStatusMessage('OK');  
      const lunarData = await lunarRes.json();
      const solarData = await solarRes.json();
      console.log("API Lunar Response Data:", lunarData);
      console.log("API Solar Response Data:", solarData);
      const rows = lunarData['data']['rows'];

      const tempEvents:string[] = [];
      let eventName, eventDate:string;
       // @ts-ignore 
      rows.forEach((row) => {
         // @ts-ignore 
        row['events'].forEach((event) => {
          // @ts-ignore 
          eventName = event['type'].split('_').map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
          }).join(' ');;
          if (event['type'].includes('solar')) {
            eventDate = event['eventHighlights']['partialStart']['date'];
          } 
          else {
            eventDate = event['eventHighlights']['penumbralStart']['date'].substring(0, 10)
            const [year, month, day] = eventDate.split("-");
            eventDate = `${year}-${Number(month)}-${Number(day)}`;
          }
          // @ts-ignore 
          tempEvents.push([eventName, eventDate])
        });
      });
      // @ts-ignore 
      solarData['eclipses_in_year'].forEach((event) => {
        eventName = event['event'].match(/^.*\beclipse\b/i)?.[0] || "";;
        eventDate = event['year']+"-"+event['month']+"-"+event['day'];
        // @ts-ignore 
        tempEvents.push([eventName, eventDate])
      });
      
      //update state if there's events
      if (tempEvents.length > 0) {
        console.log("Events");
        console.log(tempEvents);
        setEvents(tempEvents);
      } 
    }
    else {
      setStatusMessage('ERROR');  
      console.error(`Error`); 
    }
  };

  useEffect(() => {
    fetchEvents(41, 12);
  }, []); 

  //events is the array of tuples containing event names and dates
  return (
    <div>
      <h1>Event Names and Dates</h1>

      <p>Status: {statusMessage}</p>

      <div>
        <h2>Event Names/Dates:</h2>
        <ul>
          {events.map((events, index) => (
            <li key={index}>
            {events[0]} {events[1]}
          </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EventsPage;
