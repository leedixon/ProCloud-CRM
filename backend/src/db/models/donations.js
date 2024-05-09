const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const donations = sequelize.define(
    'donations',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      amount: {
        type: DataTypes.DECIMAL,
      },

      donation_date: {
        type: DataTypes.DATE,
      },

      method: {
        type: DataTypes.TEXT,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  donations.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.donations.belongsTo(db.donors, {
      as: 'donor',
      foreignKey: {
        name: 'donorId',
      },
      constraints: false,
    });

    db.donations.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.donations.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.donations.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return donations;
};
