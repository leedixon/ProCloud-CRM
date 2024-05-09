const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class DonorsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const donors = await db.donors.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        email: data.email || null,
        birthday: data.birthday || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await donors.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    await donors.setDonations(data.donations || [], {
      transaction,
    });

    return donors;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const donorsData = data.map((item, index) => ({
      id: item.id || undefined,

      name: item.name || null,
      email: item.email || null,
      birthday: item.birthday || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const donors = await db.donors.bulkCreate(donorsData, { transaction });

    // For each item created, replace relation files

    return donors;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const donors = await db.donors.findByPk(id, {}, { transaction });

    await donors.update(
      {
        name: data.name || null,
        email: data.email || null,
        birthday: data.birthday || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await donors.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    await donors.setDonations(data.donations || [], {
      transaction,
    });

    return donors;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const donors = await db.donors.findByPk(id, options);

    await donors.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await donors.destroy({
      transaction,
    });

    return donors;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const donors = await db.donors.findOne({ where }, { transaction });

    if (!donors) {
      return donors;
    }

    const output = donors.get({ plain: true });

    output.donations_donor = await donors.getDonations_donor({
      transaction,
    });

    output.donations = await donors.getDonations({
      transaction,
    });

    output.organization = await donors.getOrganization({
      transaction,
    });

    return output;
  }

  static async findAll(filter, globalAccess, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.organizations,
        as: 'organization',
      },

      {
        model: db.donations,
        as: 'donations',
        through: filter.donations
          ? {
              where: {
                [Op.or]: filter.donations.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.donations ? true : null,
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('donors', 'name', filter.name),
        };
      }

      if (filter.email) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('donors', 'email', filter.email),
        };
      }

      if (filter.birthdayRange) {
        const [start, end] = filter.birthdayRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            birthday: {
              ...where.birthday,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            birthday: {
              ...where.birthday,
              [Op.lte]: end,
            },
          };
        }
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.organization) {
        var listItems = filter.organization.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          organizationId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.donors.count({
            where: globalAccess ? {} : where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.donors.findAndCountAll({
          where: globalAccess ? {} : where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit, globalAccess, organizationId) {
    let where = {};

    if (!globalAccess && organizationId) {
      where.organizationId = organizationId;
    }

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('donors', 'name', query),
        ],
      };
    }

    const records = await db.donors.findAll({
      attributes: ['id', 'name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.name,
    }));
  }
};
