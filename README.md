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

## 📊 Screenshots

## 📊 Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/cdd513d4-2a90-4d62-8a9b-52389271188d" height="220"/>
  <img src="https://github.com/user-attachments/assets/22ff7e3c-65e0-4589-8f97-c96e8d5f2751" height="220"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/38fd10d3-b80f-45b3-b04b-e188add6d76c" height="220"/>
  <img src="https://github.com/user-attachments/assets/5a09b6cb-03b4-4d20-8b0e-cfc752192629" height="220"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/c8ef205a-9fb6-4eb5-9c40-73c4c0cf69a3" height="220"/>
  <img src="https://github.com/user-attachments/assets/e370d3b3-ce5c-477a-8f97-0b1fa0cc7634" height="220"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/6e39bf83-d658-488d-805c-48ddb95ecb73" height="220"/>
  <img src="https://github.com/user-attachments/assets/aff93016-45d2-47ec-992e-cdaf22fac163" height="220"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/275d886c-a3d5-4173-98fe-89cf8673017b" height="220"/>
</p>
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
