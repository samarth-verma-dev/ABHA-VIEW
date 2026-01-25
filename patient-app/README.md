🧑‍⚕️ Patient Web App

The Patient Web App enables patients to view consultation requests, grant consent, and share medical records securely with doctors in real time using Firebase.

This app works together with the Doctor Dashboard to demonstrate a consent-based health data access flow.

🔐 Authentication (Patient)

Patient authentication is handled using Firebase Authentication

For demo purposes, patient identity is simulated using a patient ABHA ID

No medical data is shared without explicit patient consent

🩺 Consultation Session Creation (Doctor → Patient)

Doctor initiates a consultation by entering a patientAbhaId

Example (demo):

demo-abha-1234

Firestore Session Document

When the consultation is started, a document is created in Firestore.

🔄 Real-time Session Listener (Patient Side)

The patient web app listens to the sessions collection in real time.

UI States

When consentStatus = "requested":

Display “Waiting for patient consent”

Patient can choose to Grant or Deny consent

No medical records are accessible at this stage

This ensures privacy-first access control.

✅ Consent Granted → Medical Records Access

When the patient grants consent:

consentStatus = "granted"

the system automatically enables medical record access for the doctor.

📂 Fetching Medical Records

After consent is granted:

Firestore Query

Collection: records

Filter:

patientAbhaId == session.patientAbhaId

Sorting

Records are sorted chronologically by date

Latest medical records appear first

🧾 Medical Record Display

Each medical record contains:

Record type (diagnosis, prescription, allergy, condition, etc.)

Date

Description / details

Optional prescription images

✔ Verified Records

Records where:

verified = true


are visually marked with a Verified badge

Helps distinguish trusted and authenticated medical data

🔐 Privacy & Consent Model

Medical records are never accessed before consent

Consent is session-specific

Real-time updates ensure instant sync between patient and doctor views

Patient remains in control of data sharing

📝 Demo & Hackathon Notes

patientAbhaId is a demo identifier

Consent flow is simulated for demonstration

Firebase Firestore real-time listeners are used instead of production ABHA APIs

Architecture is designed to be ABHA-API ready

🧠 Tech Stack

Next.js (App Router)

React + TypeScript

Firebase Authentication

Firebase Firestore (real-time listeners)
