import { useState } from 'react';
import { Loader, Plus, RefreshCw, X } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import CoursesTable from '../components/courses/CoursesTable';
import Layout from '../components/layout';
import Modal from '../components/shared/Modal';
import useAuth from '../hooks/useAuth';
import CreateCourseRequest from '../models/course/CreateCourseRequest';
import courseService from '../services/CourseService';

export default function Courses() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [addCourseShow, setAddCourseShow] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const { authenticatedUser } = useAuth();
  const { data, isLoading, refetch } = useQuery(
    ['courses', name, description],
    () =>
      courseService.findAll({
        name: name || undefined,
        description: description || undefined,
      }),
    // {
    //   refetchInterval: 1000,
    // },
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CreateCourseRequest>();

  const handleRefresh = () => {
    // manually refetch
    refetch();
  };
  const saveCourse = async (createCourseRequest: CreateCourseRequest) => {
    try {
      await courseService.save(createCourseRequest);
      setAddCourseShow(false);
      reset();
      setError(null);
      handleRefresh();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <Layout>
      <div className="header-background pb-5 pt-1">
        <h1 className="font-semibold text-3xl px-5 sm:px-10 mt-3">
          Manage Courses
        </h1>
      </div>
      <hr />
      <div className="px-5 sm:px-10">
        <div className="flex flex-row">
          {authenticatedUser.role !== 'user' ? (
            <button
              className="btn primary-red my-5 flex gap-2 w-full sm:w-auto justify-center"
              onClick={() => setAddCourseShow(true)}
            >
              <Plus /> Add Course
            </button>
          ) : null}
          <button
            className="btn primary-red my-5 flex gap-2 w-full sm:w-auto justify-center ml-5"
            onClick={() => handleRefresh()}
          >
            <RefreshCw /> Refresh
          </button>
        </div>
        <div className="table-filter">
          <div className="flex flex-row gap-5">
            <input
              type="text"
              className="input w-1/2"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              className="input w-1/2"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <CoursesTable data={data} isLoading={isLoading} />
      </div>

      {/* Add User Modal */}
      <Modal show={addCourseShow}>
        <div className="flex">
          <h1 className="font-semibold mb-3">Add Course</h1>
          <button
            className="ml-auto focus:outline-none"
            onClick={() => {
              reset();
              setAddCourseShow(false);
            }}
          >
            <X size={30} />
          </button>
        </div>
        <hr />

        <form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(saveCourse)}
        >
          <input
            type="text"
            className="input"
            placeholder="Name"
            disabled={isSubmitting}
            required
            {...register('name')}
          />
          <input
            type="text"
            className="input"
            placeholder="Description"
            disabled={isSubmitting}
            required
            {...register('description')}
          />
          <button className="btn primary-red" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin mx-auto" />
            ) : (
              'Save'
            )}
          </button>
          {error ? (
            <div className="text-red-500 p-3 font-semibold border rounded-md bg-red-50">
              {error}
            </div>
          ) : null}
        </form>
      </Modal>
    </Layout>
  );
}
