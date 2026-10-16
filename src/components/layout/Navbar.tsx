import React from 'react';
import { UserBubble } from './UserBubble';

interface NavbarProps {
  title?: string;
  showUserBubble?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  title = 'One Day',
  showUserBubble = true,
}) => {
  return (
    <header className="pt-6 pb-9 relative flex items-center justify-center">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
        {title}
      </h1>

      {showUserBubble && (
        <div className="absolute right-0 top-6">
          <UserBubble />
        </div>
      )}
    </header>
  );
};
