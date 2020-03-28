const Crime = require('../models/Crime');

class CrimeController {
  async getInfoById(req, res) {
    const { crimeId } = req.params;
    if (!crimeId) {
      return res.status(400)
        .json({ error: 'Id do crime não informado' })
    }

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

  async deleteCrime(req, res) {
    const { crimeId } = req.params;

    const { affectedRows } = await Crime.deleteCrime(crimeId);

    if (affectedRows < 1) {
      return res.status(400).json({
        error:
          `Não foi possível deletar o crime de id ${crimeId}.`
      });
    } else {
      return res.json({ message: 'Crime deletado com sucesso' });
    }

  }

  async createCrime(req, res) {
    const result = await Crime.createCrime(req.body);

    if (!result) {
      return res.status(400).json({ error: 'Não foi possível realizar esse cadastro' });
    }
    return res.json({ message: 'Crime criado com sucesso' });
  }
}

module.exports = new CrimeController;