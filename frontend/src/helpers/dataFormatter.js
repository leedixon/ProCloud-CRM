import dayjs from 'dayjs';
import _ from 'lodash';

export default {
  filesFormatter(arr) {
    if (!arr || !arr.length) return [];
    return arr.map((item) => item);
  },
  imageFormatter(arr) {
    if (!arr || !arr.length) return [];
    return arr.map((item) => ({
      publicUrl: item.publicUrl || '',
    }));
  },
  oneImageFormatter(arr) {
    if (!arr || !arr.length) return '';
    return arr[0].publicUrl || '';
  },
  dateFormatter(date) {
    if (!date) return '';
    return dayjs(date).format('YYYY-MM-DD');
  },
  dateTimeFormatter(date) {
    if (!date) return '';
    return dayjs(date).format('YYYY-MM-DD HH:mm');
  },
  booleanFormatter(val) {
    return val ? 'Yes' : 'No';
  },
  dataGridEditFormatter(obj) {
    return _.transform(obj, (result, value, key) => {
      if (_.isArray(value)) {
        result[key] = _.map(value, 'id');
      } else if (_.isObject(value)) {
        result[key] = value.id;
      } else {
        result[key] = value;
      }
    });
  },

  donationsManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.amount);
  },
  donationsOneListFormatter(val) {
    if (!val) return '';
    return val.amount;
  },
  donationsManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.amount };
    });
  },
  donationsOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.amount, id: val.id };
  },

  donorsManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.name);
  },
  donorsOneListFormatter(val) {
    if (!val) return '';
    return val.name;
  },
  donorsManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.name };
    });
  },
  donorsOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.name, id: val.id };
  },

  eventsManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.title);
  },
  eventsOneListFormatter(val) {
    if (!val) return '';
    return val.title;
  },
  eventsManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.title };
    });
  },
  eventsOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.title, id: val.id };
  },

  volunteersManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.name);
  },
  volunteersOneListFormatter(val) {
    if (!val) return '';
    return val.name;
  },
  volunteersManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.name };
    });
  },
  volunteersOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.name, id: val.id };
  },

  rolesManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.name);
  },
  rolesOneListFormatter(val) {
    if (!val) return '';
    return val.name;
  },
  rolesManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.name };
    });
  },
  rolesOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.name, id: val.id };
  },

  permissionsManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.name);
  },
  permissionsOneListFormatter(val) {
    if (!val) return '';
    return val.name;
  },
  permissionsManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.name };
    });
  },
  permissionsOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.name, id: val.id };
  },

  organizationsManyListFormatter(val) {
    if (!val || !val.length) return [];
    return val.map((item) => item.name);
  },
  organizationsOneListFormatter(val) {
    if (!val) return '';
    return val.name;
  },
  organizationsManyListFormatterEdit(val) {
    if (!val || !val.length) return [];
    return val.map((item) => {
      return { id: item.id, label: item.name };
    });
  },
  organizationsOneListFormatterEdit(val) {
    if (!val) return '';
    return { label: val.name, id: val.id };
  },
};
