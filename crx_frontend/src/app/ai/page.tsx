"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import WalletConnect from "../../components/ConnectWalletButton";
import styles from "../../styles/ai.module.css";

export default function AIPredictor() {
  const router = useRouter();

  const [form, setForm] = useState({
    area_hectares: "",
    duration_years: "",
    baseline_emissions: "",
    expected_emission_reduction: "",
    location: "",
    emission_factor: "",
    project_type: "reforestation",
  });

  const [result, setResult] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("crx_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      const res = await fetch(`${apiUrl}/ai/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          ...form,
          area_hectares: parseFloat(form.area_hectares),
          duration_years: parseInt(form.duration_years),
          baseline_emissions: parseFloat(form.baseline_emissions),
          expected_emission_reduction: parseFloat(form.expected_emission_reduction),
          emission_factor: parseFloat(form.emission_factor),
        }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await res.text();
        console.error("Non-JSON response from AI:", errorText);
        throw new Error("Server did not return JSON.");
      }

      const data = await res.json();
      setResult(data.predicted_carbon_credits ?? null);
    } catch (error) {
      console.error("Prediction failed:", error);
      setResult(null);
      alert("❌ AI prediction failed. Please check the backend service.");
    }
  };

  return (
    <main className={styles.dashboardContainer}>
      <video className={styles.videoBackground} autoPlay loop muted playsInline>
        <source src="/Background.mp4" type="video/mp4" />
      </video>

      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <h2 className={styles.logo}>CRX 🌱</h2>
        </div>
        <div className={styles.navRight}>
          <button onClick={() => router.push("/dashboard/user")} className={styles.navButton}>Profile</button>
          <button onClick={() => router.push("/new_project")} className={styles.navButton}>New Project</button>
          <button onClick={() => router.push("/walletfunction")} className={styles.navButton}>Wallet Functions</button>
          <button onClick={() => router.push("/community")} className={styles.navButton}>Community Page</button>
          <button onClick={() => router.push("/ai")} className={styles.navButton}>AI Prediction</button>
          <div className={styles.walletButton}>
            <WalletConnect />
          </div>
        </div>
      </nav>

      <div className={styles.formContainer}>
        <h1>AI Carbon Credit Estimator</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="number" step="0.01" placeholder="Area (hectares)" value={form.area_hectares} onChange={(e) => setForm({ ...form, area_hectares: e.target.value })} required className={styles.input} />
          <input type="number" placeholder="Duration (years)" value={form.duration_years} onChange={(e) => setForm({ ...form, duration_years: e.target.value })} required className={styles.input} />
          <input type="number" step="0.01" placeholder="Baseline Emissions" value={form.baseline_emissions} onChange={(e) => setForm({ ...form, baseline_emissions: e.target.value })} required className={styles.input} />
          <input type="number" step="0.01" placeholder="Expected Emission Reduction" value={form.expected_emission_reduction} onChange={(e) => setForm({ ...form, expected_emission_reduction: e.target.value })} required className={styles.input} />
          <input type="number" step="0.01" placeholder="Emission Factor" value={form.emission_factor} onChange={(e) => setForm({ ...form, emission_factor: e.target.value })} required className={styles.input} />
          <input type="text" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required className={styles.input} />
          <select value={form.project_type} onChange={(e) => setForm({ ...form, project_type: e.target.value })} className={styles.select}>
            <option value="reforestation">Reforestation</option>
            <option value="methane_capture">Methane Capture</option>
            <option value="electric_mobility">Electric Mobility</option>
            <option value="biochar_production">Biochar Production</option>
          <option value="wetland_restoration">Wetland Restoration</option>
          <option value="carbon_sequestration">Carbon Sequestration</option>
          <option value="geothermal_energy">Geothermal Energy</option>
          <option value="green_building">Green Building</option>
          <option value="sustainable_agriculture">Sustainable Agriculture</option>
          <option value="wind_energy">Wind Energy</option>
          <option value="afforestation">Afforestation</option>
          <option value="solar_power">Solar Power</option>
          </select>
          <button type="submit" className={styles.button}>Predict Carbon Credits</button>
        </form>

        {typeof result === "number" && !isNaN(result) && (
          <p className={styles.resultText}>Estimated Carbon Credits: {result.toFixed(2)} CRX</p>
        )}
      </div>
    </main>
  );
}




// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import WalletConnect from "../../components/ConnectWalletButton";
// import styles from "../../styles/ai.module.css";

