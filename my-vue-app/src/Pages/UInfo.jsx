import { Form, Button } from "react-bootstrap";
import useAxiosSecure from "../hooks/useAxiosSecrure";

const UInfo = () => {
  const axiosInstance = useAxiosSecure();

  const handleInfo = async (e) => {
    e.preventDefault();
    const userData = {
      email: e.target.email.value,
      school: e.target.school.value,
    };

    try {
      await axiosInstance.post("/info", userData).then((res) => {
        console.log("info response: ", res?.data);
      });
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };
  return (
    <div>
      <Form onSubmit={handleInfo}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control name="email" type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>School Name</Form.Label>
          <Form.Control name="school" type="text" placeholder="School name" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default UInfo;
