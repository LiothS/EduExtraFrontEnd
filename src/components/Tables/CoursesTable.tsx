import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../../common/config';
import { Course } from '../../types/common';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CoursePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${config.apiBaseUrl}/courses?page=${currentPage}&size=${pageSize}&sort=createdDate,desc`,
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
        setCourses(data.content);
        setTotalPages(data.totalPages);
      } catch (error: any) {
        console.error('Error fetching courses:', error.message);
      }
    };

    fetchCourses();
  }, [currentPage, pageSize]);

  const handleRowClick = (courseId: number) => {
    navigate(`/course-detail/${courseId}`);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Danh sách khoá học
        </h4>
      </div>

      <div className="overflow-x-auto">
        <div
          className="grid grid-cols-5 gap-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark"
          style={{ gridTemplateColumns: '25% 15% 20% 15% 25%' }}
        >
          {/* Header Row */}
          <div className="flex items-center px-4 py-2">
            <p className="font-medium truncate">Tên Khóa Học</p>
          </div>
          <div className="flex items-center px-4 py-2">
            <p className="font-medium truncate">Mã Khóa Học</p>
          </div>
          <div className="flex items-center px-4 py-2">
            <p className="font-medium truncate">Danh Mục</p>
          </div>
          <div className="flex items-center px-4 py-2">
            <p className="font-medium truncate">Giá</p>
          </div>
          <div className="flex items-center px-4 py-2">
            <p className="font-medium truncate">Giảng Viên</p>
          </div>
        </div>

        {courses.map((course) => (
          <div
            className="grid grid-cols-5 gap-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            key={course.id}
            onClick={() => handleRowClick(course.id)}
            style={{ gridTemplateColumns: '25% 15% 20% 15% 25%' }}
          >
            <div className="flex items-center px-4 py-2">
              <p className="text-sm text-black dark:text-white truncate">
                {course.name}
              </p>
            </div>
            <div className="flex items-center px-4 py-2">
              <p className="text-sm text-black dark:text-white truncate">
                {course.courseCode}
              </p>
            </div>
            <div className="flex items-center px-4 py-2">
              <p className="text-sm text-black dark:text-white truncate">
                {course.categoryName}
              </p>
            </div>
            <div className="flex items-center px-4 py-2">
              <p className="text-sm text-black dark:text-white truncate">
                {course.price.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </p>
            </div>
            <div className="flex items-center px-4 py-2">
              <p className="text-sm text-black dark:text-white truncate">
                {course.owner}
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
          className="rounded bg-primary py-2 px-4 text-white hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <FaChevronLeft />
        </button>
        <span className="font-medium truncate">
          Trang {currentPage} trên {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="rounded bg-primary py-2 px-4 text-white hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default CoursePage;
