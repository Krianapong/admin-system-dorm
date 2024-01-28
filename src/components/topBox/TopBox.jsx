import React, { useEffect, useState } from 'react';
import "./topBox.css";
import { firestore } from "../../firebase.js";

const TopBox = () => {
  const [topDealUsers, setTopDealUsers] = useState([]);

  useEffect(() => {
    // Fetch data from Firestore and update state
    const fetchData = async () => {
      try {
        const querySnapshot = await firestore.collection('profiles').get();
        const users = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTopDealUsers(users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="topBox">
      <h1>Top Deals</h1>
      <div className="list">
        {topDealUsers.map(user => (
          <div className="listItem" key={user.id}>
            <div className="user">
              <img src={user.avatar} alt="Avatar" />
              <div className="userTexts">
                <span className="username">{user.firstName}</span>
                <span className="email">{user.email}</span>
              </div>
            </div>
            {/* Assuming user.amount exists */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopBox;
