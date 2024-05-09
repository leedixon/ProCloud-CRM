const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const campaigns = sequelize.define(
    'campaigns',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      target_amount: {
        type: DataTypes.DECIMAL,
      },

      start_date: {
        type: DataTypes.DATE,
      },

      end_date: {
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

  campaigns.associate = (db) => {
    db.campaigns.belongsToMany(db.donations, {
      as: 'donations_received',
      foreignKey: {
        name: 'campaigns_donations_receivedId',
      },
      constraints: false,
      through: 'campaignsDonations_receivedDonations',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.campaigns.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.campaigns.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.campaigns.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return campaigns;
};
