import React, { useState, useEffect } from "react";
import "./new.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { firestore, storage } from "../../../firebase";

const fetchNewsFromFirestore = async () => {
  try {
    const newsCollection = await firestore.collection("news").get();
    const updatedNewsData = [];
    newsCollection.forEach((doc) => {
      const news = { id: doc.id, ...doc.data() };
      updatedNewsData.push(news);
    });
    return updatedNewsData;
  } catch (error) {
    console.error("Error fetching news from Firestore: ", error);
    return [];
  }
};

const addNewsToFirestore = async (newsData) => {
  try {
    await firestore.collection("news").add(newsData);
    console.log("News added to Firestore successfully");
  } catch (error) {
    console.error("Error adding news to Firestore: ", error);
  }
};

const updateNewsInFirestore = async (id, updatedData) => {
  try {
    await firestore.collection("news").doc(id).update({
      title: updatedData.title,
      description: updatedData.description,
      image: updatedData.image,
      date: updatedData.date,
      type: updatedData.type, // Include the type field in the update
    });
    console.log(`News with ID ${id} updated in Firestore`);
  } catch (error) {
    console.error("Error updating news in Firestore: ", error);
  }
};

const deleteNewsFromFirestore = async (id) => {
  try {
    await firestore.collection("news").doc(id).delete();
    console.log(`News with ID ${id} deleted from Firestore`);
  } catch (error) {
    console.error("Error deleting news from Firestore: ", error);
  }
};

const uploadImageToStorage = async (file) => {
  try {
    const storageRef = storage.ref();
    const fileRef = storageRef.child(`news_image/${file.name}`);
    await fileRef.put(file);
    return await fileRef.getDownloadURL();
  } catch (error) {
    console.error("Error uploading image to Storage: ", error);
    return null;
  }
};

const ITEMS_PER_PAGE = 2;

function News() {
  const [showModal, setShowModal] = useState(false);
  const [newNews, setNewNews] = useState({});
  const [editing, setEditing] = useState(false);
  const [firebaseNews, setFirebaseNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = firebaseNews.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const newsPage = firebaseNews.slice(startIndex, endIndex);
  const [selectedType, setSelectedType] = useState(null);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsData = await fetchNewsFromFirestore();
        setFirebaseNews(newsData);
      } catch (error) {
        console.error("Error fetching news from Firestore: ", error);
      }
    };

    fetchData();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setNewNews({});
    setEditing(false);
  };

  const handleShow = () => {
    setShowModal(true);
    setEditing(false);
  };

  const handleAddNews = async () => {
    try {
      const imageUrl = await uploadImageToStorage(newNews.file);
      const newsData = {
        title: newNews.title,
        description: newNews.description,
        image: imageUrl,
        date: newNews.date,
        type: selectedType, // Include selected type in news data
      };

      await addNewsToFirestore(newsData);
      const updatedNews = await fetchNewsFromFirestore();
      setFirebaseNews(updatedNews);
      handleClose();
    } catch (error) {
      console.error("Error adding news to Firestore: ", error);
    }
  };

  const handleEditNews = async (id, updatedData) => {
    try {
      if (newNews.file) {
        const imageUrl = await uploadImageToStorage(newNews.file);
        updatedData.image = imageUrl;
      }
      await updateNewsInFirestore(id, updatedData);
      const updatedNews = await fetchNewsFromFirestore();
      setFirebaseNews(updatedNews);
      handleClose();
    } catch (error) {
      console.error("Error updating news: ", error);
    }
  };

  const handleDeleteNews = async (id) => {
    try {
      await deleteNewsFromFirestore(id);
      const updatedNews = await fetchNewsFromFirestore();
      setFirebaseNews(updatedNews);
    } catch (error) {
      console.error("Error deleting news from Firestore: ", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewNews({
        ...newNews,
        image: URL.createObjectURL(file), // Set a preview URL for the new image
        file: file,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewNews({
      ...newNews,
      [name]: value,
    });
  };

  const handleEditClick = (news) => {
    setNewNews(news);
    setEditing(true);
    setSelectedType(news.type);
    setShowModal(true);
  };

  const handleTypeSelection = (type) => {
    setSelectedType(type);
    setNewNews({
      ...newNews,
      type: type, // Update the type in newNews state
    });
  };

  return (
    <div>
      <div className="main-content">
        <div className="header-content">
          <h2>บอร์ดข่าวสาร</h2>
        </div>

        <div className="row">
          {newsPage.map((news, index) => (
            <div key={index} className="col-md-6 mb-4">
              <div className="card">
                <img
                  src={news.image}
                  className="card-img-top"
                  alt={`News ${index}`}
                />
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title mb-0">{news.title}</h5>
                    <p className="card-text mb-0">{news.type}</p>
                  </div>
                  <p className="card-text">{news.description}</p>
                  <p className="card-text">{news.date}</p>
                  <div className="btn-group">
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteNews(news.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEditClick(news)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          <button
            className="previous-botton"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`number-button ${
                currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="next-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        <div className="add-main">
          <button className="add-button" onClick={handleShow}>
            Add News
          </button>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Edit News" : "Add News"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newNews.title || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newNews.description || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                value={selectedType || ""}
                onChange={(e) => handleTypeSelection(e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="ข่าวด่วน">ข่าวด่วน</option>
                <option value="กิจกรรม">กิจกรรม</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {newNews.file && (
                <img
                  src={URL.createObjectURL(newNews.file)}
                  alt="Selected"
                  style={{ maxWidth: "100px" }}
                />
              )}
            </Form.Group>
            <Form.Group controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={newNews.date || ""}
                onChange={handleChange}
              />
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
            variant="primary"
            onClick={
              editing
                ? () => handleEditNews(newNews.id, newNews)
                : handleAddNews
            }
            className="add-new-button"
          >
            {editing ? "Save Changes" : "Add News"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default News;
