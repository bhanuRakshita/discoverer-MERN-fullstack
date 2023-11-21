import React from "react";

import "./UsersList.css";
import UserItem from "./UserItem";

const UserList = (props) => {
  if (props.users.length === 0) {
    return (
      <div className="center">
        <h2>No users found</h2>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.users.map((user) => (
        
          <UserItem
            key={user.id}
            image={user.image}
            name={user.name}
            placeCount={user.places}
          />
        
      ))}
    </ul>
  );
};

export default UserList;
