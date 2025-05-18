module.exports = (sequelize, DataTypes) => {
  const Spetsialiseerumine = sequelize.define('Spetsialiseerumine', {
    SpetsialiseerumineID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ArstiID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { isInt: { msg: 'ArstiID peab olema täisarv' } }
    },
    Valdkond: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Valdkond on kohustuslik' },
        len: { args: [2, 50], msg: 'Valdkond peab olema 2-50 tähemärki' }
      }
    }
  }, {
    tableName: 'Spetsialiseerumine',
    schema: 'clinic',
    timestamps: false
  });


  return Spetsialiseerumine;
};
