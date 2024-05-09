const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class DonationsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const donations = await db.donations.create(
      {
        id: data.id || undefined,

        amount: data.amount || null,
        donation_date: data.donation_date || null,
        method: data.method || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await donations.setDonor(data.donor || null, {
      transaction,
    });

    await donations.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    return donations;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const donationsData = data.map((item, index) => ({
      id: item.id || undefined,

      amount: item.amount || null,
      donation_date: item.donation_date || null,
      method: item.method || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const donations = await db.donations.bulkCreate(donationsData, {
      transaction,
    });

    // For each item created, replace relation files

    return donations;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const donations = await db.donations.findByPk(id, {}, { transaction });

    await donations.update(
      {
        amount: data.amount || null,
        donation_date: data.donation_date || null,
        method: data.method || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await donations.setDonor(data.donor || null, {
      transaction,
    });

    await donations.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    return donations;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const donations = await db.donations.findByPk(id, options);

    await donations.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await donations.destroy({
      transaction,
    });

    return donations;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const donations = await db.donations.findOne({ where }, { transaction });

    if (!donations) {
      return donations;
    }

    const output = donations.get({ plain: true });

    output.donor = await donations.getDonor({
      transaction,
    });

    output.organization = await donations.getOrganization({
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
        model: db.donors,
        as: 'donor',
      },

      {
        model: db.organizations,
        as: 'organization',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.method) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('donations', 'method', filter.method),
        };
      }

      if (filter.amountRange) {
        const [start, end] = filter.amountRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            amount: {
              ...where.amount,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            amount: {
              ...where.amount,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.donation_dateRange) {
        const [start, end] = filter.donation_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            donation_date: {
              ...where.donation_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            donation_date: {
              ...where.donation_date,
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

      if (filter.donor) {
        var listItems = filter.donor.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          donorId: { [Op.or]: listItems },
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
          count: await db.donations.count({
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
      : await db.donations.findAndCountAll({
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
          Utils.ilike('donations', 'amount', query),
        ],
      };
    }

    const records = await db.donations.findAll({
      attributes: ['id', 'amount'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['amount', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.amount,
    }));
  }
};
