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
    headerName: "เจ้าของ",
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
              if (roomData.owner) {
                // Fetch email and phone data from profiles collection based on owner's uid
                const profilesCollection = firestore.collection("profiles");
                const profileSnapshot = await profilesCollection
                  .doc(roomData.owner)
                  .get();
                const profileData = profileSnapshot.data();
                return {
                  id: doc.id,
                  owner: profileData?.firstName + " " + profileData?.lastName,
                  email: profileData?.email || "", // Set email to empty string if not found
                  phone: profileData?.phone || "", // Set phone to empty string if not found
                  status: roomData.status,
                };
              } else {
                return {
                  id: doc.id,
                  owner: "",
                  email: "",
                  phone: "",
                  status: roomData.status,
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
