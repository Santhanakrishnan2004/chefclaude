import React from "react";
import chef from '../images/chef-claude-icon.png'
import '../App.css'
function Header() {
    return (  <header className="Header">

<img src={chef} alt="Chef Claude" />

<p>Chef Claude</p>

    </header>);
}

export default Header;