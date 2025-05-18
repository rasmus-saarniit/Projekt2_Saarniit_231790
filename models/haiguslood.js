
module.exports = (sequelize, DataTypes) => {
  const Haiguslood = sequelize.define('Haiguslood', {
    HaiguslooID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    PatsiendiID: DataTypes.INTEGER,
    T99tajaID: DataTypes.INTEGER,
    KliendiID: DataTypes.INTEGER,
    Kuupäev: DataTypes.DATE,
    Kirjeldus: DataTypes.STRING
  }, {
    tableName: 'Haiguslood',
    schema: 'clinic',
    timestamps: false
  });

  Haiguslood.associate = function(models) {
    // Each medical record belongs to one patient
    Haiguslood.belongsTo(models.Patsiendid, { foreignKey: 'PatsiendiID' });
    // Each medical record belongs to one employee
    Haiguslood.hasMany(models.Visiit, { foreignKey: 'HaiguslooID' });
    // Remove: belongsTo T99tajad, Klient, Visiit (contradicts clarified logic)
  };

  return Haiguslood;
};
