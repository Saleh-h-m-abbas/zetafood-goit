export const customerDatatable = [
  // { field: "id", headerName: "الرقم التعريفي", width: 200 },
  { field: "name", headerName: "اسم الزبون", width: 300 },
  { field: "saleTarget", headerName: "الهدف الشهري", width: 120 },
  { field: "sales_manager_name", headerName: "اسم مسؤول المبيعات", width: 200 },
  {
    field: "createdAt",
    headerName: "أنشئت في",
    width: 140,
    renderCell: (params) => {
      return (
        <div>{`${params.row.createdAt
            ? params.row.createdAt.toDate().toDateString()
            : ""
          }`}</div>
      );
    },
  },
];

export const userDatatable = [
  // { field: "uid", headerName: "الرقم", width: 250 },
  { field: "username", headerName: "اسم المستخدم", width: 200 },
  { field: "email", headerName: "الايميل", width: 200 },
  { field: "superName", headerName: "اسم المشرف", width: 200 },
  {
    field: "role",
    headerName: "الصلاحيات",
    width: 200,
    renderCell: (params) => {
      return (
        <div>{`${params.row.role === 0
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
    headerName: "أنشئت في",
    width: 200,
    renderCell: (params) => {
      return (
        <div>{`${params.row.createdAt
            ? params.row.createdAt?.toDate().toDateString()
            : ""
          }`}</div>
      );
    },
  },
];

export const userDatatableInfo = [
  { field: "day", headerName: "day", width: 250 },
  { field: "customers", headerName: "customers", width: 100 },
];
