// src/App.tsx
import { Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/AuthPage'; // Updated import
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import UserDetail from './pages/Users/UserDetail';
import { useEffect, useState } from 'react';
import AddUser from './pages/Users/AddUser';
import ContractDetail from './components/Contract/ContractDetail';
import AddContract from './components/Contract/AddContract';
import CoursesTable from './components/Tables/CoursesTable';
import CourseAddPage from './components/Courses/CoursesAdd';
import CourseDetail from './components/Courses/CourseDetail';
import CategoryList from './components/Tables/CategoryTable';
import StudentTable from './components/Tables/StudentTable';

function App() {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      {isAuthenticated ? (
        <DefaultLayout>
          <Routes>
            <Route
              path="/user-detail/:id"
              element={
                <>
                  <PageTitle title="Thông tin nhân viên" />
                  <UserDetail />
                </>
              }
            />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/students" element={<StudentTable />} />
            <Route path="/course-detail/:id" element={<CourseDetail />} />
            <Route path="/contract-detail/:id" element={<ContractDetail />} />
            <Route path="/course-add" element={<CourseAddPage />} />
            <Route
              path="/add-contract/:userId"
              element={<AddContract />}
            />{' '}
            {/* Add this route */}
            <Route path="/courses" element={<CoursesTable />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route
              index
              element={
                <>
                  <PageTitle title="EFE| Trung tâm quản lý" />
                  <Tables />
                </>
              }
            />
            <Route
              path="/calendar"
              element={
                <>
                  <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Calendar />
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Profile />
                </>
              }
            />
            <Route
              path="/forms/form-elements"
              element={
                <>
                  <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <FormElements />
                </>
              }
            />
            <Route
              path="/forms/form-layout"
              element={
                <>
                  <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <FormLayout />
                </>
              }
            />
            <Route
              path="/tables"
              element={
                <>
                  <PageTitle title="EFE | Trung tâm quản lý" />
                  <Tables />
                </>
              }
            />
            <Route
              path="/settings"
              element={
                <>
                  <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Settings />
                </>
              }
            />
            <Route
              path="/chart"
              element={
                <>
                  <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Chart />
                </>
              }
            />
            <Route
              path="/ui/alerts"
              element={
                <>
                  <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Alerts />
                </>
              }
            />
            <Route
              path="/ui/buttons"
              element={
                <>
                  <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Buttons />
                </>
              }
            />
            <Route
              path="/auth/signin"
              element={
                <>
                  <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <SignIn />
                </>
              }
            />
            <Route
              path="/auth/signup"
              element={
                <>
                  <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <SignUp />
                </>
              }
            />
          </Routes>
        </DefaultLayout>
      ) : (
        <SignIn />
      )}
    </>
  );
}

export default App;
