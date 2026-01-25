# ABHA-View

ABHA-View is a **consent-driven medical record viewing prototype** that demonstrates how doctors can securely access a patient’s ABHA-linked medical history **only during a consultation**, with full patient awareness, control, and transparency.

> ⚠️ This is a **hackathon prototype**.  
> It is **not publicly deployed** and does **not integrate with live ABHA or government systems**.

---

## 🧩 Problem Statement

Healthcare data in India is fragmented across multiple hospitals and laboratories.  
During consultations, doctors often do not have access to a patient’s complete medical history, which can result in:

- Incomplete or inaccurate diagnosis  
- Over-reliance on patient memory  
- Repeated tests and delayed treatment  
- Informal and insecure sharing of medical records  

At the same time, patients lack visibility into **who accesses their medical data and when**.

---

## 💡 Solution Overview

ABHA-View demonstrates a system where:

- Doctors request access to records using a patient’s ABHA ID  
- Patients grant consent from their own device  
- Medical records are visible **only for the duration of the consultation**  
- Access automatically expires after the session  
- Patients can view an **audit log** of all ABHA access events  

The platform acts purely as a **secure viewing layer**, not a permanent data store.

---

## 🔐 Authentication & Security Design

### Original Design (Intended System)
The original system design includes:
- ABHA ID for patient identification  
- **Device-level biometric authentication**
- One-Time Password (OTP) for explicit consent  

### Prototype Implementation
Due to platform and regulatory constraints:
- OTP-based consent is implemented for the demo  
- **Biometric authentication remains part of the original design**, but is out of scope for the prototype  
- No attempt is made to recreate or replace official ABHA workflows  

---

## ⏱️ Session Control & Access Lifecycle

- Each consultation runs inside a **temporary session**
- Sessions automatically expire after a predefined timeout
- **Both doctor and patient** can manually end the session at any time
- Once a session ends:
  - Medical records are no longer accessible
  - Access is immediately revoked
  - The session is marked as completed
- All access events are logged and visible to the patient

This design follows the **principle of least privilege**, minimizing unnecessary exposure of sensitive data.

---

## 👁️ Patient Transparency (Access History)

Patients can view a read-only **ABHA Access History**, showing:
- Who accessed their ABHA-linked records  
- Which hospital or clinic initiated the access  
- Date and time of access  
- Whether the session is active or completed  

Only consented access events are shown.

---

## 🧪 Demo Scope & Assumptions

For this hackathon prototype, we assume:
- Hospitals link records to ABHA IDs (partial data availability)
- Live ABHA verification APIs are not publicly accessible
- Medical records are demo data (PDFs / images)
- The system is demonstrated via a **recorded walkthrough video**, not live deployment

---

## 🛠️ Tech Stack

- **Doctor Portal**: Next.js  
- **Patient App**: React Native / Expo  
- **Authentication**: Firebase Auth (demo-only)  
- **Database**: Firebase Firestore  
- **Storage (Demo)**: External file links  
- **Hosting**: Not deployed (video demo only)

---

## 📽️ Demo Video

A complete end-to-end walkthrough of the working prototype is provided as a **screen-recorded video** for hackathon evaluation.

---

## 📊 Presentation

The project presentation is available in the `ppt/` folder.

---

## 🚧 Limitations

- No live ABHA or government system integration  
- No biometric implementation in the prototype  
- Demo-only medical records  
- Not production-ready  

---

## 👥 Team

**Team Name:** SAU_WALE  
**Project Type:** Hackathon Prototype

