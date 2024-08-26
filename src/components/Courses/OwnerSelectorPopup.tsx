import React, { useState, useEffect } from 'react';
import { config } from '../../common/config';

interface OwnerSelectorPopupProps {
  onSelect: (owner: string) => void;
  onClose: () => void;
}

const OwnerSelectorPopup: React.FC<OwnerSelectorPopupProps> = ({
  onSelect,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('phone');
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${config.apiBaseUrl}/users/search?${filter}=${searchQuery}`,
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
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchUsers();
    }
  }, [searchQuery, filter]);

  // Inline styles for dynamic width and height
  const popupStyle = {
    width: window.innerWidth < 1000 ? '100%' : '1000px',
    height: window.innerHeight < 500 ? '100%' : '500px',
    maxWidth: '100%',
    maxHeight: '100%',
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
      <div className="bg-white rounded-lg shadow-lg p-4" style={popupStyle}>
        <h2 className="text-xl font-bold mb-4">Chọn Chủ Sở Hữu</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border rounded p-2"
          />
          <select
            className="w-full border rounded p-2 mt-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="phone">Số điện thoại</option>
            <option value="email">Email</option>
            <option value="name">Tên</option>
          </select>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className="flex justify-between items-center p-2 border-b"
            >
              {user.name}
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={() => onSelect(user.name)}
              >
                Chọn
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerSelectorPopup;
