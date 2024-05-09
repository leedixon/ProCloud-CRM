import * as icon from '@mdi/js';
import { MenuAsideItem } from './interfaces';

const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: icon.mdiViewDashboardOutline,
    label: 'Dashboard',
  },

  {
    href: '/users/users-list',
    label: 'Users',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiAccountGroup ? icon.mdiAccountGroup : icon.mdiTable,
    permissions: 'READ_USERS',
  },
  {
    href: '/campaigns/campaigns-list',
    label: 'Campaigns',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiTrophy ? icon.mdiTrophy : icon.mdiTable,
    permissions: 'READ_CAMPAIGNS',
  },
  {
    href: '/donations/donations-list',
    label: 'Donations',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiCashMultiple ? icon.mdiCashMultiple : icon.mdiTable,
    permissions: 'READ_DONATIONS',
  },
  {
    href: '/donors/donors-list',
    label: 'Donors',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiAccountHeart ? icon.mdiAccountHeart : icon.mdiTable,
    permissions: 'READ_DONORS',
  },
  {
    href: '/events/events-list',
    label: 'Events',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiCalendarStar ? icon.mdiCalendarStar : icon.mdiTable,
    permissions: 'READ_EVENTS',
  },
  {
    href: '/notes/notes-list',
    label: 'Notes',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiNoteText ? icon.mdiNoteText : icon.mdiTable,
    permissions: 'READ_NOTES',
  },
  {
    href: '/volunteers/volunteers-list',
    label: 'Volunteers',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiAccountGroup ? icon.mdiAccountGroup : icon.mdiTable,
    permissions: 'READ_VOLUNTEERS',
  },
  {
    href: '/roles/roles-list',
    label: 'Roles',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiShieldAccountVariantOutline
      ? icon.mdiShieldAccountVariantOutline
      : icon.mdiTable,
    permissions: 'READ_ROLES',
  },
  {
    href: '/permissions/permissions-list',
    label: 'Permissions',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiShieldAccountOutline
      ? icon.mdiShieldAccountOutline
      : icon.mdiTable,
    permissions: 'READ_PERMISSIONS',
  },
  {
    href: '/organizations/organizations-list',
    label: 'Organizations',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiTable ? icon.mdiTable : icon.mdiTable,
    permissions: 'READ_ORGANIZATIONS',
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: icon.mdiAccountCircle,
  },
  {
    href: '/api-docs',
    target: '_blank',
    label: 'Swagger API',
    icon: icon.mdiFileCode,
    permissions: 'READ_API_DOCS',
  },
];

export default menuAside;
