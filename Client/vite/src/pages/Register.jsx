import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (name && email && password) {
      navigate("/"); // 🔥 Go to Home after register
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Join CineBook 🍿</h2>
        <p>Create an account to book faster</p>

        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Full Name" value={name} onChange={(e)=>setName(e.target.value)} />
          <input type="email" placeholder="Email Address" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button type="submit" className="primary-btn">Register</button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
