export function getGeolocation():Promise<{ userLat: number; userLong: number }>{
  return new Promise((resolve, reject)=>{
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLong = position.coords.longitude;
            resolve({userLat, userLong});
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        console.log(new Error("Geolocation is not supported by this browser."));
      }
    })
}