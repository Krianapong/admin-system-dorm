import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import "./dataTable.css";
import { firestore } from "../../firebase";

const DataTableBI = (props) => {
  const handleSendEmail = (email, amount, powers, waters) => {
    const subject = "แจ้งเตือน: ยอดค้างชำระบริการ";
    const body = `
      สวัสดีค่ะ/ครับ,\n\n
      เราขอแจ้งให้ทราบว่าคุณมียอดค้างชำระบริการ\n
      ค่าไฟ : ${powers}\n
      ค่าน้ำ : ${waters}\n
      จำนวน ${amount} บาท\n\n
      กรุณาติดต่อเราเพื่อชำระเงิน : 08237xxxxx หรือติดต่อที่ admin@admin.com \n
      ขอบคุณค่ะ/ครับ
    `;
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    // Example: Open default email client with subject and body
    window.open(mailtoLink);
  };

  const actionColumn = {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      const email = params.row.email; // Get the email address from the row data
      const waters = params.row.waterCurrent - params.row.water; // Calculate amount
      const powers = params.row.electricCurrent - params.row.electric; // Calculate amount
      const amount = waters + powers; // Calculate amount

      return (
        <div className="action">
          <IconButton
            onClick={() => handleSendEmail(email, powers, waters, amount)}
          >
            <SendIcon />
          </IconButton>
        </div>
      );
    },
  };

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={props.rows}
        columns={[...props.columns, actionColumn]}
        initialState={{
          pagination: {
            pageSize: 10,
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
      />
    </div>
  );
};

export default DataTableBI;
