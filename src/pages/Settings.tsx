import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css'; // Import Flatpickr CSS

const rolesList = ['MANAGER', 'ADMIN', 'ACCOUNTANT', 'TEACHER'];

const AddUser: React.FC = () => {
  const [birthday, setBirthday] = useState<string | undefined>(undefined);
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [profilePhoto, setProfilePhoto] = useState<string | ArrayBuffer | null>(null);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-4xl p-8">
        <Breadcrumb pageName="Add User" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="rounded-lg border border-gray-300 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-300 py-4 px-6 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">User Details</h3>
              </div>
              <div className="p-6">
                <form>
                  {/* Username Field */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="username">
                      Username
                    </label>
                    <input
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                      type="text"
                      id="username"
                      placeholder="username123"
                    />
                  </div>

                  {/* Full Name & Nickname Fields */}
                  <div className="mb-5 flex flex-col gap-5 md:flex-row">
                    <div className="w-full md:w-1/2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="fullName">
                        AHAHAHAHAH
                      </label>
                      <input
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                        type="text"
                        id="fullName"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="w-full md:w-1/2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="nickname">
                        Nickname
                      </label>
                      <input
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                        type="text"
                        id="nickname"
                        placeholder="Johnny"
                      />
                    </div>
                  </div>

                  {/* Phone Number Field */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                      type="text"
                      id="phone"
                      placeholder="+123 456 7890"
                    />
                  </div>

                  {/* Email Address Field */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                      type="email"
                      id="email"
                      placeholder="example@example.com"
                    />
                  </div>

                  {/* Identity Card Field */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="identityCard">
                      Identity Card
                    </label>
                    <input
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                      type="text"
                      id="identityCard"
                      placeholder="ID123456789"
                    />
                  </div>

                  {/* Birthday Field */}
                  <div className="mb-5 relative">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="birthday">
                      Birthday
                    </label>
                    <input
                      id="birthday"
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                      placeholder="dd/mm/yyyy"
                      value={birthday || ''}
                      readOnly
                    />
                  </div>

                  {/* Address Field */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="address">
                      Address
                    </label>
                    <input
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                      type="text"
                      id="address"
                      placeholder="123 Main St, City, Country"
                    />
                  </div>

                  {/* Roles Section */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                        className="block w-full rounded-md border border-gray-300 bg-gray-50 py-2 px-3 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
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
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
                      >
                        Add Role
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save User
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Profile Photo Section */}
          {/* <div className="md:col-span-1">
            <div className="rounded-lg border border-gray-300 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-300 py-4 px-6 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Profile Photo</h3>
              </div>
              <div className="p-6">
                <form>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-16 w-16 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
                      {profilePhoto ? (
                        <img src={profilePhoto as string} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-gray-200 text-gray-500">
                          No Photo
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="mb-1.5 text-gray-800 dark:text-gray-200">Edit your photo</p>
                      <div className="flex gap-2.5">
                        <button type="button" className="text-sm text-red-500 hover:text-red-700">
                          Delete
                        </button>
                        <button type="button" className="text-sm text-blue-500 hover:text-blue-700">
                          Update
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-blue-500 bg-gray-50 py-4 px-4 dark:bg-gray-700"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                      onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                            fill="#3C50E0"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                            fill="#3C50E0"
                          />
                        </svg>
                      </span>
                      <p>
                        <span className="text-blue-500">Click to upload</span> or drag and drop
                      </p>
                      <p className="mt-1.5 text-sm text-gray-500">SVG, PNG, JPG or GIF (max 800 X 800px)</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      className="flex justify-center rounded border border-gray-300 py-2 px-6 font-medium text-gray-800 hover:shadow-md dark:border-gray-600 dark:text-gray-200"
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-blue-500 py-2 px-6 font-medium text-white hover:bg-blue-600"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default AddUser;
