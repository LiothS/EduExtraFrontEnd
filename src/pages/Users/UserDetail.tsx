import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import defaultProfileImg from '../../images/user/user-03.png';
import { User, Role } from '../../types/common'; // Import User and Role types
import { config } from '../../common/config';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/UserStore';
import { toast, ToastContainer } from 'react-toastify';
import { setUser, updateUser } from '../../redux/UserSlice';
import ContractsTab from '../../components/Contract/ContractsTab';

const accountContent = <div>Account Content</div>;

const rolesList = ['MANAGER', 'ADMIN', 'ACCOUNTANT', 'TEACHER'];

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('userInfo');
  const [apiUser, setApiUser] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<string>(defaultProfileImg);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  // For role management
  const [, setSelectedRoles] = useState<Set<string>>(new Set());

  // Get the global user from Redux
  const globalUser = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.apiBaseUrl}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`, // Replace with your token
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const userData: User = await response.json();
        setApiUser(userData);
        setProfileImage(
          userData.image
            ? `${config.apiBaseUrl}/${userData.image}`
            : defaultProfileImg,
        );
        setFormData(userData);

        // Initialize selected roles
        const roleNames: string[] = userData.roles.map((role) => role.roleName);
        setRoles(roleNames);
        setIsActive(userData.active);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(
      apiUser?.image
        ? `${config.apiBaseUrl}/${apiUser.image}`
        : defaultProfileImg,
    );
    setImageFile(null);
  };

  const handleSaveChanges = async () => {
    if (imageFile) {
      // Prepare FormData for image upload
      const imageFormData = new FormData();
      imageFormData.append('image', imageFile);

      try {
        const imageResponse = await fetch(
          `${config.apiBaseUrl}/users/image/${id}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
            body: imageFormData,
          },
        );

        if (!imageResponse.ok) {
          throw new Error('Failed to update profile image');
        }
      } catch (error) {
        console.log('error:', error);
        toast.error('Cannot update image');
        return;
      }
    }
    // Prepare JSON for user details update
    const userDetails = {
      username: formData?.username || apiUser?.username,
      fullName: formData?.fullName || apiUser?.fullName,
      email: formData?.email || apiUser?.email,
      phone: formData?.phone || apiUser?.phone,
      address: formData?.address || apiUser?.address,
      nickname: formData?.nickname || apiUser?.nickname,
      birthday: formData?.birthday || apiUser?.birthday,
      image: profileImage || apiUser?.image,
      identityCard: formData?.identityCard || apiUser?.identityCard,
      active: isActive,
      roles: roles.length > 0 ? roles : null,
    };

    try {
      const userResponse = await fetch(`${config.apiBaseUrl}/users/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });

      if (!userResponse.ok) {
        throw new Error('Failed to update user details');
      }

      const updatedUser: User = await userResponse.json();
      setApiUser(updatedUser);
      setFormData(updatedUser);
      if (globalUser?.id === apiUser?.id) {
        dispatch(updateUser(updatedUser));
      }
      toast.success('Changes saved successfully');
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const role = event.target.value;

    setRoles((prevRoles) => {
      // Check if the checkbox is checked
      if (event.target.checked) {
        // Add the role if the checkbox is checked
        return [...prevRoles, role];
      } else {
        // Remove the role if the checkbox is unchecked
        // Check if there's only one role left and reset if needed
        if (prevRoles.length === 1 && prevRoles[0] === role) {
          return []; // Return an empty array if it's the only role
        }
        // Otherwise, filter out the unchecked role
        return prevRoles.filter((r) => r !== role);
      }
    });
  };

  const hasRole = (user: User, roleName: string): boolean => {
    return user.roles.some((role) => role.roleName === roleName);
  };

  // Check if the global user can edit
  const isAdmin = globalUser && hasRole(globalUser, 'ADMIN');
  const canEdit = apiUser && (isAdmin || globalUser?.id === apiUser?.id);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="mx-auto max-w-4xl px-4">
        <Breadcrumb pageName="UserDetail" />

        <div className="bg-white shadow-md rounded-lg p-4">
          {/* Tabs Navigation */}
          <div className="flex border-b border-stroke">
            <button
              onClick={() => setActiveTab('userInfo')}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === 'userInfo'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600'
              } focus:outline-none`}
            >
              User Info
            </button>
            <button
              onClick={() => setActiveTab('contracts')}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === 'contracts'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600'
              } focus:outline-none`}
            >
              Contracts
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === 'account'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600'
              } focus:outline-none`}
            >
              Account
            </button>
          </div>

          {/* Tabs Content */}
          <div className="pt-4">
            {activeTab === 'userInfo' && apiUser && (
              <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="p-7">
                  {/* Profile Image Section */}
                  <div className="text-center mb-8">
                    <div className="relative inline-block rounded-full overflow-hidden border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
                      <img
                        className="w-32 h-32 object-cover rounded-full"
                        src={profileImage}
                        alt="User Profile"
                      />
                    </div>
                    <div className="mt-4">
                      <input
                        type="file"
                        id="profileImage"
                        name="profileImage"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={!canEdit}
                      />
                      <label
                        htmlFor="profileImage"
                        className={`inline-block bg-primary text-white py-2 px-4 rounded cursor-pointer hover:bg-primary-dark ${
                          !canEdit ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                      >
                        Choose File
                      </label>
                      {imageFile && (
                        <button
                          onClick={handleRemoveImage}
                          className={`ml-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 ${
                            !canEdit ? 'cursor-not-allowed opacity-50' : ''
                          }`}
                          disabled={!canEdit}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Personal Information Form */}
                  <div>
                    <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                      <h3 className="font-medium text-black dark:text-white">
                        Personal Information
                      </h3>
                    </div>
                    <div className="p-7">
                      <form
                        action="#"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSaveChanges();
                        }}
                      >
                        {/* Full Name and Nickname Row */}
                        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                          <div className="w-full sm:w-1/2">
                            <label
                              className="mb-3 block text-sm font-medium text-black dark:text-white"
                              htmlFor="fullName"
                            >
                              Full Name
                            </label>
                            <input
                              className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
                                !canEdit ? 'cursor-not-allowed opacity-50' : ''
                              }`}
                              type="text"
                              name="fullName"
                              id="fullName"
                              placeholder="Devid Jhon"
                              defaultValue={apiUser.fullName}
                              disabled={!canEdit}
                              onChange={(e) =>
                                setFormData({
                                  ...apiUser,
                                  fullName: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="w-full sm:w-1/2">
                            <label
                              className="mb-3 block text-sm font-medium text-black dark:text-white"
                              htmlFor="nickname"
                            >
                              Nickname
                            </label>
                            <input
                              className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
                                !canEdit ? 'cursor-not-allowed opacity-50' : ''
                              }`}
                              type="text"
                              name="nickname"
                              id="nickname"
                              placeholder="Dave"
                              defaultValue={apiUser.nickname}
                              disabled={!canEdit}
                              onChange={(e) =>
                                setFormData({
                                  ...apiUser,
                                  nickname: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        {/* Phone Number and Email Row */}
                        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                          <div className="w-full sm:w-1/2">
                            <label
                              className="mb-3 block text-sm font-medium text-black dark:text-white"
                              htmlFor="phoneNumber"
                            >
                              Phone Number
                            </label>
                            <input
                              className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
                                !canEdit ? 'cursor-not-allowed opacity-50' : ''
                              }`}
                              type="text"
                              name="phoneNumber"
                              id="phoneNumber"
                              placeholder="+990 3343 7865"
                              defaultValue={apiUser.phone}
                              disabled={!canEdit}
                              onChange={(e) =>
                                setFormData({
                                  ...apiUser,
                                  phone: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="w-full sm:w-1/2">
                            <label
                              className="mb-3 block text-sm font-medium text-black dark:text-white"
                              htmlFor="emailAddress"
                            >
                              Email Address
                            </label>
                            <input
                              className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
                                !canEdit ? 'cursor-not-allowed opacity-50' : ''
                              }`}
                              type="email"
                              name="emailAddress"
                              id="emailAddress"
                              placeholder="devidjond45@gmail.com"
                              defaultValue={apiUser.email}
                              disabled={!canEdit}
                              onChange={(e) =>
                                setFormData({
                                  ...apiUser,
                                  email: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        {/* Birthday and Identity Card Row */}
                        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                          <div className="w-full sm:w-1/2">
                            <label
                              className="mb-3 block text-sm font-medium text-black dark:text-white"
                              htmlFor="birthday"
                            >
                              Birthday
                            </label>
                            <input
                              className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
                                !canEdit ? 'cursor-not-allowed opacity-50' : ''
                              }`}
                              type="date"
                              name="birthday"
                              id="birthday"
                              defaultValue={apiUser.birthday}
                              disabled={!canEdit}
                              onChange={(e) =>
                                setFormData({
                                  ...apiUser,
                                  birthday: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="w-full sm:w-1/2">
                            <label
                              className="mb-3 block text-sm font-medium text-black dark:text-white"
                              htmlFor="identityCard"
                            >
                              Identity Card
                            </label>
                            <input
                              className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
                                !canEdit ? 'cursor-not-allowed opacity-50' : ''
                              }`}
                              type="text"
                              name="identityCard"
                              id="identityCard"
                              placeholder="ID123456789"
                              defaultValue={apiUser.identityCard}
                              disabled={!canEdit}
                              onChange={(e) =>
                                setFormData({
                                  ...apiUser,
                                  identityCard: e.target.value,
                                })
                              }
                            />
                          </div>
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
                            className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
                              !canEdit ? 'cursor-not-allowed opacity-50' : ''
                            }`}
                            type="text"
                            name="address"
                            id="address"
                            placeholder="1234 Elm Street"
                            defaultValue={apiUser.address}
                            disabled={!canEdit}
                            onChange={(e) =>
                              setFormData({
                                ...apiUser,
                                address: e.target.value,
                              })
                            }
                          />
                        </div>
                        {/* Toggle Switch */}

                        {/* Toggle Switch */}
                        <div className="mb-6 mt-6">
                          {' '}
                          {/* Add margin top and bottom */}
                          <label
                            htmlFor="toggle1"
                            className="flex cursor-pointer select-none items-center space-x-3" // Added space-x-3 for horizontal spacing
                          >
                            <span className="text-sm font-medium text-black dark:text-white">
                              Status
                            </span>
                            <div className="relative">
                              <input
                                type="checkbox"
                                id="toggle1"
                                className="sr-only"
                                onChange={() => {
                                  setIsActive(!isActive);
                                }}
                              />
                              <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                              <div
                                className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${
                                  isActive &&
                                  '!right-1 !translate-x-full !bg-primary dark:!bg-white'
                                }`}
                              ></div>
                            </div>
                          </label>
                        </div>
                        {/* Role Selection */}
                        <div className="mb-5.5">
                          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Roles
                          </label>
                          <div className="flex flex-wrap gap-4">
                            {rolesList.map((role) => (
                              <div key={role} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`role-${role}`}
                                  value={role}
                                  checked={roles.includes(role)}
                                  onChange={handleRoleChange}
                                  disabled={!isAdmin} // Update this line
                                  className="mr-2"
                                />
                                <label
                                  className="ml-2"
                                  htmlFor={`role-${role}`}
                                >
                                  {role}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-end pt-4">
                          <button
                            type="submit"
                            className={`rounded bg-primary py-2 px-4 text-white hover:bg-primary-dark ${
                              !canEdit ? 'cursor-not-allowed opacity-50' : ''
                            }`}
                            disabled={!canEdit}
                          >
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'contracts' && apiUser && (
              <ContractsTab userId={apiUser.id} />
            )}
            {activeTab === 'account' && accountContent}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default UserDetail;
