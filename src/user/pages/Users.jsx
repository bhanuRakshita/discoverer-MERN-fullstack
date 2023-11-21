import React from "react";
import UserList from "../components/UsersList.jsx";
import img from '../../assets/photo.webp';

const USERS = [
  {
    id: "U1",
    name: "Bhanu",
    image: img,
    places: 3,
  },
  {
    id: "U2",
    name: "Aryan",
    image: img,
    places: 7,
  }
];

const Users = () => {
  return (
    <div>
      <UserList users={USERS} />
    </div>
  );
};

export default Users;
