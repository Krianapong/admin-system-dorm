import { useState } from "react";
import "./paybill.css";
import DataTablePY from "../../../components/dataTablePY/DataTablePY";
import Add from "../../../components/add/Add";
import { paybill  } from "../../../data.ts";

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "roomNumber",
    type: "string",
    headerName: "เลขห้อง",
    width: 150,
  },
  {
    field: "fullName",
    type: "string",
    headerName: "ชื่อ - นามสกุล ",
    width: 220,
  },
  {
    field: "email",
    type: "string",
    headerName: "อีเมล",
    width: 220,
  },
  {
    field: "status",
    headerName: "สถานะ",
    type: "string",
    width: 220,
  },
];

const Paybill = () => {
    const [open, setOpen] = useState(false);
  
    return (
      <div>
        <div className="header-content">
          <h2>จ่ายบิล</h2>
        </div>
        <DataTablePY slug="products" columns={columns} rows={paybill} />
        {open && <Add slug="product" columns={columns} setOpen={setOpen} />}
      </div>
    );
  };
  
  export default Paybill;