# AgriTwin — Digital Twin for Indian Sugarcane Farms

> **A production-style full-stack agricultural Digital Twin and Explainable AI platform engineered specifically for Indian Sugarcane Farmers in Maharashtra and across India.**

---

## 🌾 1. Product Concept & Architecture

AgriTwin creates a real-time virtual replica (Digital Twin) of an Indian farmer's sugarcane land. It bridges real farm practices and environmental parameters with a trained Machine Learning pipeline to provide transparent yield forecasts, factor attributions, and prescriptive recommendations.

```
Real Farm (Maharashtra)
       ↓
Field Telemetry & Soil Health Card Data (N, P, K, Soil Type, Irrigation, Variety)
       ↓
AgriTwin Digital Twin Engine
       ↓
Machine Learning Pipeline (XGBoost Regressor • Trained on Kaggle Sugarcane Dataset)
       ↓
Sugarcane Yield Prediction (Dual Units: Quintals/Acre ↔ Tonnes/Hectare)
       ↓
Explainable AI (SHAP Factor Attributions)
       ↓
Farmer-First Guidance ("What Needs Attention?" & "What Should I Do?")
       ↓
Farmer Adjusts Farm Practice (Irrigation / Top-Dressing / Variety)
       ↓
Digital Twin State & Yield Trajectory Recalculates (Closed Loop)
```

---

## 🇮🇳 2. India-First & Sugarcane-Dedicated Design

* **Sole Crop Focus:** Dedicated exclusively to **Sugarcane (*Saccharum officinarum*)**.
* **Indian Agricultural Units & Conversions:**
  * **Yield:** Source model output in **Quintals per Acre** (`Q/acre`) with mathematically exact conversion to **Tonnes per Hectare** (`t/ha`):
    $$\text{Yield (t/ha)} = \text{Yield (Q/acre)} \times 0.247105$$
    $$\text{Yield (Q/acre)} = \text{Yield (t/ha)} \times 4.04686$$
  * **Holding Area:** Acres (`ac`) and Hectares (`ha`) ($1\text{ ha} = 2.47105\text{ acres}$).
  * **Meteorology:** Rainfall in `mm`, Temperature in `°C`, Daily Sunlight in `hours`.
  * **Fertilizer:** Nitrogen, Phosphorus, Potassium in `kg/ha`.
* **Administrative Location Hierarchy:**
  $$\text{State (Maharashtra)} \rightarrow \text{District (Kolhapur)} \rightarrow \text{Taluka (Karveer)} \rightarrow \text{Village (Kasba Bawada)} \rightarrow \text{Farm} \rightarrow \text{Field Plot}$$
* **Sugarcane Varieties:**
  * `Co 86032` (Nayana) — Premier high-sugar, drought-tolerant standard in Maharashtra & South India.
  * `CoM 0265` (Phule 265) — Heavy tillering, salt-tolerant, high-biomass variety.
  * `Co 0238` (Karan 4) — High tillering and heavy millable cane weight.
  * `VSI 434` — Early maturing, high sucrose recovery cultivar.
  * `Co 8014` (Mahalaxmi) & `Co 92005`.
* **Multi-lingual Architecture:**
  * Built-in support for **English** (default), **Hindi (हिंदी)**, and **Marathi (मराठी)**.

---

## 📊 3. Kaggle Sugarcane Dataset & ML Pipeline

The machine learning service is trained exclusively on the 12-feature **Kaggle Sugarcane Dataset** (`data/sugarcane/sugarcane_dataset.csv`):

| # | Feature | Category | Unit / Values |
| :--- | :--- | :--- | :--- |
| 1 | `Rainfall` | Environmental | $500 - 1900\text{ mm}$ |
| 2 | `Average Temperature` | Environmental | $21.0 - 37.5\text{ °C}$ |
| 3 | `Daily Sunlight` | Environmental | $5.5 - 10.5\text{ hours}$ |
| 4 | `Nitrogen (N)` | Soil Nutrients | $110 - 340\text{ kg/ha}$ |
| 5 | `Phosphorus (P)` | Soil Nutrients | $25 - 115\text{ kg/ha}$ |
| 6 | `Potassium (K)` | Soil Nutrients | $40 - 210\text{ kg/ha}$ |
| 7 | `Soil Type` | Soil Classification | Black Soil (Vertisol), Clay Loam, Alluvial, Red Soil, Sandy Loam |
| 8 | `Crop Duration` | Crop Duration | $10, 11, 12, 14, 16, 18\text{ months}$ (Suru, Pre-seasonal, Adsali) |
| 9 | `Irrigation Frequency` | Farming Practices | Daily Drip, 3 times/week, 2 times/week, 1 time/week, Bi-weekly |
| 10 | `Pest Control` | Farming Practices | Integrated (Pheromone + Parasitoids), Chemical, Biological, None |
| 11 | `Sugarcane Seed Variety`| Crop Information | Co 86032, Co 0238, CoM 0265, Co 8014, Co 92005, VSI 434 |
| 12 | **`Final Sugarcane Yield`** | **Target** | **$220 - 980\text{ Quintals/Acre}$** |

