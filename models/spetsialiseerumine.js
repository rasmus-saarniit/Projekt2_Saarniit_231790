// models/spetsialiseerumine.js
module.exports = (sequelize, DataTypes) => {
  const Spetsialiseerumine = sequelize.define('Spetsialiseerumine', {
    SpetsialiseerumineID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ArstiID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Valdkond: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'Spetsialiseerumine',
    schema: 'clinic',
    timestamps: false
  });

  // No associations needed unless you want to link to T99tajad or other tables

  return Spetsialiseerumine;
};
