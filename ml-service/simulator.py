"""
AgriTwin What-If Agronomic Simulator
Allows Indian Sugarcane Farmers to simulate changes to farm inputs (Irrigation, Fertilizer NPK, Seed Variety, Pest Control, Weather)
and calculates real-time delta yield projections using the trained ML model.
"""

from typing import Dict, Any
from model import sugarcane_model, QUINTALS_PER_ACRE_TO_TONNES_PER_HA

def run_simulation(baseline_state: Dict[str, Any], scenario_params: Dict[str, Any]) -> Dict[str, Any]:
    # 1. Base prediction
    baseline_pred = sugarcane_model.predict(baseline_state)
    
    # 2. Merge scenario changes onto baseline
    merged_scenario = dict(baseline_state)
    merged_scenario.update(scenario_params)
    
    # 3. Simulated prediction
    simulated_pred = sugarcane_model.predict(merged_scenario)
    
    # Calculate deltas
    base_q = baseline_pred["expected_yield_q_acre"]
    sim_q = simulated_pred["expected_yield_q_acre"]
    delta_q = round(sim_q - base_q, 1)
    
    base_t = baseline_pred["expected_yield_tonnes_ha"]
    sim_t = simulated_pred["expected_yield_tonnes_ha"]
    delta_t = round(sim_t - base_t, 1)
    
    pct_change = round(((sim_q - base_q) / (base_q + 1e-5)) * 100.0, 1)
    
    # Generate honest model explanation for the change
    changed_keys = [k for k, v in scenario_params.items() if baseline_state.get(k) != v]
    
    if delta_q > 0:
        tone = "positive"
        explanation = f"The model estimates a higher yield (+{delta_t} tonnes/ha) under this scenario because of optimized inputs: {', '.join(changed_keys)}."
    elif delta_q < 0:
        tone = "negative"
        explanation = f"The model estimates a reduced yield ({delta_t} tonnes/ha) under this scenario due to suboptimal conditions in: {', '.join(changed_keys)}."
    else:
        tone = "neutral"
        explanation = "The selected modifications produced no significant change in the model's estimated sugarcane yield."

    return {
        "baseline": {
            "yield_q_acre": base_q,
            "yield_tonnes_ha": base_t,
            "confidence": baseline_pred["confidence_percent"]
        },
        "simulated": {
            "yield_q_acre": sim_q,
            "yield_tonnes_ha": sim_t,
            "confidence": simulated_pred["confidence_percent"]
        },
        "delta": {
            "q_acre": delta_q,
            "tonnes_ha": delta_t,
            "percent_change": pct_change,
            "tone": tone
        },
        "changed_parameters": changed_keys,
        "explanation": explanation,
        "disclaimer": "Simulation — Model Estimate based on the Kaggle Sugarcane Dataset. Actual farm outcomes depend on field management and weather."
    }
