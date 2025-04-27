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
      unique: true
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
  return Kasutajad;
};
