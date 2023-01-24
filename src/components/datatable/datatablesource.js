export const customerDatatable = [
  { field: "id", headerName: "الرقم التعريفي", width: 200 },
  { field: "name", headerName: "اسم الزبون", width: 300 },
  // TODO:: Replace ID with Name
  { field: "sales_manager_id", headerName: "اسم مسؤول المبيعات", width: 200 },
  {
    field: "createdAt",
    headerName: "أنشئت في",
    width: 140,
    renderCell: (params) => {
      return (
        <div>{`${
          params.row.createdAt
            ? params.row.createdAt.toDate().toDateString()
            : ""
        }`}</div>
      );
    },
  },
];

export const userDatatable = [
  { field: "uid", headerName: "الرقم", width: 250 },
  { field: "username", headerName: "اسم المستخدم", width: 100 },
  { field: "email", headerName: "الايميل", width: 200 },
  {
    field: "role",
    headerName: "الصلاحيات",
    width: 200,
    renderCell: (params) => {
      return (
        <div>{`${
          params.row.role === 0
            ? "مدير"
            : params.row.role === 1
            ? "مشرف"
            : "مندوب"
        }`}</div>
      );
    },
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    renderCell: (params) => {
      return (
        <div>{`${
          params.row.createdAt
            ? params.row.createdAt?.toDate().toDateString()
            : ""
        }`}</div>
      );
    },
  },
];
