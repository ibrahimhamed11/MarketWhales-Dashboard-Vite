
<Grid container spacing={2}>
<Grid item xs={12}>
  <TableContainer component={Paper} style={{ borderRadius: '8px' }}>
    <Button onClick={handleAddRow} variant="contained" color="primary" style={{ margin: '20px' }}>
      <AddIcon />
    </Button>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell style={{ padding: '8px' }}>Key</TableCell>
          <TableCell style={{ padding: '8px' }}>Value</TableCell>
          <TableCell style={{ padding: '8px' }}>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {companyDetails.map((detail, index) => (
          <TableRow key={index}>
            <TableCell style={{ padding: '8px' }}>
              <TextField
                value={detail.key}
                onChange={e => handleInputChange(index, 'key', e.target.value)}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </TableCell>
            <TableCell style={{ padding: '8px' }}>
              <TextField
                value={detail.value}
                onChange={e => handleInputChange(index, 'value', e.target.value)}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </TableCell>
            <TableCell style={{ padding: '8px' }}>
              <IconButton onClick={() => handleDeleteRow(index)} color="secondary">
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <Grid item xs={6} style={{ marginTop: '8px', marginBottom: '8px' }}>
      <Button onClick={handleSendData} variant="contained" color="primary" style={{ margin: '8px' }}>
        <SendIcon />
      </Button>
    </Grid>
  </TableContainer>
</Grid>
</Grid>


const handleInputChange = (index, field, value) => {
    const updatedDetails = [...companyDetails];
    updatedDetails[index][field] = value;
    setCompanyDetails(updatedDetails);
  };