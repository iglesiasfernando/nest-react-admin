import { useState } from 'react';
import { useQuery } from 'react-query';

import CoursesTable from '../../components/courses/CoursesTable';
import Layout from '../../components/layout';
import courseService from '../../services/CourseService';

export default function NewCourses() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string>();

  const { data, isLoading, refetch } = useQuery(
    ['courses', name, description],
    () => courseService.findAll({}),
    {
      refetchInterval: 8000,
    },
  );
  const getFormatedDate = (dateCreated: Date) => {
    let date = new Date(dateCreated);
    date.setHours(0, 0, 0, 0);
    return date;
  };
  return (
    <>
      <div className="card shadow">
        <h1 className="font-semibold px-5 mt-3">Nuevos Cursos</h1>
        <hr />
        <div className="px-5 sm:px-10">
          <CoursesTable
            canEdit={false}
            data={data?.filter(
              (course) =>
                getFormatedDate(course.dateCreated).toISOString() ===
                getFormatedDate(new Date()).toISOString(),
            )}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}
