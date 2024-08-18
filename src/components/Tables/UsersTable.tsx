import React, { useEffect, useState } from 'react';
import { User } from '../../types/common';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { config } from '../../common/config';
const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Define the API endpoint and options
    const url = `${config.apiBaseUrl}/users`;
    console.log('asdasdasdasd', url);
    const options: RequestInit = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Replace with actual token retrieval method
        'Content-Type': 'application/json',
      },
    };

    // Fetch data from API
    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: any) => {
        console.log(data);
        setUsers(data?.content);
      })
      .catch((error) => {
        setError(error.message);
        console.log('chin', error);
      });
  }, []);

  const handleRowClick = (userId: number) => {
    navigate(`/user-detail/${userId}`);
  };

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Danh sách nhân viên
          </h4>
        </div>

        <div className="grid grid-cols-7 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-7 md:px-6 2xl:px-7.5">
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Họ Tên</p>
          </div>
          <div className="col-span-1 hidden items-center sm:flex">
            <p className="font-medium">SDT</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Email</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Địa chỉ</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Ngày sinh</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Trạng thái</p>
          </div>
        </div>

        {users.map((user) => (
          <div
            className="grid grid-cols-7 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-7 md:px-6 2xl:px-7.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            key={user.id}
            onClick={() => handleRowClick(user.id)}
          >
            <div className="col-span-1 flex items-center truncate">
              <p className="text-sm text-black dark:text-white w-full">
                {user.fullName || 'Thien'}
              </p>
            </div>
            <div className="col-span-1 hidden items-center sm:flex truncate">
              <p className="text-sm text-black dark:text-white w-full">
                {user.phone || 'N/A'}
              </p>
            </div>
            <div className="col-span-1 flex items-center truncate">
              <p className="text-sm text-black dark:text-white w-full">
                {user.email || 'N/A'}
              </p>
            </div>
            <div className="col-span-1 flex items-center truncate">
              <p className="text-sm text-black dark:text-white w-full">
                {user.address || 'N/A'}
              </p>
            </div>
            <div className="col-span-1 flex items-center truncate">
              <p className="text-sm text-black dark:text-white w-full">
                {user.birthday || 'N/A'}
              </p>
            </div>
            <div className="col-span-1 flex items-center truncate">
              <p className="text-sm text-meta-3 w-full">
                {user.active ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UsersList;
