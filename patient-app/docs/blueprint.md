# **App Name**: ConsentConnect

## Core Features:

- ABHA ID Input: Allows the patient to enter their ABHA ID to initiate the consent process.
- Consent Request Check: Queries Firestore to find an active session matching the entered ABHA ID.
- OTP Verification: Verifies the entered OTP against a hardcoded demo OTP (123456).
- Consent Granting: Updates the Firestore session document to reflect that consent has been granted.
- Success Message: Displays a success message upon granting consent.

## Style Guidelines:

- Primary color: Sky blue (#87CEEB), conveying trust and tranquility suitable for a medical application.
- Background color: Light grayish-blue (#F0F8FF), almost white to ensure readability and a clean interface.
- Accent color: Soft green (#98FB98), signaling approval and confirmation of consent.
- Body and headline font: 'PT Sans' (sans-serif) to maintain readability.
- Use simple, clear icons to represent actions such as verifying and granting consent. Icons should be in the primary color.
- Maintain a clean and straightforward layout. Center the input fields and buttons for better mobile usability.
- Subtle animations when navigating between screens, and a confirmation animation when consent is successfully granted.