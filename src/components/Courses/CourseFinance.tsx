import React, { useState, useEffect } from 'react';
import CardDataStats from '../../components/CardDataStats';
import { config } from '../../common/config';

interface CourseFinanceProps {
  courseId: string;
}
interface PaymentHistoryItem {
  studentCode: string;
  studentFullName: string;
  studentPhone: string;
  paymentDate: string;
  amount: number;
  receiver: string;
}

const CourseFinance: React.FC<CourseFinanceProps> = ({ courseId }) => {
  const [financeData, setFinanceData] = useState<{
    estimation: number;
    received: number;
    paidStudents: number;
    unpaidStudents: number;
    numOfStudents: number;
  } | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
  };
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [new Date().getFullYear(), new Date().getFullYear() - 1];
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${config.apiBaseUrl}/finance/${courseId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || 'An unknown error occurred');
          return;
        }

        const data = await response.json();
        setFinanceData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchPaymentHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${config.apiBaseUrl}/finance/payment-history?year=${selectedYear}&month=${selectedMonth}&courseId=${courseId}&page=${page}&size=20&sort=createdDate,desc`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || 'An unknown error occurred');
          return;
        }

        const data = await response.json();
        setPaymentHistory(data.content);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
    fetchPaymentHistory();
  }, [courseId, page, selectedMonth, selectedYear]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const paidRate = financeData?.numOfStudents
    ? Math.round((financeData.paidStudents / financeData.numOfStudents) * 100)
    : 0;
  const unpaidRate = 100 - paidRate;
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Ước tính tháng này"
          total={
            financeData?.estimation
              ? formatCurrency(financeData.estimation)
              : '0 ₫'
          }
          rate=""
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z"
              fill=""
            />
            <path
              d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Đã thu"
          total={
            financeData?.received ? formatCurrency(financeData.received) : '0 ₫'
          }
          rate=""
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z"
              fill=""
            />
            <path
              d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Đã đóng"
          total={financeData?.paidStudents.toString() || '0'}
          rate={paidRate?.toString() + '%' || '0'}
          levelUp
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
              fill=""
            />
            <path
              d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
              fill=""
            />
            <path
              d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Chưa đóng"
          total={financeData?.unpaidStudents.toString() || '0'}
          rate={unpaidRate?.toString() + '%' || '0%'}
          levelDown
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
              fill=""
            />
            <path
              d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
              fill=""
            />
            <path
              d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
              fill=""
            />
          </svg>
        </CardDataStats>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6">
        <h2 className="mb-6 text-lg font-semibold text-black dark:text-white">
          Lịch sử thanh toán
        </h2>

        <div className="flex gap-4 mb-6">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-black dark:text-white mb-1">
              Tháng
            </label>
            <select
              className="p-2 border border-stroke rounded-sm dark:border-strokedark text-sm"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  Tháng {month}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-black dark:text-white mb-1">
              Năm
            </label>
            <select
              className="p-2 border border-stroke rounded-sm dark:border-strokedark text-sm"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="grid gap-2 rounded-sm bg-gray-2 dark:bg-meta- pl-5 pr-5"
          style={{
            gridTemplateColumns: '15% 20% 15% 20% 15% 15%',
          }}
        >
          <div className="pt-5 pb-5 flex">
            <h5 className="text-xs font-medium uppercase">Mã học sinh</h5>
          </div>
          <div className="pt-5 pb-5 flex">
            <h5 className="text-xs font-medium uppercase">Tên học sinh</h5>
          </div>
          <div className="pt-5 pb-5 flex">
            <h5 className="text-xs font-medium uppercase">Số điện thoại</h5>
          </div>
          <div className="pt-5 pb-5 flex">
            <h5 className="text-xs font-medium uppercase">Ngày thanh toán</h5>
          </div>
          <div className="pt-5 pb-5 flex">
            <h5 className="text-xs font-medium uppercase">Số tiền</h5>
          </div>
          <div className="pt-5 pb-5 flex">
            <h5 className="text-xs font-medium uppercase">Người thu</h5>
          </div>
        </div>

        {paymentHistory.map((payment, index) => (
          <div
            className={`grid gap-2 pl-5 pr-5 ${
              index !== paymentHistory.length - 1
                ? 'border-b border-stroke dark:border-strokedark'
                : ''
            }`}
            style={{
              gridTemplateColumns: '15% 20% 15% 20% 15% 15%',
            }}
            key={index}
          >
            <div className="pt-5 pb-5 flex">
              <p className="text-xs text-black dark:text-white">
                {payment.studentCode}
              </p>
            </div>
            <div className="pt-5 pb-5 flex">
              <p className="text-xs text-black dark:text-white">
                {payment.studentFullName}
              </p>
            </div>
            <div className="pt-5 pb-5 flex">
              <p className="text-xs text-black dark:text-white">
                {payment.studentPhone}
              </p>
            </div>
            <div className="pt-5 pb-5 flex">
              <p className="text-xs text-black dark:text-white">
                {formatDate(payment.paymentDate)}
              </p>
            </div>
            <div className="pt-5 pb-5 flex">
              <p className="text-xs text-meta-3">
                {formatCurrency(payment.amount)}
              </p>
            </div>
            <div className="pt-5 pb-5 flex">
              <p className="text-xs text-black dark:text-white">
                {payment.receiver}
              </p>
            </div>
          </div>
        ))}

        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 text-xs"
            onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 text-xs"
            onClick={() =>
              setPage((prevPage) =>
                prevPage < totalPages ? prevPage + 1 : prevPage,
              )
            }
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default CourseFinance;
