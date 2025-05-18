module.exports = (sequelize, DataTypes) => {
  const Haiguslood = sequelize.define('Haiguslood', {
    HaiguslooID: {
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
    KliendiID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { isInt: { msg: 'KliendiID peab olema täisarv' } }
    },
    Kuupäev: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: { isDate: { msg: 'Kuupäev peab olema kehtiv kuupäev' } }
    },
    Kirjeldus: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: { args: [0, 255], msg: 'Kirjeldus võib olla kuni 255 tähemärki' }
      }
    }
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
