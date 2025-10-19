import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Checkbox, FormControlLabel,Avatar, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { AddCircleOutline, Delete } from '@mui/icons-material';
import {  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import { Autocomplete } from '@mui/material';

import { getCompany, addCompany, updateCompany } from '../../../../utils/companies/companies'; // Update with your API file
import * as Yup from 'yup'; // Import Yup library for validation
import {
  withdrawalMethodsOptions,
  depositMethodsOptions,
  supportLanguagesOptions,
  middleEastCountries,
  accountCurrenciesOptions,
  supportChannelsOptions
} from './autocompleteOptions';
import 'react-toastify/dist/ReactToastify.css';
import Toast,{ showToast } from '../../../../components/shared/toast'; // Importing showToast function

import { API_URL } from '../../../../utils/axios';
import LogoUpload from './LogoUpload';
import CompanyDetailsTable from './CompanyDetailsTable';




const validationSchema = Yup.object().shape({
  companyName: Yup.string().required('اسم الشركة مطلوب'),
  companyLink: Yup.string().required('رابط الشركة مطلوب'),
  commissionPercentage: Yup.number().required('نسبة العمولة مطلوبة'),
  commissionPerLot: Yup.number().required('العمولة لكل لوت مطلوبة'),
  spread: Yup.number().required('الفارق مطلوب'),
  maxLeverage: Yup.string().required('أقصى رافعة مطلوبة'),
  minDeposit: Yup.number().required('أدنى إيداع مطلوب'),
  minLotSize: Yup.number().required('أدنى حجم لوت مطلوب'),
  offices: Yup.string(),
  islamicAccounts: Yup.boolean().required('حقل الحسابات الإسلامية مطلوب'),
  twentyFourHourSupport: Yup.boolean().required('حقل الدعم على مدار 24 ساعة مطلوب'),
  phoneTrading: Yup.boolean().required('حقل التداول الهاتفي مطلوب'),
  metatrader: Yup.boolean().required('حقل ميتاتريدر مطلوب'),
  trailingStop: Yup.boolean().required('حقل وقف الخسارة المتحرك مطلوب'),
  supportedCountries: Yup.array().of(Yup.string()).required('يجب وجود دولة مدعومة واحدة على الأقل')
    .test('atLeastOneSupportedCountry', 'يجب وجود دولة مدعومة واحدة على الأقل', (value) => {
      return value && value.length > 0;
    }),
  supportChannels: Yup.array().of(Yup.string()).required('يجب وجود قناة دعم واحدة على الأقل')
    .test('atLeastOneSupportChannel', 'يجب وجود قناة دعم واحدة على الأقل', (value) => {
      return value && value.length > 0;
    }),
  depositMethods: Yup.array().of(Yup.string()).required('يجب وجود طريقة إيداع واحدة على الأقل')
    .test('atLeastOneDepositMethod', 'يجب وجود طريقة إيداع واحدة على الأقل', (value) => {
      return value && value.length > 0;
    }),
  withdrawalMethods: Yup.array().of(Yup.string()).required('يجب وجود طريقة سحب واحدة على الأقل')
    .test('atLeastOneWithdrawalMethod', 'يجب وجود طريقة سحب واحدة على الأقل', (value) => {
      return value && value.length > 0;
    }),
  supportLanguages: Yup.array().of(Yup.string()).required('يجب وجود لغة دعم واحدة على الأقل')
    .test('atLeastOneSupportLanguage', 'يجب وجود لغة دعم واحدة على الأقل', (value) => {
      return value && value.length > 0;
    }),
  accountCurrencies: Yup.array().of(Yup.string()).required('يجب وجود عملة حساب واحدة على الأقل')
    .test('atLeastOneAccountCurrency', 'يجب وجود عملة حساب واحدة على الأقل', (value) => {
      return value && value.length > 0;
    }),
});

const AddCompanyModal = ({
  open,
  onClose,
  companyId,
  editMode,
  onCancel,
}) => {



  const [companyData, setCompanyData] = useState({
      companyName: '',
      companyLink: '',
      companyDetails: [],
      regulatoryAuthorities: [{ name: '', link: '' }],
      accountCurrencies: [],
      supportLanguages: [],
      supportChannels: [],
      depositMethods: [],
      withdrawalMethods: [],
      supportedCountries: [],
      commissionPercentage:null,
      commissionPerLot:null,
      spread: null,
      maxLeverage: null,
      minDeposit: null,
      minLotSize: null,
      establishmentYear:null,
      offices: '',
      islamicAccounts: false,
      twentyFourHourSupport: false,
      phoneTrading: false,
      metatrader: false,
      trailingStop: false,
      scalping: false,
      hedging: false,
      demoAccounts: false,
      logo: null,
    });
  
  const [openDialog, setOpenDialog] = useState(false);
  const [newDetail, setNewDetail] = useState({ key: '', value: '' });
  const [newAuthority, setNewAuthority] = useState({ name: '', link: '' });
  const [depositMethods, setDepositMethods] =useState([]);
  const [WithdrawalMethod, setWithdrawalMethod] =useState([]);
  const [AccountCurrency, setAccountCurrency] = useState([]);
  const [SupportLanguage, setSupportLanguage] = useState([]);
  const [supportedCountries, setSupportedCountries] = useState([]);
  const [SupportChannel, setSupportChannel] = useState([]);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [logoFile, setLogoFile] = useState(null); 
  const [errors, setErrors] = useState({}); 

 
const logoUrl = `${API_URL}/media/${companyData.logo}`;


const validateAllFields = async () => {
        try {
          await validationSchema.validate(companyData, { abortEarly: false });
          setErrors({});
          return true; 
        } catch (validationErrors) {
          const errors = {};
          validationErrors.inner.forEach(error => {
            errors[error.path] = error.message;
          });
          setErrors(errors); 
          return false; 
        }
      };
 
  const validateField = async (field, value) => {
    try {
      await Yup.reach(validationSchema, field).validate(value);
      setErrors(prevErrors => ({ ...prevErrors, [field]: undefined }));
    } catch (error) {
      setErrors(prevErrors => ({ ...prevErrors, [field]: error.message }));
    }
  };

  const handleInputUpdate = async (e, index, field, type) => {
    const { name, value } = e.target;
    await validateField(name, value);
    switch (type) {
      case 'regulatoryAuthorities':
        const updatedAuthorities = [...companyData.regulatoryAuthorities];
        if (field === 'name') {
          updatedAuthorities[index].name = value;
        } else if (field === 'link') {
          updatedAuthorities[index].link = value;
        }
        setCompanyData(prevState => ({
          ...prevState,
          regulatoryAuthorities: updatedAuthorities
        }));
        break;
      case 'companyName':
        setCompanyData(prevState => ({
          ...prevState,
          companyName: value
        }));
        break;
      case 'companyLink':
        setCompanyData(prevState => ({
          ...prevState,
          companyLink: value
        }));
        break;
      case 'commissionPercentage':
        setCompanyData(prevState => ({
          ...prevState,
          commissionPercentage: value
        }));
        break;
  
      case 'spread':
        setCompanyData(prevState => ({
          ...prevState,
          spread: value
        }));
        break;
      case 'maxLeverage':
        setCompanyData(prevState => ({
          ...prevState,
          maxLeverage: value
        }));
        break;
      case 'minDeposit':
        setCompanyData(prevState => ({
          ...prevState,
          minDeposit: value
        }));
        break;
      case 'minLotSize':
        setCompanyData(prevState => ({
          ...prevState,
          minLotSize: value
        }));
        break;
      case 'establishmentYear':
        setCompanyData(prevState => ({
          ...prevState,
          establishmentYear: value
        }));
        break;
      case 'offices':
        setCompanyData(prevState => ({
          ...prevState,
          offices: value
        }));
        break;
      case 'accountCurrencies':
        setCompanyData(prevState => ({
          ...prevState,
          accountCurrencies: value.split(',')
        }));
        break;
      case 'supportChannels':
        setCompanyData(prevState => ({
          ...prevState,
          supportChannels: value.split(',')
        }));
        break;
      case 'supportLanguages':
        setCompanyData(prevState => ({
          ...prevState,
          supportLanguages: value.split(',')
        }));
        break;
      case 'depositMethods':
        setCompanyData(prevState => ({
          ...prevState,
          depositMethods: value.split(',')
        }));
        break;
      case 'withdrawalMethods':
        setCompanyData(prevState => ({
          ...prevState,
          withdrawalMethods: value.split(',')
        }));
        break;
      case 'commissionPerLot':
        setCompanyData(prevState => ({
          ...prevState,
          commissionPerLot: value
        }));
        break;
      default:
        break;
    }
  };

  const handleCheckboxChange = (e, propertyName) => {
    const { checked } = e.target;
    setCompanyData(prevState => ({
      ...prevState,
      [propertyName]: checked
    }));
  };
  const handleAddRow = () => {
    const newDetail = {
      _id: Date.now().toString(), // Generate a unique ID for the new row
      key: '',
      value: ''
    };
    setCompanyDetails([...companyDetails, newDetail]);
  };
  





  const handleDeleteRow = (_id) => {
    // Filter out the item with the specified _id
    const updatedDetails = companyDetails.filter(detail => detail._id !== _id);
    setCompanyDetails(updatedDetails);
  };


  const handleInputChange = (id, field, value) => {
    const updatedDetails = [...companyDetails];
  
    // Find the index of the detail that matches the provided id
    const index = updatedDetails.findIndex(detail => detail._id === id);
  
    // Check if the index is valid
    if (index !== -1) {
      // Update the specific field of the found detail
      updatedDetails[index][field] = value;
  
      // Update state with the new details
      setCompanyDetails(updatedDetails);
  
      // Log the updated state
  
      // Update companyData with the new details
      setCompanyData(prevState => ({
        ...prevState,
        companyDetails: updatedDetails,
      }));
  
    } else {
      console.error('Invalid ID provided for handleInputChange:', id);
    }
  
    validateField(field, value);
  };
  






  const handleAddAuthority = () => {
    setCompanyData({
      ...companyData,
      regulatoryAuthorities: [...companyData.regulatoryAuthorities, newAuthority]
    });
    setNewAuthority({ name: '', link: '' }); 
  };
  const handleDeleteAuthority = (index) => {
    const updatedAuthorities = [...companyData.regulatoryAuthorities];
    updatedAuthorities.splice(index, 1);
    setCompanyData({ ...companyData, regulatoryAuthorities: updatedAuthorities });
  };
  const restValues = () => {

    setOpenDialog(false);
        setNewDetail({ key: '', value: '' });
    setNewAuthority({ name: '', link: '' });
    setDepositMethods([]);
    setWithdrawalMethod([]);
    setAccountCurrency([]);
    setSupportLanguage([]);
    setSupportedCountries([]);
    setSupportChannel([]);
    setLogoFile(null)
    setCompanyData({
      companyName: '',
      companyLink: '',
      companyDetails: [{ key: '', value: '' }],
      regulatoryAuthorities: [{ name: '', link: '' }],
      accountCurrencies: [],
      supportLanguages: [],
      supportChannels: [],
      depositMethods: [],
      withdrawalMethods: [],
      supportedCountries: [],
      commissionPercentage: null,
      commissionPerLot: null,
      spread: null,
      maxLeverage: null,
      minDeposit: null,
      minLotSize: null,
      establishmentYear: null,
      offices: '',
      islamicAccounts: false,
      twentyFourHourSupport: false,
      phoneTrading: false,
      metatrader: false,
      trailingStop: false,
      scalping: false,
      hedging: false,
      demoAccounts: false,
      logo: '',
      
    });
    onCancel();
  };
  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCompanyData((prevState) => ({
        ...prevState,
        logo: file,
      }));
      setLogoFile(file);
    }
  };
  const handleAdd = async () => {
    try {
    const isValid = await validateAllFields();
      if (isValid) {
      const companyPayload = { ...companyData };
      if (logoFile) {
        companyPayload.logo = logoFile;
      }
      const response = await addCompany(companyPayload);
      showToast('تم اضافة الشركه بنجاح', 'success');
      setLogoFile(null);
    }
    } catch (error) {
      console.error('Error adding company:', error);
    }
  };
  




  useEffect(() => {
    if (editMode) {
      fetchCompanyData(companyId);
    }
  }, [editMode, companyId]);
  const fetchCompanyData = async (id) => {
    try {
      const company = await getCompany(id);
       setCompanyDetails(company.companyDetails)
      setCompanyData(company); 
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  };
  
  const handleAddOrUpdate = async () => {
    try {
        const isValid = await validateAllFields();
        if (isValid) {
        
      const companyPayload = { ...companyData };
      if (logoFile) {
        companyPayload.logo = logoFile;
      }
      companyPayload.companyDetails=companyDetails
            if (editMode) {
                const updateResponse = await updateCompany(companyId, companyPayload, logoFile);
                showToast('تم تحديث معلومات الشركه بنجاح', 'success');
            } else {
                const addResponse = await addCompany(companyPayload);
                showToast('تم إضافة الشركه بنجاح', 'success');
            }
            restValues();
            onClose();
        }
    } catch (error) {
        console.error('Error adding/updating company:', error);
        showToast('حدث خطأ أثناء تحديث أو إضافة الشركه', 'error');
    }
};

  
  const handleCloseModal = () => {
    onClose();
    restValues();
  };






  return (
    <>
      <Modal open={open} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            maxWidth: "90%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflowY: "auto",
            borderRadius: "12px",
          }}
        >
    <Typography
  variant="h5"
  gutterBottom
  sx={{ marginBottom: 5 }} 
