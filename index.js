const http = require ("http")
const express = require ("express")
const axios = require ("axios")
const cors = require ("cors")


require ("dotenv").config()

const app = express()
const PORT = process.env.PORT || 8000

// Tracking Weather Data Via the APIs
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

app.get('/weather', async(req, res) => {
    const {city} = req.query;

    if (!city){
        return res.status(404).json({error: "City is required" });
    };

    try { 
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: city,
                appid: WEATHER_API_KEY,
                units: "metric",
            },
        });

        res.json(response.data);
    } catch (error) {
        console.log(error.message);
        if (error.response){
            res.status(error.reponse.status).json({error:error.response.data.message});
        }else{
            res.status(500).json({error: "Failed to fetch weather data" })
        }
    }

});

app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`)
})