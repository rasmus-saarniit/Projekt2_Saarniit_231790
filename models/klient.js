
module.exports = (sequelize, DataTypes) => {
  const Klient = sequelize.define('Klient', {
    KliendiID: { 
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Eesnimi: DataTypes.STRING,
    Perekonnanimi: DataTypes.STRING,
    Isikukood: DataTypes.STRING,
    Telefoninr: DataTypes.STRING,
    Epost: DataTypes.STRING,
    Elukoht: DataTypes.STRING
  }, {
    tableName: 'Klient',
    schema: 'clinic',
    timestamps: false
  });

  Klient.associate = function(models) {
    // One owner can have many patients
    Klient.hasMany(models.Patsiendid, { foreignKey: 'KliendiID' });
    // One owner can have many medical records
    Klient.hasMany(models.Haiguslood, { foreignKey: 'KliendiID' });
  };

  return Klient;
};
