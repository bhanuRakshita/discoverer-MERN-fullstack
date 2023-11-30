import React, {useContext} from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/UIElements/Button";
import { AuthContext } from "../../store/AuthContext";

const Logout = () => {

    const auth = useContext(AuthContext);

    const logoutHandler = (event) => {
        event.preventDefault();
        auth.logout();
    }
    return (
        <Card>
            <h2>Are you sure you want to logout?</h2>
            <Button onClick={logoutHandler}>CONFIRM</Button>
        </Card>
    )
};

export default Logout;