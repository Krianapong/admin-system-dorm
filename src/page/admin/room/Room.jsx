import { useState, useEffect } from "react";
import DataTableRoom from "../../../components/dataTableroom/DataTableRoom";
import { firestore } from "../../../firebase";

const columns = [
  { field: "id", headerName: "ID", width: 100 }, 
  {
    field: "roomNumber",
    type: "string",
    headerName: "เลขห้อง",
    width: 300,
  },
  {
    field: "status",
    type: "string",
    headerName: "สถานะ",
    width: 300,
  },
  {
    field: "typeRoom",
    type: "string",
    headerName: "ชนิดห้องพัก",   
    width: 300,
  },
];

const Room = () => {
  const [roomData, setRoomData] = useState([]); 

  useEffect(() => {
    fetchDataRoom();
  }, []); 

  const fetchDataRoom = async () => {
    try {
      const collRef = firestore
        .collection("rooms")
      const querySnapshot = await collRef.get();
      const data = querySnapshot.docs.map((doc, index) => ({
        id: index + 1, 
        roomNumber: doc.id,
        status: doc.data().status,
        typeRoom: doc.data().type
      }));
      setRoomData(data);
    } catch (error) {
      console.log("เกิดข้อผิดพลาดในการดึงข้อมูล : ", error);
    }
  };

  return (
    <div>
      <div className="header-content">
        <h2>ผังห้องพัก</h2>
      </div>
      <DataTableRoom slug="room" columns={columns} rows={roomData} fetchDataRoom={fetchDataRoom} />
    </div>
  );
};

export default Room;