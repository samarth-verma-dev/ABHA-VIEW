# ABHA-VIEW — Consent-Based Medical Record System

A privacy-first medical record system aligned with the ABHA (Ayushman Bharat Health Account) framework, enabling secure, consent-driven access to patient data during clinical consultations.

Built with Next.js, React Native, and Firebase.

---

## 🎥 Demo

[![Watch Demo](https://img.youtube.com/vi/q-APBoRfwww/0.jpg)](https://www.youtube.com/watch?v=q-APBoRfwww)

A complete end-to-end walkthrough demonstrating secure, consent-based access to medical records.

---

## 🚀 Key Features

- 🔐 Consent-based access control for medical records  
- ⏱️ Session-based visibility (auto-expiry after consultation)  
- 👁️ Patient audit logs for full transparency  
- 📱 Cross-platform system (Doctor web + Patient mobile app)  
- 🔑 Secure authentication using Firebase (demo implementation)  

---

## 💡 Problem

Healthcare data in India is fragmented across multiple providers.

This leads to:
- Incomplete diagnosis due to missing history  
- Repeated tests and delays  
- Reliance on patient memory  
- Lack of visibility into who accesses medical data  

---

## 💡 Solution

ABHA-VIEW demonstrates a system where:

- Doctors request access using a patient’s ABHA ID  
- Patients grant consent from their own device  
- Records are visible **only during an active consultation**  
- Access automatically expires after the session  
- Patients can track all access via audit logs  

The system acts as a **secure viewing layer**, not a permanent data store.

---

## 🔐 Security & Access Design

- Session-based access lifecycle  
- Automatic expiry after consultation  
- Manual termination by doctor or patient  
- Audit logging of all access events  
- Principle of least privilege enforced  

---

## 🧪 Prototype Scope

This project is a **hackathon prototype**:

- No live ABHA or government API integration  
- Medical records are demo data  
- OTP-based consent used instead of biometrics  
- Demonstrated via recorded walkthrough (no live deployment)  

---

## 🏗️ Architecture

- **Doctor Portal:** Next.js  
- **Patient App:** React Native (Expo)  
- **Backend:** Firebase (Auth, Firestore)  
- **Storage:** External demo data  

---

## 📊 Screenshots

(Add screenshots here — Doctor dashboard, patient app, consent flow)

---

## 🚧 Limitations

- No real ABHA integration  
- No biometric authentication (planned)  
- Demo-only data  
- Not production-ready  

---

## 👥 Team

**Team:** SAU_WALE  
**Type:** Hackathon Prototype
