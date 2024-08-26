import React, { useState, useEffect, useRef } from 'react';
import { config } from '../../common/config';
import { User } from '../../types/common';

interface Owner {
  userId: number;
  fullName: string;
}

interface OwnerSelectorPopupProps {
  onSelect: (userId: number, fullName: string) => void;
  onClose: () => void;
}

const OwnerSelectorPopup: React.FC<OwnerSelectorPopupProps> = ({
  onSelect,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('fullName'); // Default to fullName for initial display
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [owners, setOwners] = useState<Owner[]>([]);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${config.apiBaseUrl}/users/search?${filterType}=${searchQuery}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setUsers(data.content);
        setOwners(data.content);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchUsers();
    }
  }, [searchQuery, filterType]);

  // Close the popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Inline styles for dynamic width and height
  const popupStyle = {
    width: window.innerWidth < 1000 ? '100%' : '1000px',
    height: window.innerHeight < 500 ? '100%' : '500px',
    maxWidth: '100%',
    maxHeight: '100%',
  };

  const handleSearch = () => {
    // Trigger search action here
    if (searchQuery) {
      fetchUsers();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      style={{
        height: '100vh', // Ensure it takes up the full height of the viewport
        width: '100vw', // Ensure it takes up the full width of the viewport
        margin: 0, // Reset any margin
        padding: 0, // Reset any padding
        top: 0,
        left: 0,
        zIndex: 99999,
      }}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-4 overflow-y-auto"
        style={popupStyle}
        ref={popupRef}
      >
        <h2 className="text-xl font-bold mb-4">Chọn Giảng Viên</h2>
        <div className="flex items-center mb-4 space-x-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-stroke rounded-md py-2 px-4 dark:bg-boxdark dark:border-strokedark"
          >
            <option value="fullName">Họ tên</option>
            <option value="email">Email</option>
            <option value="phone">Số điện thoại</option>
          </select>

          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border border-stroke rounded-md py-2 px-4 w-64 dark:bg-boxdark dark:border-strokedark"
          />

          <button
            onClick={handleSearch}
            className="bg-primary text-white rounded-md py-2 px-4 hover:bg-primary-dark focus:outline-none"
          >
            Tìm
          </button>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        <div className="overflow-x-auto">
          <div
            className="grid grid-cols-3 gap-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark"
            style={{ gridTemplateColumns: '40% 30% 30%' }}
          >
            {/* Header Row */}
            <div className="flex items-center px-4 py-2">
              <p className="font-medium truncate">Họ và Tên</p>
            </div>
            <div className="flex items-center px-4 py-2">
              <p className="font-medium truncate">Số Điện Thoại</p>
            </div>
            <div className="flex items-center px-4 py-2">
              <p className="font-medium truncate">Email</p>
            </div>
          </div>

          {users.map((user) => (
            <div
              className="grid grid-cols-3 gap-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              key={user.id}
              onClick={() => onSelect(user.id, user.fullName)}
              style={{ gridTemplateColumns: '40% 30% 30%' }}
            >
              <div className="flex items-center px-4 py-2">
                <p className="text-sm text-black dark:text-white truncate">
                  {user.fullName || 'N/A'}
                </p>
              </div>
              <div className="flex items-center px-4 py-2">
                <p className="text-sm text-black dark:text-white truncate">
                  {user.phone || 'N/A'}
                </p>
              </div>
              <div className="flex items-center px-4 py-2">
                <p className="text-sm text-black dark:text-white truncate">
                  {user.email || 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerSelectorPopup;
