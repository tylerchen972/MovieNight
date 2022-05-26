import Head from 'next/head'
import React from 'react'
import "../../node_modules/bootstrap/dist/css/bootstrap.css";
import image from "../../public/Vidio.png"

function Navbar() {
  return (
<nav className="navbar navbar-light bg-light">
  <a className="navbar-brand" href="#">
    <img src={image} width="30" height="30" className="d-inline-block align-top" alt=""/>
  </a>
</nav>
  );
}
export default Navbar