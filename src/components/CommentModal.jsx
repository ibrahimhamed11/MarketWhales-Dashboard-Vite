// CommentModal.js
import React from "react";
import { Modal, Box, Typography, Button, Divider } from "@mui/material";

const CommentModal = ({ isOpen, handleClose, comments }) => {
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: "8px",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" mb={2}>
          التعليقات
        </Typography>
        <Box
          sx={{
            maxHeight: 300, // Set a maximum height
            overflowY: "auto", // Enable vertical scrolling
            mb: 2, // Add margin bottom for spacing
          }}
        >
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index}>
                <Box mb={2}>
                  {" "}
                  {/* Margin bottom for spacing */}
                  <Typography variant="body1" color="text.primary">
                    <strong>اسم المستخدم : </strong> {comment.userName}
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    <strong>نص التعليق : </strong> {comment.text}
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    <strong>ID : </strong> {comment.userId}
                  </Typography>
                </Box>
                {index < comments.length - 1 && <Divider />}{" "}
                {/* Add divider except for the last comment */}
              </div>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              لا يوجد تعليقات
            </Typography>
          )}
        </Box>
        <Button
          onClick={handleClose}
          color="primary"
          variant="contained"
          sx={{ mt: 2 }}
        >
          اغلاق
        </Button>
      </Box>
    </Modal>
  );
};

export default CommentModal;
