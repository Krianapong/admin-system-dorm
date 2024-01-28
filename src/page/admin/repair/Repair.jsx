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
    renderCell: (params) =>
      `${params.row.ownerDetails.firstName} ${params.row.ownerDetails.lastName}`,
  },
  {
    field: "totalAmount",
    type: "string",
    headerName: "ราคา",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "รูป",
    width: 150,
    renderCell: (params) => {
      return React.createElement("img", {
        src: params.row.ownerDetails.avatar || "/noavatar.png",
        alt: "",
      });
    },
  },
  {
    field: "phone",
    headerName: "เบอร์โทร",
    type: "string",
    width: 200,
    renderCell: (params) =>
      `${params.row.ownerDetails.phone}`,
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
    
        const roomsData = [];
        for (const roomDoc of roomsQuerySnapshot.docs) {
          const room = roomDoc.data();
          const ownerUID = room.owner;
    
          // Fetch owner profile details
          const profileDoc = await firestore.collection("profiles").doc(ownerUID).get();
          const ownerDetails = profileDoc.data();
    
          // Fetch service details by specifying the document path
          const serviceDoc = await firestore.collection(`Services/Repair/${ownerUID}`).doc(ownerUID).get();
          const serviceData = serviceDoc.data();
    
          // Combine room data with owner details and service details
          roomsData.push({
            id: roomDoc.id,
            numroom: room.numroom,
            owner: ownerUID,
            ownerDetails: {
              firstName: ownerDetails.firstName,
              lastName: ownerDetails.lastName,
              phone: ownerDetails.phone
            },
            totalAmount: serviceData.totalAmount || 0,
            selectedRoom: serviceData.selectedRoom || '', 
            img: room.img,
            status: serviceData.status || ''
            // Add other fields from rooms collection as needed
          });
        }
    
        setData(roomsData);
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
