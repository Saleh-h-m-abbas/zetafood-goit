import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import { UpdateSalaryButton } from "../buttons/UpdateSalaryButton";
import  CustomerFormButton  from "./CustomerFormButton";
import { customerDatatable } from "../datatable/datatablesource";
import { UpdateModelCustomers } from "../model/UpdateModelCustomers";

const CustomerDataTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // LISTEN (REALTIME)
    const sub = onSnapshot(
      collection(db, "customers"),
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
      await deleteDoc( doc(db, "customers", id));
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };
  const actionColumn = [
    {
      field: "action",
      headerName: "تعديل / حذف",
      width: 350,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <UpdateSalaryButton customerId={params.row.id} />
            {/* <UpdateModelCustomers customerId={params.row} /> */}
            <CustomerFormButton />
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
        الزبائن
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={customerDatatable.concat(actionColumn)}
        pageSize={20}
        rowsPerPageOptions={[4]}
      />
    </div>
  );
};

export default CustomerDataTable;
