import React, { useEffect, useState } from 'react';
import { User } from '../../types/common';
import { useNavigate } from 'react-router-dom';
import { config } from '../../common/config';

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('fullName');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [searchParams, setSearchParams] = useState<{
    query: string;
    filter: string;
  } | null>(null); // Store search params
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let url = `${config.apiBaseUrl}/users?page=${currentPage}&size=${pageSize}&sort=createdDate,${sortOrder}`;

        if (searchParams) {
          url = `${config.apiBaseUrl}/users/search?${searchParams.filter}=${searchParams.query}&${currentPage}&size=${pageSize}&sort=createdDate,${sortOrder}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
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
      } catch (error) {
        setError(error.message);
        console.log('Error fetching data:', error);
      }
    };

    fetchUsers();
  }, [currentPage, pageSize, sortOrder, searchParams]); // Depend on searchParams for conditional search

  const handleRowClick = (userId: number) => {
    navigate(`/user-detail/${userId}`);
  };

  const handleSearch = () => {
    setSearchParams({ query: searchQuery, filter: filterType }); // Set search params and trigger search
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle enter key press in the input field
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
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
            {/* Dropdown filter */}
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

            {/* Search bar */}
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border border-stroke rounded-md py-2 px-4 w-64 dark:bg-boxdark dark:border-strokedark"
            />

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="bg-primary text-white rounded-md py-2 px-4 hover:bg-primary-dark focus:outline-none"
            >
              Search
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-7 md:px-6 2xl:px-7.5">
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Họ Tên</p>
          </div>
          <div className="col-span-1 hidden items-center sm:flex">
            <p className="font-medium">SDT</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Email</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Địa chỉ</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Ngày sinh</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Trạng thái</p>
          </div>
        </div>

        {users.map((user) => (
          <div
            className="grid grid-cols-7 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-7 md:px-6 2xl:px-7.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            key={user.id}
            onClick={() => handleRowClick(user.id)}
          >
            <div className="col-span-1 flex items-center truncate">
              <p className="text-sm text-black dark:text-white w-full">
                {user.fullName || 'Thien'}
              </p>
            </div>
            <div className="col-span-1 hidden items-center sm:flex truncate">
              <p className="text-sm text-black dark:text-white w-full">
                {user.phone || 'N/A'}
              </p>
            </div>
            <div className="col-span-1 flex items-center truncate">
              <p className="text-sm text-black dark:text-white w-full">
                {user.email || 'N/A'}
              </p>
            </div>
            <div className="col-span-1 flex items-center truncate">
              <p className="text-sm text-black dark:text-white w-full">
                {user.address || 'N/A'}
              </p>
            </div>
            <div className="col-span-1 flex items-center truncate">
              <p className="text-sm text-black dark:text-white w-full">
                {user.birthday || 'N/A'}
              </p>
            </div>
            <div className="col-span-1 flex items-center truncate">
              <p className="text-sm text-meta-3 w-full">
                {user.active ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        ))}

        {/* Pagination Controls */}
        <div className="py-4 px-4 flex justify-between items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-primary text-white rounded-md py-2 px-4 hover:bg-primary-dark focus:outline-none"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="bg-primary text-white rounded-md py-2 px-4 hover:bg-primary-dark focus:outline-none"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default UsersList;
