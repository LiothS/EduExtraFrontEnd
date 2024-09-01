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
  const [searchKeyword, setSearchKeyword] = useState<string>('');
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

  const fetchCourses = async () => {
    try {
      let url = `${config.apiBaseUrl}/courses?page=${currentPage}&size=${pageSize}&sort=createdDate,desc`;

      if (searchKeyword) {
        url = `${config.apiBaseUrl}/courses/search?keyword=${encodeURIComponent(
          searchKeyword,
        )}&page=${currentPage}&size=${pageSize}&sort=createdDate,desc`;
      } else if (selectedCategory !== null) {
        url = `${config.apiBaseUrl}/courses/category/${selectedCategory}?page=${currentPage}&size=${pageSize}&sort=createdDate,desc`;
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
      setCourses(data.content);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      console.error('Error fetching courses:', error.message);
    }
  };

  useEffect(() => {
    fetchCourses(); // Fetch courses when page or filters change
  }, [currentPage, selectedCategory, searchKeyword]);

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to the first page when searching
    fetchCourses();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddCourse = () => {
    navigate('/course-add');
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Danh sách khóa học
        </h4>
        <div className="py-4 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <label htmlFor="category" className="text-black dark:text-white">
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

          <div className="flex items-center space-x-4 py-4">
            <input
              type="text"
              placeholder="Tìm theo Tên hoặc Mã lớp..."
              value={searchKeyword}
              onChange={handleSearchChange}
              onKeyDown={handleKeyPress}
              className="border border-stroke rounded-md py-2 px-4 dark:bg-boxdark dark:border-strokedark flex-1"
              style={{ minWidth: '300px' }}
            />
            <button
              onClick={handleSearch}
              className="rounded bg-primary py-2 px-4 text-white hover:bg-primary-dark"
            >
              Tìm
            </button>
            <button
              onClick={handleAddCourse}
              className="rounded bg-primary py-2 px-4 text-white hover:bg-primary-dark"
            >
              Thêm lớp
            </button>
          </div>
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
          Trang {currentPage}/{totalPages}
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
