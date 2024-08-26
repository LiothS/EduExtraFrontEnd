import React from 'react';

interface CourseLinksProps {
  courseId: number;
}

const CourseLinks: React.FC<CourseLinksProps> = ({ courseId }) => {
  return (
    <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="p-7">
        <h3 className="text-lg font-semibold">Liên kết</h3>
        {/* Render course links here */}
        {/* Example links */}
        <ul>
          <li>
            <a href={`/courses/${courseId}/materials`}>Course Materials</a>
          </li>
          <li>
            <a href={`/courses/${courseId}/resources`}>Additional Resources</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CourseLinks;
