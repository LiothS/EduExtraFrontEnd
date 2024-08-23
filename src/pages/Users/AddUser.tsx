import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileEncode);

const rolesList = ['MANAGER', 'ADMIN', 'ACCOUNTANT', 'TEACHER'];

const AddUser: React.FC = () => {
  const [birthday, setBirthday] = useState<string | undefined>(undefined);
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [identityCard, setIdentityCard] = useState<string>('');
  const [description, setDescription] = useState<string>(''); // New description state
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

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const role = event.target.value;
    if (event.target.checked) {
      setRoles([...roles, role]);
    } else {
      setRoles(roles.filter((r) => r !== role));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!username) newErrors.username = 'Username is required';
    if (!phone) newErrors.phone = 'Phone number is required';
    if (password !== confirmPassword)
      newErrors.password = 'Passwords do not match';
    if (!email) newErrors.email = 'Email is required';
    if (!fullName) newErrors.fullName = 'Full Name is required';
    if (!address) newErrors.address = 'Address is required';
    if (!identityCard) newErrors.identityCard = 'Identity Card is required';
    if (!description) newErrors.description = 'Description is required'; // Validate description
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const convertDateFormat = (dateStr: string | undefined): string => {
          if (!dateStr) return '';
          const [day, month, year] = dateStr.split('/').map(Number);
          const formattedDate = new Date(year, month - 1, day);
          return formattedDate.toISOString().split('T')[0];
        };

        const token = sessionStorage.getItem('token');
        const formattedBirthday = convertDateFormat(birthday);

        const payload = {
          username,
          roles,
          fullName,
          password,
          email,
          phone,
          address,
          nickname,
          birthday: formattedBirthday,
          identityCard,
          description, // Add description to payload
          active: true,
        };

        const response = await axios.post(
          'http://localhost:8080/users',
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.status === 200) {
          toast.success('User added successfully', {
            autoClose: 500,
          });
          setTimeout(() => {
            navigate(-1); // Navigate back to the previous page
          }, 2000); // Delay to allow user to see the success message
        } else {
          console.error('Failed to submit form', response.data);
          setErrorMessage(response.data.message || 'An error occurred');
          toast.error('Thêm thất bại', {
            autoClose: 500,
          });
        }
      } catch (error: any) {
        console.error('Error submitting form', error);
        setErrorMessage(
          error.response?.data?.message || 'An unexpected error occurred',
        );
      }
    }
  };

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Add User" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Fields Section */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  User Details
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  {/* Username Field */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="username"
                    >
                      Username
                    </label>
                    <input
                      className={`w-full rounded border ${
                        errors.username ? 'border-red-500' : 'border-stroke'
                      } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                      type="text"
                      id="username"
                      placeholder="username123"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm">{errors.username}</p>
                    )}
                  </div>

                  {/* Password Fields */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      className={`w-full rounded border ${
                        errors.password ? 'border-red-500' : 'border-stroke'
                      } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                      type="password"
                      id="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="confirmPassword"
                    >
                      Confirm Password
                    </label>
                    <input
                      className={`w-full rounded border ${
                        errors.password ? 'border-red-500' : 'border-stroke'
                      } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                      type="password"
                      id="confirmPassword"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>

                  {/* Full Name & Nickname Fields */}
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Full Name
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        id="fullName"
                        placeholder="John Doe"
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
                        htmlFor="nickname"
                      >
                        Nickname
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        id="nickname"
                        placeholder="Johnnie"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="phone"
                    >
                      Phone Number
                    </label>
                    <input
                      className={`w-full rounded border ${
                        errors.phone ? 'border-red-500' : 'border-stroke'
                      } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                      type="tel"
                      id="phone"
                      placeholder="+1234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm">{errors.phone}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <input
                      className={`w-full rounded border ${
                        errors.email ? 'border-red-500' : 'border-stroke'
                      } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                      type="email"
                      id="email"
                      placeholder="john.doe@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  {/* Address Field */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="address"
                    >
                      Address
                    </label>
                    <input
                      className={`w-full rounded border ${
                        errors.address ? 'border-red-500' : 'border-stroke'
                      } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                      type="text"
                      id="address"
                      placeholder="123 Main St"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm">{errors.address}</p>
                    )}
                  </div>

                  {/* Identity Card Field */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="identityCard"
                    >
                      Identity Card
                    </label>
                    <input
                      className={`w-full rounded border ${
                        errors.identityCard ? 'border-red-500' : 'border-stroke'
                      } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                      type="text"
                      id="identityCard"
                      placeholder="ID12345678"
                      value={identityCard}
                      onChange={(e) => setIdentityCard(e.target.value)}
                    />
                    {errors.identityCard && (
                      <p className="text-red-500 text-sm">
                        {errors.identityCard}
                      </p>
                    )}
                  </div>

                  {/* Birthday Field */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="birthday"
                    >
                      Birthday
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      id="birthday"
                      placeholder="Select date"
                      value={birthday}
                      readOnly
                    />
                  </div>

                  {/* Description Field */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="description"
                    >
                      Description
                    </label>
                    <textarea
                      className={`w-full rounded border ${
                        errors.description ? 'border-red-500' : 'border-stroke'
                      } bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                      id="description"
                      placeholder="Short description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      style={{ resize: 'vertical' }}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center rounded bg-primary px-5 text-base font-medium text-white transition duration-150 hover:bg-primaryfocus:outline-none dark:bg-primarydark dark:hover:bg-primarydark"
                  >
                    Add User
                  </button>
                </form>
                {errorMessage && (
                  <p className="text-red-500 mt-4 text-sm">{errorMessage}</p>
                )}
              </div>
            </div>
          </div>

          {/* Roles Section */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  User Roles
                </h3>
              </div>
              <div className="p-7">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Roles
                </label>
                {rolesList.map((role) => (
                  <div key={role} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`role-${role}`}
                      value={role}
                      checked={roles.includes(role)}
                      onChange={handleRoleChange}
                    />
                    <label className="ml-2" htmlFor={`role-${role}`}>
                      {role}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AddUser;
