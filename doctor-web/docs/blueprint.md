# **App Name**: ABHA-View

## Core Features:

- Doctor Authentication: Enable doctors to log in using Firebase Authentication with email and password.
- Profile Display: Fetch and display doctor profile (name, hospital) from Firestore after successful login using the authenticated user's UID.
- Consultation Session Creation: Create a new consultation session document in Firestore with patient ABHA ID, doctor ID, hospital, consent status, session status and timestamp, after validating the ABHA ID format with an AI tool.
- Real-time Consent Status: Listen to the session document for real-time updates on consent status and display 'Waiting for patient consent' screen until consent is granted.
- Medical Records Retrieval: Fetch and display medical records from Firestore, filtered by patient ABHA ID upon receiving consent; chronologically sort records and visually highlight verified records.
- End Session Functionality: Provide a button to end the consultation session; update the session document in Firestore to mark the session as inactive and clear medical records from the UI.

## Style Guidelines:

- Primary color: Dark blue (#293B5F) for a professional and trustworthy feel, reflecting the medical context.
- Background color: Light gray (#F0F4F8), offering a clean and neutral backdrop that reduces eye strain during long usage.
- Accent color: Teal (#3D948B), used for interactive elements and key information to draw attention without overwhelming the user.
- Body and headline font: 'Inter' (sans-serif) for a modern and clean interface suitable for displaying medical information.
- Code font: 'Source Code Pro' for displaying code snippets, particularly useful when referencing ABHA IDs or technical details.
- Use minimalist icons to represent different types of medical records and actions, ensuring clarity and ease of use.
- Implement a clear and structured layout to facilitate easy navigation and quick access to essential information.