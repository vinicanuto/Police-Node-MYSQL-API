const Crime = require('../models/Crime');

class CrimeController {
  async getInfoById(req, res) {
    const { crimeId } = req.params;

    const infos = await Crime.getInfoById(crimeId);

    return res.send(infos);
  }
  async getAllWeaponsOfCrime(req, res) {
    const weaponsOfCrimes = await Crime.getAllWeaponsOfCrimes();

    if (!weaponsOfCrimes) {
      return res.status(500).json({
        error: 'Não foi possível completar essa operação',
      });
    }

    return res.send(weaponsOfCrimes);
  }
}

module.exports = new CrimeController;