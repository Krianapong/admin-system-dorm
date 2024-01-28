import { useState, useEffect } from "react";
import { firestore } from "../../../firebase"; // Import your Firestore instance here
import "./paybill.css";
import DataTablePY from "../../../components/dataTablePY/DataTablePY";
import Add from "../../../components/add/Add";

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "owner", headerName: "เจ้าของ", width: 220 },
  { field: "email", headerName: "อีเมล", width: 220 },
  { field: "phone", headerName: "โทรศัพท์", width: 220 },
  { field: "status", headerName: "สถานะ", width: 220 },
];

const Paybill = () => {
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
              const profileSnapshot = await firestore.collection("profiles").doc(roomData.owner).get();
              const profileData = profileSnapshot.data();
              return {
                id: doc.id,
                owner: profileData?.firstName + " " + profileData?.lastName,
                email: profileData?.email || "",
                phone: profileData?.phone || "",
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
        <h2>จ่ายบิล</h2>
      </div>
      <DataTablePY slug="products" columns={columns} rows={rooms} />
      {open && <Add slug="product" columns={columns} setOpen={setOpen} />}
    </div>
  );
};

export default Paybill;
