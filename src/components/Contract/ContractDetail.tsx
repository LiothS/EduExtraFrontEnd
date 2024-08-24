import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import { Contract } from '../../types/common';
import { config } from '../../common/config';

const ContractDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amountVisible, setAmountVisible] = useState(false); // State to manage amount visibility

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/contracts/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Bạn không có quyền xem hợp đồng của nhân viên khác');
        }
        const contractData: Contract = await response.json();
        setContract(contractData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [id]);

  const toggleAmountVisibility = () => {
    setAmountVisible(!amountVisible);
  };

  // Map `per` values to Vietnamese
  const perMapping: { [key: string]: string } = {
    MONTHLY: 'Tháng',
    HOURLY: 'Giờ',
    DAILY: 'Ngày',
  };

  // Map `earnType` values to Vietnamese
  const earnTypeMapping: { [key: string]: string } = {
    SALARY: 'Lương cứng',
    EXTRA: 'Hoa hồng',
  };

  // Get the Vietnamese equivalent for the `per` value
  const perText = perMapping[contract?.per || ''] || 'N/A';

  // Get the Vietnamese equivalent for the `earnType` value
  const earnTypeText = earnTypeMapping[contract?.earnType || ''] || 'N/A';

  // Get the Vietnamese equivalent for the `contractType` value
  const contractTypeText =
    contract?.contractType === 'LABOR' ? 'Hợp đồng lao động' : 'Khác';

  // Format amount based on `earnType`
  const amountText =
    contract?.earnType === 'EXTRA'
      ? `${amountVisible ? contract.amount.toLocaleString() : '**'}%`
      : amountVisible
      ? contract?.amount.toLocaleString()
      : '*********';

  if (loading) return <p className="text-center text-gray-600">Đang tải...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto bg-gray-100">
      {contract ? (
        <div className="bg-white">
          <header className="mb-8 p-6 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {contract.name}
            </h1>
          </header>

          <section className="mb-8 p-6">
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">
              Chi tiết hợp đồng
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Loại hợp đồng:
                </span>
                <span className="text-gray-800">{contractTypeText}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">
                  Loại thu nhập:
                </span>
                <span className="text-gray-800">{earnTypeText}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Ngày bắt đầu:</span>
                <span className="text-gray-800">
                  {new Date(contract.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Ngày hết hạn:</span>
                <span className="text-gray-800">
                  {new Date(contract.expiredDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Tiền tệ:</span>
                <span className="text-gray-800">{contract.currency}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-600">Số tiền:</span>
                <div className="flex items-center">
                  <span className="text-gray-800">{amountText}</span>
                  <button
                    type="button"
                    onClick={toggleAmountVisibility}
                    className="ml-2 text-gray-600"
                  >
                    {amountVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Theo:</span>
                <span className="text-gray-800">{perText}</span>
              </div>
              {contract.isTerminated && (
                <>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Trạng thái:
                    </span>
                    <span className="text-gray-800 text-red-600">
                      Đã chấm dứt
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Người chấm dứt:
                    </span>
                    <span className="text-gray-800">
                      {contract.terminatedBy || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Ngày chấm dứt:
                    </span>
                    <span className="text-gray-800">
                      {contract.terminatedDate
                        ? new Date(contract.terminatedDate).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="mb-8 p-6">
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">
              Thông tin nhân viên
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Tên:</span>
                <span className="text-gray-800">{contract.employeeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">CCCD/CMND:</span>
                <span className="text-gray-800">
                  {contract.employeeIdentity}
                </span>
              </div>
            </div>
          </section>

          {contract.course && contract.course.length > 0 && (
            <section className="p-6">
              <h2 className="text-3xl font-semibold text-gray-700 mb-4">
                Các khóa học liên kết
              </h2>
              <ul className="list-disc pl-5 space-y-4">
                {contract.course.map((course) => (
                  <li key={course.id} className="p-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-600">
                        Tên khóa học:
                      </span>
                      <span className="text-gray-800">{course.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        ID khóa học:
                      </span>
                      <span className="text-gray-800">{course.id}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-600">Không tìm thấy hợp đồng.</p>
      )}
    </div>
  );
};

export default ContractDetail;
