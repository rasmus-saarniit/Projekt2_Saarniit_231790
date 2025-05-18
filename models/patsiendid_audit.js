// models/patsiendid_audit.js
module.exports = (sequelize, DataTypes) => {
  const PatsiendidAudit = sequelize.define('Patsiendid_Audit', {
    PatsiendiID: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    Nimi: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nimi is required' },
        len: { args: [2, 50], msg: 'Nimi must be 2-50 characters' }
      }
    },
    Vanus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'Vanus must be an integer' },
        min: { args: [0], msg: 'Vanus must be at least 0' },
        max: { args: [100], msg: 'Vanus must be at most 100' }
      }
    },
    T6ug: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: { args: [0, 50], msg: 'T6ug can be up to 50 characters' }
      }
    },
    Steriliseerimine: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    LiigiID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { isInt: { msg: 'LiigiID must be an integer' } }
    },
    KliendiID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { isInt: { msg: 'KliendiID must be an integer' } }
    },
    VisiidiID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { isInt: { msg: 'VisiidiID must be an integer' } }
    },
    HaiguslooID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { isInt: { msg: 'HaiguslooID must be an integer' } }
    },
    DeletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    DeletedByUserID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { isInt: { msg: 'DeletedByUserID must be an integer' } }
    }
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
