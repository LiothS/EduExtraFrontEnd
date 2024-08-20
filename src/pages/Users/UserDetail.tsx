import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import defaultProfileImg from '../../images/user/user-03.png';
import { User } from '../../types/common'; // Import User type
import { config } from '../../common/config';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/UserStore';
import { toast } from 'react-toastify';

const contractsContent = <div>Contracts Content</div>;
const accountContent = <div>Account Content</div>;

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('userInfo');
  const [apiUser, setApiUser] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<string>(defaultProfileImg);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<User | null>(null);

  // Get the global user from Redux
  const globalUser = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.apiBaseUrl}/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`, // Replace with your token
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const userData: User = await response.json();
        setApiUser(userData);
        setProfileImage(userData.image ? `${config.apiBaseUrl}/${userData.image}` : defaultProfileImg);
        setFormData(userData);
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
    setProfileImage(apiUser?.image ? `${config.apiBaseUrl}/${apiUser.image}` : defaultProfileImg);
    setImageFile(null);
  };

  const handleSaveChanges = async () => {
    if (imageFile) {
      // Prepare FormData for image upload
      const imageFormData = new FormData();
      imageFormData.append('image', imageFile);
  
      try {
        const imageResponse = await fetch(`${config.apiBaseUrl}/users/image/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          },
          body: imageFormData,
        });
  
        if (!imageResponse.ok) {
          throw new Error('Failed to update profile image');
        }
      } catch (error) {
        toast.error('Không thay đổi được hình ảnh');
        return;
      }
    }
  
    // Prepare JSON for user details update
    const userDetails = {
      username: formData?.username || apiUser?.username,
    //  roles: Array.isArray(formData?.roles) ? formData.roles : apiUser?.roles || [], // Ensure roles is an array
      fullName: formData?.fullName || apiUser?.fullName,
      email: formData?.email || apiUser?.email,
      phone: formData?.phone || apiUser?.phone,
      address: formData?.address || apiUser?.address,
      nickname: formData?.nickname || apiUser?.nickname,
      birthday: formData?.birthday || apiUser?.birthday,
      image: profileImage || apiUser?.image, // Ensure the image URL is set correctly
      identityCard: formData?.identityCard || apiUser?.identityCard,
      active: formData?.active !== undefined ? formData.active : apiUser?.active, // Ensure active field is set
    };
  
    try {
      const userResponse = await fetch(`${config.apiBaseUrl}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
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
      toast.success('Changes saved successfully');
      // Optionally reload the user profile page
      // window.location.reload();
    } catch (error) {
      toast.error('Cập nhật thất bại');
    }
  };
  

  const hasRole = (user: User, roleName: string): boolean => {
    return user.roles.some(role => role.roleName === roleName);
  };

  // Check if the global user can edit
  const isAdmin = globalUser && hasRole(globalUser, 'ADMIN');
  const canEdit = apiUser && (isAdmin || globalUser.id === apiUser.id);

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
              className={`py-2 px-4 text-sm font-medium ${activeTab === 'userInfo' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'} focus:outline-none`}
            >
              User Info
            </button>
            <button
              onClick={() => setActiveTab('contracts')}
              className={`py-2 px-4 text-sm font-medium ${activeTab === 'contracts' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'} focus:outline-none`}
            >
              Contracts
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`py-2 px-4 text-sm font-medium ${activeTab === 'account' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'} focus:outline-none`}
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
                        className={`inline-block bg-primary text-white py-2 px-4 rounded cursor-pointer hover:bg-primary-dark ${!canEdit ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        Choose File
                      </label>
                      {imageFile && (
                        <button
                          onClick={handleRemoveImage}
                          className={`ml-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 ${!canEdit ? 'cursor-not-allowed opacity-50' : ''}`}
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
                              className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${!canEdit ? 'cursor-not-allowed opacity-50' : ''}`}
                              type="text"
                              name="fullName"
                              id="fullName"
                              placeholder="Devid Jhon"
                              defaultValue={apiUser.fullName}
                              disabled={!canEdit}
                              onChange={(e) => setFormData({ ...apiUser, fullName: e.target.value })}
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
                              className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${!canEdit ? 'cursor-not-allowed opacity-50' : ''}`}
                              type="text"
                              name="nickname"
                              id="nickname"
                              placeholder="Dave"
                              defaultValue={apiUser.nickname}
                              disabled={!canEdit}
                              onChange={(e) => setFormData({ ...apiUser, nickname: e.target.value })}
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
                              className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${!canEdit ? 'cursor-not-allowed opacity-50' : ''}`}
                              type="text"
                              name="phoneNumber"
                              id="phoneNumber"
                              placeholder="+990 3343 7865"
                              defaultValue={apiUser.phone}
                              disabled={!canEdit}
                              onChange={(e) => setFormData({ ...apiUser, phone: e.target.value })}
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
                              className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${!canEdit ? 'cursor-not-allowed opacity-50' : ''}`}
                              type="email"
                              name="emailAddress"
                              id="emailAddress"
                              placeholder="devidjond45@gmail.com"
                              defaultValue={apiUser.email}
                              disabled={!canEdit}
                              onChange={(e) => setFormData({ ...apiUser, email: e.target.value })}
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
                              className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${!canEdit ? 'cursor-not-allowed opacity-50' : ''}`}
                              type="date"
                              name="birthday"
                              id="birthday"
                              defaultValue={apiUser.birthday}
                              disabled={!canEdit}
                              onChange={(e) => setFormData({ ...apiUser, birthday: e.target.value })}
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
                              className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${!canEdit ? 'cursor-not-allowed opacity-50' : ''}`}
                              type="text"
                              name="identityCard"
                              id="identityCard"
                              placeholder="ID123456789"
                              defaultValue={apiUser.identityCard}
                              disabled={!canEdit}
                              onChange={(e) => setFormData({ ...apiUser, identityCard: e.target.value })}
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
                            className={`w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary ${!canEdit ? 'cursor-not-allowed opacity-50' : ''}`}
                            type="text"
                            name="address"
                            id="address"
                            placeholder="1234 Elm Street"
                            defaultValue={apiUser.address}
                            disabled={!canEdit}
                            onChange={(e) => setFormData({ ...apiUser, address: e.target.value })}
                          />
                        </div>

                        <div className="flex items-center justify-end pt-4">
                          <button
                            type="submit"
                            className={`rounded bg-primary py-2 px-4 text-white hover:bg-primary-dark ${!canEdit ? 'cursor-not-allowed opacity-50' : ''}`}
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
            {activeTab === 'contracts' && contractsContent}
            {activeTab === 'account' && accountContent}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetail;
