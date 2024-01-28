import React, { Component, createRef } from "react";
import {
  getDatabase,
  onValue,
  off,
  push,
  ref,
  serverTimestamp,
} from "firebase/database";
import { auth, firestore, storage } from "../../firebase";
import { Link } from "react-router-dom";
import "./chat.css";

const database = getDatabase();

class ChatAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatUsers: [],
      selectedUser: null,
      chat: [],
      text: "",
      userData: null,
    };

    this.messagesRef = null;
    this.messagesEndRef = createRef();
  }

  toggleInfo = (e) => {
    e.target.parentNode.classList.toggle("open");
  };

  async componentDidMount() {
    this.fetchChatUsers();

    if (this.messagesEndRef.current) {
      this.scrollToBottom();
    }
    const userData = await this.getUserData();
    this.setState({ userData });
  }

  componentWillUnmount() {
    if (this.messagesRef) {
      off(this.messagesRef);
    }
  }

  fetchChatUsers() {
    const chatUsersRef = ref(database);
    onValue(chatUsersRef, (snapshot) => {
      const chatUsers = snapshot.val() ? Object.keys(snapshot.val()) : [];
      this.setState({ chatUsers });

      if (chatUsers.length > 0) {
        this.selectUser(chatUsers[0]);
      }
    });
  }

  selectUser(userId) {
    this.setState({ selectedUser: userId }, () => {
      this.messagesRef = ref(database, `/${userId}`);
      onValue(this.messagesRef, (snapshot) => {
        const messages = snapshot.val();
        if (messages) {
          this.setState({ chat: Object.values(messages) }, () => {
            this.scrollToBottom();
          });
        } else {
          this.setState({ chat: [] });
        }
      });
    });
  }

  scrollToBottom() {
    if (this.messagesEndRef.current) {
      this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  async getUserData() {
    const userId = auth.currentUser.uid;
    const userRef = firestore.collection("profiles").doc(userId);

    return userRef.get().then(async (doc) => {
      if (doc.exists) {
        const userData = doc.data();

        const avatarRef = storage.ref().child(`profiles_image/${userId}`);
        const avatarURL = await avatarRef.getDownloadURL();

        return {
          _id: userId,
          avatar: avatarURL,
          email: userData.email,
          name: `${userData.firstName} ${userData.lastName}`,
        };
      } else {
        console.log("No such document!");
        return null;
      }
    });
  }

  async fetchUserAvatar(userId) {
    const userRef = firestore.collection("profiles").doc(userId);
    const doc = await userRef.get();
    if (doc.exists) {
      const userData = doc.data();
      return userData.avatar; // ส่ง URL ของภาพของผู้ใช้
    } else {
      console.log("No such document!");
      return null;
    }
  }


  sendMessage = async () => {
    const { selectedUser, text } = this.state;
    const currentUserID = auth.currentUser?.uid;

    if (!currentUserID) {
      return;
    }

    const userData = await this.getUserData(currentUserID);

    if (userData) {
      const newMessage = {
        createdAt: serverTimestamp(),
        user: userData,
        text: text,
      };

      push(ref(database, `/${selectedUser}`), newMessage);

      this.setState({ text: "" });
    }
  };

  // ฟังก์ชันเพื่อแปลง timestamp เป็นรูปแบบวันที่และเวลาที่ต้องการ
  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    return date.toLocaleString("en-US", options);
  }

  renderUserProfile(userData) {
    return (
      <div className="main__userprofile">
        <div className="profile__card user__profile__image">
          <div className="profile__image">
            <img src={userData.avatar} alt="User Avatar" />
          </div>
          <h4>{userData.name}</h4>
          <p>{userData.email}</p>
        </div>
        <div className="profile__card">
          <div className="card__header" onClick={this.toggleInfo}>
            <h4>Information</h4>
            <i className="fa fa-angle-down"></i>
          </div>
          <div className="card__content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            ultrices urna a imperdiet egestas. Donec in magna quis ligula
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { chatUsers, selectedUser, chat, text, userData } = this.state;
    const currentUserID = auth.currentUser?.uid;

    return (
      <div className="main__chatbody">
        <div className="main__chatlist">
          <div className="chatList__search">
            <div className="chatList__search">
              <div className="search_wrap">
                <h1>หน้าหลัก</h1>
              </div>
            </div>
          </div>
          {chatUsers.map((userId) => (
            <div
              key={userId}
              style={{ marginBottom: "10px" }}
              className="chatlist__item"
            >
              <button onClick={() => this.selectUser(userId)}>
                <p>{userId}</p>
              </button>
            </div>
          ))}
        </div>
        <div className="main__chatcontent">
          {selectedUser && (
            <div className="content__header">
              <div className="blocks">
                <div className="current-chatting-user">
                  <div className="avatar">
                    <div className="avatar">
                      <img src={chat[0]?.user.avatar} alt="User Avatar" />
                    </div>
                  </div>
                  <p>{chat[0]?.user.name}</p>
                </div>
              </div>
              <div className="blocks">
                <div className="settings">
                  <button className="btn-nobg">
                    <i className="fa fa-cog"></i>
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="content__body">
            <div className="chat__items">
              {chat.map((item) => (
                <div
                  key={item.createdAt}
                  className={`chat__item ${
                    item.user._id === selectedUser ? "other" : "self"
                  }`}
                >
                  <div className="chat__item__content">
                    <div className="chat__msg">{item.text}</div>
                    <div className="chat__meta">
                      <span>{this.formatTimestamp(item.createdAt)}</span>
                    </div>
                  </div>
                  <div className="avatar">
                    <div className="avatar-img">
                      <img src={item.user.avatar} alt="#" />
                    </div>
                  </div>
                </div>
              ))}
              <div ref={this.messagesEndRef} />
            </div>
          </div>
          <div className="content__footer">
            <div className="sendNewMessage">
              <input
                type="text"
                placeholder="Type a message here"
                onChange={(e) => this.setState({ text: e.target.value })}
                value={text}
              />
              <button className="btnSendMsg" onClick={this.sendMessage}>
                <i className="fa fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
        {userData && this.renderUserProfile(userData)}
      </div>
    );
  }
}

export default ChatAdmin;
