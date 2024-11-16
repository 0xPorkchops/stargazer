import {useState} from 'react';

function StarMap() {
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [date, setDate] = useState('');
  const [style, setStyle] = useState('');
  const [constellation, setConstellation] = useState('');
  const [message, setMessage] = useState('');
  const authString = btoa(`fae035fe-50ae-4b4a-9ff2-57736802a25a:bd42fe2afe2024a3c401a501746f1960b30bf77972c6e31cf32827b58c4d81e61b0f90cbe2eebf16c0ffb92f54622dd14f362592b6a444bc51494c29820246734e1c608a33802d0f10a9173b907fc278e4f835ee1adcde573fac0d2cc45d9fa594ff053b86628ef3cb4adffd8f8d5c11`);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("https://api.astronomyapi.com/api/v2/studio/star-chart", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authString}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "style": style,
        "observer": {
        "latitude": parseFloat(latitude),
        "longitude": parseFloat(longitude),
        "date": date
        },
        "view": {
          "type": "constellation",
          "parameters": {
            "constellation": constellation
          }
        }
      })
    });

    let output;
    if(res.ok){
      const data = await res.json();
      output = data["data"]["imageUrl"];
    }
    else{
      output = res.status
    }
    setMessage(output);
  };

  //StarMap
  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      {/* Form Section on the left */}
      <div className="flex flex-col items-start justify-start w-1/3 p-6">
        <h2 className="text-2xl text-center mb-6">Generate your Star Map!</h2>

        <form onSubmit={handleSubmit} className="input-form w-full max-w-xs bg-gray-800 p-6 rounded-lg shadow-md">
          {/* longitude */}
          <div className="mb-4">
            <label htmlFor="longitude" className="block text-lg mb-2">Longitude:</label>
            <input
              type="number"
              id="longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
              className="w-full p-3 text-black rounded-md"
            />
          </div>
          
          {/* latitude */}
          <div className="mb-4">
            <label htmlFor="latitude" className="block text-lg mb-2">Latitude:</label>
            <input
              type="number"
              id="latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
              className="w-full p-3 text-black rounded-md"
            />
          </div>

          {/* date */}
          <div className="mb-4">
            <label htmlFor="date" className="block text-lg mb-2">Date:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full p-3 text-black rounded-md"
            />
          </div>

          {/* constellation */}
          <div className="mb-4">
            <label htmlFor="style" className="block text-lg mb-2">Constellation:</label>
            <select
              value={constellation}
              onChange={(e) => setConstellation(e.target.value)}
              className="w-full p-3 text-black rounded-md"
            >
              <option value="ori">Orion</option>
              <option value="uma">Ursa Major</option>
              <option value="umi">Ursa Minor</option>
              <option value="cas">Cassiopeia</option>
              <option value="tau">Taurus</option>
              <option value="sco">Scorpius</option>
              <option value="leo">Leo</option>
            </select>
          </div>
          
          {/* style */}
          <div className="mb-4">
            <label htmlFor="style" className="block text-lg mb-2">Map Style:</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full p-3 text-black rounded-md"
            >
              <option value="default">Default</option>
              <option value="inverted">Inverted</option>
              <option value="navy">Navy</option>
              <option value="red">Red</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Star Map Section on the right of the page*/}
      <div className="flex flex-col items-center justify-center w-2/3 bg-gray-900 p-6 -mt-20">
        {/* The image for the star map is displayed here */}
        <div className="star-map-container w-full h-full flex items-center justify-center bg-gray-900 -mt-20">
          {message && (
            <img
              src={message} 
              alt={`Status Error: ${message}`}
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default StarMap;
