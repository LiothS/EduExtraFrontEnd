import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { config } from '../../common/config';
import { toast, ToastContainer } from 'react-toastify';

const AddContract: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [contractType, setContractType] = useState<'LABOR' | 'OTHER'>('LABOR');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [earnType, setEarnType] = useState<'SALARY' | 'EXTRA'>('SALARY');
  const [amount, setAmount] = useState('');
  const [currency] = useState('VND'); // Default currency, read-only
  const [per, setPer] = useState<'MONTHLY' | 'HOURLY' | 'DAILY'>('MONTHLY');
  const [employeeName, setEmployeeName] = useState('');
  const [identityCard, setIdentityCard] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8080/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          // Display the error message from the response
          toast.error(errorData.message || 'An unknown error occurred');
          return;
        }

        const userResponse = await response.json();
        setEmployeeName(userResponse.fullName || '');
        setIdentityCard(userResponse.identityCard || '');
      } catch (error) {
        toast.error('Failed to fetch user information', {
          autoClose: 1000,
        });
      }
    };

    fetchUserInfo();
  }, [userId]);

  // Determine contract name based on contract type
  const contractName =
    contractType === 'LABOR' ? 'Hợp Đồng Lao Động' : 'Hợp Đồng';

  // Format dates to LocalDateTime format
  const formatDateToLocalDateTime = (date: string) => {
    // Assuming input date is in the format 'YYYY-MM-DD'
    return date ? `${date}T00:00:00` : '';
  };

  // Validate dates
  const validateDates = (startDate: string, endDate: string) => {
    return new Date(startDate) < new Date(endDate);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate dates
    if (!validateDates(startDate, endDate)) {
      toast.error('Ngày hết hạn phải sau ngày bắt đầu', {
        autoClose: 1000,
      });
      return;
    }

    setLoading(true);

    // Convert dates to LocalDateTime format
    const formattedStartDate = formatDateToLocalDateTime(startDate);
    const formattedEndDate = formatDateToLocalDateTime(endDate);

    try {
      const response = await fetch(`${config.apiBaseUrl}/contracts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`, // Replace with your token
        },
        body: JSON.stringify({
          contractName,
          contractType,
          startDate: formattedStartDate,
          expiredDate: formattedEndDate,
          earnType,
          amount,
          currency,
          per,
          employeeName,
          identityCard,
          userId, // Include userId in the request
        }),
      });

      if (response.ok) {
        toast.success('Thêm thành công', {
          autoClose: 500,
        });
        // Go back to the previous page after success
        setTimeout(() => {
          navigate(-1);
        }, 3000);
      } else {
        throw new Error('Failed to add contract');
      }
    } catch (error) {
      toast.error('Thêm thất bại', {
        autoClose: 500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-4xl px-4">
        <Breadcrumb pageName="Hợp Đồng" />

        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="border-b border-stroke pb-4">
            <h1 className="text-xl font-medium text-black dark:text-white">
              Tạo hợp đồng mới
            </h1>
          </div>

          <div className="pt-4">
            <div className="rounded-lg bg-white dark:border-strokedark dark:bg-boxdark">
              <div className="p-7">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contract Type Field */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="contractType"
                    >
                      Loại hợp đồng
                    </label>
                    <select
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      id="contractType"
                      value={contractType}
                      onChange={(e) =>
                        setContractType(e.target.value as 'LABOR' | 'OTHER')
                      }
                    >
                      <option value="LABOR">Hợp đồng lao động</option>
                      <option value="OTHER">Hợp đồng khác</option>
                    </select>
                  </div>

                  {/* Start Date and End Date Fields on Same Row */}
                  <div className="mb-5.5 flex gap-4">
                    <div className="w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="startDate"
                      >
                        Ngày bắt đầu
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="endDate"
                      >
                        Ngày kết thúc
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Income Type, Amount, Currency, and Per Fields on Same Row */}
                  <div className="mb-5.5 flex gap-4">
                    <div className="w-1/4">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="earnType"
                      >
                        Loại thu nhập
                      </label>
                      <select
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        id="earnType"
                        value={earnType}
                        onChange={(e) =>
                          setEarnType(e.target.value as 'SALARY' | 'EXTRA')
                        }
                      >
                        <option value="SALARY">Lương cứng</option>
                        <option value="EXTRA">Hoa hồng</option>
                      </select>
                    </div>
                    <div className="w-1/4">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="amount"
                      >
                        Số tiền
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="number"
                        id="amount"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <div className="w-1/4">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="currency"
                      >
                        Tiền tệ
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        id="currency"
                        value={currency}
                        readOnly
                      />
                    </div>
                    <div className="w-1/4">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="per"
                      >
                        Theo
                      </label>
                      <select
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        id="per"
                        value={per}
                        onChange={(e) =>
                          setPer(
                            e.target.value as 'MONTHLY' | 'HOURLY' | 'DAILY',
                          )
                        }
                      >
                        <option value="MONTHLY">Tháng</option>
                        <option value="HOURLY">Giờ</option>
                        <option value="DAILY">Ngày</option>
                      </select>
                    </div>
                  </div>

                  {/* Employee Name and Identity Card Fields */}
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="employeeName"
                    >
                      Tên Nhân Viên
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      id="employeeName"
                      value={employeeName}
                      readOnly
                    />
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="identityCard"
                    >
                      CCCD
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      id="identityCard"
                      value={identityCard}
                      readOnly
                    />
                  </div>

                  <div className="flex items-center justify-end pt-4">
                    <button
                      type="submit"
                      className={`rounded bg-primary py-2 px-4 text-white hover:bg-primary-dark ${
                        loading ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                      disabled={loading}
                    >
                      {loading ? 'Adding...' : 'Add Contract'}
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

export default AddContract;
