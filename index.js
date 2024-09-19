const express = require ("express");
const axios = require ("axios");
const cors = require ("cors");
const rateLimit = require("express-rate-limit");


require ("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Add rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

app.use(limiter);

// Tracking Weather Data Via the APIs
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

app.get('/weather', limiter, async(req, res) => {
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

app.get('/forecast', async(req, res) => {
    const {city} = req.query;

    if (!city){
        return res.status(404).json({error: "City is required" });
    };

    try { 
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
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