# 🛡️ JobShield AI

A complete Machine Learning project for detecting fake job postings using NLP, FastAPI, and Next.js.

## 📌 Overview
JobShield AI predicts whether a job advertisement is **Real** or **Fake** using a trained Linear SVM model.

## ✨ Features
- Fake job detection
- TF-IDF text processing
- Linear SVM model
- FastAPI backend
- Next.js frontend
- Dark/Light mode
- Swagger API
- Automated testing

## 📂 Dataset
Dataset: Fake Job Postings Dataset
https://www.kaggle.com/datasets/shivamb/real-or-fake-fake-jobposting-prediction

Target column: `fraudulent`

## 🏆 Best Model
Balanced Linear SVM

Accuracy: **98.70%**
F1 Score: **85.30%**

## 🛠 Tech Stack
- Python
- Scikit-learn
- Pandas
- FastAPI
- Next.js
- Tailwind CSS

## 📁 Structure
```text
jobshield-ai/
├── api/
├── src/
├── models/
├── frontend/
├── dataset/
├── notebooks/
├── tests/
├── screenshots/
├── README.md
└── requirements.txt
```

## ⚙ Installation
```bash
git clone https://github.com/Hayatmohamud/jobshield-ai_ML.git
cd jobshield-ai_ML
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 🚀 Backend
```bash
uvicorn api.app:app --reload
```
Swagger: http://127.0.0.1:8000/docs

## 🌐 Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testing
```bash
python -m pytest -v
```

## 🙏 Acknowledgements
Special thanks to **Goobo Labs** for organizing the Machine Learning Bootcamp.
https://github.com/goobolabs

## 👩‍💻 Author
**Hayat Mohamud**

