import "./datatable.scss";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
const useStyles = makeStyles({
  table: {
    width: "100%",
    margin: "0 auto",
    textAlign: "right",
    boxShadow: "0px 0px 10px #ccc",
  },
  scrollableCell: {
    maxHeight: 200,
    overflowY: "auto",
  },
});
const UserDataTableInfo = ({ userId, getCustomers }) => {
  const [data, setData] = useState([]);
  const classes = useStyles();
  const [customersList, setCustomersList] = useState([]);

  const getData = async () => {
    const docRef = doc(db, "users", userId);
    const snapshot = await getDoc(docRef);
    const item = snapshot.data().customerListByDay;
    setData(item);
  };
  const getCustomersForName = async () => {
    if (customersList.length == 0) {
      const userArray = [];
      const q = query(collection(db, "customers"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        userArray.push({ uid: doc.id, name: doc.get("name") });
      });
      setCustomersList(userArray);
    }
  };

  useEffect(() => {
    getCustomersForName();
    getData();
  }, [userId]);

  const deleteCustomers = async (item, cUid) => {
    const newMap = data.filter((e) => e.day !== item.day);
    const newMapOfDay = data.filter((e) => e.day === item.day);
    newMapOfDay[0].customers.pop(cUid);
    newMap.push(newMapOfDay[0]);
    const frankDocRef = doc(db, "users", userId);
    try {
      await updateDoc(frankDocRef, {
        customerListByDay: newMap,
      });
      getCustomers(userId);
    } catch (e) {
      console.log(e);
    }
    setData(newMap);
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">الايام للمندوب المختار</div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{ textAlign: "right" }}>Day</TableCell>
              <TableCell style={{ textAlign: "right" }}>Customers</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userId !== "" &&
              data.map((item) => (
                <TableRow>
                  <TableCell style={{ textAlign: "right" }}>
                    {item.day}
                  </TableCell>
                  <TableCell style={{ textAlign: "right" }}>
                    <div className={classes.scrollableCell}>
                      {customersList &&
                        item.customers.map((e) => {
                          const customer = customersList.find(
                            (x) => x.uid === e
                          );
                          return customer ? (
                            <div
                            style={{
                              backgroundColor: "white",
                              borderRadius: "10px",
                              boxShadow: "5px 5px 5px #aaaaaa",
                              alignItems: "center",
                              margin: "10px",
                              padding: "10px",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                            >
                              <div>{customer.name}</div>
                              <button
                                 style={{
                                   backgroundColor: "red",
                                   color: "white",
                                   border: "0px",
                                   margin: "5px",
                                   padding: "5px",
                                   borderRadius: "5px",
                                 }}
                                 onClick={() => deleteCustomers(item, e)}
                               >
                                 Delete
                               </button>
                            </div>
                          ) : null;
                        })}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserDataTableInfo;
