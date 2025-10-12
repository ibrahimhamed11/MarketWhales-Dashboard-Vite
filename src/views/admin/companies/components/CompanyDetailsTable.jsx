import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  IconButton,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const CompanyDetailsTable = ({
  companyDetails,
  handleAddRow,
  handleInputChange,
  handleDeleteRow,
}) => {
  return (
    <TableContainer
      component={Paper}
      style={{
        borderRadius: '8px',
        marginBottom: '20px',
        padding: '16px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h6" style={{ marginBottom: '10px', textAlign: 'right' }} dir="rtl">
        تفاصيل الشركة
      </Typography>
      <Button
        onClick={handleAddRow}
        variant="contained"
        color="primary"
        style={{ margin: '10px 0', borderRadius: '8px', display: 'block' }}
      >
        <AddIcon />
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ padding: '8px', textAlign: 'right' }}>القميه</TableCell>
            <TableCell style={{ padding: '8px', textAlign: 'right' }}>العنوان</TableCell>
            <TableCell style={{ padding: '8px', textAlign: 'right' }}>الإجراءات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {companyDetails.map((detail) => (
    <TableRow key={detail._id} style={{ marginBottom: '8px' }}>
      <TableCell style={{ padding: '8px', textAlign: 'right' }}>
        <TextField
          value={detail.value}
          onChange={(e) => handleInputChange(detail._id, 'value', e.target.value)} 
          style={{ width: '95%', borderRadius: '8px' }}
          dir="rtl"
        />
      </TableCell>
      <TableCell style={{ padding: '8px', textAlign: 'right' }}>
        <TextField
          value={detail.key}
          onChange={(e) => handleInputChange(detail._id, 'key', e.target.value)} 
          style={{ width: '95%', borderRadius: '8px' }}
          dir="rtl"
        />
      </TableCell>
      <TableCell style={{ padding: '8px', textAlign: 'right' }}>
        <IconButton onClick={() => handleDeleteRow(detail._id)} color="error">
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

      </Table>
    </TableContainer>
  );
};

export default CompanyDetailsTable;
