"""
AgriTwin Sugarcane Model Training & Evaluation Pipeline
Trains Random Forest Regressor and XGBoost Regressor on the Sugarcane Dataset.
Compares models on MAE, RMSE, and R2.
Saves the selected best model and metadata.
"""

import os
import json
import datetime
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import xgboost as xgb
import joblib

NUMERICAL_FEATURES = [
    'Rainfall',
    'Average Temperature',
    'Daily Sunlight',
    'Nitrogen',
    'Phosphorus',
    'Potassium',
    'Crop Duration'
]

CATEGORICAL_FEATURES = [
    'Soil Type',
    'Irrigation Frequency',
    'Pest Control',
    'Sugarcane Seed Variety'
]

TARGET_COLUMN = 'Final Sugarcane Yield'

def load_and_validate_dataset(csv_path: str) -> pd.DataFrame:
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Sugarcane dataset not found at {csv_path}")
    df = pd.read_csv(csv_path)
    
    # Validation checks
    print(f"[AgriTwin ML] Dataset loaded: {len(df)} rows, {len(df.columns)} columns")
    print(f"[AgriTwin ML] Missing values count: {df.isnull().sum().sum()}")
    print(f"[AgriTwin ML] Target range: {df[TARGET_COLUMN].min()} to {df[TARGET_COLUMN].max()} Q/acre")
    return df

def train_and_evaluate(csv_path: str, output_dir: str):
    df = load_and_validate_dataset(csv_path)
    
    X = df[NUMERICAL_FEATURES + CATEGORICAL_FEATURES]
    y = df[TARGET_COLUMN]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), NUMERICAL_FEATURES),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), CATEGORICAL_FEATURES)
        ]
    )
    
    # 1. Random Forest Regressor Pipeline
    rf_pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(
            n_estimators=100,
            max_depth=12,
            min_samples_split=4,
            random_state=42,
            n_jobs=-1
        ))
    ])
    
    # 2. XGBoost Regressor Pipeline
    xgb_pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('regressor', xgb.XGBRegressor(
            n_estimators=120,
            max_depth=5,
            learning_rate=0.08,
            subsample=0.85,
            colsample_bytree=0.85,
            random_state=42,
            n_jobs=-1
        ))
    ])
    
    print("\n[AgriTwin ML] Training Random Forest Regressor...")
    rf_pipeline.fit(X_train, y_train)
    rf_pred = rf_pipeline.predict(X_test)
    rf_mae = float(mean_absolute_error(y_test, rf_pred))
    rf_rmse = float(np.sqrt(mean_squared_error(y_test, rf_pred)))
    rf_r2 = float(r2_score(y_test, rf_pred))
    
    print(f"Random Forest Results: MAE = {rf_mae:.2f} Q/acre, RMSE = {rf_rmse:.2f} Q/acre, R² = {rf_r2:.4f}")
    
    print("\n[AgriTwin ML] Training XGBoost Regressor...")
    xgb_pipeline.fit(X_train, y_train)
    xgb_pred = xgb_pipeline.predict(X_test)
    xgb_mae = float(mean_absolute_error(y_test, xgb_pred))
    xgb_rmse = float(np.sqrt(mean_squared_error(y_test, xgb_pred)))
    xgb_r2 = float(r2_score(y_test, xgb_pred))
    
    print(f"XGBoost Results: MAE = {xgb_mae:.2f} Q/acre, RMSE = {xgb_rmse:.2f} Q/acre, R² = {xgb_r2:.4f}")
    
    # Selection of best model
    if xgb_r2 >= rf_r2:
        selected_model_name = "XGBoost Regressor"
        selected_pipeline = xgb_pipeline
        selected_metrics = {"mae": round(xgb_mae, 2), "rmse": round(xgb_rmse, 2), "r2": round(xgb_r2, 4)}
    else:
        selected_model_name = "Random Forest Regressor"
        selected_pipeline = rf_pipeline
        selected_metrics = {"mae": round(rf_mae, 2), "rmse": round(rf_rmse, 2), "r2": round(rf_r2, 4)}
        
    print(f"\n[AgriTwin ML] Selected Model: {selected_model_name} (R² = {selected_metrics['r2']})")
    
    # Extract feature names & importances from selected model
    cat_encoder = selected_pipeline.named_steps['preprocessor'].named_transformers_['cat']
    encoded_cat_features = cat_encoder.get_feature_names_out(CATEGORICAL_FEATURES).tolist()
    all_feature_names = NUMERICAL_FEATURES + encoded_cat_features
    
    regressor = selected_pipeline.named_steps['regressor']
    if hasattr(regressor, 'feature_importances_'):
        importances = regressor.feature_importances_.tolist()
    else:
        importances = [1.0 / len(all_feature_names)] * len(all_feature_names)
        
    # Aggregate importances back to original top-level features
    feature_importance_map = {}
    for feat in NUMERICAL_FEATURES:
        idx = all_feature_names.index(feat)
        feature_importance_map[feat] = round(float(importances[idx]), 4)
        
    for cat_feat in CATEGORICAL_FEATURES:
        cat_indices = [i for i, name in enumerate(all_feature_names) if name.startswith(f"{cat_feat}_")]
        cat_sum = sum(importances[i] for i in cat_indices)
        feature_importance_map[cat_feat] = round(float(cat_sum), 4)
        
    os.makedirs(output_dir, exist_ok=True)
    model_save_path = os.path.join(output_dir, "sugarcane_model.joblib")
    joblib.dump(selected_pipeline, model_save_path)
    print(f"[AgriTwin ML] Saved trained model to {model_save_path}")
    
    metadata = {
        "model_name": selected_model_name,
        "model_version": "v1.4.0-sugarcane",
        "training_timestamp": datetime.datetime.now().isoformat(),
        "dataset_name": "Kaggle Sugarcane Dataset",
        "dataset_rows": len(df),
        "target_variable": TARGET_COLUMN,
        "native_target_unit": "quintals/acre",
        "conversion_unit": "tonnes/ha",
        "conversion_factor": 0.247105, # 1 Quintal/Acre = 0.247105 Tonnes/Hectare
        "features": {
            "numerical": NUMERICAL_FEATURES,
            "categorical": CATEGORICAL_FEATURES,
            "all_features": NUMERICAL_FEATURES + CATEGORICAL_FEATURES
        },
        "model_comparisons": [
            {
                "algorithm": "Random Forest Regressor",
                "mae": round(rf_mae, 2),
                "rmse": round(rf_rmse, 2),
                "r2": round(rf_r2, 4)
            },
            {
                "algorithm": "XGBoost Regressor",
                "mae": round(xgb_mae, 2),
                "rmse": round(xgb_rmse, 2),
                "r2": round(xgb_r2, 4)
            }
        ],
        "selected_metrics": selected_metrics,
        "feature_importances": feature_importance_map
    }
    
    meta_save_path = os.path.join(output_dir, "model_metadata.json")
    with open(meta_save_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"[AgriTwin ML] Saved model metadata to {meta_save_path}")

if __name__ == "__main__":
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    dataset_file = os.path.join(base_dir, "data", "sugarcane", "sugarcane_dataset.csv")
    models_dir = os.path.join(base_dir, "ml-service", "models")
    train_and_evaluate(dataset_file, models_dir)
