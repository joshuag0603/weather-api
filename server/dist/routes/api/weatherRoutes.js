import { Router } from 'express';
const router = Router();
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
    // TODO: GET weather data from city name
    // TODO: save city to search history
    const { cityName } = req.body;
    if (!cityName) {
        return res.status(400).json({ error: 'City name is required' });
    }
    try {
        const weatherData = await WeatherService.getWeatherForCity(cityName);
        await HistoryService.addCity(cityName);
        return res.status(200).json(weatherData);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve weather data' });
    }
});
// TODO: GET search history
router.get('/history', async (_req, res) => {
    try {
        const cities = await HistoryService.getCities();
        res.status(200).json(cities);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve search history' });
    }
});
// * BONUS TODO: DELETE city from search history
// router.delete('/history/:id', async (req, res) => {});
export default router;
