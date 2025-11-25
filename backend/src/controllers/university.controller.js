import University from "../models/university.model.js";
import College from "../models/college.model.js";

// Get all universities
export const getUniversities = async (req, res) => {
  try {
    const universities = await University.find().select("name domain");
    res.json({ success: true, data: universities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get colleges by university ID
export const getCollegesByUniversity = async (req, res) => {
  try {
    const { universityId } = req.params;
    const colleges = await College.find({ university: universityId }).select("name");
    res.json({ success: true, data: colleges });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// Create University
export const createUniversity = async (req, res) => {
  try {
    const { name, address_line_1, address_line_2, city, state, postcode } = req.body;
    const existingUni = await University.findOne({ name });
    if (existingUni) {
      return res.status(400).json({ success: false, message: "University already exists with this name" });
    }

    const university = await University.create({ name, address_line_1, address_line_2, city, state, postcode });
    res.status(201).json({ success: true, data: university });
  } catch (err) {
    console.error(err);
    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false, 
        message: errors.join(", ") 
      });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Create College under University
export const createCollege = async (req, res) => {
  try {
    const { name, universityId, address_line_1, address_line_2, city, state, postcode } = req.body;
    const university = await University.findById(universityId);
    if (!university) {
      return res.status(404).json({ success: false, message: "University not found" });
    }

    const college = await College.create({ name, university: universityId, address_line_1, address_line_2, city, state, postcode });
    res.status(201).json({ success: true, data: college });
  } catch (err) {
    console.error(err);
    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false, 
        message: errors.join(", ") 
      });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update University
export const updateUniversity = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    console.log('updates',updates);
    // Ensure university exists
    const university = await University.findById(id);
    if (!university) {
      return res.status(404).json({ success: false, message: "University not found" });
    }

    // Update only allowed fields
    const allowedFields = ["name", "address_line_1", "address_line_2", "city", "state", "postcode", "shipping_address_name", "semester_length"];
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        university[key] = updates[key];
      }
    });

    await university.save();
    res.status(200).json({ success: true, data: university });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: errors.join(", ") });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// Update College
export const updateCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    console.log('updates',updates);
    // Ensure college exists
    const college = await College.findById(id);
    if (!college) {
      return res.status(404).json({ success: false, message: "College not found" });
    }

    // Update only allowed fields
    const allowedFields = ["name", "address_line_1", "address_line_2", "city", "state", "postcode"];
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        college[key] = updates[key];
      }
    });

    await college.save();
    res.status(200).json({ success: true, data: college });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: errors.join(", ") });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete University (cascade delete colleges)
export const deleteUniversity = async (req, res) => {
  try {
    const { id } = req.params;

    const university = await University.findById(id);
    if (!university) {
      return res.status(404).json({ success: false, message: "University not found" });
    }

    // Delete all colleges under this university
    await College.deleteMany({ university: id });

    // Delete the university
    await University.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "University and its colleges deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete College
export const deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;

    const college = await College.findById(id);
    if (!college) {
      return res.status(404).json({ success: false, message: "College not found" });
    }

    await College.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "College deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};