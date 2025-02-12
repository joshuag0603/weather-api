import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// TODO: Define a City class with name and id properties
class City {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  private dbPath = path.resolve(__dirname, '../../db/db.json'); 

  private async read(): Promise<City[]> {
    const data = await fs.readFile(this.dbPath, 'utf-8');
    return JSON.parse(data).searchHistory || [];
  }

  private async write(cities: City[]): Promise<void> {
    const dbData = { searchHistory: cities };
    await fs.writeFile(this.dbPath, JSON.stringify(dbData, null, 2), 'utf-8');
  }

  async getCities(): Promise<City[]> {
    const cities = await this.read();
    return cities;
  }

  async addCity(cityName: string): Promise<void> {
    const cities = await this.read();
    const cityExists = cities.some(city => city.name.toLowerCase() === cityName.toLowerCase());
    if (!cityExists) {
      const newCity = new City((cities.length + 1).toString(), cityName);
      cities.push(newCity);
      await this.write(cities);
    }
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();
