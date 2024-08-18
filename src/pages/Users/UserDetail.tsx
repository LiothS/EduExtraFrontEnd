import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User } from '../../types/common';
import { config } from '../../common/config';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('profile');

  useEffect(() => {
    if (!id) return;
    const url = `${config.apiBaseUrl}/users/${id}`;
    const options: RequestInit = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Replace with actual token retrieval method
        'Content-Type': 'application/json',
      },
    };

    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: User) => {
        setUser(data);
      })
      .catch((error) => {
        setError(error.message);
        console.error('Fetch error:', error);
      });
  }, [id]);

  if (error) return <p className="text-red-600">Error: {error}</p>;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleEditClick = () => {
    // Handle edit button click (e.g., navigate to an edit page or open a modal)
    console.log('Edit button clicked');
  };

  // Fake data for Contracts and Income
  const contracts = [
    {
      id: 1,
      title: 'Contract A',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
    },
    {
      id: 2,
      title: 'Contract B',
      startDate: '2023-06-01',
      endDate: '2023-12-31',
    },
  ];

  const income = [
    { month: 'January', amount: 5000 },
    { month: 'February', amount: 4500 },
    { month: 'March', amount: 4800 },
  ];

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 mb-6">
        <li className="me-2">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleTabChange('profile');
            }}
            className={`inline-block p-4 rounded-t-lg ${
              activeTab === 'profile'
                ? 'text-blue-600 bg-gray-100 dark:bg-gray-800 dark:text-blue-500'
                : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
            }`}
          >
            Profile
          </a>
        </li>
        <li className="me-2">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleTabChange('contracts');
            }}
            className={`inline-block p-4 rounded-t-lg ${
              activeTab === 'contracts'
                ? 'text-blue-600 bg-gray-100 dark:bg-gray-800 dark:text-blue-500'
                : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
            }`}
          >
            Contracts
          </a>
        </li>
        <li className="me-2">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleTabChange('income');
            }}
            className={`inline-block p-4 rounded-t-lg ${
              activeTab === 'income'
                ? 'text-blue-600 bg-gray-100 dark:bg-gray-800 dark:text-blue-500'
                : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
            }`}
          >
            Income
          </a>
        </li>
      </ul>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
          <h3 className="font-medium text-black dark:text-white">
            {activeTab === 'profile'
              ? 'User Profile'
              : activeTab === 'contracts'
              ? 'Contracts'
              : 'Income'}
          </h3>
          {activeTab === 'profile' && (
            <button
              onClick={handleEditClick}
              className="bg-blue-500 text-white rounded px-4 py-2 font-medium hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        <div className="p-6.5">
          {activeTab === 'profile' && user ? (
            <form>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user.fullName || 'N/A'}
                    readOnly
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  />
                </div>
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email || 'N/A'}
                    readOnly
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  />
                </div>
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Phone
                </label>
                <input
                  type="text"
                  value={user.phone || 'N/A'}
                  readOnly
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Address
                </label>
                <input
                  type="text"
                  value={user.address || 'N/A'}
                  readOnly
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Birthday
                </label>
                <input
                  type="text"
                  value={user.birthday || 'N/A'}
                  readOnly
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Status
                </label>
                <input
                  type="text"
                  value={user.active ? 'Active' : 'Inactive'}
                  readOnly
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                />
              </div>
            </form>
          ) : activeTab === 'contracts' ? (
            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">
                Contracts
              </h4>
              <ul>
                {contracts.map((contract) => (
                  <li
                    key={contract.id}
                    className="bg-white p-4 rounded-lg shadow-sm mb-2"
                  >
                    <p>
                      <strong>Title:</strong> {contract.title}
                    </p>
                    <p>
                      <strong>Start Date:</strong> {contract.startDate}
                    </p>
                    <p>
                      <strong>End Date:</strong> {contract.endDate}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : activeTab === 'income' ? (
            <div>
              <h4 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">
                Income
              </h4>
              <ul>
                {income.map((record, index) => (
                  <li
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-sm mb-2"
                  >
                    <p>
                      <strong>Month:</strong> {record.month}
                    </p>
                    <p>
                      <strong>Amount:</strong> ${record.amount}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Select a tab to view content.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
