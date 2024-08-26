import React, { useEffect, useState } from 'react';
import { config } from '../../common/config';

interface StudentListProps {
  courseId: number;
}

const StudentList: React.FC<StudentListProps> = ({ courseId }) => {
  const [students, setStudents] = useState<any[]>([]); // Replace `any` with a proper type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `${config.apiBaseUrl}/courses/${courseId}/students`,
        );
        if (!response.ok) throw new Error('Failed to fetch students');
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [courseId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="p-7">
        <h3 className="text-lg font-semibold">Danh sách học sinh</h3>
        {/* Render student list here */}
        <ul>
          {students.map((student) => (
            <li key={student.id}>{student.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentList;
