import { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import PageviewIcon from "@mui/icons-material/Pageview";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { GridToolbarExport, GridToolbarQuickFilter } from "@mui/x-data-grid";
import "./DataTableRoom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import { firestore, storage } from "../../firebase";

const DataTableRoom = (props) => {
  const { slug, fetchDataRoom } = props;
  const isRoomPage = slug === "room";
  const [showModal, setShowModal] = useState(false);
  const [showSmallModal, setShowSmallModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [roomData, setRoomData] = useState([]);
  const [UserData, setUserData] = useState([]);
  const [showOccupied, setShowOccupied] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [showSlipImg, setShowSlipImg] = useState("");
  const [smallModalTitle, setSmallModalTitle] = useState(null);
  const [smallModalDetail, setSmallModalDetail] = useState(null);
  const [documents, setDocument] = useState([]);
  const [selectoption, setSelectOption] = useState(null);
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);

  const handleFetchDataRoom = async (status, roomNumber) => {
    try {
      console.log(roomNumber);
      const DocRef = firestore.collection("rooms").doc(roomNumber);
      DocRef.get().then((doc) => {
        setRoomData(doc.data());

        if (status === "Assign") {
          const ImgRef = storage.ref().child(`slip_image/${doc.data().img}`);
          ImgRef.getDownloadURL().then((url) => {
            setShowSlipImg(url);
          });
        }
        if (doc.exists) {
          firestore
            .collection("profiles")
            .doc(doc.data().owner)
            .get()
            .then((doc) => {
              if (doc.exists) {
                setUserData(doc.data());
                //console.log(doc.data());
                if (status === "Occupied") {
                  setShowOccupied(true);
                } else if (status === "Assign") {
                  setShowAssign(true);
                }
              } else {
                console.log("ไม่พบข้อมูลเจ้าของห้อง");
              }
            });
        } else {
          console.log("not have this room");
        }
      });
    } catch (error) {
      console.log("error fetch data : ", error);
    }
  };

  useEffect(() => {
    const fetchDataType = async () => {
      const collectionRef = firestore.collection("typerooms");
      const querySnapshot = await collectionRef.get();
      const documentIds = querySnapshot.docs.map((doc) => doc.id);
      setDocument(documentIds);
    };

    fetchDataType();
  }, []);

  const handleDelete = async () => {
    try {
      await firestore.collection("rooms").doc(roomId).delete();
      console.log(`Room ${roomId} deleted successfully.`);
      setShowDeleteModal(false);
      fetchDataRoom();
      setTimeout(() => {
        setSmallModalTitle("Delete Success");
        setSmallModalDetail(`Delete Room : ${roomId} Success`);
        setShowSmallModal(true);
      }, 1000);
      setTimeout(() => {
        setShowSmallModal(false);
      }, 2000);
    } catch (error) {
      console.log("error delete room : ", error);
    }
  };

  const handleAddRoom = async () => {
    const roomNumber = document.getElementById("title").value;

    if (!roomNumber) {
      console.error("Room number is required.");
      return;
    }

    const NewRoomData = {
      numroom: roomNumber, // Include title (room number) in NewRoomData
      owner: null,
      electric: "0",
      electricCurrent: "0",
      waterCurrent: "0",
      water: "0",
      img: null,
      datein: null,
      dateout: null,
      type: document.getElementById("TypeRooms").value,
      status: document.getElementById("Status").value,
    };

    try {
      await firestore.collection("rooms").doc(roomNumber).set(NewRoomData);
      console.log(`Room ${roomNumber} added successfully.`);
      setShowModal(false);
      fetchDataRoom();
      setTimeout(() => {
        setSmallModalTitle("Add Success");
        setSmallModalDetail(`Add Room Number : ${roomNumber} Success`);
        setShowSmallModal(true);
      }, 1000);
      setTimeout(() => {
        setShowSmallModal(false);
      }, 2000);
    } catch (error) {
      console.log("error add new rooms : ", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setShowDeleteModal(false);
    setShowAssign(false);
    setShowOccupied(false);
    setSelectOption(null);
  };

  const handleShow = () => {
    setShowModal(true);
  };

  const handleOccupied = async () => {
    try {
      await firestore
        .collection("rooms")
        .doc(roomId)
        .update({
          status: "Occupied",
        })
        .then(() => {
          console.log("Update Success");
          handleClose();
          fetchDataRoom();
          setTimeout(() => {
            setSmallModalTitle("Update Success");
            setSmallModalDetail(`Update Room ${roomId} : to Occupied Success`);
            setShowSmallModal(true);
          }, 1000);
          setTimeout(() => {
            setShowSmallModal(false);
          }, 2000);
        })
        .catch((error) => {
          console.error("Error Update : ", error);
        });
    } catch (error) {
      console.log("error update to Occupied : ", error);
    }
  };

  const handleAddType = async () => {
    const typeName = document.getElementById("TypeName").value;
    const location = document.getElementById("Location").value;
    const price = document.getElementById("Price").value;
    const imageFile = document.getElementById("Image").files[0];

    if (!typeName || !location || !price || !imageFile) {
      console.error("All fields are required.");
      return;
    }

    try {
      // Upload the image file to Firebase Storage
      const storageRef = storage.ref().child(`${imageFile.name}`);
      const snapshot = await storageRef.put(imageFile);

      // Get the reference to the uploaded image file
      const imageUrl = await snapshot.ref.getDownloadURL();

      // Save the image file path or reference in Firestore
      const newTypeData = {
        name: typeName,
        location,
        price,
        imgPath: snapshot.ref.fullPath, // Save the path/reference instead of URL
      };

      await firestore.collection("typerooms").doc(typeName).set(newTypeData);

      console.log(`Room type ${typeName} added successfully.`);
      setShowAddTypeModal(false);
    } catch (error) {
      console.error("Error adding new room type:", error);
    }
  };

  const handleVacant = async () => {
    try {
      await firestore
        .collection("rooms")
        .doc(roomId)
        .update({
          status: "Vacant",
          datein: null,
          dateout: null,
          img: null,
          owner: null,
        })
        .then(() => {
          console.log("Update Success");
          handleClose();
          fetchDataRoom();
          setTimeout(() => {
            setSmallModalTitle("Update Success");
            setSmallModalDetail(`Update Room ${roomId} : to Vancant Success`);
            setShowSmallModal(true);
          }, 1000);
          setTimeout(() => {
            setShowSmallModal(false);
          }, 2000);
        })
        .catch((error) => {
          console.error("Error Update : ", error);
        });
    } catch (error) {
      console.log("error update to Vacant : ", error);
    }
  };

  function CustomToolbar() {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <GridToolbarQuickFilter />
        </div>
        <div>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            onClick={() => setShowAddTypeModal(true)}
          >
            Add Type
          </Button>
          <Button variant="text" startIcon={<AddIcon />} onClick={handleShow}>
            ADD
          </Button>
          <GridToolbarExport />
        </div>

        <Modal
          show={showModal}
          onHide={handleClose}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton className="modal-header">
            <Modal.Title className="modal-title">Add Room</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            <Form>
              <Form.Group>
                <Form.Label className="form-label">Room Number</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  id="title"
                  className="form-control"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className="form-label">Status Room</Form.Label>
                <Form.Control
                  as="select"
                  name="Status"
                  id="Status"
                  className="form-control"
                >
                  <option value="Vacant">Vacant</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Assign">Assign</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="title" className="form-label">
                  Type Room
                </Form.Label>
                <Form.Control
                  as="select"
                  name="TypeRooms"
                  id="TypeRooms"
                  value={selectoption}
                >
                  {documents.map((documentId) => (
                    <option key={documentId} value={documentId}>
                      {documentId}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="modal-footer">
            <button
              variant="secondary"
              onClick={handleClose}
              className="close-button"
            >
              Close
            </button>
            <button
              variant="primary"
              onClick={handleAddRoom}
              className="add-room-button"
            >
              Add Room
            </button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showAddTypeModal}
          onHide={() => setShowAddTypeModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Type</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            <Form>
              <Form.Group>
                <Form.Label className="form-label">Type Room</Form.Label>
                <Form.Control
                  type="text"
                  id="TypeName"
                  placeholder="Type Room"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className="form-label">Location</Form.Label>
                <Form.Control
                  type="text"
                  id="Location"
                  placeholder="ชั้น 1 2 3"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className="form-label">Price</Form.Label>
                <Form.Control type="text" id="Price" placeholder="500฿" />
              </Form.Group>
              <Form.Group>
                <Form.Label className="form-label">Image</Form.Label>
                <Form.Control type="file" id="Image" />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowAddTypeModal(false)}
            >
              Close
            </Button>
            <Button variant="primary" onClick={handleAddType}>
              Add Type
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showSmallModal} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>{smallModalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>
                  <CheckIcon />
                  {smallModalDetail}
                </Form.Label>
              </Form.Group>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal
          show={showDeleteModal}
          onHide={handleClose}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton className="modal-header">
            <Modal.Title className="modal-title">
              Delete Room {roomId}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            <Form>
              <Form.Group>
                <Form.Label>
                  Are you sure to delete room : {roomId} ?
                </Form.Label>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <button
              variant="secondary"
              onClick={handleClose}
              className="close-button"
            >
              Close
            </button>
            <button
              variant="outlined"
              onClick={handleDelete}
              className="delete-room-button"
            >
              Delete Room
            </button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showOccupied}
          onHide={handleClose}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Room {roomId} Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="profile owner">
                <Form.Label>
                  Name : {UserData.firstName} {UserData.lastName}
                </Form.Label>
                <br />
                <Form.Label>Phone Number : {UserData.phone}</Form.Label>
                <br />
                <Form.Label>Email : {UserData.email}</Form.Label>
                <br />
                <Form.Label>DateIn : {roomData.datein}</Form.Label>
                <br />
                <Form.Label>DateOut : {roomData.dateout}</Form.Label>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <button
              color="error"
              variant="outlined"
              onClick={handleVacant}
              className="add-room-button"
            >
              Change to Vacant
            </button>
            <button
              variant="secondary"
              onClick={handleClose}
              className="close-button"
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showAssign}
          onHide={handleClose}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Room {roomId} Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="profile owner">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "20px",
                  }}
                >
                  <img
                    className="img-room-bille"
                    src={showSlipImg}
                    alt="slip_bank_images"
                    style={{
                      width: "200px",
                      height: "330px",
                      marginRight: "10px",
                    }}
                  />
                  <div>
                    <p>
                      <strong>Name:</strong> {UserData.name}
                    </p>
                    <p>
                      <strong>Phone Number:</strong> {UserData.phone}
                    </p>
                    <p>
                      <strong>Email:</strong> {UserData.email}
                    </p>
                    <p>
                      <strong>Check-In Date:</strong> {roomData.datein}
                    </p>
                    <p>
                      <strong>Check-Out Date:</strong> {roomData.dateout}
                    </p>
                  </div>
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={handleOccupied} className="add-room-button">
              Change to Occupied
            </button>
            <button onClick={handleVacant} className="close-button">
              Change to Vacant
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  const actionColumn = {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="action">
          {props.slug === "room" && params.row.status !== "Vacant" && (
            <IconButton
              onClick={() => {
                setRoomId(params.row.roomNumber);
                handleFetchDataRoom(params.row.status, params.row.roomNumber);
              }}
            >
              <PageviewIcon />
            </IconButton>
          )}

          <div
            className="delete"
            onClick={() => {
              setRoomId(params.row.roomNumber);
              setShowDeleteModal(true);
            }}
          >
            <IconButton>
              <DeleteIcon />
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
        columns={isRoomPage ? [...props.columns, actionColumn] : props.columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        slots={{ toolbar: isRoomPage ? CustomToolbar : GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
      />
    </div>
  );
};

export default DataTableRoom;
