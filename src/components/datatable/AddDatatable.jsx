import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { smsColumns } from "../../datatablesource";
import { useEffect, useState } from "react";
import {
  deleteDoc,
  doc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import { PopupMessage } from "./PopupMessage";

const AddDatatable = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // LISTEN (REALTIME)
    const sub = onSnapshot(
      collection(db, "sms"),
      (snapShot) => {
        let list = snapShot.docs.map(doc => {
          return { ...doc.data(), id: doc.id }
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
      await deleteDoc(doc(db, "sms", id));
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>

           
            <PopupMessage />

          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        SMS Messages List
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={smsColumns.concat(actionColumn)}
        pageSize={100}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
};

export default AddDatatable;
