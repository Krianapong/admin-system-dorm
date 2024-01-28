import { useState, useEffect } from "react";
import "./notifybill.css";
import DataTableBI from "../../../components/dataTableBI/DataTableBI.jsx";
import Add from "../../../components/add/Add.jsx";
import { firestore } from "../../../firebase.js";

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "owner",
    type: "string",
    headerName: "ชื่อ - นามสกุล",
    width: 150,
  },
  {
    field: "email",
    type: "string",
    headerName: "e-mail",
    width: 150,
  },
  {
    field: "phone",
    type: "string",
    headerName: "phone",
    width: 150,
  },
  {
    field: "status",
    type: "string",
    headerName: "สถานะ",
    width: 220,
  },
  {
    field: "type",
    type: "number",
    headerName: "ประเภท",
    width: 150,
  },
  // {
  //   field: "typePrice",
  //   type: "string",
  //   headerName: "ราคาประเภท",
  //   width: 150,
  // },
];

const Notifybill = () => {
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsCollection = firestore.collection("rooms");
        const snapshot = await roomsCollection.get();
        const roomsData = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const roomData = doc.data();
            let type = ""; // Initialize type

            // Fetch type from room document
            if (roomData.type) {
              type = roomData.type;
            }

            if (roomData.owner) {
              // Fetch email and phone data from profiles collection based on owner's uid
              const profilesCollection = firestore.collection("profiles");
              const profileSnapshot = await profilesCollection
                .doc(roomData.owner)
                .get();
              const profileData = profileSnapshot.data();

              // Fetch type details from typerooms
              let typeName = "";
              let typePrice = "";
              const typeroomsCollection = firestore.collection("typerooms");
              const typeSnapshot = await typeroomsCollection
                .doc(type)
                .get();
              const typeData = typeSnapshot.data();
              if (typeData) {
                typeName = typeData.name || "";
                typePrice = typeData.price || "";
              }

              return {
                id: doc.id,
                owner: profileData?.firstName + " " + profileData?.lastName,
                email: profileData?.email || "",
                phone: profileData?.phone || "",
                status: roomData.status,
                type: type,
                water: roomData.water || "",
                waterCurrent: roomData.waterCurrent || "",
                electric: roomData.electric || "",
                electricCurrent: roomData.electricCurrent || "",
                typeName: typeName,
                typePrice: typePrice,
              };
            } else {
              return {
                id: doc.id,
                owner: "",
                email: "",
                phone: "",
                status: roomData.status,
                type: type,
                water: roomData.water || "",
                waterCurrent: roomData.waterCurrent || "",
                electric: roomData.electric || "",
                electricCurrent: roomData.electricCurrent || "",
                typeName: "",
                typePrice: "",
              };
            }
          })
        );
        setRooms(roomsData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div>
      <div className="header-content">
        <h2>แจ้งบิล</h2>
      </div>
      <DataTableBI slug="rooms" columns={columns} rows={rooms} />
      {open && <Add slug="room" columns={columns} setOpen={setOpen} />}
    </div>
  );
};

export default Notifybill;
