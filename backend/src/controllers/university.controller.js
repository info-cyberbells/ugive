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
    const { name, domain } = req.body;

    if (!name || !domain) {
      return res.status(400).json({ success: false, message: "Name and domain are required" });
    }

    const existingUni = await University.findOne({ domain });
    if (existingUni) {
      return res.status(400).json({ success: false, message: "University already exists with this domain" });
    }

    const university = await University.create({ name, domain });
    res.status(201).json({ success: true, data: university });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Create College under University
export const createCollege = async (req, res) => {
  try {
    const { name, universityId } = req.body;

    if (!name || !universityId) {
      return res.status(400).json({ success: false, message: "Name and universityId are required" });
    }

    const university = await University.findById(universityId);
    if (!university) {
      return res.status(404).json({ success: false, message: "University not found" });
    }

    const college = await College.create({ name, university: universityId });
    res.status(201).json({ success: true, data: college });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

