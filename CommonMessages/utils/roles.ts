export const roles = {
    NO_ROLE: 'NO_ROLE',
    TALENT: 'TALENT',
    COMPANIE_ROLES: {
      MANAGER: 'MANAGER',
      USER: 'USER'
    },
    SYSTEM_ADMINS: {
      SUPER_ADMIN: 'SUPER_ADMIN',
      ADMIN: 'ADMIN'
    }
}
  
export const roleList = [
    roles.TALENT,
    roles.SYSTEM_ADMINS.SUPER_ADMIN,
    roles.SYSTEM_ADMINS.ADMIN,
    roles.COMPANIE_ROLES.MANAGER,
    roles.COMPANIE_ROLES.USER,
    roles.NO_ROLE
]
  
export const hosts = {
    ADMIN_DASHBOARD: 'ADMIN_DASHBOARD',
    COMPANY: 'COMPANY',
    TALENT: 'TALENT',
    ASSESSMENT: 'ASSESSMENT',
    UNKNOWN: 'UNKNOWN'
  }

type Mapping = Record<string, string>
export const HostRoleMapping: Mapping = {
    'ADMIN_DASHBOARD': roles.SYSTEM_ADMINS.ADMIN,
    'COMPANY': roles.COMPANIE_ROLES.MANAGER,
    'TALENT': roles.TALENT,
    'ASSESSMENT': roles.TALENT,
    'UNKNOWN': roles.NO_ROLE
}
  
export const hostList = [
    hosts.ADMIN_DASHBOARD,
    hosts.COMPANY,
    hosts.TALENT,
    hosts.ASSESSMENT,
    hosts.UNKNOWN
]