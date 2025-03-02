import React, {useState, useEffect} from 'react';
// import {GoogleMap, LoadScript, Marker, Circle} from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const circleOptions = {
  fillColor: 'blue',
  fillOpacity: 0.2,
  strokeColor: 'blue',
  strokeOpacity: 0.5,
  strokeWeight: 2,
};

export const images = [
  'https://media-hosting.imagekit.io//b669b3f8cff049e7/tile_1.png?Expires=1835500574&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=tLWZ6W83C~KiWlTOsSA8~bbqT79xxjWYiwFdelVgwVbTwgopfYUNDatkHb4cE4L0WIPtYCCGOPR0-OxmcA5G7ms8WO1~EBxtzSlYxqBAB99~-sTVFPRGPkxvEimrMFtIdHBj8s9xK12ku92hFT5zwSnKN4xhzN5~ZNtDLImbR0L2Sf-rKR48OEDAGkwtJf4NIzWRfazilpwLUmiKBeluOWvkTJLmVl90ggBc-dnMtbWcUvxLulPySXVm~oz73qkZnwlzLrRZCrwzAazAkvLRqq7wrNkej0kXP197DodcPfDq~W1HFqRsK4KGUJ1xl8VWSYKzLdFt7myJnTGyE6hKRA__',
  'https://media-hosting.imagekit.io//cd17a303044c4861/tile_2.png?Expires=1835500574&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=DLL9AjkGzWxsjdlevu-z4ryWaI0ZuUDYPtu2ih0e6VqZIXdTpzYY1yWJLnK2aCaXvq8sh20XWXi2Xw6-hDVG0WFhmQ-EM4rDBN~8NmgDH57npSSq597CARnUIqjxHCtVl-fAMr9aMMYJDijvkoJ6VQjKIe-sL-Y~14pv~QlOnqgiUPYNGHm5OGCX4nTutJ9QYw8dQbpWZ898H2shTDVGc1u3F0-mzU75MshIyEZ5~rWZq1OUp7xm4C16CXHPupm5yGDl1QNYAg2ykL7YaPK9Jody8Tw21xFhoV6~uBQY3AITfJhae78bnCOacVFgg4KkiUHkZoP2G0BsavVf2k3ZPw__',
  'https://media-hosting.imagekit.io//33679a4a6dc24fc2/tile_3.png?Expires=1835500574&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Jk3rE3kbq~rIuYaNgY5WLuGEoy0Th7Fp2v6ac5R0cfjEzYThRbP96vIaeumZmx66tNVFN9ToNteFNRABen~9T4akCL8745fCN9lNOjr-fXV-ZVPcaPN8Zk1VM9VVstM7dqbf9ALv3FjNtfbiqAz4Y75L0omU3U38cCJlwfJVjloOPnIsUGDUYKurXMwlFT7pUi5ZUtGVOsBRYG3UiVz~NYz6g3N3FsfqRh7si2fQE9~7oJUPXgqleXMN8sogiZuJjtzCKSMeg9awndBjOGnY9j6ohRR7DXY~uWYsmvvz9E8-2TuRHDdGdhT~kiDRCLngWX7P~l56gKFzIUkbHJNQMw__',
  'https://media-hosting.imagekit.io//88cbc05e97fa45e5/tile_4.png?Expires=1835500574&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=h9zMPt36h8JaVtAEGuqibZ3bYqrtxFbKjONUWjZCJ~it-FO0EWq7ZnEGtfcHUIucjfdVlNlY8dSYMQwUMAsKrjjdbvS2Qw6ngTv9WIPmoLJrjWD9be1vv~LJgkgnZNm3kjeM7ALFUHeSv5Pm-EO278DlPZTw~Dqx8g7Srvr57iye02GNBMJBpq7KVCb131MOZDyl0cPbboItyPJcCoI3KURBPx00mpg1LwBOlLPodPGuFxzMuEwHj2y2bvN3p3989rt8k0GdNCfyH0vmnAGyzycWkerF0OM9tD13q9NhCH-6CFM6ZyBuBxC4gxtrLnXpG8g12P5krSzAaaAw0zTJ2A__',
  'https://media-hosting.imagekit.io//9cec2074ffc54add/tile_5.png?Expires=1835500574&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=F96-pEs6QjG89Gp76pWpltC8~nQ-0TR8c9LsTFEC2mlnGBqXiRInI1eKMI6e4gIv-zbGxoLqMU-hc3dYWA5kl3R5mNLp7EzWL2a7ZA1vg8PSfEinnVYx8Ty-O1Md-ZUtxXPwPSrehBvkQh8rrW1ScxV4dNxWxD9DOtRjE4Kz0SQ1w-H6Wbgl1iQf7HClDikyyancEg0W5mPuPh8XtdIQRas4g2~mMqhxwgehg2dOXz-MMj7AOd9ds-QV~2OfhajvVKGB0V8ywKtimfEDYCzqwvIie4y088NiPciIr04pfapyK1A5Bs-ZeO3lFuS0cicyr00uG4z~3s-~O5TW7S5C4w__',
  'https://media-hosting.imagekit.io//dc1b6e42319a4d4d/tile_6.png?Expires=1835500574&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Ar1xcw-q9Z0Ae6OAhCR9K1jEWUfPaddKWKTjLMFWCvW~Z5u1K3REEqBY7IxJkx-4OXyQnRW8yEw30di3QyV82Y-wYzYdOqSZAjuzCuv0dA6fA3ZlCtyJQFEuAk8SMu78doIYtRMaJtRXJejh1w74wsrTTuZiRa~SmXJQdvGFJGTWygTo6FL-nLUIXwg64Xy6IUSc8g87wxtYsh889LElHHEQLfHyff5ebMoFOWH5H1vqCo6c1NgqzAbMUdk46w9GU7eg49fPLS9OBMCe8TcFbvW76BVNuYgibdMbZ2W0rwFuxYNpfGt7V4MssnP~eDc-RQYKk1Nd8FSbcnznD68Rig__',
  'https://media-hosting.imagekit.io//275189753046442d/tile_7.png?Expires=1835500574&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=rf~NHdhRCuoQ-sTF-C~0ColEcmUa37OGZU5y4GSB6GwLNiOqxge0GK60iTtl8kYXiU74P-7djVX5IHShmzXRgQAWzrtGepi-R-w3Mn-r6PVTkVPjQ79ZQI6tBiQYrlESa29tIzU8oNtEE8FEB7SP1XnZeEe1i3L1IQKXr7QtUlrZMh~N0~scPvJaK5uDQ-I5LxT8CphM1rMoAB-TpT-zRiFQ7Jck2UmJyvRdJxE09f1gXx-1y1UagTW4Xr0sl3gkIPU~9ktj-gx~Ndh17NJ92AcQ~VEjVWuXjNoEX4J1vFHyMK69JyRL279jDZ5tMWUK~79Wb9nTc-bfe0N3QjTSQw__',
  'https://media-hosting.imagekit.io//c4d3d651fa2e413f/tile_8.png?Expires=1835500574&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Z7twRPMQ3jX~gObvIB0zODl-~Zr3qgoZYZfGgi1KdxNb6SZZuK5uNiHic8cQBv1emjAb8uVqTGgPhOj0UpQgKfryA1EfYMDJBzG1eGt55ks4pRXWw9yh3opDM0ZII811IeiF3ydKa0bLVbeJ8Hii~mZ2wpsakIBLxYFJ5iJqKT3lbGRZIJmMVhniPBdNXYHdLFmi1DEN6z7ln5YNCqhUcehuOCSLnann1sTr67Lw4TOqkUoVD7v3hCZdblES0D~glYSBWgj~rqxxUSrnoFfZ94eS4qX4UDCF0w228cgw4pt6UQA4-VRE5I~PtoD67UBO7yhFi2xTkSETxGqu9acsqA__',
  'https://media-hosting.imagekit.io//8b09e91ac07c462f/tile_9.png?Expires=1835500574&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Fjupv5oAGz-dQGDzeduPePe2A40MzXZ2t~ri7VaJXPiGkNNo-pvMgIlsZUhOUWhonnRcW0aZUq8BFBI8dMdGkO3AOeIKBXseI0jxsjrIfzL2QZ7a-ZC7Z60qXMcTV8FOTs~k6W0W4Tna4s6it-T13R1z54xnA06-S7PIUM-TCQFncl1ZOuFPw-64I4u18OyPxAvNAzin1XzzoBoXpUgrYYQeyS30GSxL4kTjZz4m7-NewrymCJeoypyiMd1r-dgk-w2ekt5iB4XhmJ15saZ3bBz9ptwHhzo5bn1Sd2ZE37Uw-EDIZCGK18uq6rUebBq13K9d7eC0jtKUmODKeo9SMA__',
];

