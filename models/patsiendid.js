module.exports = (sequelize, DataTypes) => {
  const Patsiendid = sequelize.define('Patsiendid', {
    PatsiendiID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Nimi: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nimi on kohustuslik' },
        len: { args: [2, 50], msg: 'Nimi peab olema 2-50 tähemärki' }
      }
    },
    Vanus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'Vanus peab olema täisarv' },
        min: { args: [0], msg: 'Vanus peab olema vähemalt 0' },
        max: { args: [100], msg: 'Vanus ei tohi ületada 100' }
      }
    },
    T6ug: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: { args: [0, 50], msg: 'Tõug võib olla kuni 50 tähemärki' }
      }
    },
    Steriliseerimine: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    LiigiID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { isInt: { msg: 'LiigiID peab olema täisarv' } }
    },
    KliendiID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { isInt: { msg: 'KliendiID peab olema täisarv' } }
    },
    VisiidiID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { isInt: { msg: 'VisiidiID peab olema täisarv' } }
    },
    HaiguslooID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { isInt: { msg: 'HaiguslooID must be an integer' } }
    }
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
