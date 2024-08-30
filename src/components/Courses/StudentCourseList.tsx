import React, { useEffect, useState } from 'react';
import { config } from '../../common/config';
import { StudentCourse } from '../../types/common';
import StudentSelectionPopup from './StudentCourseSelectPopup';
import { FaTrashAlt } from 'react-icons/fa'; // Import delete icon
import { ToastContainer, toast } from 'react-toastify'; // Import toast components
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS

interface StudentListProps {
  courseId: number;
}

const StudentCourseList: React.FC<StudentListProps> = ({ courseId }) => {
  const [students, setStudents] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    studentId?: number;
  }>({ open: false });

  const fetchStudents = async (pageNumber: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.apiBaseUrl}/courses/${courseId}/students?page=${pageNumber}&size=20&sort=fullName,asc`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data.content);
      setTotalPages(data.totalPages || 1); // Ensure totalPages is correctly set
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(page);
  }, [page, courseId]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handlePopupClose = () => {
    setIsPopupVisible(false);
    fetchStudents(page); // Refetch students when popup is closed
  };

  const handleStudentSelect = (studentId: number, fullName: string) => {
    console.log(`Student selected: ID ${studentId}, Name ${fullName}`);
    // Implement your logic here for the selected student
    handlePopupClose(); // Close popup after selection
  };

  const handleDelete = async () => {
    if (confirmDelete.studentId) {
      try {
        const response = await fetch(
          `${config.apiBaseUrl}/students/remove-from-course`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              courseId,
              studentId: confirmDelete.studentId,
            }),
          },
        );

        if (!response.ok) throw new Error('Failed to delete student');
        await response.json();
        fetchStudents(page); // Refresh the student list
        toast.success('Xoá thành công'); // Show success toast
        setConfirmDelete({ open: false });
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  const handleConfirmDelete = (studentId: number) => {
    setConfirmDelete({ open: true, studentId });
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ open: false });
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error)
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  function handlePayment(studentId: number): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Danh sách học sinh
        </h4>
      </div>

      <div className="overflow-x-auto">
        <div
          className="grid grid-cols-6 gap-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark"
          style={{ gridTemplateColumns: '15% 20% 20% 20% 15% 10%' }}
        >
          {/* Header Row */}
          <div className="flex items-center px-4 py-2">
            <p className="font-medium text-black dark:text-white truncate">
              Mã học sinh
            </p>
          </div>
          <div className="flex items-center px-4 py-2">
            <p className="font-medium text-black dark:text-white truncate">
              Họ Tên
            </p>
          </div>
          <div className="flex items-center px-4 py-2">
            <p className="font-medium text-black dark:text-white truncate">
              SDT
            </p>
          </div>
          <div className="flex items-center px-4 py-2">
            <p className="font-medium text-black dark:text-white truncate">
              Học Phí
            </p>
          </div>
          <div className="flex items-center px-4 py-2">
            <p className="font-medium text-black dark:text-white truncate">
              Học phí
            </p>
          </div>
          <div className="flex items-center px-4 py-2">
            <p className="font-medium text-black dark:text-white truncate"></p>
          </div>
        </div>

        {students.map((student) => (
          <div
            className="grid grid-cols-6 gap-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark"
            key={student.studentId}
            style={{ gridTemplateColumns: '15% 20% 20% 20% 15% 10%' }}
          >
            <div className="flex items-center px-4 py-2 truncate">
              <p className="text-sm text-black dark:text-white truncate">
                {student.studentCode}
              </p>
            </div>
            <div className="flex items-center px-4 py-2 truncate">
              <p className="text-sm text-black dark:text-white truncate">
                {student.studentFullName}
              </p>
            </div>
            <div className="flex items-center px-4 py-2 truncate">
              <p className="text-sm text-black dark:text-white truncate">
                {student.studentPhone || 'N/A'}
              </p>
            </div>
            <div className="flex items-center px-4 py-2 truncate">
              <p className="text-sm text-black dark:text-white truncate">
                {student.isPaid ? 'Đã đóng' : 'Chưa đóng'}
              </p>
            </div>
            <div className="flex items-center px-4 py-2">
              {student.isPaid ? (
                <p className="text-sm text-black dark:text-white">Đã thu</p>
              ) : (
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                  onClick={() => handlePayment(student.studentId)}
                >
                  Thu
                </button>
              )}
            </div>
            <div className="flex items-center px-4 py-2">
              <button
                className="bg-red-500 text-white p-2 rounded-md"
                onClick={() => handleConfirmDelete(student.studentId)}
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center my-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 disabled:bg-gray-400"
          onClick={handlePreviousPage}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2 disabled:bg-gray-400"
          onClick={handleNextPage}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>

      {/* Floating Button */}
      <button
        className="fixed bottom-4 right-4 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary-dark focus:outline-none"
        onClick={() => setIsPopupVisible(true)}
      >
        + Thêm học viên
      </button>

      {isPopupVisible && (
        <StudentSelectionPopup
          onSelect={handleStudentSelect}
          onClose={handlePopupClose}
          currentCourseId={courseId || 0}
        />
      )}

      {/* Confirmation Dialog */}
      {confirmDelete.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-6 rounded-lg border border-gray-300">
            <h3 className="text-lg font-semibold mb-4">
              Xoá học sinh khỏi lớp
            </h3>
            <p className="mb-4">
              Bạn có chắc chắn muốn xoá học sinh này khỏi lớp không?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={handleDelete}
              >
                Có
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded-md"
                onClick={handleCancelDelete}
              >
                Không
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default StudentCourseList;
