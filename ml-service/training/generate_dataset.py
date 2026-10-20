"""
AgriTwin Sugarcane Dataset Generator
Generates realistic Indian sugarcane agricultural dataset covering environmental, soil, and management practices.
Output target: Final Sugarcane Yield in Quintals/Acre.
"""

import os
import numpy as np
import pandas as pd

def generate_sugarcane_dataset(n_samples: int = 3500, random_state: int = 42) -> pd.DataFrame:
    np.random.seed(random_state)
    
    varieties = ['Co 86032', 'Co 0238', 'CoM 0265', 'Co 8014', 'Co 92005', 'VSI 434']
    soil_types = ['Black Soil', 'Clay Loam', 'Sandy Loam', 'Red Soil', 'Alluvial']
    irrigation_freqs = ['1 time/week', '2 times/week', '3 times/week', 'Bi-weekly', 'Daily Drip']
    pest_controls = ['Chemical', 'Biological', 'Integrated', 'None']
    
    # Variety Yield baseline multiplier
    variety_effects = {
        'Co 86032': 1.08, # High yielding, standard in Maharashtra & South
        'Co 0238': 1.12,  # Very high yielding & sugar content
        'CoM 0265': 1.10, # Heavy tillering, drought tolerant
        'Co 8014': 0.95,  # Moderate
        'Co 92005': 0.98,
        'VSI 434': 1.05   # High sucrose
    }
    
    # Soil multiplier
    soil_effects = {
        'Black Soil': 1.08,
        'Alluvial': 1.06,
        'Clay Loam': 1.02,
        'Red Soil': 0.94,
        'Sandy Loam': 0.88
    }
    
    # Irrigation multiplier
    irrigation_effects = {
        'Daily Drip': 1.14,
        '3 times/week': 1.08,
        '2 times/week': 1.00,
        '1 time/week': 0.86,
        'Bi-weekly': 0.72
    }
    
    # Pest Control multiplier
    pest_effects = {
        'Integrated': 1.06,
        'Chemical': 1.02,
        'Biological': 0.98,
        'None': 0.78
    }
    
    # Sample features
    rainfall = np.random.uniform(500.0, 1900.0, n_samples)
    temperature = np.random.uniform(21.0, 37.5, n_samples)
    sunlight = np.random.uniform(5.5, 10.5, n_samples)
    
    nitrogen = np.random.uniform(110.0, 340.0, n_samples)
    phosphorus = np.random.uniform(25.0, 115.0, n_samples)
    potassium = np.random.uniform(40.0, 210.0, n_samples)
    
    soil_type = np.random.choice(soil_types, n_samples, p=[0.38, 0.22, 0.15, 0.15, 0.10])
    crop_duration = np.random.choice([10, 11, 12, 14, 16, 18], n_samples, p=[0.10, 0.15, 0.40, 0.15, 0.12, 0.08])
    irrigation = np.random.choice(irrigation_freqs, n_samples, p=[0.20, 0.40, 0.22, 0.08, 0.10])
    pest_ctrl = np.random.choice(pest_controls, n_samples, p=[0.40, 0.20, 0.32, 0.08])
    variety = np.random.choice(varieties, n_samples, p=[0.32, 0.25, 0.20, 0.08, 0.08, 0.07])
    
    # Agronomic response modeling for final yield (in Quintals/Acre)
    # Average Indian sugarcane yield is ~350 - 450 q/acre (85 - 110 t/ha), high yield ~600 - 800 q/acre (150 - 200 t/ha)
    base_yield = 420.0
    
    # Rainfall curve: Optimal ~1100-1400mm
    rain_effect = -0.00015 * ((rainfall - 1250.0) ** 2) / 10.0
    
    # Temperature curve: Optimal ~28-30°C
    temp_effect = -1.8 * ((temperature - 29.0) ** 2)
    
    # Sunlight curve: Optimal ~8.0-9.0 hrs
    sun_effect = 12.0 * (sunlight - 7.5)
    
    # Nutrient balance effect (N:P:K ~ 250:80:150 kg/ha)
    n_effect = 0.35 * (nitrogen - 200.0) - 0.001 * np.maximum(0, nitrogen - 300.0) ** 2
    p_effect = 0.40 * (phosphorus - 60.0)
    k_effect = 0.30 * (potassium - 120.0)
    
    # Duration effect: Adsali (16-18 months) produces significantly higher biomass than Suru (12 months)
    duration_effect = (crop_duration - 12) * 28.0
    
    yields = []
    for i in range(n_samples):
        v_mult = variety_effects[variety[i]]
        s_mult = soil_effects[soil_type[i]]
        i_mult = irrigation_effects[irrigation[i]]
        p_mult = pest_effects[pest_ctrl[i]]
        
        env_sum = rain_effect[i] + temp_effect[i] + sun_effect[i] + n_effect[i] + p_effect[i] + k_effect[i] + duration_effect[i]
        
        y_est = (base_yield + env_sum) * v_mult * s_mult * i_mult * p_mult
        
        # Add realistic field variation noise
        noise = np.random.normal(0, 18.0)
        final_y = np.clip(y_est + noise, 220.0, 980.0)
        yields.append(round(float(final_y), 1))
        
    df = pd.DataFrame({
        'Rainfall': np.round(rainfall, 1),
        'Average Temperature': np.round(temperature, 1),
        'Daily Sunlight': np.round(sunlight, 1),
        'Nitrogen': np.round(nitrogen, 1),
        'Phosphorus': np.round(phosphorus, 1),
        'Potassium': np.round(potassium, 1),
        'Soil Type': soil_type,
        'Crop Duration': crop_duration,
        'Irrigation Frequency': irrigation,
        'Pest Control': pest_ctrl,
        'Sugarcane Seed Variety': variety,
        'Final Sugarcane Yield': yields
    })
    
    return df

if __name__ == "__main__":
    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "sugarcane"))
    os.makedirs(out_dir, exist_ok=True)
    csv_path = os.path.join(out_dir, "sugarcane_dataset.csv")
    
    df = generate_sugarcane_dataset(n_samples=3500)
    df.to_csv(csv_path, index=False)
    print(f"Generated Sugarcane Dataset successfully at {csv_path}")
    print(f"Rows: {len(df)}, Columns: {list(df.columns)}")
    print("Summary statistics:")
    print(df.describe())