export const getRandomLocation = (center, radius) => {
  const y0 = center.lat;
  const x0 = center.lng;
  const rd = radius / 111300; // Convert meters to degrees

  const u = Math.random();
  const v = Math.random();
  const w = rd * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  return {lat: y0 + y, lng: x0 + x};
};

// const GoogleMapsMarker = () => {
//   const [location, setLocation] = useState(null);
//   const [randomLocations, setRandomLocations] = useState({});
//   const apiKey = 'AIzaSyDwz3TOnCfEMpIo6IO1XIN6M2Pkf6ZP_9I'; // Replace with your actual API Key

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       position => {
//         const userLocation = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         };
//         setLocation(userLocation);

//         // Generate 9 random locations and assign numbers (1-9)
//         const locations = {};
//         for (let i = 0; i < 9; i++) {
//           const randomPoint = getRandomLocation(userLocation, 20);
//           locations[`${randomPoint.lat},${randomPoint.lng}`] = i + 1; // Assign a number
//         }
//         setRandomLocations(locations);
//       },
//       error => {
//         console.error('Error getting location:', error);
//       },
//     );
//   }, []);

//   return (
//     // <LoadScript googleMapsApiKey={apiKey}>
//     //   {location && (
//     //     <GoogleMap
//     //       mapContainerStyle={mapContainerStyle}
//     //       center={location}
//     //       zoom={20.5}>
//     //       {/* User Location Marker */}
//     //       {/* <Marker position={location} /> */}

//     //       {/* Random Numbered Markers */}
//         //   {Object.entries(randomLocations).map(([key, number]) => {
//         //     const [lat, lng] = key.split(',').map(Number);
//         //     return (
//         //        <Marker
//         //         key={key}
//         //         position={{lat, lng}}
//         //         icon={{
//         //           url: images[number - 1], // Use image path
//         //           scaledSize: new window.google.maps.Size(30, 30), // Adjust size here
//         //           anchor: new window.google.maps.Point(25, 25), // Centers the image
//         //         }}
//         //       />
//         //     );
//         //   })}

//     //       {/* Circle around User Location */}
//     //       {/* <Circle center={location} radius={20} options={circleOptions} /> */}
//     //     </GoogleMap>
//     //   )}
//     // </LoadScript>
// //   );
// };

// export default GoogleMapsMarker;
