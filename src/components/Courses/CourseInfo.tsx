import React, { useState, useEffect } from 'react';
import { Course } from '../../types/common';
import { config } from '../../common/config'; // Adjust this path as needed
import { ToastContainer, toast } from 'react-toastify';

interface CourseInfoProps {
  courseId: number;
}
const dayOfWeekMap: { [key: string]: string } = {
  MONDAY: 'Thứ Hai',
  TUESDAY: 'Thứ Ba',
  WEDNESDAY: 'Thứ Tư',
  THURSDAY: 'Thứ Năm',
  FRIDAY: 'Thứ Sáu',
  SATURDAY: 'Thứ Bảy',
  SUNDAY: 'Chủ Nhật',
};
const CourseInfo: React.FC<CourseInfoProps> = ({ courseId }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiEndpoint = `${config.apiBaseUrl}/courses/${courseId}`; // Adjust API endpoint
  const token = sessionStorage.getItem('token'); // Adjust token if needed

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(apiEndpoint, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data: Course = await response.json();
        setCourse(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, []);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  if (!course) {
    return <div>Không có dữ liệu khóa học</div>;
  }

  const formatPrice = (price: number) =>
    price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('vi-VN'); // Format to Vietnamese locale

  return (
    <div className="mx-auto max-w-4xl px-4">
      <div className="">
        <div className="pt-1">
          <div>
            <div className="p-2">
              <form className="space-y-6">
                {/* Course Code and Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="courseCode"
                    >
                      Mã Lớp
                    </label>
                    <input
                      className="w-full max-w-xs rounded border border-stroke bg-gray py-3 px-4.5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      type="text"
                      id="courseCode"
                      value={course.courseCode}
                      readOnly
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="name"
                    >
                      Tên Lớp Học
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      type="text"
                      id="name"
                      value={course.name}
                      readOnly
                    />
                  </div>
                </div>

                {/* Mô Tả Field */}
                <div className="w-full">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="description"
                  >
                    Mô Tả
                  </label>
                  <textarea
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    id="description"
                    value={course.description}
                    readOnly
                    rows={4}
                  />
                </div>

                {/* Price and Start Date Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="price"
                    >
                      Học Phí
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      type="text"
                      id="price"
                      value={formatPrice(course.price)}
                      readOnly
                    />
                  </div>

                  <div>
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="startDate"
                    >
                      Ngày Bắt Đầu
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      type="text"
                      id="startDate"
                      value={formatDate(course.startDate)}
                      readOnly
                    />
                  </div>
                </div>

                {/* Room and Owner Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="room"
                    >
                      Phòng
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      type="text"
                      id="room"
                      value={course.room}
                      readOnly
                    />
                  </div>

                  <div>
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="owner"
                    >
                      Người Đăng Ký
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      type="text"
                      id="owner"
                      value={course.owner}
                      readOnly
                    />
                  </div>
                </div>

                {/* Category Field */}
                <div className="w-full sm:w-1/2">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="category"
                  >
                    Danh Mục
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    type="text"
                    id="category"
                    value={course.categoryName}
                    readOnly
                  />
                </div>

                {/* Active Field */}
                <div className="w-full sm:w-1/2">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="active"
                  >
                    Đang Kích Hoạt
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    type="text"
                    id="active"
                    value={course.active ? 'Có' : 'Không'}
                    readOnly
                  />
                </div>

                {/* Schedule Field */}
                <div className="w-full">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="schedule"
                  >
                    Lịch Học
                  </label>
                  <ul className="list-disc pl-5">
                    {course.schedule.map((slot, index) => (
                      <li
                        key={index}
                        className="text-sm font-medium text-black dark:text-white"
                      >
                        <strong>
                          {dayOfWeekMap[slot.dayOfWeek] || slot.dayOfWeek}:
                        </strong>{' '}
                        {slot.start} - {slot.end}
                      </li>
                    ))}
                  </ul>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CourseInfo;
