import React, { useState, useEffect } from 'react';
import { config } from '../../common/config';
import { StudentCourse } from '../../types/common';
import StudentSelectionPopup from './StudentCourseSelectPopup';
import { FaChevronLeft, FaChevronRight, FaTrashAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StudentPayment from './StudentPayment';

interface StudentListProps {
  courseId: number;
}

const StudentCourseList: React.FC<StudentListProps> = ({ courseId }) => {
  const [students, setStudents] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    studentId?: number;
  }>({ open: false });
  const [selectedStudent, setSelectedStudent] = useState<StudentCourse | null>(
    null,
  );

  const fetchStudents = async (pageNumber: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.apiBaseUrl}/courses/${courseId}/students?page=${pageNumber}&size=10&sort=fullName,asc`,
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
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
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
        toast.success('Xoá thành công');
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

  const handlePayment = (student: StudentCourse) => {
    setSelectedStudent(student);
  };

  const handlePaymentClose = () => {
    setSelectedStudent(null);
    fetchStudents(page); // Refetch the student list when payment modal is closed
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error)
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Danh sách học sinh ({totalElements})
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
              Còn nợ
            </p>
          </div>
          <div className="flex items-center px-4 py-2">
            <p className="font-medium text-black dark:text-white truncate">
              Học phí
            </p>
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
                {student.remainingAmount
                  ? `${student.remainingAmount.toLocaleString()} VND`
                  : '0 VND'}
              </p>
            </div>
            <div className="flex items-center px-4 py-2 truncate">
              {student.isNew && student.remainingAmount === 0 ? (
                <p className="text-sm text-black dark:text-white truncate">
                  Học sinh mới
                </p>
              ) : student.isPaid ? (
                <p className="text-sm text-black dark:text-white">Đã đóng</p>
              ) : (
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                  onClick={() => handlePayment(student)}
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

      <div className="my-4 px-4 flex justify-center items-center space-x-4">
        <button
          className="rounded bg-primary py-2 px-4 text-white hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={handlePreviousPage}
          disabled={page === 1}
        >
          <FaChevronLeft />
        </button>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Trang {page}/{totalPages}
        </p>
        <button
          className="rounded bg-primary py-2 px-4 text-white hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={handleNextPage}
          disabled={page >= totalPages}
        >
          <FaChevronRight />
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

      {/* Student Payment Modal */}
      {selectedStudent && (
        <StudentPayment
          student={selectedStudent}
          courseId={courseId}
          onClose={handlePaymentClose}
        />
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default StudentCourseList;
