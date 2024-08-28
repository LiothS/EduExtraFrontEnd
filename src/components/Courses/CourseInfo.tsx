import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/UserStore'; // Adjust this path as needed
import { Course, User } from '../../types/common';
import { config } from '../../common/config'; // Adjust this path as needed
import { ToastContainer, toast } from 'react-toastify';
import OwnerSelectorPopup from './OwnerSelectorPopup'; // Import the popup component

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

const daysOfWeek = [
  { value: 'MONDAY', label: 'Thứ Hai' },
  { value: 'TUESDAY', label: 'Thứ Ba' },
  { value: 'WEDNESDAY', label: 'Thứ Tư' },
  { value: 'THURSDAY', label: 'Thứ Năm' },
  { value: 'FRIDAY', label: 'Thứ Sáu' },
  { value: 'SATURDAY', label: 'Thứ Bảy' },
  { value: 'SUNDAY', label: 'Chủ Nhật' },
];

const CourseInfo: React.FC<CourseInfoProps> = ({ courseId }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<
    { dayOfWeek: string; start: string; end: string }[]
  >([]);
  const [showOwnerPopup, setShowOwnerPopup] = useState<boolean>(false);
  const [selectedOwner, setSelectedOwner] = useState<{
    userId: number;
    fullName: string;
  } | null>(null);

  const globalUser = useSelector((state: RootState) => state.user.user);
  const isAdmin =
    globalUser && globalUser.roles.some((role) => role.roleName === 'ADMIN');

  const apiEndpoint = `${config.apiBaseUrl}/courses/${courseId}`;
  const token = sessionStorage.getItem('token');

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
        setSchedule(data.schedule || []);
        setSelectedOwner({ userId: data.userId, fullName: data.owner });
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [apiEndpoint, token]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (course) {
      const { id, value } = e.target;
      const newValue =
        id === 'price' ? parseFloat(value.replace(/\D/g, '')) || 0 : value;
      setCourse({ ...course, [id]: newValue });
    }
  };

  const handleScheduleChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    setSchedule((prevSchedule) =>
      prevSchedule.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleAddSchedule = () => {
    setSchedule((prevSchedule) => [
      ...prevSchedule,
      { dayOfWeek: '', start: '', end: '' },
    ]);
  };

  const handleRemoveSchedule = (index: number) => {
    setSchedule((prevSchedule) => prevSchedule.filter((_, i) => i !== index));
  };

  const validateSchedule = () => {
    const errors: string[] = [];
    const timeRangeStart = new Date('1970-01-01T07:00:00');
    const timeRangeEnd = new Date('1970-01-01T22:00:00');

    // Check if end time is after start time for each schedule
    schedule.forEach((item) => {
      const start = new Date(`1970-01-01T${item.start}:00`);
      const end = new Date(`1970-01-01T${item.end}:00`);

      // Check for start and end time within allowed range
      if (start < timeRangeStart || end > timeRangeEnd) {
        errors.push(
          `Giờ học phải trong khoảng từ 07:00 đến 22:00 vào ngày ${
            dayOfWeekMap[item.dayOfWeek]
          }`,
        );
      }

      if (start >= end) {
        errors.push(
          `Thời gian kết thúc phải sau thời gian bắt đầu vào ngày ${
            dayOfWeekMap[item.dayOfWeek]
          }`,
        );
      }
    });

    // Check for overlapping schedules
    const scheduleByDay = schedule.reduce(
      (acc, item) => {
        if (!acc[item.dayOfWeek]) {
          acc[item.dayOfWeek] = [];
        }
        acc[item.dayOfWeek].push({ start: item.start, end: item.end });
        return acc;
      },
      {} as { [key: string]: { start: string; end: string }[] },
    );

    Object.keys(scheduleByDay).forEach((day) => {
      const times = scheduleByDay[day];
      times.sort((a, b) => a.start.localeCompare(b.start)); // Sort by start time

      for (let i = 0; i < times.length - 1; i++) {
        const currentEnd = new Date(`1970-01-01T${times[i].end}:00`);
        const nextStart = new Date(`1970-01-01T${times[i + 1].start}:00`);
        if (currentEnd > nextStart) {
          errors.push(`Lịch học vào ngày ${dayOfWeekMap[day]} bị trùng lặp.`);
        }
      }
    });

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error, { autoClose: 5000 }));
      return false;
    }
    return true;
  };

  // const checkForOverlaps = (
  //   schedules: { dayOfWeek: string; start: string; end: string }[],
  // ) => {
  //   const groupedSchedules = schedules.reduce(
  //     (acc, sched) => {
  //       if (!acc[sched.dayOfWeek]) acc[sched.dayOfWeek] = [];
  //       acc[sched.dayOfWeek].push({ start: sched.start, end: sched.end });
  //       return acc;
  //     },
  //     {} as Record<string, { start: string; end: string }[]>,
  //   );

  //   for (const day in groupedSchedules) {
  //     const daySchedules = groupedSchedules[day];
  //     for (let i = 0; i < daySchedules.length; i++) {
  //       for (let j = i + 1; j < daySchedules.length; j++) {
  //         const a = daySchedules[i];
  //         const b = daySchedules[j];
  //         if (a.start < b.end && b.start < a.end) {
  //           return true; // Overlap detected
  //         }
  //       }
  //     }
  //   }
  //   return false; // No overlaps
  // };

  const handleSave = async () => {
    if (!course) {
      toast.error('Không có gì để lưu');
      return;
    }

    if (!validateSchedule()) {
      return; // Exit if validation fails
    }
    // if (checkForOverlaps(schedule)) {
    //   toast.error('Thời gian bị trùng', {
    //     autoClose: 5000,
    //   });
    //   return;
    // }
    try {
      const response = await fetch(apiEndpoint, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...course,
          schedule: schedule,
          userId: selectedOwner?.userId, // Send the selected owner's userId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Display the error message from the response
        toast.error(errorData.message || 'An unknown error occurred');
        return;
      }

      const updatedCourse: Course = await response.json();
      setCourse(updatedCourse);
      toast.success('Lưu thành công');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
    }
  };

  const handleOwnerSelect = (userId: number, fullName: string) => {
    setSelectedOwner({ userId, fullName });
    setShowOwnerPopup(false); // Close the popup
  };

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
    new Date(date).toLocaleDateString('vi-VN');

  return (
    <div className="mx-auto max-w-4xl px-4">
      <div className="pt-1">
        <div className="p-2">
          <form className="space-y-6">
            {/* Course Code, Category, and Name Fields */}
            <div className="flex space-x-4">
              <div className="flex-[2]">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="courseCode"
                >
                  Mã Lớp
                </label>
                <input
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  type="text"
                  id="courseCode"
                  value={course.courseCode}
                  onChange={handleInputChange} // Added onChange handler
                  readOnly={true}
                />
              </div>

              <div className="flex-[3] overflow-x-auto">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="category"
                >
                  Danh Mục
                </label>
                <input
                  className="w-full min-w-[300px] rounded border border-stroke bg-gray py-3 px-4.5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  type="text"
                  id="category"
                  value={course.categoryName}
                  onChange={handleInputChange} // Added onChange handler
                  readOnly={true}
                />
              </div>

              <div className="flex-[5] overflow-x-auto">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="name"
                >
                  Tên Lớp Học
                </label>
                <input
                  className="w-full min-w-[300px] rounded border border-stroke bg-gray py-3 px-4.5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  type="text"
                  id="name"
                  value={course.name}
                  onChange={handleInputChange} // Added onChange handler
                  readOnly={!isAdmin}
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
                onChange={handleInputChange} // Added onChange handler
                rows={4}
                readOnly={!isAdmin}
              />
            </div>

            {/* Price, Start Date, Room, and Owner Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="price"
                >
                  Giá
                </label>
                <input
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  type="text"
                  id="price"
                  value={formatPrice(course.price)}
                  onChange={handleInputChange} // Added onChange handler
                  readOnly={!isAdmin}
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
                  onChange={handleInputChange} // Added onChange handler
                  readOnly={!isAdmin}
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
                  onChange={handleInputChange} // Added onChange handler
                  readOnly={!isAdmin}
                />
              </div>

              <div>
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="owner"
                >
                  Giảng Viên
                </label>
                <input
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  type="text"
                  id="owner"
                  value={selectedOwner?.fullName || 'Chọn người'}
                  onClick={() => setShowOwnerPopup(true)} // Show popup on click
                  readOnly
                />
              </div>
            </div>

            {/* Schedule Field */}
            <div className="mb-5.5">
              <label
                className="mb-3 block text-sm font-medium text-black dark:text-white"
                htmlFor="schedule"
              >
                Lịch học
              </label>
              {schedule.map((item, index) => (
                <div key={index} className="mb-4 flex gap-4 items-center">
                  <div className="w-1/3">
                    <select
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      value={item.dayOfWeek}
                      onChange={(e) =>
                        handleScheduleChange(index, 'dayOfWeek', e.target.value)
                      }
                      disabled={!isAdmin}
                    >
                      <option value="">Chọn ngày trong tuần</option>
                      {daysOfWeek.map((day) => (
                        <option key={day.value} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-1/3">
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="time"
                      placeholder="Giờ bắt đầu"
                      value={item.start}
                      onChange={(e) =>
                        handleScheduleChange(index, 'start', e.target.value)
                      }
                      disabled={!isAdmin}
                    />
                  </div>
                  <div className="w-1/3">
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="time"
                      placeholder="Giờ kết thúc"
                      value={item.end}
                      onChange={(e) =>
                        handleScheduleChange(index, 'end', e.target.value)
                      }
                      disabled={!isAdmin}
                    />
                  </div>
                  {isAdmin && (
                    <button
                      type="button"
                      className="text-red-600 ml-2"
                      onClick={() => handleRemoveSchedule(index)}
                    >
                      Xóa
                    </button>
                  )}
                </div>
              ))}
              {isAdmin && (
                <button
                  type="button"
                  className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600"
                  onClick={handleAddSchedule}
                >
                  Thêm lịch
                </button>
              )}
            </div>

            {/* Save Button */}
            {isAdmin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600"
                  onClick={handleSave}
                >
                  Lưu
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Show Owner Selector Popup */}
      {showOwnerPopup && (
        <OwnerSelectorPopup
          onSelect={handleOwnerSelect}
          onClose={() => setShowOwnerPopup(false)}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default CourseInfo;
