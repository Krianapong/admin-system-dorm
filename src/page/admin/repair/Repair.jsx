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
    renderCell: (params) => `${params.row.ownerDetails.phone}`,
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

          // Check if owner field exists and is valid
          if (room.owner) {
            const ownerUID = room.owner;

            // Fetch owner profile details
            const profileDoc = await firestore
              .collection("profiles")
              .doc(ownerUID)
              .get();
            const ownerDetails = profileDoc.data();

            // Fetch additional data from /Services/Repairt/{ownerUID}
            const repairQuerySnapshot = await firestore
              .collection("Services")
              .doc("Repairt")
              .collection(ownerUID)
              .where("selectedRoom", "==", roomDoc.id)
              .get();

            let totalAmount = "";
            let status = "";

            // Check if repair data exists for the selected room
            if (!repairQuerySnapshot.empty) {
              const repairDoc = repairQuerySnapshot.docs[0];
              const repairData = repairDoc.data();
              totalAmount = repairData.totalAmount;
              status = repairData.status;
            }

            // Combine room data with owner details, totalAmount, and status
            console.log("Total:", totalAmount);
            console.log("Status:", status);

            roomsData.push({
              id: roomDoc.id,
              numroom: room.numroom,
              owner: ownerUID,
              ownerDetails: {
                firstName: ownerDetails.firstName,
                lastName: ownerDetails.lastName,
                phone: ownerDetails.phone,
                avatar: ownerDetails.avatar,
              },
              totalAmount: totalAmount,
              status: status,
              img: room.img,
              // Add other fields from rooms collection as needed
            });
          } else {
            console.error(
              "Room document does not have valid owner field:",
              roomDoc.id
            );
          }
        }

        setData(roomsData);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchData();
  }, []);

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
