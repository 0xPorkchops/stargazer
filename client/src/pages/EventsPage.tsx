import { useState, useEffect } from 'react';

function EventsPage() {
  const [eventNames, setEventNames] = useState(["No events at the moment!"]);
  const [eventDates, setEventDates] = useState(["N/A"]);
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
      output: "rows",
    }).toString();
    const res = await fetch(`https://api.astronomyapi.com/api/v2/bodies/events/sun?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": 'application/json',
          Authorization: `Basic ${authString}`,
        }
      }); 

  
    if (res.ok) {
      setStatusMessage('OK');  
      const data = await res.json();
      console.log("API Response Data:", data);
    
      const rows = data['data']['rows'];

      const tempEventNames: string[] = [];
      const tempEventDates: string[] = [];
      rows.forEach((row) => {
        row['events'].forEach((event) => {
          tempEventNames.push(event['type']);
          if (event['type'].includes('solar')) {
            tempEventDates.push(event['eventHighlights']['partialStart']['date']);
          } else {
            tempEventDates.push(event['eventHighlights']['pemumbralStart']['date']);
          }
        });
      });

      //update state if there's events
      if (tempEventNames.length > 0) {
        console.log(tempEventNames);
        console.log(tempEventDates);

        setEventNames(tempEventNames);
        setEventDates(tempEventDates);
      } 
      else {
        setEventNames(["NO events"]); 
        setEventDates(["N/A"]); 
      }
    } 
    else {
      setStatusMessage('ERROR');  
      console.error(`Error: ${res.status} - ${res.statusText}`); 
    }
  };

  useEffect(() => {
    fetchEvents(42, -72);
  }, []); 

  return (
    <div>
      <h1>Event Names and Dates</h1>

      <p>Status: {statusMessage}</p>

      <div>
        <h2>Event Names:</h2>
        <ul>
          {eventNames.map((eventName, index) => (
            <li key={index}>{eventName}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Event Dates:</h2>
        <ul>
          {eventDates.map((eventDate, index) => (
            <li key={index}>{eventDate}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EventsPage;
