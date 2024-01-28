import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "./personnel.css";

function Personnel() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newPersonData, setNewPersonData] = useState({
    name: "",
    role: "",
    image: null,
    phoneNumber: "",
  });
  const [personnelData, setPersonnelData] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [editPersonId, setEditPersonId] = useState("");
  const db = firebase.firestore();
  const storage = firebase.storage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const personnelSnapshot = await db.collection("personnel").get();
        const personnelList = personnelSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPersonnelData(personnelList);
      } catch (error) {
        console.error("Error fetching personnel data:", error);
      }
    };

    fetchData();
  }, [db]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPersonData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewPersonData((prevData) => ({ ...prevData, image: file }));
  };

  const handleAddPerson = async () => {
    try {
      const personnelRef = db.collection("personnel");
      const newPerson = {
        name: newPersonData.name,
        role: newPersonData.role,
        phoneNumber: newPersonData.phoneNumber,
      };

      const docRef = await personnelRef.add(newPerson);

      if (newPersonData.image) {
        const storageRef = storage.ref().child(`profile_personal/${docRef.id}`);
        await storageRef.put(newPersonData.image);
        const imageUrl = await storageRef.getDownloadURL();
        await personnelRef.doc(docRef.id).update({ image: imageUrl });
      }

      setPersonnelData((prevData) => [
        ...prevData,
        { id: docRef.id, ...newPerson },
      ]);
      setShowAddModal(false);
      setNewPersonData({ name: "", role: "", image: null, phoneNumber: "" });
    } catch (error) {
      console.error("Error adding person:", error);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setNewPersonData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditPersonSubmit = async () => {
    try {
      const personnelRef = db.collection("personnel").doc(editPersonId);
      const updatedPerson = {
        name: newPersonData.name,
        role: newPersonData.role,
        phoneNumber: newPersonData.phoneNumber,
      };

      await personnelRef.update(updatedPerson);

      if (newPersonData.image) {
        const storageRef = storage.ref().child(`profile_personal/${editPersonId}`);
        await storageRef.put(newPersonData.image);
        const imageUrl = await storageRef.getDownloadURL();
        await personnelRef.update({ image: imageUrl });
      }

      setPersonnelData((prevData) =>
        prevData.map((person) =>
          person.id === editPersonId ? { ...person, ...updatedPerson } : person
        )
      );
      setShowEditModal(false);
      setNewPersonData({ name: "", role: "", image: null, phoneNumber: "" });
    } catch (error) {
      console.error("Error updating person:", error);
    }
  };

  const handleEditPerson = async (personId) => {
    try {
      const docRef = db.collection("personnel").doc(personId);
      const doc = await docRef.get();
      const personData = doc.data();
      setNewPersonData({
        name: personData.name,
        role: personData.role,
        phoneNumber: personData.phoneNumber,
      });
      setShowEditModal(true);
      setEditPersonId(personId);
    } catch (error) {
      console.error("Error fetching person data for editing:", error);
    }
  };

  const handleDeletePerson = async (personId) => {
    try {
      await db.collection("personnel").doc(personId).delete();
      setPersonnelData((prevData) =>
        prevData.filter((person) => person.id !== personId)
      );
    } catch (error) {
      console.error("Error deleting person:", error);
    }
  };

  const filteredPersonnelData = personnelData.filter((person) =>
    selectedRole ? person.role.toLowerCase() === selectedRole.toLowerCase() : true
  );

  return (
    <div>
      <div className="main-content">
        <div className="content-header">
          <div className="header-content">
            <h2>บุคลากร</h2>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              เพิ่มข้อมูล
            </Button>
          </div>
          <Form>
            <Form.Group controlId="formRole">
              <Form.Label>ค้นหาตำแหน่ง:</Form.Label>
              <Form.Control
                as="select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">ทั้งหมด</option>
                <option value="แม่บ้าน">แม่บ้าน</option>
                <option value="ยาม">ยาม</option>
                <option value="ช่างซ่อม">ช่างซ่อม</option>
              </Form.Control>
            </Form.Group>
          </Form>
          <div className="row">
            {filteredPersonnelData.map((person) => (
              <div className="col-md-4" key={person.id}>
                <div className="card custom-card-style">
                  <div className="personnel-image-container">
                    <img
                      src={person.image}
                      className="card-img-top"
                      alt={`รูป ${person.name}`}
                    />
                    <div className="personnel-actions">
                      <Button variant="warning" onClick={() => handleEditPerson(person.id)}>
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => handleDeletePerson(person.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{person.name}</h5>
                    <p className="card-text">{person.role}</p>
                    <p className="card-text">เบอร์โทร: {person.phoneNumber}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มข้อมูลบุคลากร</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>ชื่อ:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={newPersonData.name}
                onChange={handleInputChange}
                name="name"
              />
            </Form.Group>
            <Form.Group controlId="formRole">
              <Form.Label>ตำแหน่ง:</Form.Label>
              <Form.Control
                as="select"
                value={newPersonData.role}
                onChange={handleInputChange}
                name="role"
              >
                <option value="">เลือกตำแหน่ง</option>
                <option value="แม่บ้าน">แม่บ้าน</option>
                <option value="ยาม">ยาม</option>
                <option value="ช่างซ่อม">ช่างซ่อม</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formPhoneNumber">
              <Form.Label>เบอร์โทร:</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter phone number"
                value={newPersonData.phoneNumber}
                onChange={handleInputChange}
                name="phoneNumber"
              />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>รูปภาพ:</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                name="image"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            ปิด
          </Button>
          <Button variant="primary" onClick={handleAddPerson}>
            เพิ่ม
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>แก้ไขข้อมูลบุคลากร</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>ชื่อ:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={newPersonData.name}
                onChange={handleEditInputChange}
                name="name"
              />
            </Form.Group>
            <Form.Group controlId="formRole">
              <Form.Label>ตำแหน่ง:</Form.Label>
              <Form.Control
                as="select"
                value={newPersonData.role}
                onChange={handleEditInputChange}
                name="role"
              >
                <option value="">เลือกตำแหน่ง</option>
                <option value="แม่บ้าน">แม่บ้าน</option>
                <option value="ยาม">ยาม</option>
                <option value="ช่างซ่อม">ช่างซ่อม</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formPhoneNumber">
              <Form.Label>เบอร์โทร:</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter phone number"
                value={newPersonData.phoneNumber}
                onChange={handleEditInputChange}
                name="phoneNumber"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            ยกเลิก
          </Button>
          <Button variant="primary" onClick={handleEditPersonSubmit}>
            บันทึก
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Personnel;
