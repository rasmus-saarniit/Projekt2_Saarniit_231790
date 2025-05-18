module.exports = (sequelize, DataTypes) => {
  const Liik = sequelize.define('Liik', {
    LiigiID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Nimetus: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Nimetus on kohustuslik' },
        len: { args: [2, 50], msg: 'Nimetus peab olema 2-50 tähemärki' }
      }
    }
  }, {
    tableName: 'Liik',
    schema: 'clinic',   
    timestamps: false
  });

  Liik.associate = function(models) {
    // One species can have many patients
    Liik.hasMany(models.Patsiendid, { foreignKey: 'LiigiID' });
    // One species can have many specializations
    Liik.hasMany(models.Spetsialiseerumine, { foreignKey: 'LiigiID' });
  };

  return Liik;
};
