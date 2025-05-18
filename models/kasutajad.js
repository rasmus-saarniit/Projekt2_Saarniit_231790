// models/kasutajad.js
module.exports = (sequelize, DataTypes) => {
  const Kasutajad = sequelize.define('Kasutajad', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Username is required' },
        len: { args: [3, 50], msg: 'Username must be 3-50 characters' }
      }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'User'
    }
  }, {
    tableName: 'Kasutajad',
    schema: 'clinic',
    timestamps: true // Sequelize will handle createdAt/updatedAt
  });
  Kasutajad.associate = function(models) {
    // A user can delete many patients (audit log)
    Kasutajad.hasMany(models.Patsiendid_Audit, { foreignKey: 'DeletedByUserID' });
    // A user can be an employee (T99taja)
    Kasutajad.hasOne(models.T99tajad, { foreignKey: 'UserID' });
  };
  return Kasutajad;
};
