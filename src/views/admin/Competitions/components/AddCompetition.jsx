import React, { useState, useEffect } from "react";
import Modal from "../../../../components/modal/modal";
import { addCompetition, updateCompetition } from "../../../../utils/competitions/competitions";
import { TextField, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const AddCompetition = ({ isOpen, onClose, onSuccess, competition }) => {
  const [formData, setFormData] = useState({
    title: "",
    details: "",
    startDate: "",
    endDate: "",
    status: "upcoming",
    links: [""],
    poster: null,
  });

  const [errors, setErrors] = useState({});

  // Pre-fill form if competition prop is provided (update mode)
  useEffect(() => {
    if (competition) {
      setFormData({
        title: competition.title,
        details: competition.details,
        startDate: competition.startDate,
        endDate: competition.endDate,
        status: competition.status,
        links: competition.links || [""],
        poster: null, // Reset poster for update (can be handled separately if needed)
      });
    } else {
      // Reset form for add mode
      setFormData({
        title: "",
        details: "",
        startDate: "",
        endDate: "",
        status: "upcoming",
        links: [""],
        poster: null,
      });
    }
  }, [competition]);

  const validate = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.details.trim()) newErrors.details = "Details are required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.startDate = "Start date must be before end date";
    }
    formData.links.forEach((link, index) => {
      if (!link.trim()) newErrors[`links-${index}`] = "Link cannot be empty";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === "links" && index !== null) {
      const newLinks = [...formData.links];
      newLinks[index] = value;
      setFormData((prev) => ({ ...prev, links: newLinks }));
      setErrors((prev) => ({ ...prev, [`links-${index}`]: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, poster: e.target.files[0] }));
    setErrors((prev) => ({ ...prev, poster: "" }));
  };

  const handleAddLink = () => {
    setFormData((prev) => ({ ...prev, links: [...prev.links, ""] }));
  };

  const handleRemoveLink = (index) => {
    const newLinks = formData.links.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, links: newLinks }));

    let newErrors = { ...errors };
    delete newErrors[`links-${index}`];
    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      let response;
      if (competition) {
        // Update existing competition
        response = await updateCompetition(competition._id, formData);
      } else {
        // Add new competition
        response = await addCompetition(formData);
      }
      onSuccess(response);
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalName={competition ? "Update Competition" : "Add Competition"}
      inputFields={[
        { label: "Title", name: "title", value: formData.title, onChange: handleChange, error: errors.title },
        { label: "Details", name: "details", value: formData.details, onChange: handleChange, error: errors.details },
        { label: "Start Date", name: "startDate", value: formData.startDate, onChange: handleChange, type: "date", error: errors.startDate },
        { label: "End Date", name: "endDate", value: formData.endDate, onChange: handleChange, type: "date", error: errors.endDate },
        {
          label: "Links",
          name: "links",
          value: "",
          onChange: () => {},
          customRender: (
            <>
              {formData.links.map((link, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label={`Link ${index + 1}`}
                    name="links"
                    value={link}
                    onChange={(e) => handleChange(e, index)}
                    placeholder="Enter link"
                    margin="normal"
                    error={!!errors[`links-${index}`]}
                    helperText={errors[`links-${index}`]}
                    focused
                  />
                  <IconButton color="error" onClick={() => handleRemoveLink(index)}>
                    <RemoveCircleIcon />
                  </IconButton>
                </div>
              ))}
              <IconButton color="primary" onClick={handleAddLink} style={{ marginTop: "10px" }}>
                <AddCircleIcon fontSize="large" />
              </IconButton>
            </>
          ),
        },
        {
          label: "Status",
          name: "status",
          value: formData.status,
          onChange: handleChange,
          select: true,
          options: ["upcoming", "ongoing", "completed"],
        },
        { label: "Poster", name: "poster", type: "file", onChange: handleFileChange, error: errors.poster },
      ]}
      onSave={handleSubmit}
    />
  );
};

export default AddCompetition;