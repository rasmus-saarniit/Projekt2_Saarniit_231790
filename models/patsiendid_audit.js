// models/patsiendid_audit.js
module.exports = (sequelize, DataTypes) => {
  const PatsiendidAudit = sequelize.define('Patsiendid_Audit', {
    PatsiendiID: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    Nimi: DataTypes.STRING,
    Vanus: DataTypes.INTEGER,
    T6ug: DataTypes.STRING,
    Steriliseerimine: DataTypes.BOOLEAN,
    LiigiID: DataTypes.INTEGER,
    KliendiID: DataTypes.INTEGER,
    VisiidiID: DataTypes.INTEGER,
    HaiguslooID: DataTypes.INTEGER,
    DeletedAt: DataTypes.DATE,
    DeletedByUserID: DataTypes.INTEGER
  }, {
    tableName: 'Patsiendid_Audit',
    schema: 'clinic',
    timestamps: false
  });

  PatsiendidAudit.associate = function(models) {
    // Link to user who deleted
    PatsiendidAudit.belongsTo(models.Kasutajad, { foreignKey: 'DeletedByUserID' });
  };

  return PatsiendidAudit;
};
