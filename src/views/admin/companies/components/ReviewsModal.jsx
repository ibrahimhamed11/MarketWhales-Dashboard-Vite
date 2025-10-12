import React from "react";
import { Box, Modal, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ReviewsModal = ({ open, onClose, reviews, onDeleteReview, companyId }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ padding: 4, backgroundColor: 'white', borderRadius: '8px', maxWidth: '600px', margin: 'auto', mt: '100px', overflowY: 'auto', maxHeight: '80vh' }}>
        <Typography variant="h6" mb={2}>المراجعات</Typography>
        {reviews.length === 0 ? (
          <Typography>لا توجد مراجعات</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>الاسم</strong></TableCell>
                  <TableCell><strong>التعليق</strong></TableCell>
                  <TableCell><strong>التقييم</strong></TableCell>
                  <TableCell><strong>اجراء</strong></TableCell>
                  <TableCell><strong>User Id</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviews.map(review => (
                  <TableRow key={review.reviewId}>
                    <TableCell>{review.user}</TableCell>
                    <TableCell>{review.comment}</TableCell>
                    <TableCell>{review.rating}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => onDeleteReview(review.reviewId, companyId)} color="error">
                        <DeleteIcon />
                      </IconButton>

                    </TableCell>
                    <TableCell>{review.ownerId}</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Button onClick={onClose} variant="contained" sx={{ mt: 2 }}>إغلاق</Button>
      </Box>
    </Modal>
  );
};

export default ReviewsModal;
