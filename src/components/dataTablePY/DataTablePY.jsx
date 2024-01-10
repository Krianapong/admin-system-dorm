  import React from "react";
  import {
    DataGrid,
    GridToolbar,
  } from "@mui/x-data-grid";
  import { Link } from "react-router-dom";
  import IconButton from "@mui/material/IconButton";
  import AssignmentIcon from '@mui/icons-material/Assignment';
  import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
  import "./dataTable.css";

  const DataTablePY = (props) => {

    const actionColumn = {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="action">
            <Link to={`/${props.slug}/${params.row.id}`}>
              <IconButton>
                <AssignmentIcon />
              </IconButton>
            </Link>
            <div>
              <IconButton>
                <ShoppingCartIcon />
              </IconButton>
            </div>
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

  export default DataTablePY;
