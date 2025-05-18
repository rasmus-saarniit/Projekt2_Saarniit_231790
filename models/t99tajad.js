// models/t99tajad.js
module.exports = (sequelize, DataTypes) => {
  const T99tajad = sequelize.define('T99tajad', {
    T99tajaID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    LaborandiID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { isInt: { msg: 'LaborandiID peab olema täisarv' } }
    },
    TehnikuID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { isInt: { msg: 'TehnikuID peab olema täisarv' } }
    },
    ArstiID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { isInt: { msg: 'ArstiID peab olema täisarv' } }
    },
    Valdkond: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: { args: [0, 50], msg: 'Valdkond võib olla kuni 50 tähemärki' }
      }
    },
    Eesnimi: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Eesnimi on kohustuslik' },
        len: { args: [2, 50], msg: 'Eesnimi peab olema 2-50 tähemärki' }
      }
    },
    Perekonnanimi: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Perekonnanimi on kohustuslik' },
        len: { args: [2, 50], msg: 'Perekonnanimi peab olema 2-50 tähemärki' }
      }
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { isInt: { msg: 'UserID peab olema täisarv' } }
    } // Foreign key to Kasutajad
  }, {
    tableName: 'T99tajad',
    schema: 'clinic',
    timestamps: false
  });

  T99tajad.associate = function(models) {
    // One employee can have many visits
    T99tajad.hasMany(models.Visiit, { foreignKey: 'T99tajaID' });
    // One employee can have many medical records
    T99tajad.hasMany(models.Haiguslood, { foreignKey: 'T99tajaID' });
    // One employee can have many specializations
    T99tajad.hasMany(models.Spetsialiseerumine, { foreignKey: 'T99tajaID' });
    // Each employee is a user
    T99tajad.belongsTo(models.Kasutajad, { foreignKey: 'UserID' });
  };

  return T99tajad;
};
