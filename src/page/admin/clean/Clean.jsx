import React, { useState, useEffect } from "react";
import DataTable from "../../../components/dataTable/DataTable.jsx";
import { firestore } from "../../../firebase.js";

const columns = [
  {
    field: "firstName",
    type: "string",
    headerName: "ชื่อ",
    width: 150,
  },
  {
    field: "imageUrl",
    headerName: "รูป",
    width: 150,
    renderCell: (params) => {
      return React.createElement("img", {
        src: params.row.imageUrl || "/noavatar.png",
        alt: "",
      });
    },
  },
  {
    field: "phone",
    headerName: "เบอร์โทร",
    type: "string",
    width: 200,
  },
  {
    field: "selectedRoom",
    type: "string",
    headerName: "ห้องที่เลือก",
    width: 200,
  },
  {
    field: "status",
    headerName: "สถานะ",
    width: 200,
    type: "string",
  },
  {
    field: "totalAmount",
    type: "string",
    headerName: "ราคา",
    width: 200,
  },
];

const HousewifeServices = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesCollection = firestore.collection("Housewife");
        const servicesQuerySnapshot = await servicesCollection.get();
        const servicesData = servicesQuerySnapshot.docs.map((serviceDoc) => {
          return { id: serviceDoc.id, ...serviceDoc.data() };
        });
        setData(servicesData);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchData();
  }, []); // Run this effect only once (on mount)

  return (
    <div>
      <div className="header-content">
        <h2>บริการคุณแม่บ้าน</h2>
      </div>
      <DataTable columns={columns} rows={data} />
    </div>
  );
};

export default HousewifeServices;
