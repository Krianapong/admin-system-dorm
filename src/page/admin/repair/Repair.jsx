import React from "react";
import DataTable from "../../../components/dataTable/DataTable.jsx";
import { rooms  } from "../../../data.ts";

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "roomNumber",
    type: "string",
    headerName: "เลขห้อง",
    width: 150,
  },
  {
    field: "name",
    type: "string",
    headerName: "ชื่อ - นามสกุล ",
    width: 200,
  },
  {
    field: "details",
    type: "string",
    headerName: "รายละเอียด",
    width: 200,
  },
  {
    field: "img",
    headerName: "รูป",
    width: 150,
    renderCell: (params) => {
      return React.createElement("img", { src: params.row.img || "/noavatar.png", alt: "" });
    },
  },
  {
    field: "phoneNumber",
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
    return (
      <div>
        <div className="header-content">
          <h2>เเจ้งซ่อม</h2>
        </div>
        <DataTable columns={columns} rows={rooms} />
      </div>
    );
  };
  
  export default Repair;