import React, { useState, useEffect } from 'react';
import axios from 'axios';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddStudent: React.FC = () => {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [relativePhone, setRelativePhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    flatpickr('#birthday', {
      dateFormat: 'd/m/Y',
      onChange: (selectedDates) => {
        if (selectedDates.length > 0) {
          setBirthday(selectedDates[0].toLocaleDateString('en-GB'));
        }
      },
    });
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName) newErrors.fullName = 'Họ và tên là bắt buộc';
    //if (!email) newErrors.email = 'Email là bắt buộc';
    if (!phone) newErrors.phone = 'Số điện thoại là bắt buộc';
    // if (!relativePhone)
    //   newErrors.relativePhone = 'Số điện thoại người thân là bắt buộc';
    //if (!address) newErrors.address = 'Địa chỉ là bắt buộc';
    if (!birthday) newErrors.birthday = 'Ngày sinh là bắt buộc';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const convertDateFormat = (dateStr: string): string => {
          const [day, month, year] = dateStr.split('/').map(Number);
          const formattedDate = new Date(year, month - 1, day);
          return formattedDate.toISOString().split('T')[0];
        };

        const token = sessionStorage.getItem('token');
        const formattedBirthday = convertDateFormat(birthday);

        const payload = {
          fullName,
          email,
          phone,
          relativePhone,
          address,
          birthday: formattedBirthday,
        };

        const response = await axios.post(
          'http://localhost:8080/students',
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.status === 200) {
          toast.success('Thêm học sinh thành công', {
            autoClose: 2000,
          });
          setTimeout(() => {
            navigate(-1); // Navigate back to the previous page
          }, 2000); // Delay to allow user to see the success message
        } else {
          console.error('Failed to submit form', response.data);
          setErrorMessage(response.data.message || 'Có lỗi xảy ra');
          toast.error('Thêm thất bại', {
            autoClose: 2000,
          });
        }
      } catch (error: any) {
        console.error('Error submitting form', error);
        setErrorMessage(
          error.response?.data?.message || 'Có lỗi không mong muốn xảy ra',
        );
      }
    }
  };

  return (
    <>
      <div className="mx-auto max-w-270">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Fields Section */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Thêm Học Sinh
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  {/* Full Name & Email Fields */}
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Họ và tên
                      </label>
                      <input
                        className={`w-full rounded border ${
                          errors.fullName ? 'border-red-500' : 'border-stroke'
                        } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                        type="text"
                        id="fullName"
                        placeholder="Nguyễn Văn A"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm">
                          {errors.fullName}
                        </p>
                      )}
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        className={`w-full rounded border ${
                          errors.email ? 'border-red-500' : 'border-stroke'
                        } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                        type="email"
                        id="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone & Relative Phone Fields */}
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="phone"
                      >
                        Số điện thoại
                      </label>
                      <input
                        className={`w-full rounded border ${
                          errors.phone ? 'border-red-500' : 'border-stroke'
                        } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                        type="tel"
                        id="phone"
                        placeholder="Nhập số điện thoại tại đây..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone}</p>
                      )}
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="relativePhone"
                      >
                        Số điện thoại người thân
                      </label>
                      <input
                        className={`w-full rounded border ${
                          errors.relativePhone
                            ? 'border-red-500'
                            : 'border-stroke'
                        } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                        type="tel"
                        id="relativePhone"
                        placeholder="Nhập số điện thoại tại đây..."
                        value={relativePhone}
                        onChange={(e) => setRelativePhone(e.target.value)}
                      />
                      {errors.relativePhone && (
                        <p className="text-red-500 text-sm">
                          {errors.relativePhone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address & Birthday Fields */}
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="address"
                      >
                        Địa chỉ
                      </label>
                      <input
                        className={`w-full rounded border ${
                          errors.address ? 'border-red-500' : 'border-stroke'
                        } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                        type="text"
                        id="address"
                        placeholder="Ấp, Xã, Huyện, Tỉnh"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm">{errors.address}</p>
                      )}
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="birthday"
                      >
                        Ngày sinh
                      </label>
                      <input
                        className={`w-full rounded border ${
                          errors.birthday ? 'border-red-500' : 'border-stroke'
                        } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                        type="text"
                        id="birthday"
                        placeholder="dd/mm/yyyy"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                      />
                      {errors.birthday && (
                        <p className="text-red-500 text-sm">
                          {errors.birthday}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-base font-medium text-white shadow-button transition hover:bg-opacity-90"
                    >
                      Thêm
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

export default AddStudent;
