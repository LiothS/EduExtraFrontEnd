import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { config } from '../../common/config';

interface Student {
  studentId: number;
  studentFullName: string;
  studentCode: string;
  studentPhone: string;
  remainingAmount: number;
}

interface Course {
  courseId: number;
  courseCode: string;
  name: string;
  price: number;
}

interface StudentPaymentProps {
  courseId: number;
  student: Student;
  onClose: () => void; // Callback to close the modal
}

const StudentPayment: React.FC<StudentPaymentProps> = ({
  courseId,
  student,
  onClose,
}) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(
          `${config.apiBaseUrl}/courses/${courseId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.message || 'Failed to fetch course details');
          return;
        }

        const data = await response.json();
        setCourse(data);
        setAmount(student.remainingAmount.toString()); // Default amount to course price
      } catch (err) {
        toast.error('Failed to fetch course details');
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handlePayment = async () => {
    setLoading(true);

    // Validate the amount here
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Chỉ nhập số cho giá trị thanh toán');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/students/payment', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: student.studentId,
          courseId,
          studentName: student.studentFullName,
          amount: numericAmount,
          description,
        }),
      });

      if (response.ok) {
        toast.success('Thu học phí thành công', { autoClose: 500 });
        setTimeout(() => {
          onClose(); // Close the modal on successful payment
        }, 500);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Đã xảy ra lỗi');
      }
    } catch (err) {
      toast.error('Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  // Handler for input change to ensure amount is a valid number
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty string or valid number input
    if (value === '' || !isNaN(parseFloat(value))) {
      setAmount(value);
    }
  };

  return (
    <>
      {course && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          style={{
            height: '100vh', // Ensure it takes up the full height of the viewport
            width: '100vw', // Ensure it takes up the full width of the viewport
            margin: 0, // Reset any margin
            padding: 0, // Reset any padding
            top: 0,
            left: 0,
            zIndex: 99999,
          }}
        >
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={onClose}
          />
          <div className="bg-white shadow-md rounded-lg p-6 relative w-full max-w-4xl">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h1 className="text-2xl font-semibold text-black mb-6">
              Thanh toán học phí
            </h1>

            {/* Course Information */}
            <div className="mb-6">
              <div className="flex mb-4">
                <div className="w-1/3 pr-2">
                  <label
                    className="block text-sm font-medium text-black mb-2"
                    htmlFor="courseCode"
                  >
                    Mã lớp
                  </label>
                  <input
                    type="text"
                    id="courseCode"
                    value={course.courseCode}
                    readOnly
                    className="w-full rounded border border-gray-300 bg-gray-100 py-3 px-4 text-black cursor-not-allowed"
                  />
                </div>
                <div className="w-2/3 pl-2">
                  <label
                    className="block text-sm font-medium text-black mb-2"
                    htmlFor="courseName"
                  >
                    Tên lớp
                  </label>
                  <input
                    type="text"
                    id="courseName"
                    value={course.name}
                    readOnly
                    className="w-full rounded border border-gray-300 bg-gray-100 py-3 px-4 text-black cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Student Information */}
            <div className="mb-6">
              <div className="flex mb-4">
                <div className="w-1/5 pr-2">
                  <label
                    className="block text-sm font-medium text-black mb-2"
                    htmlFor="studentCode"
                  >
                    Mã học viên
                  </label>
                  <input
                    type="text"
                    id="studentCode"
                    value={student.studentCode}
                    readOnly
                    className="w-full rounded border border-gray-300 bg-gray-100 py-3 px-4 text-black cursor-not-allowed"
                  />
                </div>
                <div className="w-2/5 px-2">
                  <label
                    className="block text-sm font-medium text-black mb-2"
                    htmlFor="studentName"
                  >
                    Tên học viên
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    value={student.studentFullName}
                    readOnly
                    className="w-full rounded border border-gray-300 bg-gray-100 py-3 px-4 text-black cursor-not-allowed"
                  />
                </div>
                <div className="w-2/5 pl-2">
                  <label
                    className="block text-sm font-medium text-black mb-2"
                    htmlFor="studentPhone"
                  >
                    SDT
                  </label>
                  <input
                    type="text"
                    id="studentPhone"
                    value={student.studentPhone}
                    readOnly
                    className="w-full rounded border border-gray-300 bg-gray-100 py-3 px-4 text-black cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="mb-6">
              <div className="flex mb-4">
                <div className="w-1/2 pr-2">
                  <label
                    className="block text-sm font-medium text-black mb-2"
                    htmlFor="coursePrice"
                  >
                    Học phí
                  </label>
                  <input
                    type="text"
                    id="coursePrice"
                    value={`${student.remainingAmount.toLocaleString()} VND`}
                    readOnly
                    className="w-full rounded border border-gray-300 bg-gray-100 py-3 px-4 text-black cursor-not-allowed"
                  />
                </div>
                <div className="w-1/2 pl-2">
                  <label
                    className="block text-sm font-medium text-black mb-2"
                    htmlFor="paymentAmount"
                  >
                    Thanh toán
                  </label>
                  <input
                    type="text"
                    id="paymentAmount"
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full rounded border border-gray-300 bg-white py-3 px-4 text-black focus:border-primary focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description Field */}
            <div className="mb-6">
              <label
                className="block text-sm font-medium text-black mb-2"
                htmlFor="description"
              >
                Mô tả
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white py-3 px-4 text-black focus:border-primary focus:outline-none"
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end">
              <button
                type="submit"
                className={`rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:outline-none ${
                  loading ? 'cursor-not-allowed opacity-50' : ''
                }`}
                disabled={loading}
                onClick={handlePayment}
              >
                {loading ? 'Đang xử lý...' : 'Xử lý thanh toán'}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default StudentPayment;
