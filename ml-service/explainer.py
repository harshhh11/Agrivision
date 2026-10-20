"""
AgriTwin Farmer Narrative Explainer
Translates machine learning feature contributions into simple, transparent guidance for Indian Sugarcane Farmers.
"""

from typing import List, Dict, Any

def generate_farmer_narrative(
    features: Dict[str, Any],
    explanations: List[Dict[str, Any]],
    expected_yield_tonnes: float,
    expected_yield_quintals: float
) -> Dict[str, Any]:
    
    positives = [e for e in explanations if e.get("impact") == "positive"]
    negatives = [e for e in explanations if e.get("impact") == "negative"]
    neutrals = [e for e in explanations if e.get("impact") == "neutral"]
    
    # Farmer-first summary headlines
    if len(negatives) == 0:
        summary_tone = "Optimal"
        headline = "Your sugarcane crop conditions are very favorable."
    elif len(negatives) <= 2:
        summary_tone = "Attention"
        headline = f"Good overall growth, but {negatives[0]['farmer_label']} needs your attention."
    else:
        summary_tone = "Needs Action"
        headline = "Multiple farm factors are currently limiting your expected yield."
        
    supporting_points = [p["simple_explanation"] for p in positives[:3]]
    attention_points = [n["simple_explanation"] for n in negatives[:3]]
    
    actionable_recommendations = []
    for neg in negatives:
        factor = neg.get("factor")
        if factor == "Irrigation":
            actionable_recommendations.append({
                "category": "Water & Irrigation",
                "action": "Increase irrigation frequency to 2-3 times per week to prevent moisture stress.",
                "urgency": "High",
                "why": "Sugarcane is in a critical water-demanding growth phase."
            })
        elif factor == "Soil Nutrients":
            actionable_recommendations.append({
                "category": "Soil Fertility",
                "action": "Apply nitrogen top-dressing (e.g. Urea / DAP split application) and verify soil test values.",
                "urgency": "Medium",
                "why": "Nitrogen supports rapid stem elongation and leaf area expansion."
            })
        elif factor == "Pest Control":
            actionable_recommendations.append({
                "category": "Crop Protection",
                "action": "Adopt integrated pest management (pheromone traps or biological biocontrol) against early shoot borer.",
                "urgency": "High",
                "why": "Unchecked pest activity damages early millable cane stalks."
            })
        elif factor == "Rainfall":
            actionable_recommendations.append({
                "category": "Water Management",
                "action": "Maintain supplementary canal/borewell irrigation to offset seasonal rainfall deficit.",
                "urgency": "Medium",
                "why": "Rainfall in your zone is below the 1100-1400 mm sugarcane benchmark."
            })
            
    if not actionable_recommendations:
        actionable_recommendations.append({
            "category": "Crop Maintenance",
            "action": "Continue current irrigation and fertilization schedules. Monitor for late-stage lodging.",
            "urgency": "Normal",
            "why": "All measured parameters are within optimal model benchmarks."
        })

    return {
        "headline": headline,
        "summary_tone": summary_tone,
        "expected_yield_display": f"{expected_yield_tonnes:.1f} tonnes/ha ({expected_yield_quintals:.0f} quintals/acre)",
        "supporting_factors": supporting_points,
        "attention_factors": attention_points,
        "farmer_actions": actionable_recommendations,
        "factors_influencing_model": explanations
    }
