const express = require("express");
const router = express.Router();
const Form = require("../models/Form");

const authMiddleware = require("../middleware/authMiddleware");
const {
  saveForm,
  getForms,
  updateForm,
} = require("../controllers/formController");

// Save a new form (protected)
router.post("/", authMiddleware, saveForm);

// Get all forms for logged-in user (protected)
router.get("/", authMiddleware, getForms);

// Update an existing form (protected)
router.put("/:id", authMiddleware, updateForm);

// DELETE form
router.delete("/:id", async (req, res) => {
  console.log("DELETE FORM ID:", req.params.id);
  try {
    await Form.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});


module.exports = router;
