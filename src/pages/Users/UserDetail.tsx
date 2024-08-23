import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import defaultProfileImg from '../../images/user/user-03.png';
import { User } from '../../types/common'; // Import User and Role types
import { config } from '../../common/config';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/UserStore';
import { toast, ToastContainer } from 'react-toastify';
import { updateUser } from '../../redux/UserSlice';
import ContractsTab from '../../components/Contract/ContractsTab';

const accountContent = <div>Account Content</div>;

const rolesList = ['MANAGER', 'ADMIN', 'ACCOUNTANT', 'TEACHER'];
const roleTranslations: { [key: string]: string } = {
  MANAGER: 'Quản lý',
  ADMIN: 'Quản trị viên',
  ACCOUNTANT: 'Kế toán',
  TEACHER: 'Giáo viên',
};

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
  const [] = useState<boolean>(false);
  // For role management
  const [] = useState<Set<string>>(new Set());
  const [description, setDescription] = useState<string | ''>(
    apiUser?.description || '',
  );

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
        setDescription(userData.description);
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
          throw new Error('Không thể đăng ảnh');
        }
      } catch (error) {
        console.log('error:', error);
        toast.error('Không thể đăng ảnh');
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
      description: description || apiUser?.description,
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
      toast.success('Lưu thành công', {
        autoClose: 500,
      });
    } catch (error) {
      toast.error('Lưu thất bại', {
        autoClose: 500,
      });
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
        <Breadcrumb pageName="Thông tin nhân viên" />

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
              Thông tin
            </button>
            {canEdit && (
              <button
                onClick={() => setActiveTab('contracts')}
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === 'contracts'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-600'
                } focus:outline-none`}
              >
                Hợp đồng
              </button>
            )}
            {canEdit && (
              <button
                onClick={() => setActiveTab('account')}
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === 'account'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-600'
                } focus:outline-none`}
              >
                Tài khoản
              </button>
            )}
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
                        Chọn ảnh
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
                              Họ tên
                            </label>
                            <input
                              className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
                                !canEdit ? 'cursor-not-allowed opacity-50' : ''
                              }`}
                              type="text"
                              name="fullName"
                              id="fullName"
                              placeholder="Trần Văn A"
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
                              Tên rút gọn
                            </label>
                            <input
                              className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
                                !canEdit ? 'cursor-not-allowed opacity-50' : ''
                              }`}
                              type="text"
                              name="nickname"
                              id="nickname"
                              placeholder="Thầy A"
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
                              Số điện thoại
                            </label>
                            <input
                              className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
                                !canEdit ? 'cursor-not-allowed opacity-50' : ''
                              }`}
                              type="text"
                              name="phoneNumber"
                              id="phoneNumber"
                              placeholder="Nhập số điện thoại"
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
                              Email
                            </label>
                            <input
                              className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
                                !canEdit ? 'cursor-not-allowed opacity-50' : ''
                              }`}
                              type="email"
                              name="emailAddress"
                              id="emailAddress"
                              placeholder="Nhập địa chỉ email"
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
                              Ngày sinh
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
                              CCCD/CMDN
                            </label>
                            <input
                              className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
                                !canEdit ? 'cursor-not-allowed opacity-50' : ''
                              }`}
                              type="text"
                              name="identityCard"
                              id="identityCard"
                              placeholder="823491239232"
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
                            Địa chỉ
                          </label>
                          <input
                            className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
                              !canEdit ? 'cursor-not-allowed opacity-50' : ''
                            }`}
                            type="text"
                            name="address"
                            id="address"
                            placeholder="Số nhà, Ấp, Xã, Huyện, Tỉnh"
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

                        {/* Description Field */}
                        <div className="mb-5.5">
                          <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="description"
                          >
                            Mô tả (nếu có)
                          </label>
                          <textarea
                            rows={6}
                            className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${
                              !canEdit ? 'cursor-not-allowed opacity-50' : ''
                            }`}
                            name="description"
                            id="description"
                            placeholder="..."
                            value={description ?? ''}
                            disabled={!canEdit}
                            onChange={(e) => {
                              setDescription(e.target.value);
                              setFormData({
                                ...apiUser,
                                description: e.target.value,
                              });
                            }}
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
                              Trạng thái
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
                            Quyền
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
                                  {roleTranslations[role]}
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
                            Lưu
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
