import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { config } from '../../common/config'; // Adjust the import path as needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Student {
  id: number;
  code: string;
  fullName: string;
  email: string;
  phone: string;
  relativePhone: string;
  address: string;
  nickname: string;
  birthday: string;
  active: boolean;
  joinTime: string;
  createdDate: string;
  updatedDate: string | null;
  createdBy: string;
  updatedBy: string | null;
}

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/students/${id}`, {
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
        setStudent(data);
      } catch (error: any) {
        console.error('Error fetching student data:', error.message);
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (student) {
      setStudent({
        ...student,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/students/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: student?.fullName,
          email: student?.email,
          phone: student?.phone,
          relativePhone: student?.relativePhone,
          address: student?.address,
          birthday: student?.birthday,
        }),
      });

      if (response.ok) {
        toast.success('Cập nhật thành công', { autoClose: 500 });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Đã xảy ra lỗi khi cập nhật dữ liệu.');
      }
    } catch (error: any) {
      toast.error('Đã xảy ra lỗi khi cập nhật dữ liệu.');
    }
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
        Học viên {student.code}
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* First row: Họ tên and Email */}
        <div className="w-full">
          <label
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            htmlFor="fullName"
          >
            Họ tên
          </label>
          <input
            className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
            type="text"
            name="fullName"
            id="fullName"
            placeholder="Trần Văn A"
            value={student.fullName}
            onChange={handleChange}
          />
        </div>
        <div className="w-full">
          <label
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
            type="email"
            name="email"
            id="email"
            placeholder="email@example.com"
            value={student.email}
            onChange={handleChange}
          />
        </div>

        {/* Second row: Số điện thoại and Số điện thoại phụ huynh */}
        <div className="w-full">
          <label
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            htmlFor="phone"
          >
            Số điện thoại
          </label>
          <input
            className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
            type="text"
            name="phone"
            id="phone"
            placeholder="+84375537382"
            value={student.phone}
            onChange={handleChange}
          />
        </div>
        <div className="w-full">
          <label
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            htmlFor="relativePhone"
          >
            Số điện thoại phụ huynh
          </label>
          <input
            className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
            type="text"
            name="relativePhone"
            id="relativePhone"
            placeholder="0312445678"
            value={student.relativePhone}
            onChange={handleChange}
          />
        </div>

        {/* Third row: Địa chỉ and Ngày sinh */}
        <div className="w-full">
          <label
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            htmlFor="address"
          >
            Địa chỉ
          </label>
          <input
            className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
            type="text"
            name="address"
            id="address"
            placeholder="123 Main Street, Hometown"
            value={student.address}
            onChange={handleChange}
          />
        </div>
        <div className="w-full">
          <label
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            htmlFor="birthday"
          >
            Ngày sinh
          </label>
          <input
            className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
            type="date"
            name="birthday"
            id="birthday"
            value={student.birthday.substring(0, 10)}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={handleSave}
          className="rounded bg-primary py-2 px-4 text-white hover:bg-primary-dark"
        >
          Lưu
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default StudentDetail;