// export default function AIPredictor() {
//   const router = useRouter();

//   const [form, setForm] = useState({
//     area_hectares: "",
//     duration_years: "",
//     baseline_emissions: "",
//     expected_emission_reduction: "",
//     location: "",
//     emission_factor: "",
//     project_type: "reforestation",
//   });

//   const [result, setResult] = useState<number | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const res = await fetch("http://localhost:5001/api/ai/predict", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...form,
//           area_hectares: parseFloat(form.area_hectares),
//           duration_years: parseInt(form.duration_years),
//           baseline_emissions: parseFloat(form.baseline_emissions),
//           expected_emission_reduction: parseFloat(form.expected_emission_reduction),
//           emission_factor: parseFloat(form.emission_factor),
//         }),
//       });

//       const contentType = res.headers.get("content-type");
//       if (!contentType || !contentType.includes("application/json")) {
//         const errorText = await res.text();
//         console.error("Non-JSON response from AI:", errorText);
//         throw new Error("Server did not return JSON.");
//       }

//       const data = await res.json();
//       setResult(data.predicted_carbon_credits ?? null);
//     } catch (error) {
//       console.error("Prediction failed:", error);
//       setResult(null);
//     }
//   };

//   return (
//     <main className={styles.dashboardContainer}>
//       <nav className={styles.navbar}>
//         <div className={styles.navLeft}>
//           <h2 className={styles.logo}>CRX 🌱</h2>
//         </div>
//         <div className={styles.navRight}>
//           <button onClick={() => router.push("/dashboard/user")} className={styles.navButton}>
//             Profile
//           </button>
//           <button onClick={() => router.push("/new_project")} className={styles.navButton}>
//             New Project
//           </button>
//           <button onClick={() => router.push("/walletfunction")} className={styles.navButton}>
//             wallet functions
//           </button>
//           <button onClick={() => router.push("/community")} className={styles.navButton}>
//             Community Page
//           </button>
//           <button onClick={() => router.push("/ai")} className={styles.navButton}>
//             AI prediction
//           </button>
//           <div className={styles.walletButton}>
//             <WalletConnect />
//           </div>
//         </div>
//       </nav>

//       <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
//         <h1>AI Carbon Credit Estimator</h1>
//         <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
//           <input
//             type="number"
//             step="0.01"
//             placeholder="Area (hectares)"
//             value={form.area_hectares}
//             onChange={(e) => setForm({ ...form, area_hectares: e.target.value })}
//             required
//           />
//           <input
//             type="number"
//             placeholder="Duration (years)"
//             value={form.duration_years}
//             onChange={(e) => setForm({ ...form, duration_years: e.target.value })}
//             required
//           />
//           <input
//             type="number"
//             step="0.01"
//             placeholder="Baseline Emissions"
//             value={form.baseline_emissions}
//             onChange={(e) => setForm({ ...form, baseline_emissions: e.target.value })}
//             required
//           />
//           <input
//             type="number"
//             step="0.01"
//             placeholder="Expected Emission Reduction"
//             value={form.expected_emission_reduction}
//             onChange={(e) => setForm({ ...form, expected_emission_reduction: e.target.value })}
//             required
//           />
//           <input
//             type="number"
//             step="0.01"
//             placeholder="Emission Factor"
//             value={form.emission_factor}
//             onChange={(e) => setForm({ ...form, emission_factor: e.target.value })}
//             required
//           />
//           <input
//             type="text"
//             placeholder="Location"
//             value={form.location}
//             onChange={(e) => setForm({ ...form, location: e.target.value })}
//             required
//           />
//           <select
//             value={form.project_type}
//             onChange={(e) => setForm({ ...form, project_type: e.target.value })}
//           >
//             <option value="reforestation">Reforestation</option>
//             <option value="methane_capture">Methane Capture</option>
//             <option value="electric_mobility">Electric Mobility</option>
            
//           </select>
//           <button
//             type="submit"
//             style={{
//               background: "#007bff",
//               color: "white",
//               padding: "0.5rem",
//               border: "none",
//               borderRadius: "6px",
//             }}
//           >
//             Predict Carbon Credits
//           </button>
//         </form>

//         {typeof result === "number" && !isNaN(result) && (
//           <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
//             Estimated Carbon Credits: {result.toFixed(2)} CRX
//           </p>
//         )}
//       </div>
//     </main>
//   );
// }
