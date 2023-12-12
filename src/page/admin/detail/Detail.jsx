import React, { useState, useEffect } from "react";
import "./detail.css";
import DataTableAC from "../../../components/dataTableroom/DataTableRoom";
import Add from "../../../components/add/Add";
import { firestore } from "../../../firebase";

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "img",
    headerName: "รูป",
    width: 150,
    renderCell: (params) => {
      return (
        <img
          src={`https://firebasestorage.googleapis.com/v0/b/hopak2-7320e.appspot.com/o/profiles_image%2F${params.row.img}.jpg?alt=media`}
          alt="profiileAvatar"
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
      );
    },
  },
  {
    field: "roomNumber",
    type: "string",
    headerName: "เลขห้อง",
    width: 150,
  },
  {
    field: "name",
    type: "string",
    headerName: "ชื่อ - นามสกุล",
    width: 220,
  },
  {
    field: "email",
    type: "string",
    headerName: "อีเมล",
    width: 220,
  },
  {
    field: "phoneNumber",
    headerName: "เบอร์โทร",
    type: "string",
    width: 220,
  },
  {
    field: "dateIn",
    headerName : "วันเข้าหอพัก",
    type : 'String',
    width : 220,
  },
  {
    field: "dateOut",
    headerName : "วันออกหอพัก",
    type : 'String',
    width : 220,
  }
];

const Detail = () => {
  const [open, setOpen] = useState(false);
  const [memberData, setMemberData] = useState([]);

  useEffect(() => {
    try {
      const fetchOwnerData = async () => {
        const collRef = firestore.collection("rooms");
        const querySnapshot = await collRef.get();
        const memberDataArray = [];

        await Promise.all(
          querySnapshot.docs.map(async (docSnapshot) => {
            const room = docSnapshot.id;
            const owner = docSnapshot.data().owner;
            const DateIn = docSnapshot.data().datein;
            const DateOut = docSnapshot.data().dateout;
  
            if (owner !== null) {
              const collRef = firestore.collection("profiles").doc(owner);
              const doc = await collRef.get();
              if (doc.exists) {
                const data = {
                  id: memberDataArray.length + 1,
                  img: owner,
                  roomNumber: room,
                  name: doc.data().name,
                  email: doc.data().email,
                  phoneNumber: doc.data().phone,
                  dateIn : DateIn,
                  dateOut : DateOut,
                };

                memberDataArray.push(data);
              }
            }
          })
        );

        setMemberData(memberDataArray);
      };

      fetchOwnerData();
    } catch (error) {
      console.log("error fetching owner data: ", error);
    }
  }, []);


  return (
    <div>
      <div className="header-content">
        <h2>รายละเอียดผู้เช่า</h2>
      </div>
      <DataTableAC slug="products" columns={columns} rows={memberData} />
      {open && <Add slug="product" columns={columns} setOpen={setOpen} />}
    </div>
  );
};

export default Detail;
