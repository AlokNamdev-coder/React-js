import axios from "axios";
const GetWeather = async (lon,lat)=>{
    const API_KEY = "2a39ff38af79d9118281d86d21751bc1";
    try{
        const response = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
            params:{
                lat,
                lon,
                appid:API_KEY,
                units:'metric'
            }
        }
        );
        console.log(response.data);
        return response.data;
    }
    catch(error){
    console.log(error);
    return null;

  }


  };

export default GetWeather;