module.exports = (sequelize, DataTypes) => {
  const Visiit = sequelize.define('Visiit', {
    VisiidiID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    PatsiendiID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { isInt: { msg: 'PatsiendiID peab olema täisarv' } }
    },
    T99tajaID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { isInt: { msg: 'T99tajaID peab olema täisarv' } }
    },
    Kuup2ev: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: { isDate: { msg: 'Kuup2ev peab olema kehtiv kuupäev' } }
    },
    Kaal: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: { isFloat: { msg: 'Kaal peab olema number' } }
    },
    HaiguslooID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { isInt: { msg: 'HaiguslooID peab olema täisarv' } }
    }
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
