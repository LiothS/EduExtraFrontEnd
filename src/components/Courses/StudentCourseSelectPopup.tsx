import React, { useState, useEffect, useRef } from 'react';
import { config } from '../../common/config';
import { Student } from '../../types/common';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface StudentSelectionPopupProps {
  onSelect: (studentId: number, fullName: string) => void;
  onClose: () => void;
  currentCourseId: number;
}

const StudentSelectionPopup: React.FC<StudentSelectionPopupProps> = ({
  onSelect,
  onClose,
  currentCourseId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('fullName');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedStudents, setAddedStudents] = useState<Set<number>>(new Set());
  const popupRef = useRef<HTMLDivElement>(null);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/students/filter-exclude/${currentCourseId}?page=1&size=10&sort=createdDate,desc&${filterType}=${searchQuery}`,
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
      setStudents(data.content);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const popupStyle = {
    width: window.innerWidth < 1000 ? '100%' : '1000px',
    height: window.innerHeight < 500 ? '100%' : '500px',
    maxWidth: '100%',
    maxHeight: '100%',
  };

  const handleSearch = () => {
    if (searchQuery) {
      fetchStudents();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddStudent = async (studentId: number) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/students/assign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: currentCourseId,
          studentId,
        }),
      });

      if (response.ok) {
        toast.success('Thêm thành công');
        setAddedStudents((prev) => new Set(prev).add(studentId));
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'An unknown error occurred');
      }
    } catch (error) {
      toast.error('An error occurred while adding the student');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      style={{
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        top: 0,
        left: 0,
        zIndex: 99999,
      }}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-4 overflow-y-auto"
        style={popupStyle}
        ref={popupRef}
      >
        <h2 className="text-xl font-bold mb-4">Chọn học viên</h2>
        <div className="flex items-center mb-4 space-x-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-stroke rounded-md py-2 px-4 dark:bg-boxdark dark:border-strokedark"
          >
            <option value="fullName">Họ tên</option>
            <option value="code">Mã học sinh</option>
            <option value="email">Email</option>
            <option value="phone">Số điện thoại</option>
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
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        <div className="overflow-x-auto">
          <div
            className="grid grid-cols-4 gap-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark"
            style={{ gridTemplateColumns: '25% 25% 25% 25%' }}
          >
            <div className="flex items-center px-4 py-2">
              <p className="font-medium truncate">Mã học viên</p>
            </div>
            <div className="flex items-center px-4 py-2">
              <p className="font-medium truncate">Tên</p>
            </div>
            <div className="flex items-center px-4 py-2">
              <p className="font-medium truncate">Số điện thoại</p>
            </div>
            <div className="flex items-center px-4 py-2">
              <p className="font-medium truncate">Thao tác</p>
            </div>
          </div>

          {students.map((student) => (
            <div
              className="grid grid-cols-4 gap-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              key={student.id}
              style={{ gridTemplateColumns: '25% 25% 25% 25%' }}
            >
              <div className="flex items-center px-4 py-2">
                <p className="text-sm text-black dark:text-white truncate">
                  {student.code || 'N/A'}
                </p>
              </div>
              <div className="flex items-center px-4 py-2">
                <p className="text-sm text-black dark:text-white truncate">
                  {student.fullName || 'N/A'}
                </p>
              </div>
              <div className="flex items-center px-4 py-2">
                <p className="text-sm text-black dark:text-white truncate">
                  {student.phone || 'N/A'}
                </p>
              </div>
              <div className="flex items-center px-4 py-2">
                {addedStudents.has(student.id) ? (
                  <p className="text-green-500">Đã thêm</p>
                ) : (
                  <button
                    onClick={() => handleAddStudent(student.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Thêm
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default StudentSelectionPopup;
