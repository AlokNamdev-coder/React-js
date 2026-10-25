import { useState } from "react";
import statesData from "../data/states";
import GetWeather from "../services/Weatherservices";
import GetHistoricalData from "../services/HistoricalData";
import { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";



const Cards = ({ name,weather }) => {
  const [Weather,setWeather] = useState(null);
  const [historicalData,sethistoricalData] = useState(null);
  const [Predicteddata,setPredicteddata] = useState(null)
  const StateDetails = statesData[name];
  


  console.log(StateDetails.image);
  console.log(StateDetails.lon);

  
  if (!StateDetails) {
    return <div>No data found for {name}</div>;
  }
  useEffect(() => {
    async function fetchWeather() {
      if (!StateDetails) return;

      const result = await GetWeather(
        StateDetails.lon,
        StateDetails.lat,
      );

      setWeather(result);
    }

    fetchWeather();
  }, [name]);

  

  useEffect(()=>{
    async function setHistoData(){
        if (!StateDetails){
            return;
        }
        const result = await GetHistoricalData(StateDetails.lat,StateDetails.lon);
        sethistoricalData(result);
    };

    setHistoData();
  },[name])

  console.log(historicalData?.daily?.temperature_2m_mean);
  

  useEffect(() => {

  async function predictedresult() {

    var seven_days_predicted = [];
    

    if (!historicalData?.daily?.temperature_2m_mean) {
      return;
    }

    const last_30_day =
      [...historicalData.daily.temperature_2m_mean.slice(-30)];
    for(var i=0;i<7;i++){
      const response =
      await axios.post(
        "http://127.0.0.1:8000/predict",
        {
          Name: name,
          temperatures: last_30_day
        }
      );



    console.log(response.data);
    seven_days_predicted.push(response.data.result);
    last_30_day.shift();      // remove oldest
    last_30_day.push(response.data.result);
    
    }

    setPredicteddata(seven_days_predicted);

  }

  predictedresult();

}, [historicalData]);

console.log(Predicteddata);
 function buildChartData(historicalData) {
  if (
    !historicalData?.daily?.time ||
    !historicalData?.daily?.temperature_2m_mean
  ) {
    return [];
  }

  const yearlyData = {};

  historicalData.daily.time.forEach((date, index) => {
    const year = date.substring(0, 4);
    const temp = historicalData.daily.temperature_2m_mean[index];

    if (!yearlyData[year]) {
      yearlyData[year] = {
        sum: 0,
        count: 0,
      };
    }

    yearlyData[year].sum += temp;
    yearlyData[year].count += 1;
  });

  return Object.entries(yearlyData).map(
    ([year, data]) => ({
      year,
      temp: Number(
        (data.sum / data.count).toFixed(2)
      ),
    })
  );
}

 console.log(buildChartData(historicalData));
 var chartData = buildChartData(historicalData);
 const predictionChartData =
  Predicteddata?.map((temp, index) => ({
    day: index + 1,
    temp: temp
  })) || [];

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        width: 800,
        backgroundColor:"lightblue",
        background:"linear-gradient(to bottom,#33ccff,#ff99cc)",
        padding: 20,
        borderRadius: 10,
        borderColor:"whitesmoke",
        borderWidth:"2px",
        border:1,
        zIndex: 1000,
      }}
    >
      <img
        src={StateDetails.image}
        alt={name}
        style={{ width: "100%" }}
      />

      <h2 style={{color:"white",fontWeight:"bold"}}>{name}</h2>

      <p style={{color:"black" }} >
        <strong>Population:</strong> {StateDetails.population}
      </p>
      <div style={{display:"flex",flexDirection:"row"}}>
      <p style={{color:"black"}}>
        <strong>Temperature: </strong>{Weather?.main?.temp}C
      </p>
      <p style={{color:"black",paddingLeft:"50px"}}>
        <strong>Humidity: </strong>{Weather?.main?.humidity}
      </p>
      </div>

      <p style={{color:"black", fontWeight:"bold"}}>{StateDetails.description}</p>
      <div
  style={{
    display: "flex",
    gap: "10px",
    width: "100%",
    height: "250px",
  }}
>
  <div style={{ flex: 1 }}>
    <h3>Last 10 Years Temperature Graph</h3>
    <ResponsiveContainer width="100%" height="90%">
      <LineChart data={chartData}>
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="temp"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>

  <div style={{ flex: 1 }}>
    <h3>Next 7-Days Predicted Temp</h3>
    <ResponsiveContainer width="100%" height="90%">
      <LineChart data={predictionChartData}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="temp"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>

      
    </div>
  );
};

export default Cards;