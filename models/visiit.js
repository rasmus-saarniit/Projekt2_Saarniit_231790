// models/visiit.js
module.exports = (sequelize, DataTypes) => {
  const Visiit = sequelize.define('Visiit', {
    VisiidiID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    PatsiendiID: DataTypes.INTEGER,
    T99tajaID: DataTypes.INTEGER,
    Kuup2ev: DataTypes.DATE, // <-- updated to match your DB
    Kaal: DataTypes.FLOAT,
    HaiguslooID: DataTypes.INTEGER
  }, {
    tableName: 'Visiit',
    schema: 'clinic',
    timestamps: false
  });

  Visiit.associate = function(models) {
    Visiit.belongsTo(models.Patsiendid, { foreignKey: 'PatsiendiID' });
    Visiit.belongsTo(models.Haiguslood, { foreignKey: 'HaiguslooID' });
    Visiit.belongsToMany(models.T99tajad, { through: 'VisiitTootajad', foreignKey: 'VisiidiID', otherKey: 'TootajaID' });
  };

  return Visiit;
};
