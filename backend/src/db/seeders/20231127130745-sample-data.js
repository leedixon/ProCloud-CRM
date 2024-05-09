const db = require('../models');
const Users = db.users;

const Campaigns = db.campaigns;

const Donations = db.donations;

const Donors = db.donors;

const Events = db.events;

const Notes = db.notes;

const Volunteers = db.volunteers;

const Organizations = db.organizations;

const CampaignsData = [
  {
    name: 'Save the Forests',

    target_amount: 10000,

    start_date: new Date('2023-06-01'),

    end_date: new Date('2023-08-31'),

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    name: 'Clean Water Initiative',

    target_amount: 5000,

    start_date: new Date('2023-04-01'),

    end_date: new Date('2023-05-30'),

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    name: 'Education for All',

    target_amount: 15000,

    start_date: new Date('2023-09-01'),

    end_date: new Date('2023-12-31'),

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    name: 'Winter Clothes Drive',

    target_amount: 3000,

    start_date: new Date('2023-10-01'),

    end_date: new Date('2023-11-30'),

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },
];

const DonationsData = [
  {
    amount: 100,

    donation_date: new Date('2023-01-20'),

    method: 'Credit Card',

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    amount: 250,

    donation_date: new Date('2023-02-15'),

    method: 'PayPal',

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    amount: 50,

    donation_date: new Date('2023-03-05'),

    method: 'Stripe',

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    amount: 500,

    donation_date: new Date('2023-04-25'),

    method: 'Bank Transfer',

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },
];

const DonorsData = [
  {
    name: 'John Doe',

    email: 'john.doe@example.com',

    birthday: new Date('1980-04-23'),

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    name: 'Jane Smith',

    email: 'jane.smith@example.com',

    birthday: new Date('1975-08-09'),

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    name: 'Michael Brown',

    email: 'michael.brown@example.com',

    birthday: new Date('1990-01-16'),

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    name: 'Emily White',

    email: 'emily.white@example.com',

    birthday: new Date('1985-07-02'),

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },
];

const EventsData = [
  {
    title: 'Annual Gala',

    start_date: new Date('2023-09-15'),

    end_date: new Date('2023-09-16'),

    location: 'City Hall',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    title: 'Charity Run',

    start_date: new Date('2023-10-05'),

    end_date: new Date('2023-10-05'),

    location: 'Central Park',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    title: 'Book Drive',

    start_date: new Date('2023-08-20'),

    end_date: new Date('2023-08-25'),

    location: 'Public Library',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    title: 'Food Bank Day',

    start_date: new Date('2023-07-11'),

    end_date: new Date('2023-07-11'),

    location: 'Community Center',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },
];

const NotesData = [
  {
    content: 'Meeting with potential donor went well, follow up next week.',

    // type code here for "relation_one" field
  },

  {
    content: 'Updated volunteer training materials.',

    // type code here for "relation_one" field
  },

  {
    content: 'New email campaign for Clean Water Initiative launched.',

    // type code here for "relation_one" field
  },

  {
    content:
      "Reviewed last quarter's donation reports, seeing an upward trend.",

    // type code here for "relation_one" field
  },
];

const VolunteersData = [
  {
    name: 'Alice Johnson',

    email: 'alice.johnson@example.com',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    name: 'Bob Lee',

    email: 'bob.lee@example.com',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    name: 'Carol King',

    email: 'carol.king@example.com',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    name: 'Derek Hale',

    email: 'derek.hale@example.com',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },
];

const OrganizationsData = [
  {
    name: 'Heike Kamerlingh Onnes',
  },

  {
    name: 'Dmitri Mendeleev',
  },

  {
    name: 'Gertrude Belle Elion',
  },

  {
    name: 'Carl Linnaeus',
  },
];

// Similar logic for "relation_many"

async function associateUserWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User0 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (User0?.setOrganization) {
    await User0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User1 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (User1?.setOrganization) {
    await User1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User2 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (User2?.setOrganization) {
    await User2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User3 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (User3?.setOrganization) {
    await User3.setOrganization(relatedOrganization3);
  }
}

// Similar logic for "relation_many"

async function associateCampaignWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Campaign0 = await Campaigns.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Campaign0?.setOrganization) {
    await Campaign0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Campaign1 = await Campaigns.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Campaign1?.setOrganization) {
    await Campaign1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Campaign2 = await Campaigns.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Campaign2?.setOrganization) {
    await Campaign2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Campaign3 = await Campaigns.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Campaign3?.setOrganization) {
    await Campaign3.setOrganization(relatedOrganization3);
  }
}

