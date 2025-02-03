import { usePermissions } from '../hooks/usePermissions';
import { ACTIONS } from '../constants/permissions';

export const withPermission = (WrappedComponent, requiredPermission, requiredAction = ACTIONS.READ) => {
  return function PermissionWrapper(props) {
    const { canRead, canWrite, canDelete, isSuperAdmin } = usePermissions();
    
    const hasAccess = () => {
      if (isSuperAdmin) return true;
      
      switch (requiredAction) {
        case ACTIONS.READ:
          return canRead(requiredPermission);
        case ACTIONS.WRITE:
          return canWrite(requiredPermission);
        case ACTIONS.DELETE:
          return canDelete(requiredPermission);
        default:
          return false;
      }
    };

    return hasAccess() ? <WrappedComponent {...props} /> : null;
  };
}; 