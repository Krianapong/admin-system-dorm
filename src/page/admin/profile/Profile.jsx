import React from "react";
import { useState, useEffect } from "react";
import { auth, firestore, storage } from "../../../firebase";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import { Dna } from "react-loader-spinner";
// import './profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    avatar: "",
    email: "",
    avatarFile: null,
  });
  const [roomsData, setRoomsData] = useState([]);

  useEffect(() => {
    const userId = auth.currentUser.uid;

    const unsubscribe = firestore
      .collection("profiles")
      .doc(userId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setUserData(doc.data());
          setLoading(false);
          setFormData({
            firstName: doc.data().firstName || "",
            lastName: doc.data().lastName || "",
            phone: doc.data().phone || "",
            avatar: doc.data().avatar || "",
            email: doc.data().email || "",
            avatarFile: null,
          });
        } else {
          console.log("No such document!");
        }
      });

    // Fetch rooms data
    firestore
      .collection("rooms")
      .where("owner", "==", userId)
      .get()
      .then((querySnapshot) => {
        const roomsData = [];
        querySnapshot.forEach((doc) => {
          const { numroom, status, type } = doc.data();
          roomsData.push({ numroom, status, type });
        });
        setRoomsData(roomsData);
      })
      .catch((error) => {
        console.log("error fetching room data: ", error);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setFormData({
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      phone: userData?.phone || "",
      avatar: userData?.avatar || "",
      email: userData?.email || "",
      avatarFile: null,
    });
  };

  const handleSaveClick = async () => {
    const userId = auth.currentUser.uid;

    try {
      // Upload avatar if a new file is selected
      if (formData.avatarFile) {
        const avatarRef = storage.ref().child(`profiles_image/${userId}`);
        await avatarRef.put(formData.avatarFile);
        const avatarURL = await avatarRef.getDownloadURL();

        // Update user data including the avatar URL
        await firestore.collection("profiles").doc(userId).update({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          avatar: avatarURL,
        });
      } else {
        // Update user data without modifying the avatar
        await firestore.collection("profiles").doc(userId).update({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        });
      }

      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      avatarFile: files ? files[0] : null,
    }));
  };

  return (
    <div className="main-profile">
      <Card className="profile-body">
        {loading ? (
          <CardContent
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <Dna
              visible={true}
              height="200"
              width="200"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
          </CardContent>
        ) : (
          <>
            {userData ? (
              <>
                {editMode ? (
                  <CardContent>
                    <Grid container spacing={6}>
                      <Grid item xs={4}>
                        {formData.avatarFile && (
                          <CardMedia
                            component="img"
                            alt="Selected Avatar"
                            height="200"
                            image={URL.createObjectURL(formData.avatarFile)}
                          />
                        )}
                        {userData.avatar && !formData.avatarFile && (
                          <CardMedia
                            component="img"
                            alt="Avatar"
                            height="200"
                            image={userData.avatar}
                          />
                        )}
                      </Grid>
                      <Grid item xs={8}>
                        <div className="profile-detail">
                          <Typography variant="subtitle1">Avatar</Typography>
                          <input
                            type="file"
                            name="avatarFile"
                            onChange={handleInputChange}
                            className="input-edit"
                          />
                          <Typography variant="subtitle1">
                            First Name
                          </Typography>
                          <TextField
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="input-edit"
                          />
                          <Typography variant="subtitle1">Last Name</Typography>
                          <TextField
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="input-edit"
                          />
                          <Typography variant="subtitle1">Phone</Typography>
                          <TextField
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="input-edit"
                          />
                        </div>
                      </Grid>
                    </Grid>
                    <div className="footer-profile">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveClick}
                      >
                        Save
                      </Button>
                      <Button variant="contained" onClick={handleCancelClick}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                ) : (
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        {userData.avatar && (
                          <CardMedia
                            component="img"
                            alt="Avatar"
                            height="200"
                            image={userData.avatar}
                          />
                        )}
                      </Grid>
                      <Grid item xs={8}>
                        <div className="profile-detail">
                          <Typography variant="subtitle1">Email</Typography>
                          <TextField
                            type="text"
                            name="firstName"
                            value={formData.email}
                            className="input-edit"
                          />
                          <Typography variant="subtitle1">
                            First Name
                          </Typography>
                          <TextField
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            className="input-edit"
                          />
                          <Typography variant="subtitle1">Last Name</Typography>
                          <TextField
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            className="input-edit"
                          />
                          <Typography variant="subtitle1">Phone</Typography>
                          <TextField
                            type="text"
                            name="phone"
                            value={formData.phone}
                            className="input-edit"
                          />
                          {roomsData.map((room, index) => (
                            <div key={index}>
                              <Typography variant="subtitle1">
                                ห้อง {room.numroom}
                              </Typography>
                              <Typography variant="h6" className="profile-info">
                                Status: {room.status}
                              </Typography>
                              <Typography variant="h6" className="profile-info">
                                Type: {room.type}
                              </Typography>
                            </div>
                          ))}
                        </div>
                      </Grid>
                    </Grid>
                    <div className="footer-profile">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleEditClick}
                      >
                        Edit Profile
                      </Button>
                    </div>
                  </CardContent>
                )}
              </>
            ) : (
              <p>No user data available.</p>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default Profile;
