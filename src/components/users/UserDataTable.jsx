import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { userDatatable } from "../datatable/datatablesource";
import  UserUpdateButton from "./UserUpdateButton";
import { getAuth } from "firebase/auth";

const UserDataTable = () => {
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
      await deleteDoc( doc(db, "users", id));
      console.log(id)
      const user = auth.currentUser;

      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };
  const actionColumn = [
    {
      field: "action",
      headerName: "تعديل / حذف",
      width: 250,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {/* <UpdateModelUsers /> */}
            <UserUpdateButton userId={params.row.username}/>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              حذف
            </div>
            
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        المستخدمين
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userDatatable.concat(actionColumn)}
        pageSize={20}
        rowsPerPageOptions={[4]}
      />
    </div>
  );
};

export default UserDataTable;
