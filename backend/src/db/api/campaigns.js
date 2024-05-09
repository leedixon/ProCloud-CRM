const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class CampaignsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const campaigns = await db.campaigns.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        target_amount: data.target_amount || null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await campaigns.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    await campaigns.setDonations_received(data.donations_received || [], {
      transaction,
    });

    return campaigns;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const campaignsData = data.map((item, index) => ({
      id: item.id || undefined,

      name: item.name || null,
      target_amount: item.target_amount || null,
      start_date: item.start_date || null,
      end_date: item.end_date || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const campaigns = await db.campaigns.bulkCreate(campaignsData, {
      transaction,
    });

    // For each item created, replace relation files

    return campaigns;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const campaigns = await db.campaigns.findByPk(id, {}, { transaction });

    await campaigns.update(
      {
        name: data.name || null,
        target_amount: data.target_amount || null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await campaigns.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    await campaigns.setDonations_received(data.donations_received || [], {
      transaction,
    });

    return campaigns;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const campaigns = await db.campaigns.findByPk(id, options);

    await campaigns.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await campaigns.destroy({
      transaction,
    });

    return campaigns;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const campaigns = await db.campaigns.findOne({ where }, { transaction });

    if (!campaigns) {
      return campaigns;
    }

    const output = campaigns.get({ plain: true });

    output.donations_received = await campaigns.getDonations_received({
      transaction,
    });

    output.organization = await campaigns.getOrganization({
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
        as: 'donations_received',
        through: filter.donations_received
          ? {
              where: {
                [Op.or]: filter.donations_received.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.donations_received ? true : null,
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
          [Op.and]: Utils.ilike('campaigns', 'name', filter.name),
        };
      }

      if (filter.target_amountRange) {
        const [start, end] = filter.target_amountRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            target_amount: {
              ...where.target_amount,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            target_amount: {
              ...where.target_amount,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.start_dateRange) {
        const [start, end] = filter.start_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            start_date: {
              ...where.start_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            start_date: {
              ...where.start_date,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.end_dateRange) {
        const [start, end] = filter.end_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            end_date: {
              ...where.end_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            end_date: {
              ...where.end_date,
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
          count: await db.campaigns.count({
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
      : await db.campaigns.findAndCountAll({
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
          Utils.ilike('campaigns', 'name', query),
        ],
      };
    }

    const records = await db.campaigns.findAll({
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
