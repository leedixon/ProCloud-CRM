const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const donors = sequelize.define(
    'donors',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      email: {
        type: DataTypes.TEXT,
      },

      birthday: {
        type: DataTypes.DATE,
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

  donors.associate = (db) => {
    db.donors.belongsToMany(db.donations, {
      as: 'donations',
      foreignKey: {
        name: 'donors_donationsId',
      },
      constraints: false,
      through: 'donorsDonationsDonations',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.donors.hasMany(db.donations, {
      as: 'donations_donor',
      foreignKey: {
        name: 'donorId',
      },
      constraints: false,
    });

    //end loop

    db.donors.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.donors.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.donors.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return donors;
};
