import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import UsersList from '../components/Tables/UsersTable';

const Tables = () => {
  return (
    <>
      <Breadcrumb pageName="Nhân Viên" />

      <div className="flex flex-col gap-10">
        {/* <TableOne /> */}
        <UsersList />
        {/* <TableThree /> */}
      </div>
    </>
  );
};

export default Tables;
