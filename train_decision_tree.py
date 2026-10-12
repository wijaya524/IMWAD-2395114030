#!/usr/bin/env python3
"""
Skrip Training Model Decision Tree untuk DailyLife Adaptive Learning System
Tujuan: Mengklasifikasikan tindakan bantuan (target_directive) bagi siswa tunagrahita.
Fitur: attempt_index, idle_time_ms, consecutive_failures, is_distractor_clicked
Target: NONE, GENERAL_HINT, SPECIFIC_VISUAL_CUE, FALLBACK_STATIC
"""

import os
import json
import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

def load_dataset(file_path="dataset.xlsx"):
    """Membaca file dataset Excel (.xlsx) atau CSV (.csv)"""
    if not os.path.exists(file_path):
        csv_path = file_path.replace(".xlsx", ".csv")
        if os.path.exists(csv_path):
            file_path = csv_path
        else:
            raise FileNotFoundError(f"File dataset tidak ditemukan: {file_path} atau {csv_path}")

    print(f"[*] Membaca dataset dari: {file_path}")
    if file_path.endswith(".csv"):
        df = pd.read_csv(file_path)
    else:
        df = pd.read_excel(file_path)
    
    print(f"[*] Dimensi dataset: {df.shape[0]} baris, {df.shape[1]} kolom")
    return df

def preprocess_data(df):
    """Preprocessing fitur independen (X) dan label target (y)"""
    feature_cols = ['attempt_index', 'idle_time_ms', 'consecutive_failures', 'is_distractor_clicked']
    target_col = 'target_directive'

    for col in feature_cols + [target_col]:
        if col not in df.columns:
            raise ValueError(f"Kolom wajib '{col}' tidak ditemukan dalam dataset!")

    X = df[feature_cols].copy()
    
    # Konversi boolean ke integer (0 atau 1)
    X['is_distractor_clicked'] = X['is_distractor_clicked'].astype(int)
    
    y = df[target_col].astype(str)

    print("\n[*] Distribusi Kelas Target (y):")
    print(y.value_counts().to_string())

    return X, y, feature_cols

def tree_to_dict(tree, feature_names, class_names, node_id=0, rule_path=""):
    """Mengonversi struktur Decision Tree Scikit-Learn ke objek Dict rekursif"""
    is_leaf = tree.children_left[node_id] == tree.children_right[node_id]

    # Distribusi nilai sampel per kelas di node ini
    values = tree.value[node_id][0]
    total_samples = float(np.sum(values))
    probabilities = {class_names[i]: float(values[i] / total_samples) for i in range(len(class_names))}
    predicted_idx = int(np.argmax(values))
    predicted_class = class_names[predicted_idx]
    confidence = float(values[predicted_idx] / total_samples) if total_samples > 0 else 0.0

    if is_leaf:
        return {
            "node_id": int(node_id),
            "is_leaf": True,
            "prediction": predicted_class,
            "confidence": round(confidence, 4),
            "samples": int(tree.n_node_samples[node_id]),
            "probabilities": {k: round(v, 4) for k, v in probabilities.items()},
            "rule_path": rule_path.strip()
        }

    feature_idx = tree.feature[node_id]
    feature_name = feature_names[feature_idx]
    threshold = float(round(tree.threshold[node_id], 4))

    left_child = tree.children_left[node_id]
    right_child = tree.children_right[node_id]

    left_path = f"{rule_path} ({feature_name} <= {threshold})"
    right_path = f"{rule_path} ({feature_name} > {threshold})"

    return {
        "node_id": int(node_id),
        "is_leaf": False,
        "feature": feature_name,
        "feature_index": int(feature_idx),
        "threshold": threshold,
        "samples": int(tree.n_node_samples[node_id]),
        "left": tree_to_dict(tree, feature_names, class_names, left_child, left_path),
        "right": tree_to_dict(tree, feature_names, class_names, right_child, right_path)
    }

def main():
    print("=" * 65)
    print("  TRAINING DECISION TREE - DAILYLIFE ADAPTIVE GUIDANCE")
    print("=" * 65)

    # 1. Load Data
    data_file = "dataset.xlsx" if os.path.exists("dataset.xlsx") else "dataset.csv"
    df = load_dataset(data_file)

    # 2. Preprocess
    X, y, feature_names = preprocess_data(df)

    # 3. Train-Test Split (80:20, stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"\n[*] Ukuran Train set: {len(X_train)} sampel | Test set: {len(X_test)} sampel")

    # 4. Inisialisasi & Training Model (max_depth=4 agar tidak overfitting dan interpretable)
    model = DecisionTreeClassifier(
        criterion="gini",
        max_depth=4,
        min_samples_split=2,
        min_samples_leaf=1,
        random_state=42
    )
    model.fit(X_train, y_train)

    # 5. Evaluasi Model
    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)

    train_acc = accuracy_score(y_train, y_pred_train)
    test_acc = accuracy_score(y_test, y_pred_test)

    print("\n" + "=" * 45)
    print("HASIL EVALUASI MODEL:")
    print("=" * 45)
    print(f"Akurasi Data Latih (Train) : {train_acc * 100:.2f}%")
    print(f"Akurasi Data Uji (Test)    : {test_acc * 100:.2f}%")

    print("\n[+] Classification Report (Data Uji):")
    print(classification_report(y_test, y_pred_test, zero_division=0))

    print("\n[+] Confusion Matrix (Data Uji):")
    labels = sorted(list(model.classes_))
    cm = confusion_matrix(y_test, y_pred_test, labels=labels)
    cm_df = pd.DataFrame(cm, index=labels, columns=labels)
    print(cm_df)

    print("\n[+] Struktur Pohon Keputusan (Text Rules):")
    tree_text = export_text(model, feature_names=feature_names)
    print(tree_text)

    # 6. Ekspor Aturan Pohon ke Format JSON
    class_names = list(model.classes_)
    tree_dict = {
        "metadata": {
            "model_type": "DecisionTreeClassifier",
            "criterion": "gini",
            "max_depth": 4,
            "train_accuracy": round(float(train_acc), 4),
            "test_accuracy": round(float(test_acc), 4),
            "feature_names": feature_names,
            "classes": class_names,
            "created_at": pd.Timestamp.now().isoformat()
        },
        "root": tree_to_dict(model.tree_, feature_names, class_names, 0, "")
    }

    # Simpan di root workspace
    output_files = [
        "trained_rules.json",
        "ptm06-backend/src/ai/trained_rules.json",
        "ptm07-frontend/src/ai/trained_rules.json"
    ]

    for out_path in output_files:
        os.makedirs(os.path.dirname(out_path) if os.path.dirname(out_path) else ".", exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(tree_dict, f, indent=2)
        print(f"[OK] Berhasil mengekspor aturan pohon ke: {out_path}")

    print("\n[*] Pelatihan dan ekspor aturan selesai dengan sukses!")

if __name__ == "__main__":
    main()
