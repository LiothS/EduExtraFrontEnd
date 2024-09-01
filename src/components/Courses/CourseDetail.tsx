import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Course } from '../../types/common'; // Import Course type
import { config } from '../../common/config'; // Assuming this has API configuration
import { toast, ToastContainer } from 'react-toastify'; // For notifications
import CourseInfo from './CourseInfo';
import StudentCourseList from './StudentCourseList';
import CourseContract from './CourseContract';
import CourseFinance from './CourseFinance';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('courseInfo');
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.apiBaseUrl}/courses/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`, // Assuming the token is stored in the config
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          // Display the error message from the response
          toast.error(errorData.message || 'An unknown error occurred');
          return;
        }

        const data: Course = await response.json();
        setCourse(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleSaveChanges = async () => {
    if (!course) return;

    try {
      await fetch(`${config.apiBaseUrl}/courses/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(course),
      });
      toast.success('Course updated successfully');
    } catch (err) {
      toast.error('Failed to update course');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="w-full px-4 mx-auto">
        <Breadcrumb pageName="Lớp học" />

        <div className="bg-white shadow-md rounded-lg p-4">
          {/* Tabs Navigation */}
          <div className="flex border-b border-stroke">
            <button
              onClick={() => setActiveTab('courseInfo')}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === 'courseInfo'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600'
              } focus:outline-none`}
            >
              Thông tin lớp học
            </button>
            <button
              onClick={() => setActiveTab('studentList')}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === 'studentList'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600'
              } focus:outline-none`}
            >
              Danh sách học sinh
            </button>
            <button
              onClick={() => setActiveTab('financials')}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === 'financials'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600'
              } focus:outline-none`}
            >
              Tài chính
            </button>
            <button
              onClick={() => setActiveTab('courseLinks')}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === 'courseLinks'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600'
              } focus:outline-none`}
            >
              Liên kết
            </button>
          </div>

          {/* Tabs Content */}
          <div className="pt-4">
            {activeTab === 'courseInfo' && course?.id !== undefined && (
              <CourseInfo courseId={course.id} />
            )}

            {activeTab === 'studentList' && (
              <StudentCourseList courseId={course?.id || 0} />
            )}

            {activeTab === 'financials' && course?.id !== undefined && (
              <CourseFinance courseId={course.id} />
            )}

            {activeTab === 'courseLinks' && (
              <CourseContract courseUserId={course?.userId || 0} />
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default CourseDetail;