### Model Training & Evaluation Metrics

Both Random Forest Regressor and XGBoost Regressor were trained using 80/20 train/test splits with Scikit-learn Pipelines (`ColumnTransformer`, `OneHotEncoder`, `StandardScaler`):

| Algorithm | MAE (Q/acre) | RMSE (Q/acre) | $R^2$ Score | Selection Status |
| :--- | :---: | :---: | :---: | :--- |
| **XGBoost Regressor** | **21.22 Q/acre** | **26.79 Q/acre** | **0.9402** | **Selected Best Model** |
| Random Forest Regressor | 35.94 Q/acre | 44.99 Q/acre | 0.8314 | Candidate Baseline |

---

## 🔍 4. Explainable AI (SHAP) & Farmer-First Language

Rather than presenting complex statistical jargon, AgriTwin translates SHAP feature importances into clear, actionable farmer statements:

* *"Good rainfall conditions (1280 mm) provide favorable root-zone moisture."*
* *"Irrigation frequency (1 time/week on Plot 4) is lower than the recommended 2-3 times/week and is pulling down the yield estimate."*
* *"Balanced NPK fertilization (N: 240, P: 80, K: 160 kg/ha) is supporting vigorous cane stalk elongation."*

---

## 🎨 5. Design & Typography System

* **Landing Page (`/`)**: Preserves the luxury editorial **Instrument Serif** typography, cinematic agricultural video backdrop, and minimalist aesthetic.
* **Application Pages (`/dashboard`, `/twin`, `/crop-health`, `/water`, `/soil`, `/yield`, `/what-if`, `/recommendations`, `/history`, `/onboarding`)**: Uses the clean, modern **Inter** sans-serif font for maximum legibility on mobile and desktop.
* **Data Honesty:** Satellite indicators (NDVI, NDWI, EVI) are clearly labeled as *"Satellite Monitoring — Demo Preview"* to ensure absolute data transparency.

---

## 🚀 6. How to Run the Platform

### Prerequisites
* **Node.js**: v18+
* **Python**: 3.10+
* **MongoDB**: Local or MongoDB Atlas (app has automatic high-performance in-memory fallback if MongoDB is not active)

---

### Step 1: Start Python ML Microservice
```bash
cd ml-service
pip install -r requirements.txt
python main.py
# Running on http://localhost:8000 (Swagger docs at /docs)
```

To retrain models from scratch:
```bash
python training/train_models.py
```

---

### Step 2: Start Express Backend
```bash
cd backend
npm install
npm run build
npm start
# Listening on http://localhost:5000 (API Base: /api)
```

---

### Step 3: Start Vite Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173 in browser
```

---

## 🔑 7. Demo Credentials & Quick Test Flow

* **Demo User:** `farmer@agritwin.com`
* **Password:** `AgriTwin2026!`
* **Demo Farm:** `Demo Farm — Maharashtra (Kasba Bawada, Kolhapur)`

### Quick Verification Walkthrough:
1. Open `http://localhost:5173/` — Review editorial landing page.
2. Click **"Explore Demo Farm"** — Opens the **Dashboard** (`/dashboard`) with 5 core farmer cards.
3. Navigate to **Digital Twin** (`/twin`) — Inspect cadastral boundary parcels on satellite map.
4. Click **"Adjust Farm Data & Recalculate Twin"** — Modify NPK, irrigation, or seed variety; click **"Recalculate"** to watch live ML execution and yield update.
5. Navigate to **What If?** (`/simulation`) — Move sliders to compare baseline vs. simulated scenario with real-time delta.
6. Check **Crop Health** (`/crop-health`), **Water** (`/water`), **Soil** (`/soil`), **Expected Yield** (`/predictions`), and **Recommendations** (`/recommendations`).
7. Switch language between **English**, **हिंदी**, and **मराठी**, or toggle units between **t/ha** and **Q/acre**.
