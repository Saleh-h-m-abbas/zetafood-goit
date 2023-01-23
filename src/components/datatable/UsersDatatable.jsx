import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { usersColumns } from "../../datatablesource";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";

const UsersDatatable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // LISTEN (REALTIME)
    const sub = onSnapshot(
      collection(db, "users"),
      (snapShot) => {
        let list = snapShot.docs.map(doc=>{
          return {...doc.data(),id: doc.id}
        })
        setData(list);
      },
      (error) => {
        console.log('error');
      }
    );
    return sub;
  }, []);
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Users List
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={usersColumns.concat(actionColumn)}
        pageSize={100}
        rowsPerPageOptions={[9]}
      />
    </div>
  );
};

export default UsersDatatable;
