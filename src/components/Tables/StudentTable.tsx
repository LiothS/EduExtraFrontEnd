import React, { useEffect, useState } from 'react';
import { Student, User } from '../../types/common'; // Ensure this type is defined in your types
import { useNavigate } from 'react-router-dom';
import { config } from '../../common/config';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/UserStore'; // Adjust if necessary

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
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
    const fetchStudents = async () => {
      try {
        // Construct URL with selected filter and search query
        let url = `${config.apiBaseUrl}/students/filter?page=${currentPage}&size=${pageSize}&sort=createdDate,${sortOrder}`;
        if (searchParams) {
          url += `&${searchParams.filter}=${searchParams.query}`;
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
        setStudents(data.content);
        setTotalPages(data.totalPages);
        console.log('Data received:', data);
      } catch (error: any) {
        setError(error.message);
        console.log('Error fetching data:', error);
      }
    };

    fetchStudents();
  }, [currentPage, pageSize, sortOrder, searchParams]);

  const handleRowClick = (studentId: number) => {
    navigate(`/student-detail/${studentId}`);
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

  const handleAddStudent = () => {
    navigate('/add-student');
  };

  // Pagination control handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Danh sách học viên
          </h4>

          {/* Search bar and filter dropdown */}
          <div className="flex items-center space-x-4 py-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-stroke rounded-md py-2 px-4 dark:bg-boxdark dark:border-strokedark"
            >
              <option value="fullName">Họ tên</option>
              <option value="code">Mã học viên</option>
              <option value="email">Email</option>
              <option value="phone">Số điện thoại</option>
              <option value="address">Địa chỉ</option>
              {/* <option value="nickname">Tên rút gọn</option> */}
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
            {isAdmin && (
              <button
                onClick={handleAddStudent}
                className="bg-primary text-white rounded-md py-2 px-4 hover:bg-primary-dark focus:outline-none"
              >
                Thêm học viên
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div
            className="grid grid-cols-5 gap-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark"
            style={{ gridTemplateColumns: '15% 20% 20% 20% 25%' }}
          >
            {/* Header Row */}
            <div className="flex items-center px-4 py-2">
              <p className="font-medium truncate">Mã học viên</p>
            </div>
            <div className="flex items-center px-4 py-2">
              <p className="font-medium truncate">Họ Tên</p>
            </div>
            <div className="flex items-center px-4 py-2">
              <p className="font-medium truncate">Số Điện Thoại</p>
            </div>
            <div className="flex items-center px-4 py-2">
              <p className="font-medium truncate">Email</p>
            </div>
            <div className="flex items-center px-4 py-2">
              <p className="font-medium truncate">Địa chỉ</p>
            </div>
          </div>

          {students.map((student) => (
            <div
              className="grid grid-cols-5 gap-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              key={student.id}
              onClick={() => handleRowClick(student.id)}
              style={{ gridTemplateColumns: '15% 20% 20% 20% 25%' }}
            >
              {/* Student Details */}
              <div className="flex items-center px-4 py-2">
                <p className="text-sm text-black dark:text-white truncate">
                  {student.code}
                </p>
              </div>
              <div className="flex items-center px-4 py-2">
                <p className="text-sm text-black dark:text-white truncate">
                  {student.fullName || ''}
                </p>
              </div>
              <div className="flex items-center px-4 py-2">
                <p className="text-sm text-black dark:text-white truncate">
                  {student.phone || 'N/A'}
                </p>
              </div>
              <div className="flex items-center px-4 py-2">
                <p className="text-sm text-black dark:text-white truncate">
                  {student.email || 'N/A'}
                </p>
              </div>
              <div className="flex items-center px-4 py-2">
                <p className="text-sm text-black dark:text-white truncate">
                  {student.address || 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="py-4 px-4 flex justify-center items-center space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="bg-primary text-white rounded-md py-2 px-4 hover:bg-primary-dark focus:outline-none disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-primary text-white rounded-md py-2 px-4 hover:bg-primary-dark focus:outline-none disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default StudentList;
