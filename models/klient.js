
module.exports = (sequelize, DataTypes) => {
  const Klient = sequelize.define('Klient', {
    KliendiID: { 
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Eesnimi: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Eesnimi is required' },
        len: {
          args: [2, 50],
          msg: 'Eesnimi must be between 2 and 50 characters'
        }
      }
    },
    Perekonnanimi: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Perekonnanimi is required' },
        len: {
          args: [2, 50],
          msg: 'Perekonnanimi must be between 2 and 50 characters'
        }
      }
    },
    Isikukood: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Isikukood is required' },
        isNumeric: { msg: 'Isikukood must be numeric' },
        len: {
          args: [11, 11],
          msg: 'Isikukood must be exactly 11 digits'
        }
      }
    },
    Telefoninr: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: {
          args: [/^\+?\d{7,15}$/],
          msg: 'Telefoninr must be a valid phone number'
        }
      }
    },
    Epost: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Epost must be a valid email address' },
        notEmpty: { msg: 'Epost is required' }
      }
    },
    Elukoht: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: 'Elukoht can be up to 100 characters'
        }
      }
    }
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
