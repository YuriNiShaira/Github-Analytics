import React from 'react';
import { 
  MapPinIcon, 
  BuildingOfficeIcon, 
  LinkIcon, 
  CalendarIcon,
  UsersIcon,
  UserGroupIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import { formatDate, getInitials, formatNumber } from '../../utils/formatters';

const ProfileCard = ({ profile }) => {
  const {
    username,
    name,
    bio,
    avatar_url,
    location,
    company,
    blog,
    followers,
    following,
    public_repos,
    created_at,
  } = profile;

  return (
    <div className="bg-white dark:bg-github-card border border-gray-200 dark:border-github-border rounded-lg p-6 transition-colors duration-300">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {avatar_url ? (
            <img
              src={avatar_url}
              alt={username}
              className="w-24 h-24 rounded-full border-2 border-gray-200 dark:border-github-border"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-github-border flex items-center justify-center text-3xl font-bold text-gray-400 dark:text-github-muted">
              {getInitials(name || username)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {/* 4. Text turns to dark slate gray on light mode instead of text-white */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {name || username}
            </h2>
            <span className="text-gray-500 dark:text-github-muted text-sm">@{username}</span>
          </div>

          {bio && (
            <p className="text-gray-700 dark:text-github-text text-sm mb-3">{bio}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {location && (
              <div className="flex items-center text-gray-500 dark:text-github-muted">
                <MapPinIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            )}
            {company && (
              <div className="flex items-center text-gray-500 dark:text-github-muted">
                <BuildingOfficeIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
                <span className="truncate">{company}</span>
              </div>
            )}
            {blog && (
              <div className="flex items-center text-gray-500 dark:text-github-muted">
                <LinkIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
                <a
                  href={blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-github-accent hover:underline truncate"
                >
                  {blog.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            {created_at && (
              <div className="flex items-center text-gray-500 dark:text-github-muted">
                <CalendarIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
                <span className="truncate">Joined {formatDate(created_at)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-github-border grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center text-gray-500 dark:text-github-muted text-sm">
            <UsersIcon className="h-4 w-4 mr-1" />
            Followers
          </div>
          <div className="text-gray-900 dark:text-white font-semibold text-lg mt-0.5">
            {formatNumber(followers)}
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center text-gray-500 dark:text-github-muted text-sm">
            <UserGroupIcon className="h-4 w-4 mr-1" />
            Following
          </div>
          <div className="text-gray-900 dark:text-white font-semibold text-lg mt-0.5">
            {formatNumber(following)}
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center text-gray-500 dark:text-github-muted text-sm">
            <FolderIcon className="h-4 w-4 mr-1" />
            Repositories
          </div>
          <div className="text-gray-900 dark:text-white font-semibold text-lg mt-0.5">
            {formatNumber(public_repos)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;