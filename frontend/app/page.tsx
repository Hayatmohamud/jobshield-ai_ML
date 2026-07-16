"use client";

import { FormEvent, useEffect, useState } from "react";

type JobForm = {
  title: string;
  company_profile: string;
  description: string;
  requirements: string;
  benefits: string;
};

type PredictionResult = {
  prediction: number;
  label: "Real" | "Fake";
  decision_score: number;
};

const initialForm: JobForm = {
  title: "",
  company_profile: "",
  description: "",
  requirements: "",
  benefits: "",
};

export default function Home() {
  const [form, setForm] = useState<JobForm>(initialForm);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("jobshield-theme");

    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("jobshield-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  function updateField(field: keyof JobForm, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail ?? "Prediction request failed.");
      }

      setResult(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  function clearForm() {
    setForm(initialForm);
    setResult(null);
    setError("");
  }

  const isFake = result?.label === "Fake";

  return (
    <main
      className={
        darkMode
          ? "min-h-screen bg-[#07100b] text-white"
          : "min-h-screen bg-[#f4f7f5] text-slate-950"
      }
    >
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-500 text-xl font-black text-black shadow-lg shadow-emerald-500/20">
              JS
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">JobShield AI</h1>

              <p
                className={
                  darkMode ? "text-sm text-slate-400" : "text-sm text-slate-500"
                }
              >
                Fake Job Posting Detector
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDarkMode((previous) => !previous)}
            className={
              darkMode
                ? "flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                : "flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50"
            }
          >
            <span className="text-base">{darkMode ? "☾" : "☀"}</span>

            <span>{darkMode ? "Dark mode" : "Light mode"}</span>

            <span
              className={`relative h-5 w-9 rounded-full transition ${
                darkMode ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
                  darkMode ? "left-[18px]" : "left-0.5"
                }`}
              />
            </span>
          </button>
        </header>

        <section className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-500">
            Machine Learning Security Tool
          </p>

          <h2 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            Check whether a job posting looks real or suspicious.
          </h2>

          <p
            className={
              darkMode
                ? "mt-4 max-w-2xl text-slate-400"
                : "mt-4 max-w-2xl text-slate-600"
            }
          >
            Enter the details from a job advertisement. JobShield AI analyzes
            the text and returns a prediction using a trained Linear SVM model.
          </p>
        </section>

        <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            onSubmit={handleSubmit}
            className={
              darkMode
                ? "rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8 lg:min-h-[700px]"
                : "rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8 lg:min-h-[700px]"
            }
          >
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-500">
                Job information
              </p>

              <h3 className="mt-2 text-2xl font-bold">Analyze a job posting</h3>
            </div>

            <div className="space-y-4">
              <Field
                darkMode={darkMode}
                label="Job title"
                placeholder="Senior Python Developer"
                value={form.title}
                onChange={(value) => updateField("title", value)}
                required
              />

              <TextAreaField
                darkMode={darkMode}
                label="Company profile"
                placeholder="Describe the company..."
                value={form.company_profile}
                onChange={(value) => updateField("company_profile", value)}
                rows={2}
              />

              <TextAreaField
                darkMode={darkMode}
                label="Job description"
                placeholder="Paste the full job description..."
                value={form.description}
                onChange={(value) => updateField("description", value)}
                rows={4}
                required
              />

              <TextAreaField
                darkMode={darkMode}
                label="Requirements"
                placeholder="Skills, experience and education..."
                value={form.requirements}
                onChange={(value) => updateField("requirements", value)}
                rows={3}
              />

              <TextAreaField
                darkMode={darkMode}
                label="Benefits"
                placeholder="Salary, insurance, paid leave..."
                value={form.benefits}
                onChange={(value) => updateField("benefits", value)}
                rows={2}
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-emerald-500 px-5 py-3.5 font-bold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Analyzing..." : "Run JobShield Analysis"}
              </button>

              <button
                type="button"
                onClick={clearForm}
                className={
                  darkMode
                    ? "rounded-xl border border-white/10 px-5 py-3.5 font-semibold text-slate-300 transition hover:bg-white/5"
                    : "rounded-xl border border-slate-200 px-5 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
                }
              >
                Clear
              </button>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}
          </form>

          <aside
            className={
              darkMode
                ? "rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-white/[0.025] to-transparent p-6 shadow-2xl shadow-emerald-950/30 sm:p-8 lg:min-h-[700px]"
                : "rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white p-6 shadow-xl shadow-emerald-100/60 sm:p-8 lg:min-h-[700px]"
            }
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-500">
                Decision
              </p>

              <span
                className={
                  result
                    ? isFake
                      ? "rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold text-red-400"
                      : "rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-500"
                    : darkMode
                      ? "rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-slate-400"
                      : "rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500"
                }
              >
                {result ? (isFake ? "Warning" : "Pass") : "Waiting"}
              </span>
            </div>

            {!result ? (
              <div className="flex min-h-[570px] flex-col items-center justify-center text-center">
                <div
                  className={
                    darkMode
                      ? "mb-5 grid h-20 w-20 place-items-center rounded-3xl border border-white/10 bg-white/5 text-3xl"
                      : "mb-5 grid h-20 w-20 place-items-center rounded-3xl border border-slate-200 bg-white text-3xl shadow-sm"
                  }
                >
                  🛡️
                </div>

                <h3 className="text-2xl font-bold">Ready to analyze</h3>

                <p
                  className={
                    darkMode
                      ? "mt-3 max-w-sm text-sm leading-6 text-slate-400"
                      : "mt-3 max-w-sm text-sm leading-6 text-slate-600"
                  }
                >
                  Fill in the job details and run the analysis to see whether
                  the posting appears real or fake.
                </p>
              </div>
            ) : (
              <div className="mt-8">
                <h3
                  className={`text-5xl font-black ${
                    isFake ? "text-red-400" : "text-emerald-500"
                  }`}
                >
                  {isFake ? "Suspicious" : "Likely Real"}
                </h3>

                <p
                  className={
                    darkMode ? "mt-4 text-slate-400" : "mt-4 text-slate-600"
                  }
                >
                  {isFake
                    ? "This posting contains patterns commonly found in fraudulent job advertisements."
                    : "This posting looks more similar to legitimate job advertisements in the training data."}
                </p>

                <div className="mt-10">
                  <div className="flex items-end justify-between">
                    <span
                      className={
                        darkMode
                          ? "text-sm text-slate-400"
                          : "text-sm text-slate-600"
                      }
                    >
                      Decision score
                    </span>

                    <strong className="text-3xl">
                      {result.decision_score.toFixed(3)}
                    </strong>
                  </div>

                  <div
                    className={
                      darkMode
                        ? "mt-3 h-2 overflow-hidden rounded-full bg-white/10"
                        : "mt-3 h-2 overflow-hidden rounded-full bg-slate-200"
                    }
                  >
                    <div
                      className={`h-full rounded-full ${
                        isFake ? "bg-red-500" : "bg-emerald-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          Math.max(Math.abs(result.decision_score) * 35, 8),
                          100,
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    Positive scores lean toward fake. Negative scores lean
                    toward real. This score is not a probability.
                  </p>
                </div>

                <div
                  className={
                    darkMode
                      ? "mt-10 grid grid-cols-2 gap-4 border-t border-white/10 pt-6"
                      : "mt-10 grid grid-cols-2 gap-4 border-t border-slate-200 pt-6"
                  }
                >
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Model
                    </p>
                    <p className="mt-2 font-semibold">Linear SVM</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Class
                    </p>
                    <p className="mt-2 font-semibold">
                      {result.prediction} - {result.label}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>

        <footer
          className={
            darkMode
              ? "mt-10 border-t border-white/10 pt-6 text-sm text-slate-500"
              : "mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500"
          }
        >
          <p className="font-semibold text-emerald-500">JobShield AI</p>

          <p className="mt-1">
            Fake job detection · Machine Learning Final Project
          </p>

          <p className="mt-3 max-w-3xl">
            Machine-learning models can make mistakes. Always verify the
            employer, company website, contact details and payment requests
            before sharing personal information.
          </p>
        </footer>
      </div>
    </main>
  );
}

type FieldProps = {
  darkMode: boolean;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

function Field({
  darkMode,
  label,
  placeholder,
  value,
  onChange,
  required = false,
}: FieldProps) {
  return (
    <label className="block">
      <span
        className={
          darkMode
            ? "mb-2 block text-sm font-medium text-slate-300"
            : "mb-2 block text-sm font-medium text-slate-700"
        }
      >
        {label}
      </span>

      <input
        type="text"
        required={required}
        minLength={required ? 2 : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={
          darkMode
            ? "w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
            : "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"
        }
      />
    </label>
  );
}

type TextAreaFieldProps = FieldProps & {
  rows: number;
};

function TextAreaField({
  darkMode,
  label,
  placeholder,
  value,
  onChange,
  rows,
  required = false,
}: TextAreaFieldProps) {
  return (
    <label className="block">
      <span
        className={
          darkMode
            ? "mb-2 block text-sm font-medium text-slate-300"
            : "mb-2 block text-sm font-medium text-slate-700"
        }
      >
        {label}
      </span>

      <textarea
        rows={rows}
        required={required}
        minLength={required ? 10 : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={
          darkMode
            ? "w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
            : "w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"
        }
      />
    </label>
  );
}
