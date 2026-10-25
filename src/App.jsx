import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import Cards from "./components/Cards";
import axios from 'axios'





function App() {
  const position = [22.5937, 78.9629]; // Center of India
  const [geodata,setgeodata] = useState(null);
  const [selectedstate,setselectedstate]=useState(null);
  const [weatherData,setweatherData] = useState(null);
  

  
  

  useEffect(()=>{
    fetch("/india_state.geojson")
    .then((res)=>res.json())
    .then((data)=>setgeodata(data));
    console.log(geodata);
  },[])

  console.log(selectedstate);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <MapContainer
        center={position}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
           url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {geodata && <GeoJSON
        data={geodata}
        onEachFeature={(features,layers)=>{layers.on(
          "click",()=>{
            
            alert(features.properties['NAME_1']);
            const name = features.properties['NAME_1'];
            console.log(features.properties);
            console.log(name);
            

            
            setselectedstate(name)
          }
        )}}
        style={{color:"#00ff88",weight:1,fillOpacity:0.2,fillColor: "#00ff88",}}/>}

        <Marker position={position}>
          <Popup>India</Popup>
        </Marker>
        {selectedstate && <Cards name={selectedstate}/>}
      </MapContainer>
    </div>
  );
}

export default App;