>
  {editMode ? "تعديل" : "اضافة"}
</Typography>
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <TextField
                focused={editMode}
                name="companyName"
                label="اسم الشركه"
                value={companyData.companyName}
                onChange={(e) =>
                  handleInputUpdate(e, null, null, "companyName")
                }
                fullWidth
                error={!!errors.companyName}
                helperText={errors.companyName}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                focused={editMode}
                name="companyLink"
                label="رابط الشركه"
                value={companyData.companyLink}
                onChange={(e) =>
                  handleInputUpdate(e, null, null, "companyLink")
                }
                fullWidth
                error={!!errors.companyLink}
                helperText={errors.companyLink}
              />
            </Grid>

            <LogoUpload
        editMode={editMode}
        logoUrl={logoUrl}
        logoFile={logoFile}
        handleLogoChange={handleLogoChange}
      />


            <Grid container spacing={2} style={{ marginTop: "20px" }}>
              <Divider variant="middle" sx={{ width: "100%" }} />
            </Grid>


            <Divider variant="middle" sx={{ width: "100%" }} />

            {/* Regulatory Authorities: */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
تراخيص الشركه
              </Typography>
              <IconButton onClick={handleAddAuthority}>
                <AddCircleOutline />
              </IconButton>
              {companyData.regulatoryAuthorities.map((authority, index) => (
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  key={index}
                  style={{ marginBottom: "16px" }}
                >
                  <Grid item xs={6}>
                    <TextField
                                    focused={editMode}

                      name={`regulatoryAuthorities[${index}].name`}
                      label="اسم الترخيص"
                      value={authority.name}
                      onChange={(e) =>
                        handleInputUpdate(
                          e,
                          index,
                          "name",
                          "regulatoryAuthorities"
                        )
                      }
                      fullWidth
                      multiline={false}
                      error={!!errors.regulatoryAuthorities}
                      helperText={errors.regulatoryAuthorities}
                    />
                  </Grid>

                  <Grid item xs={5}>
                    <TextField
                                    focused={editMode}

                      name={`regulatoryAuthorities[${index}].link`}
                      label="رابط الترخيص"
                      value={authority.link}
                      onChange={(e) =>
                        handleInputUpdate(
                          e,
                          index,
                          "link",
                          "regulatoryAuthorities"
                        )
                      }
                      fullWidth
                      multiline={false}
                    />
                  </Grid>

                  <Grid item xs={1}>
                    <IconButton
                      onClick={() => handleDeleteAuthority(index)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Grid item xs={6}>
              <TextField
                focused={editMode}
                name="commissionPercentage"
                label="النسبه المئويه للعمولة "
                type="number"
                value={
                  companyData.commissionPercentage === 0
                    ? ""
                    : companyData.commissionPercentage
                }
                onChange={(e) =>
                  handleInputUpdate(e, null, null, "commissionPercentage")
                }
                error={!!errors.commissionPercentage}
                helperText={errors.commissionPercentage}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                focused={editMode}
                name="commissionPerLot"
                label="نسبة العموله لكل عقد"
                type="number"
                value={
                  companyData.commissionPerLot === 0
                    ? ""
                    : companyData.commissionPerLot
                }
                onChange={(e) =>
                  handleInputUpdate(e, null, null, "commissionPerLot")
                }
                fullWidth
                error={!!errors.commissionPerLot}
                helperText={errors.commissionPerLot}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                focused={editMode}
                name="spread"
                label="فرق السعر"
                type="number"
                value={companyData.spread === 0 ? "" : companyData.spread}
                onChange={(e) => handleInputUpdate(e, null, null, "spread")}
                fullWidth
                error={!!errors.spread}
                helperText={errors.spread}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                focused={editMode}
                name="maxLeverage"
                label="اقصي رافعه ماليه"
                value={
                  companyData.maxLeverage === 0 ? "" : companyData.maxLeverage
                }
                onChange={(e) =>
                  handleInputUpdate(e, null, null, "maxLeverage")
                }
                fullWidth
                error={!!errors.maxLeverage}
                helperText={errors.maxLeverage}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                focused={editMode}
                name="minDeposit"
                label="اقل ايداع"
                type="number"
                value={
                  companyData.minDeposit === 0 ? "" : companyData.minDeposit
                }
                onChange={(e) => handleInputUpdate(e, null, null, "minDeposit")}
                fullWidth
                error={!!errors.minDeposit}
                helperText={errors.minDeposit}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                focused={editMode}
                name="minLotSize"
                label="اقل حجم عقد"
                type="number"
                value={
                  companyData.minLotSize === 0 ? "" : companyData.minLotSize
                }
                onChange={(e) => handleInputUpdate(e, null, null, "minLotSize")}
                fullWidth
                error={!!errors.minLotSize}
                helperText={errors.minLotSize}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
               focused={editMode}
                  name="establishmentYear"
                label="سنة التأسيس"
                type="number"
                value={
                  companyData.establishmentYear === 0
                    ? ""
                    : companyData.establishmentYear
                }
                onChange={(e) =>
                  handleInputUpdate(e, null, null, "establishmentYear")
                }
                fullWidth
              />
            </Grid>





            <Grid item xs={6}>
              <TextField
                            focused={editMode}

                name="offices"
                label="مكاتب الشركه"
                value={companyData.offices === "" ? "" : companyData.offices}
                onChange={(e) => handleInputUpdate(e, null, null, "offices")}
                fullWidth
                error={!!errors.offices}
                helperText={errors.offices}
              />
            </Grid>



            <Toast position="top-right" autoClose={3000} closeButton={false} />






            <Grid item xs={6}>
              <Autocomplete
                multiple
                options={supportChannelsOptions}
                value={companyData.supportChannels || []} 
                onChange={(event, newValue) => {
                  setSupportChannel(newValue);
                  setCompanyData((prevState) => ({
                    ...prevState,
                    supportChannels: newValue,
                  }));
                  validateField("supportChannels", newValue); 
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="وسائل التواصل مع الدعم"
                    error={!!errors.supportChannels}
                    helperText={errors.supportChannels}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                options={withdrawalMethodsOptions}
                value={companyData.withdrawalMethods || []}
                onChange={(event, newValue) => {
                  setWithdrawalMethod(newValue);
                  setCompanyData((prevState) => ({
                    ...prevState,
                    withdrawalMethods: newValue,
                  }));
                  validateField("withdrawalMethods", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="وسائل السحب"
                    error={!!errors.withdrawalMethods}
                    helperText={errors.withdrawalMethods}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                options={depositMethodsOptions}
                value={companyData.depositMethods || []}
                onChange={(event, newValue) => {
                  setDepositMethods(newValue);
                  setCompanyData((prevState) => ({
                    ...prevState,
                    depositMethods: newValue,
                  }));
                  validateField("depositMethods", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="وسائل الايداع"
                    error={!!errors.depositMethods}
                    helperText={errors.depositMethods}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Autocomplete
                multiple
                options={supportLanguagesOptions}
                value={companyData.supportLanguages || []}
                onChange={(event, newValue) => {
                  setSupportLanguage(newValue);
                  setCompanyData((prevState) => ({
                    ...prevState,
                    supportLanguages: newValue,
                  }));
                  validateField("supportLanguages", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="اللغات"
                    error={!!errors.supportLanguages}
                    helperText={errors.supportLanguages}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Autocomplete
                multiple
                options={middleEastCountries}
                value={companyData.supportedCountries || []}
                onChange={(event, newValue) => {
                  setSupportedCountries(newValue);
                  setCompanyData((prevState) => ({
                    ...prevState,
                    supportedCountries: newValue,
                  }));
                  validateField("supportedCountries", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="الدول اللي تدعمها"
                    error={!!errors.supportedCountries}
                    helperText={errors.supportedCountries}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Autocomplete
                multiple
                options={accountCurrenciesOptions}
                value={companyData.accountCurrencies || []}
                onChange={(event, newValue) => {
                  setAccountCurrency(newValue);
                  setCompanyData((prevState) => ({
                    ...prevState,
                    accountCurrencies: newValue,
                  }));
                  validateField("accountCurrencies", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="عملات الحساب"
                    error={!!errors.accountCurrencies}
                    helperText={errors.accountCurrencies}
                  />
                )}
              />
            </Grid>



            <Grid item xs={3}>
  <FormControlLabel
    control={
      <Checkbox
        name="islamicAccounts"
        checked={companyData.islamicAccounts}
        onChange={(e) => handleCheckboxChange(e, "islamicAccounts")}
      />
    }
    label="حسابات إسلامية" // Islamic Accounts
  />
</Grid>
<Grid item xs={3}>
  <FormControlLabel
    control={
      <Checkbox
        name="twentyFourHourSupport"
        checked={companyData.twentyFourHourSupport}
        onChange={(e) =>
          handleCheckboxChange(e, "twentyFourHourSupport")
        }
      />
    }
    label="دعم على مدار 24 ساعة" // 24 Hour Support
  />
</Grid>
<Grid item xs={3}>
  <FormControlLabel
    control={
      <Checkbox
        name="phoneTrading"
        checked={companyData.phoneTrading}
        onChange={(e) => handleCheckboxChange(e, "phoneTrading")}
      />
    }
    label="تداول عبر الهاتف" // Phone Trading
  />
</Grid>
<Grid item xs={3}>
  <FormControlLabel
    control={
      <Checkbox
        name="metatrader"
        checked={companyData.metatrader}
        onChange={(e) => handleCheckboxChange(e, "metatrader")}
      />
    }
    label="ميتاتريدر" // MetaTrader
  />
</Grid>
<Grid item xs={3}>
  <FormControlLabel
    control={
      <Checkbox
        name="trailingStop"
        checked={companyData.trailingStop}
        onChange={(e) => handleCheckboxChange(e, "trailingStop")}
      />
    }
    label="وقف الخسارة المتحرك" // Trailing Stop
  />
</Grid>
<Grid item xs={3}>
  <FormControlLabel
    control={
      <Checkbox
        name="scalping"
        checked={companyData.scalping}
        onChange={(e) => handleCheckboxChange(e, "scalping")}
      />
    }
    label="سكالبينغ" // Scalping
  />
</Grid>
<Grid item xs={3}>
  <FormControlLabel
    control={
      <Checkbox
        name="hedging"
        checked={companyData.hedging}
        onChange={(e) => handleCheckboxChange(e, "hedging")}
      />
    }
    label="التحوط" // Hedging
  />
</Grid>
<Grid item xs={3}>
  <FormControlLabel
    control={
      <Checkbox
        name="demoAccounts"
        checked={companyData.demoAccounts}
        onChange={(e) => handleCheckboxChange(e, "demoAccounts")}
      />
    }
    label="حسابات تجريبية" // Demo Accounts
  />
</Grid>

            <Grid item xs={12}>
            <Typography variant="h6" style={{ marginBottom: "20px" }} dir="rtl">
  أضف تفاصيل إضافية
</Typography>




<CompanyDetailsTable
        companyDetails={companyDetails}
        handleAddRow={handleAddRow}
        handleInputChange={handleInputChange}
        handleDeleteRow={handleDeleteRow}
      />



            </Grid>
          </Grid>
          <Box display="flex" justifyContent="center" marginTop={10}>
            {editMode ? (
              <Button
                variant="contained"
                onClick={handleAddOrUpdate}
                style={{
                  width: "100px",
                  height: "50px",
                  textTransform: "none",
                  borderRadius: "15px",
                }}
              >
                تعديل
              </Button>
            ) : (
              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={handleAdd}
                    style={{
                      width: "100px",
                      height: "50px",
                      textTransform: "none",
                      borderRadius: "8px",

                      
                    }}
                  >
                    اضافه
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    onClick={restValues}
                    style={{
                      width: "100px",
                      borderRadius: "8px",
                      height: "50px",
                      backgroundColor: "red",
                      color: "white",
                      textTransform: "none",
                    }}
                  >
اغلاق
                  </Button>
                </Grid>
              </Grid>
            )}
          </Box>
        </Box>
      </Modal>

    
    </>
  );
};

export default AddCompanyModal;