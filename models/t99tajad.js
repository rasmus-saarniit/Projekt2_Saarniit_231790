// models/t99tajad.js
module.exports = (sequelize, DataTypes) => {
  const T99tajad = sequelize.define('T99tajad', {
    T99tajaID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    LaborandiID: DataTypes.INTEGER,
    TehnikuID: DataTypes.INTEGER,
    ArstiID: DataTypes.INTEGER,
    Valdkond: DataTypes.STRING,
    Eesnimi: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Perekonnanimi: {
      type: DataTypes.STRING,
      allowNull: false
    }
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
  };

  return T99tajad;
};
