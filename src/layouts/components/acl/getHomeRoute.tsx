/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role?: string) => {
  //if (role === 'client') return '/acl' //TODO: handle different UI
  return '/apps/documents/list' //'/home'
}

export default getHomeRoute
