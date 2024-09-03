// src/components/Income/IncomeTab.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { config } from '../../common/config';

interface IncomeResponse {
  laborContractSalary: {
    amount: number;
    contractId: number;
    startDate: string;
    endDate: string;
  };
  extraSalaries: {
    amount: number;
    contractId: number;
    description: string;
    courseId: string;
    courseIncome: any; // Adjust type based on expected data
  }[];
  total: number;
}

const IncomeTab: React.FC<{ userId: number }> = ({ userId }) => {
  const [incomeData, setIncomeData] = useState<IncomeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const response = await fetch(
          `${config.apiBaseUrl}/finance/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`, // Replace with your token
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.message || 'Đã xảy ra lỗi không xác định');
          return;
        }

        const data: IncomeResponse = await response.json();
        setIncomeData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeData();
  }, [userId]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Thu nhập</h2>

      {/* Table for Labor Contract Salary */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Lương hợp đồng</h3>
        {incomeData?.laborContractSalary ? (
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Mức lương</th>
                <th className="border border-gray-300 px-4 py-2">
                  Ngày bắt đầu
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Ngày kết thúc
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Mã hợp đồng
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  {incomeData.laborContractSalary.amount.toLocaleString(
                    'vi-VN',
                    {
                      style: 'currency',
                      currency: 'VND',
                    },
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(
                    incomeData.laborContractSalary.startDate,
                  ).toLocaleDateString('vi-VN')}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(
                    incomeData.laborContractSalary.endDate,
                  ).toLocaleDateString('vi-VN')}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  HD-{incomeData.laborContractSalary.contractId}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>Không có thông tin lương hợp đồng</p>
        )}
      </div>

      {/* Table for Extra Salaries */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Lương thêm</h3>
        {incomeData?.extraSalaries.length > 0 ? (
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Mức lương</th>
                <th className="border border-gray-300 px-4 py-2">Mô tả</th>

                <th className="border border-gray-300 px-4 py-2">Mã lớp</th>
                <th className="border border-gray-300 px-4 py-2">
                  Mã hợp đồng
                </th>
              </tr>
            </thead>
            <tbody>
              {incomeData.extraSalaries.map((salary, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    {salary.amount.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {salary.description}
                  </td>

                  <td className="border border-gray-300 px-4 py-2">
                    {salary.courseId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    HD-{salary.contractId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có lương thêm</p>
        )}
      </div>

      {/* Total Income */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Tổng thu nhập</h3>
        <p>
          {incomeData?.total.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
          })}
        </p>
      </div>
    </div>
  );
};

export default IncomeTab;
