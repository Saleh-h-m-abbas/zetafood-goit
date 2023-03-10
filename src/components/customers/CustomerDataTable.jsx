import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { UpdateSalaryButton } from "../buttons/UpdateSalaryButton";
import { customerDatatable } from "../datatable/datatablesource";
import UpdateCustomer from "./UpdateCustomer";

const CustomerDataTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // LISTEN (REALTIME)
    const sub = onSnapshot(
      collection(db, "customers"),
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
  const handleDelete = async (parms) => {
    try {
      const userArray = [];
      const q = query(collection(db, "users"), where("uid", "==", parms.sales_manager_id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        userArray.push({ id: doc.data().uid, customerListByDay: doc.get("customerListByDay") });
      });
      const newArray = userArray[0].customerListByDay
        .map((obj) => ({ ...obj, customers: obj.customers.filter((num) => num !== parms.id) }));

      const frankDocRef = doc(db, "users", parms.sales_manager_id);
      await updateDoc(frankDocRef, {
        customerListByDay: newArray,
      });
      await deleteDoc(doc(db, "customers", parms.id));
      setData(data.filter((item) => item.id !== parms.id));
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
            <UpdateSalaryButton customerId={params.row}  />
            <UpdateCustomer customerData={params.row} />
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row)}
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
