# JobShield AI

JobShield AI is a machine learning web application that predicts whether an online job posting is likely to be real or fraudulent.

The system analyzes job advertisement text such as the title, company profile, description, requirements, and benefits. It then returns a classification result through a FastAPI backend and a Next.js frontend.

---

## Project Overview

Fake job advertisements can waste applicants' time, steal personal information, or request illegal payments. JobShield AI helps job seekers identify suspicious postings before applying.

The project uses Natural Language Processing and supervised machine learning to classify job postings into two categories:

- Real
- Fake

---

## Main Features

- Fake job posting detection
- Machine learning classification
- TF-IDF text feature extraction
- FastAPI REST API
- Next.js frontend
- Dark and light themes
- Responsive user interface
- Decision score display
- Automated API tests
- Swagger API documentation

---

## Dataset

The project uses the Fake Job Postings dataset from Kaggle.

Dataset source:

https://www.kaggle.com/datasets/shivamb/real-or-fake-fake-jobposting-prediction

The dataset contains approximately 17,880 job advertisements.

### Target Column

`fraudulent`

- `0` means Real
- `1` means Fake

### Main Text Features

- `title`
- `company_profile`
- `description`
- `requirements`
- `benefits`

These columns are combined into one text feature before training.

---

## Data Preprocessing

The preprocessing pipeline includes:

1. Filling missing text values
2. Combining important text columns
3. Converting text to lowercase
4. Removing HTML tags
5. Removing URLs
6. Removing email addresses
7. Removing punctuation and numbers
8. Removing repeated spaces
9. Removing empty rows
10. Converting text into numerical features using TF-IDF

The train-test split uses stratification because the dataset is imbalanced.

---

## Models Trained

The following models were trained and compared:

1. Logistic Regression
2. Random Forest
3. Linear Support Vector Machine
4. Multinomial Naive Bayes

Both default and balanced versions of some models were tested.

---

## Model Performance

| Model | Accuracy | Precision | Recall | F1 Score |
|---|---:|---:|---:|---:|
| Linear SVM Balanced | 0.9870 | 0.8686 | 0.8380 | 0.8530 |
| Linear SVM | 0.9863 | 0.9626 | 0.7254 | 0.8273 |
| Logistic Regression Balanced | 0.9761 | 0.6893 | 0.8592 | 0.7649 |
| Random Forest | 0.9787 | 0.9870 | 0.5352 | 0.6941 |
| Logistic Regression | 0.9714 | 0.9815 | 0.3732 | 0.5408 |
| Multinomial Naive Bayes | 0.9641 | 0.6933 | 0.3662 | 0.4793 |

### Selected Model

The final model is:

**Balanced Linear SVM**

It was selected because it achieved the highest F1 score while maintaining a strong balance between precision and recall.

---

## Technology Stack

### Machine Learning

- Python
- Pandas
- Scikit-learn
- TF-IDF
- Joblib

### Backend

- FastAPI
- Uvicorn
- Pydantic

### Frontend

- Next.js
- TypeScript
- Tailwind CSS

### Testing

- Pytest
- FastAPI TestClient



## Project Structure

```text
deployment/
│
├── preprocess.py      # Text preprocessing
├── train.py           # Train & save model
├── predict.py         # Prediction logic
├── utils.py           # Helper functions
├── app.py             # FastAPI /predict endpoint
├── models/            # Saved model + TF-IDF
└── frontend/          # Next.js UI


---

## Acknowledgements

I would like to express my sincere gratitude to **Goobo Labs** for organizing the Machine Learning Bootcamp and providing the learning resources, mentorship, and practical assignments that helped me build this project.

I also appreciate the instructors and mentors for their continuous guidance, feedback, and support throughout the bootcamp.

Official GitHub Repository:
https://github.com/goobolabs




## Author

**Hayat Mohamud**

Machine Learning Final Project