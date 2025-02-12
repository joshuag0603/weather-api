import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// TODO: Define a City class with name and id properties
class City {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
// TODO: Complete the HistoryService class
class HistoryService {
    constructor() {
        this.dbPath = path.resolve(__dirname, '../../db/db.json');
        // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
        // async removeCity(id: string) {}
    }
    async read() {
        const data = await fs.readFile(this.dbPath, 'utf-8');
        return JSON.parse(data).searchHistory || [];
    }
    async write(cities) {
        const dbData = { searchHistory: cities };
        await fs.writeFile(this.dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
    }
    async getCities() {
        const cities = await this.read();
        return cities;
    }
    async addCity(cityName) {
        const cities = await this.read();
        const cityExists = cities.some(city => city.name.toLowerCase() === cityName.toLowerCase());
        if (!cityExists) {
            const newCity = new City((cities.length + 1).toString(), cityName);
            cities.push(newCity);
            await this.write(cities);
        }
    }
}
export default new HistoryService();
