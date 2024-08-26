import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { config } from '../../common/config';
import { toast, ToastContainer } from 'react-toastify';
import OwnerSelectorPopup from './OwnerSelectorPopup';

const daysOfWeek = [
  { value: 'MONDAY', label: 'Thứ Hai' },
  { value: 'TUESDAY', label: 'Thứ Ba' },
  { value: 'WEDNESDAY', label: 'Thứ Tư' },
  { value: 'THURSDAY', label: 'Thứ Năm' },
  { value: 'FRIDAY', label: 'Thứ Sáu' },
  { value: 'SATURDAY', label: 'Thứ Bảy' },
  { value: 'SUNDAY', label: 'Chủ Nhật' },
];

const AddCourse: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [studentLimit, setStudentLimit] = useState('');
  const [startDate, setStartDate] = useState('');
  const [schedule, setSchedule] = useState<
    { dayOfWeek: string; start: string; end: string }[]
  >([]);
  const [room, setRoom] = useState('');
  const [owner, setOwner] = useState('');
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [showOwnerPopup, setShowOwnerPopup] = useState(false);

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
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data.content);
        if (categoryId) {
          setSelectedCategory(Number(categoryId));
        }
      } catch (error) {
        toast.error('Failed to fetch categories', {
          autoClose: 1000,
        });
      }
    };

    fetchCategories();
  }, [categoryId]);

  const handleAddSchedule = () => {
    setSchedule([...schedule, { dayOfWeek: '', start: '', end: '' }]);
  };

  const handleScheduleChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[index] = { ...updatedSchedule[index], [field]: value };
    setSchedule(updatedSchedule);
  };

  const handleRemoveSchedule = (index: number) => {
    const updatedSchedule = schedule.filter((_, i) => i !== index);
    setSchedule(updatedSchedule);
  };

  const handleOwnerSelection = (selectedOwner: string) => {
    setOwner(selectedOwner);
    setShowOwnerPopup(false);
  };

  const checkForOverlaps = (
    schedules: { dayOfWeek: string; start: string; end: string }[],
  ) => {
    const groupedSchedules = schedules.reduce(
      (acc, sched) => {
        if (!acc[sched.dayOfWeek]) acc[sched.dayOfWeek] = [];
        acc[sched.dayOfWeek].push({ start: sched.start, end: sched.end });
        return acc;
      },
      {} as Record<string, { start: string; end: string }[]>,
    );

    for (const day in groupedSchedules) {
      const daySchedules = groupedSchedules[day];
      for (let i = 0; i < daySchedules.length; i++) {
        for (let j = i + 1; j < daySchedules.length; j++) {
          const a = daySchedules[i];
          const b = daySchedules[j];
          if (a.start < b.end && b.start < a.end) {
            return true; // Overlap detected
          }
        }
      }
    }
    return false; // No overlaps
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedCategory) {
      toast.error('Please select a category', {
        autoClose: 1000,
      });
      return;
    }

    if (checkForOverlaps(schedule)) {
      toast.error('Schedule times overlap. Please correct the times.', {
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          studentLimit: Number(studentLimit),
          startDate,
          schedule,
          room,
          owner,
          categoryId: selectedCategory,
        }),
      });

      if (response.ok) {
        toast.success('Thêm thành công', {
          autoClose: 500,
        });
        setTimeout(() => {
          navigate('/courses'); // Redirect to course list or another page
        }, 3000);
      } else {
        throw new Error('Failed to add course');
      }
    } catch (error) {
      toast.error('Thêm thất bại', {
        autoClose: 500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-4xl px-4">
        <Breadcrumb pageName="Khóa Học" />

        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="border-b border-stroke pb-4">
            <h1 className="text-xl font-medium text-black dark:text-white">
              Tạo khóa học mới
            </h1>
          </div>

          <div className="pt-4">
            <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="p-7">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Course Name Field */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="name"
                    >
                      Tên khóa học
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {/* Description Field */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="description"
                    >
                      Mô tả
                    </label>
                    <textarea
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>

                  {/* Price, Student Limit, and Room Fields */}
                  <div className="mb-5.5 flex gap-4">
                    <div className="w-1/3">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="price"
                      >
                        Giá
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                    <div className="w-1/3">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="studentLimit"
                      >
                        Giới hạn học viên
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="number"
                        id="studentLimit"
                        value={studentLimit}
                        onChange={(e) => setStudentLimit(e.target.value)}
                      />
                    </div>
                    <div className="w-1/3">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="room"
                      >
                        Phòng học
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        id="room"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Start Date Field */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="startDate"
                    >
                      Ngày bắt đầu
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  {/* Schedule Fields */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="schedule"
                    >
                      Lịch học
                    </label>
                    {schedule.map((item, index) => (
                      <div key={index} className="mb-4 flex gap-4">
                        <div className="w-1/3">
                          <select
                            className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            value={item.dayOfWeek}
                            onChange={(e) =>
                              handleScheduleChange(
                                index,
                                'dayOfWeek',
                                e.target.value,
                              )
                            }
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
                              handleScheduleChange(
                                index,
                                'start',
                                e.target.value,
                              )
                            }
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
                          />
                        </div>
                        <button
                          type="button"
                          className="text-red-600"
                          onClick={() => handleRemoveSchedule(index)}
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600"
                      onClick={handleAddSchedule}
                    >
                      Thêm lịch
                    </button>
                  </div>

                  {/* Category Dropdown */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="category"
                    >
                      Danh mục
                    </label>
                    <select
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      id="category"
                      value={selectedCategory || ''}
                      onChange={(e) =>
                        setSelectedCategory(Number(e.target.value))
                      }
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Owner Field */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="owner"
                    >
                      Chủ sở hữu
                    </label>
                    <div className="flex items-center">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        id="owner"
                        value={owner}
                        readOnly
                      />
                      <button
                        type="button"
                        className="ml-2 rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600"
                        onClick={() => setShowOwnerPopup(true)}
                      >
                        Chọn người dùng
                      </button>
                    </div>
                  </div>

                  {showOwnerPopup && (
                    <OwnerSelectorPopup
                      onSelect={handleOwnerSelection}
                      onClose={() => setShowOwnerPopup(false)}
                    />
                  )}

                  <div className="flex items-center justify-end pt-4">
                    <button
                      type="submit"
                      className={`rounded bg-primary py-2 px-4 text-white hover:bg-primary-dark ${
                        loading ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                      disabled={loading}
                    >
                      {loading ? 'Adding...' : 'Add Course'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AddCourse;
