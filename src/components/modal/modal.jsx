import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Select, 
  MenuItem, 
  TextField, 
  InputLabel, 
  FormControl,
  FormHelperText,
  InputAdornment, // Import InputAdornment
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import Autocomplete from "@mui/material/Autocomplete";

const Modal = ({ 
  isOpen, 
  onClose, 
  inputFields, 
  onSave,
  imagePicker,
  modalName 
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{modalName}</DialogTitle>
      <DialogContent>
        {imagePicker}
        {inputFields.map((field, index) => {
          if (field.customRender) {
            return <div key={index}>{field.customRender}</div>; // Render custom content
          } else if (field.type === "autocomplete") {
            return (
              <Autocomplete
                key={index}
                value={field.value}
                onChange={field.onChange}
                options={field.options}
                getOptionLabel={field.getOptionLabel}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label={field.label} 
                    error={!!field.error} 
                    helperText={field.error} 
                  />
                )}
              />
            );
          } else if (field.select) {
            return (
              <FormControl 
                variant="outlined" 
                margin="normal" 
                fullWidth 
                key={index}
                error={!!field.error}
              >
                <InputLabel>{field.label}</InputLabel>
                <Select label={field.label} value={field.value} onChange={field.onChange}>
                  {field.options.map((option, idx) => (
                    <MenuItem key={idx} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {field.error && <FormHelperText>{field.error}</FormHelperText>}
              </FormControl>
            );
          } else if (field.type === "file") {
            return (
              <TextField
                key={index}
                label={field.label}
                name={field.name}
                onChange={field.onChange}
                fullWidth
                variant="outlined"
                margin="normal"
                type="file"
                InputProps={{
                  startAdornment: <InputAdornment position="start">{field.label}</InputAdornment>,
                }}
                error={!!field.error}
                helperText={field.error}
              />
            );
          } else {
            return (
              <TextField
                focused
                key={index}
                label={field.label}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                fullWidth
                variant="outlined"
                margin="normal"
                type={field.type || "text"}
                error={!!field.error}
                helperText={field.error}
              />
            );
          }
        })}
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={onClose}
          variant="contained"
          color="error"
          startIcon={<CancelIcon />}
        >
          Cancel
        </Button>
        <Button 
          onClick={onSave} 
          color="primary"
          variant="contained"
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
