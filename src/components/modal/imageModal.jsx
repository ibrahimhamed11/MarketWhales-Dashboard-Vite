import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import {API_URL} from '../../utils/axios'
const ImageModal = ({ open, handleClose, imageUrl }) => {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        {loading && <CircularProgress />} {/* Render spinner while loading */}
        <img
          src={`${API_URL}/media/${imageUrl}`}
          alt="order screenshot Image"
          style={{ width: '100%', display: loading ? 'none' : 'block' }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        {loading && <div>Loading...</div>}
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
