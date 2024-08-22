import React, { useEffect, useState } from 'react';
import { User } from '../../types/common';
import { useNavigate } from 'react-router-dom';
import { config } from '../../common/config';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/UserStore';

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('fullName');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [sortOrder] = useState<string>('desc');
  const [searchParams, setSearchParams] = useState<{
    query: string;
    filter: string;
  } | null>(null);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);

  const hasRole = (user: User, roleName: string): boolean => {
    return user.roles.some((role) => role.roleName === roleName);
  };

  const isAdmin = user ? hasRole(user, 'ADMIN') : false;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let url = `${config.apiBaseUrl}/users?page=${currentPage}&size=${pageSize}&sort=createdDate,${sortOrder}`;

        if (searchParams) {
          url = `${config.apiBaseUrl}/users/search?${searchParams.filter}=${searchParams.query}&page=${currentPage}&size=${pageSize}&sort=createdDate,${sortOrder}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setUsers(data.content);
        setTotalPages(data.totalPages);
        console.log('Data received:', data);
      } catch (error: any) {
        setError(error.message);
        console.log('Error fetching data:', error);
      }
    };

    fetchUsers();
  }, [currentPage, pageSize, sortOrder, searchParams]);

  const handleRowClick = (userId: number) => {
    navigate(`/user-detail/${userId}`);
  };

  const handleSearch = () => {
    setSearchParams({ query: searchQuery, filter: filterType });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddUser = () => {
    navigate('/add-user');
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 rounded ${
            i === currentPage
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-gray-700'
          }`}
        >
          {i}
        </button>,
      );
    }
    return pageNumbers;
  };

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Danh sách nhân viên
          </h4>

          {/* Search bar and filter dropdown */}
          <div className="flex items-center space-x-4 py-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-stroke rounded-md py-2 px-4 dark:bg-boxdark dark:border-strokedark"
            >
              <option value="fullName">Full Name</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="address">Address</option>
              <option value="nickname">Nickname</option>
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
              Search
            </button>
            {isAdmin && (
              <button
                onClick={handleAddUser}
                className="bg-primary text-white rounded-md py-2 px-4 hover:bg-primary-dark focus:outline-none"
              >
                Add User
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div
            className="grid grid-cols-4 gap-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark"
            style={{ gridTemplateColumns: '30% 20% 30% 20%' }}
          >
            {/* Header Row */}
            <div className="flex items-center px-4 py-2">
              <p className="font-medium truncate">Họ Tên</p>
            </div>
            <div className="flex items-center px-4 py-2">
              <p className="font-medium truncate">SDT</p>
            </div>
            <div className="flex items-center px-4 py-2">
              <p className="font-medium truncate">Email</p>
            </div>
            <div className="flex items-center px-4 py-2">
              <p className="font-medium truncate">Trạng thái</p>
            </div>
          </div>

          {users.map((user) => (
            <div
              className="grid grid-cols-4 gap-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              key={user.id}
              onClick={() => handleRowClick(user.id)}
              style={{ gridTemplateColumns: '30% 20% 30% 20%' }}
            >
              {/* Avatar */}
              <div className="flex items-center px-4 py-2">
                <img
                  src={`${config.apiBaseUrl}/${user.image}`} // Assuming user ID is used to fetch the image
                  alt={user.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <p className="ml-4 text-sm text-black dark:text-white truncate">
                  {user.fullName || 'Thien'}
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
              <div className="flex items-center px-4 py-2">
                <p
                  className={`text-sm truncate ${
                    user.active ? 'text-green-500' : 'text-gray-500'
                  }`}
                >
                  {user.active ? 'Hoạt Động' : 'Vô hiệu hóa'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Numeric Pagination Controls */}
        <div className="py-4 px-4 flex justify-center items-center space-x-2">
          {renderPageNumbers()}
        </div>
      </div>
    </>
  );
};

export default UsersList;
