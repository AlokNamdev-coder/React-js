import axios from "axios";

const GetHistoricalData= async(lat,lon)=>{
    try{
        const response = await axios.get("https://archive-api.open-meteo.com/v1/archive",{
            params:{
                latitude:lat,
                longitude:lon,
                start_date:"2015-01-01",
                end_date:"2025-01-01",
                daily:"temperature_2m_mean",
                timezone:"auto",

            }
        });
        console.log(response.data);
        return response.data;
    }catch(error){
        console.log(error);
        return null;
    }

};

export default GetHistoricalData;