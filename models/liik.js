// models/liik.js
module.exports = (sequelize, DataTypes) => {
  const Liik = sequelize.define('Liik', {
    LiigiID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Nimetus: DataTypes.STRING
  }, {
    tableName: 'Liik',
    schema: 'clinic',   // <--- this line is important!
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
