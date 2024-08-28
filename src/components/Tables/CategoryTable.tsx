import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Category } from '../../types/common'; // Adjust the import path as needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { config } from '../../common/config';

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<{
    name: string;
    description: string;
  }>({
    name: '',
    description: '',
  });
  const token = sessionStorage.getItem('token');
  const modalRef = useRef<HTMLDivElement>(null);
  const apiEndpoint = `${config.apiBaseUrl}/categories`;
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(apiEndpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data.content);
      } catch (err) {
        setError('Failed to fetch categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCategory = async () => {
    if (
      newCategory.name.trim() === '' ||
      newCategory.description.trim() === ''
    ) {
      toast.error('Hãy nhập dữ liệu');
      return;
    }

    try {
      await axios.post(
        apiEndpoint,
        {
          name: newCategory.name,
          description: newCategory.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      // Fetch categories again to refresh the list
      const response = await axios.get(apiEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data.content);
      setIsModalOpen(false); // Close the modal
      setNewCategory({ name: '', description: '' }); // Reset form
      toast.success('Thêm thành công'); // Show success toast
    } catch (err) {
      setError('Failed to add category.');
    }
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isModalOpen]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark relative">
      <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Danh sách danh mục
        </h4>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded bg-primary py-2 px-4 text-white hover:bg-primary-dark"
        >
          Thêm danh mục
        </button>
      </div>

      <div className="overflow-x-auto">
        <div
          className="grid grid-cols-5 gap-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark"
          style={{ gridTemplateColumns: '5% 25% 45% 10% 15%' }}
        >
          {/* Header Row */}
          <div className="flex items-center px-4 py-2">
            <p className="font-medium truncate">ID</p>
          </div>
          <div className="flex items-center px-4 py-2">
            <p className="font-medium truncate">Tên</p>
          </div>
          <div className="flex items-center px-4 py-2">
            <p className="font-medium truncate">Mô tả</p>
          </div>
          <div className="flex items-center px-4 py-2">
            <p className="font-medium truncate">Ngày Tạo</p>
          </div>
          <div className="flex items-center px-4 py-2">
            <p className="font-medium truncate">Người Tạo</p>
          </div>
        </div>

        {categories.map((category) => (
          <div
            className="grid grid-cols-5 gap-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark"
            key={category.id}
            style={{ gridTemplateColumns: '5% 25% 45% 10% 15%' }}
          >
            <div className="flex items-center px-4 py-2">
              <p className="text-sm text-black dark:text-white truncate">
                {category.id}
              </p>
            </div>
            <div className="flex items-center px-4 py-2">
              <p className="text-sm text-black dark:text-white truncate">
                {category.name}
              </p>
            </div>
            <div className="flex items-center px-4 py-2">
              <p className="text-sm text-black dark:text-white truncate">
                {category.description || 'N/A'}
              </p>
            </div>
            <div className="flex items-center px-4 py-2">
              <p className="text-sm text-black dark:text-white truncate">
                {new Date(category.createdDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center px-4 py-2">
              <p className="text-sm text-black dark:text-white truncate">
                {category.createdBy || 'N/A'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding New Category */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          style={{ zIndex: 9999 }}
        >
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-lg shadow-lg w-1/3 dark:bg-boxdark relative"
            style={{ zIndex: 10000 }} // Ensure modal is above the overlay
          >
            <h3 className="text-lg font-semibold mb-4">Thêm danh mục</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Tên danh mục
              </label>
              <input
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary focus:border-primary dark:bg-boxdark dark:border-strokedark"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Mô tả
              </label>
              <textarea
                name="description"
                value={newCategory.description}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary focus:border-primary dark:bg-boxdark dark:border-strokedark"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded py-2 px-4 text-white bg-primary hover:bg-primary-dark"
              >
                Bỏ
              </button>
              <button
                onClick={handleAddCategory}
                className="rounded py-2 px-4 text-white bg-primary hover:bg-primary-dark"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default CategoryList;
