import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../../common/config';
import { Course, Category } from '../../types/common';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CoursePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/categories`, {
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
        setCategories(data.content);
      } catch (error: any) {
        console.error('Error fetching categories:', error.message);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Build the URL based on whether a category is selected
        const categoryParam =
          selectedCategory !== null ? `category/${selectedCategory}` : '';
        const response = await fetch(
          `${config.apiBaseUrl}/courses${
            categoryParam ? `/${categoryParam}` : ''
          }?page=${currentPage}&size=${pageSize}&sort=createdDate,desc`,
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
  }, [currentPage, pageSize, selectedCategory]);

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

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const categoryId = event.target.value ? Number(event.target.value) : null;
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to the first page when changing categories
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Danh sách khoá học
        </h4>
        <div className="py-4">
          <label htmlFor="category" className="mr-2 text-black dark:text-white">
            Phân loại:
          </label>
          <select
            id="category"
            value={selectedCategory !== null ? selectedCategory : ''}
            onChange={handleCategoryChange}
            className="border border-stroke rounded-md py-2 px-4 dark:bg-boxdark dark:border-strokedark"
          >
            <option value="">Tất cả</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
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
