import React from 'react'

function Navbar() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
    .then((res) => res.json())
    .then((data) => setData(data.message));
  }, []);

  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="nav-link" href="#"><img src='./Vidio.png' alt=""/></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="input-group input-group-lg px-3 margin-left-20 margin-right-20" id="navbarSupportedContent">
          <input type="text" class="form-control" placeholder="Search"/>
          <button class="btn btn-outline-success" type="submit">Search</button>
        </div>
        <div>Account stuff goes here</div>
      </div>
    </nav>
  );
}
export default Navbar