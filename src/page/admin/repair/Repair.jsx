import React, { useState, useEffect } from "react";
import DataTable from "../../../components/dataTable/DataTable.jsx";
import { firestore } from "../../../firebase.js";

const columns = [
  {
    field: "id",
    type: "string",
    headerName: "เลขห้อง",
    width: 150,
  },
  {
    field: "owner",
    type: "string",
    headerName: "ชื่อ - นามสกุล",
    width: 200,
    renderCell: (params) => {
      return params.row.owner
        ? `${params.row.firstName} ${params.rowlastName}`
        : "";
    },
  },
  {
    field: "totalAmount",
    type: "string",
    headerName: "ราคา",
    width: 200,
  },
  {
    field: "img",
    headerName: "รูป",
    width: 150,
    renderCell: (params) => {
      return React.createElement("img", {
        src: params.row.img || "/noavatar.png",
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
    field: "status",
    headerName: "สถานะ",
    width: 200,
    type: "string",
  },
];

const Repair = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsCollection = firestore.collection("rooms");
        const roomsQuerySnapshot = await roomsCollection.get();
        const roomsData = roomsQuerySnapshot.docs.map((roomDoc) => {
          return { id: roomDoc.id, ...roomDoc.data() };
        });

        const profilesCollection = firestore.collection("profiles");
        const profilesQuerySnapshot = await profilesCollection.get();
        const profilesData = profilesQuerySnapshot.docs.map((profileDoc) => {
          return { id: profileDoc.id, ...profileDoc.data() };
        });

        const combinedData = roomsData.map((rooms) => {
          const ownerProfile = profilesData.find(
            (profiles) => profiles.firstName === rooms.owner
          );
          return {
            ...rooms,
            ownerDetails: ownerProfile || {},
          };
        });

        setData(combinedData);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchData();
  }, []); // Run this effect only once (on mount)

  return (
    <div>
      <div className="header-content">
        <h2>แจ้งซ่อม</h2>
      </div>
      <DataTable columns={columns} rows={data} />
    </div>
  );
};

export default Repair;
