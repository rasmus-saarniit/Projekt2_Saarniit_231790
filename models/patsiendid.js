
module.exports = (sequelize, DataTypes) => {
  const Patsiendid = sequelize.define('Patsiendid', {
    PatsiendiID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Nimi: DataTypes.STRING,
    Vanus: DataTypes.INTEGER,
    T6ug: DataTypes.STRING, 
    Steriliseerimine: DataTypes.BOOLEAN,
    LiigiID: DataTypes.INTEGER,
    KliendiID: DataTypes.INTEGER,
    VisiidiID: DataTypes.INTEGER,
    HaiguslooID: DataTypes.INTEGER
  }, {
    tableName: 'Patsiendid',
    schema: 'clinic', 
    timestamps: false
  });

  Patsiendid.associate = function(models) {
    // Each patient can have many visits
    Patsiendid.hasMany(models.Visiit, { foreignKey: 'PatsiendiID' });
    // Each patient belongs to one species
    Patsiendid.belongsTo(models.Liik, { foreignKey: 'LiigiID' });
    // Each patient belongs to one owner
    Patsiendid.belongsTo(models.Klient, { foreignKey: 'KliendiID' });
    // Each patient has one medical record
    Patsiendid.hasOne(models.Haiguslood, { foreignKey: 'PatsiendiID' });
  };

  return Patsiendid;
};