async function associateDonationWithDonor() {
  const relatedDonor0 = await Donors.findOne({
    offset: Math.floor(Math.random() * (await Donors.count())),
  });
  const Donation0 = await Donations.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Donation0?.setDonor) {
    await Donation0.setDonor(relatedDonor0);
  }

  const relatedDonor1 = await Donors.findOne({
    offset: Math.floor(Math.random() * (await Donors.count())),
  });
  const Donation1 = await Donations.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Donation1?.setDonor) {
    await Donation1.setDonor(relatedDonor1);
  }

  const relatedDonor2 = await Donors.findOne({
    offset: Math.floor(Math.random() * (await Donors.count())),
  });
  const Donation2 = await Donations.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Donation2?.setDonor) {
    await Donation2.setDonor(relatedDonor2);
  }

  const relatedDonor3 = await Donors.findOne({
    offset: Math.floor(Math.random() * (await Donors.count())),
  });
  const Donation3 = await Donations.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Donation3?.setDonor) {
    await Donation3.setDonor(relatedDonor3);
  }
}

async function associateDonationWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Donation0 = await Donations.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Donation0?.setOrganization) {
    await Donation0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Donation1 = await Donations.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Donation1?.setOrganization) {
    await Donation1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Donation2 = await Donations.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Donation2?.setOrganization) {
    await Donation2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Donation3 = await Donations.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Donation3?.setOrganization) {
    await Donation3.setOrganization(relatedOrganization3);
  }
}

// Similar logic for "relation_many"

async function associateDonorWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Donor0 = await Donors.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Donor0?.setOrganization) {
    await Donor0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Donor1 = await Donors.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Donor1?.setOrganization) {
    await Donor1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Donor2 = await Donors.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Donor2?.setOrganization) {
    await Donor2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Donor3 = await Donors.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Donor3?.setOrganization) {
    await Donor3.setOrganization(relatedOrganization3);
  }
}

// Similar logic for "relation_many"

async function associateEventWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Event0 = await Events.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Event0?.setOrganization) {
    await Event0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Event1 = await Events.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Event1?.setOrganization) {
    await Event1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Event2 = await Events.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Event2?.setOrganization) {
    await Event2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Event3 = await Events.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Event3?.setOrganization) {
    await Event3.setOrganization(relatedOrganization3);
  }
}

async function associateNoteWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Note0 = await Notes.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Note0?.setOrganization) {
    await Note0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Note1 = await Notes.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Note1?.setOrganization) {
    await Note1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Note2 = await Notes.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Note2?.setOrganization) {
    await Note2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Note3 = await Notes.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Note3?.setOrganization) {
    await Note3.setOrganization(relatedOrganization3);
  }
}

// Similar logic for "relation_many"

async function associateVolunteerWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Volunteer0 = await Volunteers.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Volunteer0?.setOrganization) {
    await Volunteer0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Volunteer1 = await Volunteers.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Volunteer1?.setOrganization) {
    await Volunteer1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Volunteer2 = await Volunteers.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Volunteer2?.setOrganization) {
    await Volunteer2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Volunteer3 = await Volunteers.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Volunteer3?.setOrganization) {
    await Volunteer3.setOrganization(relatedOrganization3);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Campaigns.bulkCreate(CampaignsData);

    await Donations.bulkCreate(DonationsData);

    await Donors.bulkCreate(DonorsData);

    await Events.bulkCreate(EventsData);

    await Notes.bulkCreate(NotesData);

    await Volunteers.bulkCreate(VolunteersData);

    await Organizations.bulkCreate(OrganizationsData);

    await Promise.all([
      // Similar logic for "relation_many"

      await associateUserWithOrganization(),

      // Similar logic for "relation_many"

      await associateCampaignWithOrganization(),

      await associateDonationWithDonor(),

      await associateDonationWithOrganization(),

      // Similar logic for "relation_many"

      await associateDonorWithOrganization(),

      // Similar logic for "relation_many"

      await associateEventWithOrganization(),

      await associateNoteWithOrganization(),

      // Similar logic for "relation_many"

      await associateVolunteerWithOrganization(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('campaigns', null, {});

    await queryInterface.bulkDelete('donations', null, {});

    await queryInterface.bulkDelete('donors', null, {});

    await queryInterface.bulkDelete('events', null, {});

    await queryInterface.bulkDelete('notes', null, {});

    await queryInterface.bulkDelete('volunteers', null, {});

    await queryInterface.bulkDelete('organizations', null, {});
  },
};
