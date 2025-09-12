import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const UserProfile: React.FC = () => {
  //console.log('UserProfile component rendering...');
  
  const { user, logout, isLoading } = useAuth();
  
  //console.log('Auth state:', { user, isLoading, userExists: !!user });


  // Debug logging to see what user properties are available
  let displayName;
  let displayIdentifier;
  if (user) {
    // console.log('User object:', user);
    // console.log('User type:', typeof user);
    // console.log('User stringified:', JSON.stringify(user, null, 2));
    displayName = user.name || user.username || user.email || user.displayName || user.preferred_username || 'TBD';
    displayIdentifier = user.username || user.email || user.preferred_username || user.sub || user.oid || 'ID not available';
  } else {
    displayName = 'TBD';
    displayIdentifier = 'ID not available';
  }

  return (
    <div className="flex flex-col items-end space-y-1 px-1 sm:px-4 py-1 sm:py-2 w-16 sm:w-auto min-w-0">
      <div className="flex flex-col items-end w-full min-w-0">
        <span className="text-[10px] sm:text-base font-medium text-gray-900 truncate w-full text-right leading-none sm:leading-normal">
          {displayName}
        </span>
        {displayIdentifier !== displayName && displayIdentifier !== 'ID not available' && (
          <span className="hidden sm:block text-sm text-gray-500 truncate w-full text-right">
            {displayIdentifier}
          </span>
        )}
      </div>
      <button
        onClick={logout}
        disabled={isLoading}
        className="flex items-center justify-center p-1 sm:px-3 sm:py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 w-full sm:w-auto"
      >
        <span className="hidden sm:flex sm:items-center sm:space-x-1">
          <span>Log out</span>
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
        </span>
        <ArrowRightOnRectangleIcon className="h-4 w-4 sm:hidden" />
      </button>
    </div>
  );
};

export default UserProfile;
