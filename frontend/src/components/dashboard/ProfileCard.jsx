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
    <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl dark:shadow-2xl transition-all duration-300">
      
      {/* Top Section: Avatar & Info */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Avatar */}
        <div className="flex-shrink-0 flex justify-center md:block">
          <div className="relative">
            {/* Soft glow behind the avatar for premium feel */}
            <div className="absolute inset-0 bg-blue-500/20 dark:bg-white/10 blur-xl rounded-full"></div>
            {avatar_url ? (
              <img
                src={avatar_url}
                alt={username}
                className="relative w-28 h-28 rounded-full border-4 border-white/50 dark:border-white/10 shadow-lg object-cover z-10"
              />
            ) : (
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-4 border-white/50 dark:border-white/10 shadow-lg flex items-center justify-center text-3xl font-bold text-gray-500 dark:text-gray-400 z-10">
                {getInitials(name || username)}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex flex-col sm:flex-row sm:items-end gap-2 mb-2 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {name || username}
            </h2>
            <span className="text-blue-600 dark:text-gray-400 font-medium text-sm sm:mb-1 pb-1">
              @{username}
            </span>
          </div>

          {bio && (
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 leading-relaxed text-center md:text-left max-w-2xl">
              {bio}
            </p>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-3 gap-x-4 text-sm mt-auto">
            {location && (
              <div className="flex items-center justify-center md:justify-start text-gray-600 dark:text-gray-400">
                <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                <span className="truncate">{location}</span>
              </div>
            )}
            {company && (
              <div className="flex items-center justify-center md:justify-start text-gray-600 dark:text-gray-400">
                <BuildingOfficeIcon className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                <span className="truncate">{company}</span>
              </div>
            )}
            {blog && (
              <div className="flex items-center justify-center md:justify-start text-gray-600 dark:text-gray-400">
                <LinkIcon className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                <a
                  href={blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-white hover:underline truncate transition-colors"
                >
                  {blog.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            {created_at && (
              <div className="flex items-center justify-center md:justify-start text-gray-600 dark:text-gray-400">
                <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                <span className="truncate">Joined {formatDate(created_at)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-white/5 grid grid-cols-3 gap-4">
        {/* Followers Stat Widget */}
        <div className="bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 rounded-xl p-3 sm:p-4 text-center hover:bg-white/80 dark:hover:bg-white/10 transition-colors">
          <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <UsersIcon className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Followers</span>
            <span className="sm:hidden">Flwrs</span>
          </div>
          <div className="text-gray-900 dark:text-white font-bold text-xl sm:text-2xl mt-1">
            {formatNumber(followers)}
          </div>
        </div>

        {/* Following Stat Widget */}
        <div className="bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 rounded-xl p-3 sm:p-4 text-center hover:bg-white/80 dark:hover:bg-white/10 transition-colors">
          <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <UserGroupIcon className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Following</span>
            <span className="sm:hidden">Flwng</span>
          </div>
          <div className="text-gray-900 dark:text-white font-bold text-xl sm:text-2xl mt-1">
            {formatNumber(following)}
          </div>
        </div>

        {/* Repositories Stat Widget */}
        <div className="bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 rounded-xl p-3 sm:p-4 text-center hover:bg-white/80 dark:hover:bg-white/10 transition-colors">
          <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <FolderIcon className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Repositories</span>
            <span className="sm:hidden">Repos</span>
          </div>
          <div className="text-gray-900 dark:text-white font-bold text-xl sm:text-2xl mt-1">
            {formatNumber(public_repos)}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ProfileCard;