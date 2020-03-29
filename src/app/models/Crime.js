const sql = require('../../database');

class Crimes {

  async getAllWeaponsOfCrimes() {
    const result = await sql.doQuery(`SELECT TX_MODEL model 
                                FROM WEAPON WHERE EXISTS 
                                  (SELECT 1 
                                      FROM WEAPON_CRIME 
                                      WHERE ID_WEAPON = WEAPON.ID_WEAPON)`);

    return result;
  }

  async getCrimeById(crimeId) {
    const result = await sql.doQuery(`SELECT ID_CRIME, 
                                            TX_COUNTRY, 
                                            DT_CRIME FROM CRIME
                                            WHERE ID_CRIME = ${crimeId}`);
    return result;
  }

  async getWeaponByCrimeId(crimeId) {
    const result = await sql.doQuery(`select WEAPON_CRIME.ID_WEAPON_CRIME, 
        WEAPON_CRIME.ID_WEAPON, 
        WEAPON.TX_MODEL, 
        WEAPON.ID_WEAPON_TYPE FROM
        WEAPON_CRIME INNER JOIN WEAPON 
         ON WEAPON_CRIME.ID_WEAPON = WEAPON.ID_WEAPON
    WHERE WEAPON_CRIME.ID_CRIME = ${crimeId}`);

    return result;
  }

  async getCriminalByCrimeId(crimeId) {
    const result = await sql.doQuery(`SELECT CRIMINAL_CRIME.ID_CRIMINAL_CRIME, 
                    CRIMINAL_CRIME.ID_CRIMINAL,
                    CRIMINAL_CRIME.ID_CRIME_TYPE, 
                    CRIMINAL.TX_NAME, 
                    CRIME_TYPE.TX_TYPE 
                    FROM CRIMINAL_CRIME 
                    INNER JOIN CRIMINAL 
                      ON CRIMINAL_CRIME.ID_CRIMINAL = CRIMINAL.ID_CRIMINAL
                    INNER JOIN CRIME_TYPE 
                      ON CRIMINAL_CRIME.ID_CRIME_TYPE = CRIME_TYPE.ID_CRIME_TYPE
                    WHERE CRIMINAL_CRIME.ID_CRIME = ${crimeId}`);

    return result;
  }

  async getVictimByCrimeId(crimeId) {
    const result = await sql.doQuery(`SELECT VICTIM_CRIME.ID_VICTIM, 
    VICTIM.TX_NAME 
    FROM VICTIM_CRIME INNER JOIN VICTIM
    ON VICTIM_CRIME.ID_VICTIM = VICTIM.ID_VICTIM
  WHERE VICTIM_CRIME.ID_CRIME = ${crimeId}`);

    return result;
  }

  async deleteCrime(crimeId) {
    const result = await sql.doQuery(`DELETE FROM CRIME 
                    WHERE ID_CRIME=${crimeId}`);

    if (result.affectedRows > 0) {
      await sql.doQuery(`DELETE FROM WEAPON_CRIME WHERE ID_CRIME=${crimeId}`);
      await sql.doQuery(`DELETE FROM CRIMINAL_CRIME WHERE ID_CRIME=${crimeId}`);
      await sql.doQuery(`DELETE FROM VICTIM_CRIME WHERE ID_CRIME=${crimeId}`);
    }

    return result;
  }

  async createCrime(crimeBody) {
    const { country, date, weaponCrime, victimCrime, criminal } = crimeBody;


    const crime = await sql.doQueryParams("INSERT INTO CRIME SET TX_COUNTRY=?, DT_CRIME=?", [country, date]);

    if (crime.insertId) {
      weaponCrime.map(async weapon => {
        await sql.doQueryParams("INSERT INTO WEAPON_CRIME SET ID_WEAPON=?, ID_CRIME=?", [weapon.id_weapon, crime.insertId]);
      })

      victimCrime.map(async victim => {
        const victimInserted = await sql.doQueryParams("INSERT INTO VICTIM SET TX_NAME=?", [victim.name]);

        if (victimInserted.insertId) {
          await sql.doQueryParams("INSERT INTO VICTIM_CRIME SET ID_VICTIM=?, ID_CRIME=?", [victimInserted.insertId, crime.insertId]);
        }
      })

      criminal.map(async criminalPerson => {
        const criminalInserted = await sql.doQueryParams("INSERT INTO CRIMINAL SET TX_NAME=?", [criminalPerson.name]);

        if (criminalInserted.insertId) {
          criminalPerson.criminalCrime.map(async crimeCommited => {
            await sql.doQueryParams("INSERT INTO CRIMINAL_CRIME SET ID_CRIMINAL=?, ID_CRIME=?, ID_CRIME_TYPE=?", [criminalInserted.insertId, crime.insertId, crimeCommited.idCrimeType]);
          })
        }
      })

    }
  }
}

module.exports = new Crimes();