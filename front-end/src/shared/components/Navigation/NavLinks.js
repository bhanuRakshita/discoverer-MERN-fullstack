import React, {useContext} from "react";
import { NavLink } from "react-router-dom";
import './NavLinks.css';
import { AuthContext } from "../../../store/AuthContext";

const NavLinks = props => {
    const auth = useContext(AuthContext);
    const userPlacesLink = `/${auth.userId}/places`;

return (
    <ul className="nav-links" onClick={props.onClick}>
        <li>
            <NavLink to="/" exact>All Users</NavLink>
        </li>

        {auth.isLoggedIn && (<li>
            <NavLink to={userPlacesLink} exact>My Places</NavLink>
        </li>)}

        {auth.isLoggedIn && (<li>
            <NavLink to="/places/new" exact>Add Place</NavLink>
        </li>)}
        
        {!auth.isLoggedIn && (<li>
            <NavLink to="/auth" exact>Authenticate</NavLink>
        </li>)}

        {auth.isLoggedIn && (<li>
            <NavLink to="/logout" exact>Logout</NavLink>
        </li>)}
        
    </ul>
)
}

export default NavLinks;