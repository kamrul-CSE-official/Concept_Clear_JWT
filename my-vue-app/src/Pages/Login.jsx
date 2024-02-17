import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useEffect, useState } from "react";
function Login() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetch() {
      const data = await axios.get("http://localhost:5000", {
        withCredentials: true,
      });
      console.log(data?.data);
    }
    fetch();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setUser({ email: e.target.email.value, password: e.target.password.value });

    if (user) {
      const postUser = await axios.post("http://localhost:5000/jwt", user, {
        withCredentials: true,
      });
      console.log(postUser?.data);
    }
  };
  return (
    <Form onSubmit={handleLogin}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control name="email" type="email" placeholder="Enter email" />
        <Form.Text className="text-muted">
          We will never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control name="password" type="password" placeholder="Password" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default Login;
