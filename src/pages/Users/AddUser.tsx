import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // Import Flatpickr CSS
import { registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileEncode);

const rolesList = ['MANAGER', 'ADMIN', 'ACCOUNTANT', 'TEACHER'];

const AddUser: React.FC = () => {
  const [birthday, setBirthday] = useState<string | undefined>(undefined);
  const [roles, setRoles] = useState<string[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    flatpickr("#birthday", {
      dateFormat: "d/m/Y",
      onChange: (selectedDates) => {
        if (selectedDates.length > 0) {
          setBirthday(selectedDates[0].toLocaleDateString('en-GB'));
        }
      },
    });
  }, []);

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(event.target.value);
  };

  const handleAddRole = () => {
    if (selectedRole && !roles.includes(selectedRole)) {
      setRoles([...roles, selectedRole]);
      setSelectedRole('');
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setRoles(roles.filter(role => role !== roleToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        setProfilePhoto(file);
      } else {
        alert('Please select a JPG or PNG image.');
      }
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!username) newErrors.username = 'Username is required';
    if (!phone) newErrors.phone = 'Phone number is required';
    if (password !== confirmPassword) newErrors.password = 'Passwords do not match';
    if (!email) newErrors.email = 'Email is required';
    if (!fullName) newErrors.fullName = 'Full Name is required';
    if (!address) newErrors.address = 'Address is required';
    if (!identityCard) newErrors.identityCard = 'Identity Card is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('roles', JSON.stringify(roles));
        formData.append('fullName', fullName);
        formData.append('password', password);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('nickname', nickname);
        formData.append('birthday', birthday || '');
        formData.append('identityCard', identityCard);
        if (profilePhoto) formData.append('image', profilePhoto);
        formData.append('active', 'true'); // or set based on your needs

        const response = await axios.post('http://localhost:8080/users', formData, {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbjIiLCJpYXQiOjE3MjM4MjYwMDYsImV4cCI6MTcyMzgyOTAwNn0.sXVu1kI75VFYTXHtVojAuXFLCpNrCnk3QWPLisd5f3gIE08H7QaGoyTiq0KSLZUv',
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          console.log('Form submitted successfully', response.data);
          // Clear form fields or redirect user
        } else {
          console.error('Failed to submit form', response.data);
          setErrorMessage(response.data.message || 'An error occurred');
        }
      } catch (error: any) {
        console.error('Error submitting form', error);
        setErrorMessage(error.response?.data?.message || 'An unexpected error occurred');
      }
    }
  };

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Add User" />
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">User Details</h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  {/* Username Field */}
                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="username">
                      Username
                    </label>
                    <input
                      className={`w-full rounded border ${errors.username ? 'border-red-500' : 'border-stroke'} bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                      type="text"
                      id="username"
                      placeholder="username123"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                  </div>

                  {/* Password Fields */}
                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="password">
                      Password
                    </label>
                    <input
                      className={`w-full rounded border ${errors.password ? 'border-red-500' : 'border-stroke'} bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                      type="password"
                      id="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <input
                      className={`w-full rounded border ${errors.password ? 'border-red-500' : 'border-stroke'} bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                      type="password"
                      id="confirmPassword"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                  </div>

                  {/* Full Name & Nickname Fields */}
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="fullName">
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
                      {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="nickname">
                        Nickname
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        id="nickname"
                        placeholder="Johnny"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Phone Number Field */}
                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      className={`w-full rounded border ${errors.phone ? 'border-red-500' : 'border-stroke'} bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                      type="text"
                      id="phone"
                      placeholder="+123 456 7890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                  </div>

                  {/* Email Address Field */}
                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      className={`w-full rounded border ${errors.email ? 'border-red-500' : 'border-stroke'} bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                      type="email"
                      id="email"
                      placeholder="example@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>

                  {/* Identity Card Field */}
                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="identityCard">
                      Identity Card
                    </label>
                    <input
                      className={`w-full rounded border ${errors.identityCard ? 'border-red-500' : 'border-stroke'} bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                      type="text"
                      id="identityCard"
                      placeholder="ID123456789"
                      value={identityCard}
                      onChange={(e) => setIdentityCard(e.target.value)}
                    />
                    {errors.identityCard && <p className="text-red-500 text-sm">{errors.identityCard}</p>}
                  </div>

                  {/* Birthday Field */}
                  <div className="mb-5.5 relative">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="birthday">
                      Birthday
                    </label>
                    <input
                      id="birthday"
                      className="w-full rounded border border-stroke bg-transparent px-5 py-3 text-black focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      placeholder="dd/mm/yyyy"
                      value={birthday || ''}
                      readOnly
                    />
                  </div>

                  {/* Address Field */}
                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="address">
                      Address
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      id="address"
                      placeholder="123 Main St, City, Country"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                  </div>

                  {/* Roles Section */}
                  <div className="mb-5.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      Roles
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {roles.map((role, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 border border-blue-300"
                        >
                          <span>{role}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRole(role)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedRole}
                        onChange={handleRoleChange}
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      >
                        <option value="">Select a role</option>
                        {rolesList.map((role, index) => (
                          <option key={index} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAddRole}
                        className="ml-2 px-3 py-1 bg-primary text-white text-sm rounded shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark"
                      >
                        Add Role
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="mt-4 px-6 py-2 bg-primary text-white rounded"
                  >
                    Save User
                  </button>
                </form>
                {errorMessage && (
                  <div className="mt-4 p-4 bg-red-100 text-red-800 border border-red-200 rounded">
                    {errorMessage}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Photo Section */}
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">Your Photo</h3>
              </div>
              <div className="p-7">
                <div className="flex flex-col items-center">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-200">
                    {profilePhoto ? (
                      <img
                        src={URL.createObjectURL(profilePhoto)}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full text-gray-500">
                        No Photo
                      </div>
                    )}
                    {profilePhoto && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <label className="cursor-pointer bg-primary text-white rounded px-4 py-2">
                      Choose File
                      <input
                        type="file"
                        accept="image/jpeg, image/png"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className={`px-4 py-2 rounded border ${profilePhoto ? 'border-red-600 text-red-600' : 'border-gray-300 text-gray-500'}`}
                      disabled={!profilePhoto}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddUser;
