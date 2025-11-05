import express, { Request, Response } from "express";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/predict", verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      area_hectares,
      duration_years,
      baseline_emissions,
      expected_emission_reduction,
      emission_factor,
      location,
      project_type,
    } = req.body;

    if (
      !area_hectares ||
      !duration_years ||
      !baseline_emissions ||
      !expected_emission_reduction ||
      !emission_factor
    ) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const emissionReduction = baseline_emissions * (expected_emission_reduction / 100);
    const carbonSequestered = emissionReduction * duration_years * emission_factor;
    const predictedCredits = Math.round(carbonSequestered * 10) / 10;

    res.status(200).json({
      message: "Prediction successful",
      predicted_carbon_credits: predictedCredits,
      project_type,
      location,
      details: {
        area_hectares,
        duration_years,
        baseline_emissions,
        expected_emission_reduction,
        emission_factor,
        emission_reduction: emissionReduction,
        carbon_sequestered: carbonSequestered,
      },
    });
  } catch (error) {
    console.error("AI prediction error:", error);
    res.status(500).json({ message: "Prediction failed" });
  }
});

export default router;
