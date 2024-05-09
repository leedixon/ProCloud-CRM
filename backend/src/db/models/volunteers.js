const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const volunteers = sequelize.define(
    'volunteers',
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

  volunteers.associate = (db) => {
    db.volunteers.belongsToMany(db.events, {
      as: 'events_attended',
      foreignKey: {
        name: 'volunteers_events_attendedId',
      },
      constraints: false,
      through: 'volunteersEvents_attendedEvents',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.volunteers.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.volunteers.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.volunteers.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return volunteers;
};
