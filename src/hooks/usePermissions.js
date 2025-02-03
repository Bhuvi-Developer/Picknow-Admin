import { PERMISSIONS, ACTIONS } from '../constants/permissions';

const usePermissions = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const hasPermission = (module, action) => {
    if (!currentUser) return false;
    
    // Super admin has all permissions
    if (currentUser.role === 'super_admin') return true;
    
    // Check if user has specific permission
    const userPermissions = currentUser.permissions || {};
    return Array.isArray(userPermissions[module]) && userPermissions[module].includes(action);
  };

  const canRead = (module) => {
    // Super admin can read everything
    if (currentUser?.role === 'super_admin') return true;
    
    // Check specific module permission
    return hasPermission(module, ACTIONS.READ);
  };

  const canWrite = (module) => {
    if (currentUser?.role === 'super_admin') return true;
    return hasPermission(module, ACTIONS.WRITE);
  };

  const canDelete = (module) => {
    if (currentUser?.role === 'super_admin') return true;
    return hasPermission(module, ACTIONS.DELETE);
  };

  return {
    hasPermission,
    canRead,
    canWrite,
    canDelete,
    isSuperAdmin: currentUser?.role === 'super_admin',
    currentUser
  };
};

export default usePermissions; 