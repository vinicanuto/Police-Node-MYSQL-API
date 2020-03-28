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

  async getInfoById(crimeId) {
    const result = await sql.doQuery(`
      SELECT CRIME.ID_CRIME, 
	    	CRIME.TX_COUNTRY PAIS, 
        CRIME.DT_CRIME, 
        CRIME_TYPE.TX_TYPE CRIME_TYPE, 
        CRIMINAL.TX_NAME CRIMINAL_NAME, 
        WEAPON.TX_MODEL WEAPON_MODEL, 
        WEAPON_TYPE.TX_WEAPON_TYPE WEAPON_TYPE, 
        VICTIM.TX_NAME VICTIM_NAME
	FROM CRIME 
	INNER JOIN CRIMINAL_CRIME 
		ON CRIME.ID_CRIME = CRIMINAL_CRIME.ID_CRIME 
	INNER JOIN CRIME_TYPE 
		ON CRIMINAL_CRIME.ID_CRIME_TYPE = CRIME_TYPE.ID_CRIME_TYPE
	INNER JOIN CRIMINAL 
		ON CRIMINAL_CRIME.ID_CRIMINAL = CRIMINAL.ID_CRIMINAL
	INNER JOIN WEAPON_CRIME 
		ON WEAPON_CRIME.ID_CRIME = CRIME.ID_CRIME
	INNER JOIN WEAPON 
		ON WEAPON.ID_WEAPON = WEAPON_CRIME.ID_WEAPON 
	INNER JOIN WEAPON_TYPE 
		ON WEAPON_TYPE.ID_WEAPON_TYPE = WEAPON.ID_WEAPON_TYPE
	INNER JOIN VICTIM_CRIME 
		ON VICTIM_CRIME.ID_CRIME = CRIME.ID_CRIME
	INNER JOIN VICTIM 
		ON VICTIM.ID_VICTIM = VICTIM_CRIME.ID_VICTIM_CRIME
  WHERE CRIME.ID_CRIME = ${crimeId}`);

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
    /*
    await sql.doQuery(`INSERT INTO CRIME (TX_COUNTRY,DT_CRIME) VALUES (${crime.country},${crime.date})`);
    await sql.doQuery(`INSERT INTO WEAPON_CRIME (ID_WEAPON,ID_CRIME) VALUES (${crime.weapon},${crime.id_crime})`);
    await sql.doQuery(`INSERT INTO CRIMINAL_CRIME (ID_CRIMINAL,ID_CRIME, ID_CRIME_TYPE) VALUES (${crime.ID_CRIMINAL},${crime.date})`);
    await sql.doQuery(`INSERT INTO CRIME (TX_COUNTRY,DT_CRIME) VALUES (${crime.country},${crime.date})`);
  */
  }
}

module.exports = new Crimes();