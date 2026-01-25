🔐 Authentication (Doctor Login)

- This application uses Firebase Authentication and Firestore to securely authenticate doctors and load their profiles.

✅ Login Method

- Doctors log in using Email & Password

- Authentication is handled by Firebase Authentication

🔁 Login Flow

- Doctor enters email and password

- Firebase Authentication validates credentials
 
- On successful login, Firebase provides auth.currentUser.uid

- This uid is used to fetch the doctor’s profile from Firestore

📁 Firestore Structure

- Doctor profiles are stored in the doctors collection.

- Document ID must match the authenticated user’s uid
 
🔍 Fetching Doctor Profile

- After login, the app fetches the doctor profile using:

- auth.currentUser.uid

- Firestore query:

- Collection: doctors

- Document ID: auth.currentUser.uid

🧑‍⚕️ Dashboard Display

- Once the profile is fetched:

- Doctor Name is displayed in the dashboard header

- Hospital Name is shown below the doctor name

- This confirms the authenticated identity and role of the doctor

🔒 Security Note

- Only authenticated users can access the dashboard

- Doctor-specific data is scoped using their Firebase uid
