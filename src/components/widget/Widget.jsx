import "./widget.scss";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";

const Widget = ({ type }) => {
  const [amount, setAmount] = useState(null);
  let data;

  switch (type) {
    case "user":
      data = {
        title: "Last Month",
        isMoney: false,
        link: "See all SMS",
        query: "SendSms",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "allUser":
      data = {
        title: "Total SMS",
        loginType: "all",
        isMoney: false,
        query: "SendSms",
      };
      break;

    default:
      break;
  }

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      const lastMonth = new Date(new Date().setMonth(today.getMonth() - 1));
      var lastMonthQuery = query(
        collection(db, data.query),
        where("createdAt", "<=", today),
        where("createdAt", ">", lastMonth)
      );
      if (data.loginType) {
        if (data.loginType === "all") {
          lastMonthQuery = query(
            collection(db, data.query)
          );
        } else {
          lastMonthQuery = query(
            collection(db, data.query),
            where("authType", "==", data.loginType),
          );
        }

      }
      const lastMonthData = await getDocs(lastMonthQuery);
      setAmount(lastMonthData.docs.length);

    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {amount}
        </span>
        <Link to={"/sms"}>
          <span className="link">{data.link}</span>
        </Link>
      </div>

    </div>
  );
};

export default Widget;
