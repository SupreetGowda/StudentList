import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
} from "@mui/material";
import { useForm } from "react-hook-form";

const StudentsList = () => {
  const [stud, setStud] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetch = async () => {
    const res = await axios.get("http://localhost:3001/students");
    setStud(res.data);
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleOpen = (student) => {
    setSelectedStudent(student);
    setOpen(true);
    reset(student); // Populate the form with selected student's data
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStudent(null);
    reset(); // Reset form when the modal is closed
  };

  const onSubmit = async (data) => {
    if (selectedStudent) {
      await axios.put(`http://localhost:3001/students/${selectedStudent.id}`, data);
    } else {
      await axios.post("http://localhost:3001/students", data);
    }
    fetch(); // Refresh the students list
    handleClose();
  };

  const handleDelete = async () => {
    if (selectedStudent) {
      await axios.delete(`http://localhost:3001/students/${selectedStudent.id}`);
      fetch(); // Refresh the students list
      handleClose();
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Students List
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stud.map((ele) => (
              <TableRow key={ele.id}>
                <TableCell>{ele.firstName}</TableCell>
                <TableCell>{ele.lastName}</TableCell>
                <TableCell>{ele.email}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(ele)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {selectedStudent ? "Edit Student" : "Add Student"}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="First Name"
              margin="normal"
              {...register("firstName", { required: "First name is required" })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
            <TextField
              fullWidth
              label="Last Name"
              margin="normal"
              {...register("lastName", { required: "Last name is required" })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
              <Button onClick={handleDelete} variant="outlined" color="secondary">
                Delete
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default StudentsList;
