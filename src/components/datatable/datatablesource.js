export const customerDatatable = [
  { field: "id", headerName: "الرقم التعريفي", width: 200 },
  { field: "name", headerName: "اسم الزبون", width: 300 },
  // TODO:: Replace ID with Name
  { field: "sales_manager_id", headerName: "اسم مسؤول المبيعات", width: 200 },
  // { field: "sms", headerName: "SMS Message", width: 600 },
  // { field: "sender", headerName: "SMS Header", width: 150 },
  // { field: "email", headerName: "Sender Email", width: 150 },
  {
    field: "createdAt",
    headerName: "أنشئت في",
    width: 140,
    renderCell: (params) => {
      return (
        <div>{`${params.row.createdAt ? params.row.createdAt.toDate().toDateString() : ''}`}</div>
      );
    },
  },
];

export const smsColumns = [
  { field: "id", headerName: "ID", width: 200 },
  { field: "title", headerName: "SMS Title", width: 100 },
  { field: "sms", headerName: "SMS Message", width: 800 },
  { field: "email", headerName: "Added User", width: 250 },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    renderCell: (params) => {
      return (
        <div>{`${params.row.createdAt ? params.row.createdAt?.toDate().toDateString() : ''}`}</div>
      );
    },

  },

];
export const usersColumns = [
  { field: "id", headerName: "ID", width: 250 },
  { field: "username", headerName: "Username", width: 150 },
  { field: "email", headerName: "Email", width: 200 },
  {
    field: "role", headerName: "Role", width: 100, renderCell: (params) => {
      return (
        <div>{`${params.row.role === 0 ? 'Root' : params.row.role === 1 ? 'Admin' : 'User'}`}</div>
      );
    },
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 140,
    renderCell: (params) => {
      return (
        <div>{`${params.row.createdAt ? params.row.createdAt.toDate().toDateString() : ''}`}</div>
      );
    },
  },
];