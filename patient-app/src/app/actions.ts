"use server";

import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  limit,
  orderBy,
  Timestamp,
} from "firebase/firestore";

export async function checkConsentRequest(
  patientAbhaId: string
): Promise<{ sessionId: string | null; error: string | null }> {
  try {
    const sessionsRef = collection(db, "sessions");
    const q = query(
      sessionsRef,
      where("patientAbhaId", "==", patientAbhaId),
      where("sessionActive", "==", true),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        sessionId: null,
        error: "No active consultation found for the provided ABHA ID.",
      };
    }

    const sessionDoc = querySnapshot.docs[0];
    return { sessionId: sessionDoc.id, error: null };
  } catch (error) {
    console.error("Error checking consent request:", error);
    return {
      sessionId: null,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function grantConsent(
  sessionId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const sessionDocRef = doc(db, "sessions", sessionId);
    await updateDoc(sessionDocRef, {
      consentStatus: "granted",
      consentGrantedAt: serverTimestamp(),
    });
    return { success: true, error: null };
  } catch (error) {
    console.error("Error granting consent:", error);
    return {
      success: false,
      error: "Failed to grant consent. Please try again.",
    };
  }
}

export type AccessHistoryItem = {
  id: string;
  doctorName: string;
  hospitalName: string;
  consentGrantedAt: string; // ISO string
  sessionStatus: "Active" | "Completed";
};

export async function getAccessHistory(
  patientAbhaId: string
): Promise<{ history: AccessHistoryItem[] | null; error: string | null }> {
  if (!patientAbhaId) {
    return { history: null, error: "ABHA ID is required." };
  }

  try {
    const sessionsRef = collection(db, "sessions");
    // Query only by patientAbhaId to avoid needing a composite index.
    const q = query(sessionsRef, where("patientAbhaId", "==", patientAbhaId));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { history: [], error: null };
    }

    const history: AccessHistoryItem[] = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        };
      })
      .filter((data) => data.consentStatus === "granted" && data.consentGrantedAt)
      .sort((a, b) => {
        const timeA = (a.consentGrantedAt as Timestamp).toMillis();
        const timeB = (b.consentGrantedAt as Timestamp).toMillis();
        return timeB - timeA;
      })
      .map((data) => {
        const consentGrantedAt = data.consentGrantedAt as Timestamp;
        return {
          id: data.id,
          doctorName: data.doctorName || "Dr. Not Found",
          hospitalName: data.hospital || "Hospital Not Found",
          consentGrantedAt: consentGrantedAt.toDate().toISOString(),
          sessionStatus: data.sessionActive ? "Active" : "Completed",
        };
      });

    return { history, error: null };
  } catch (error) {
    console.error("Error fetching access history:", error);
    return {
      history: null,
      error: "An unexpected error occurred while fetching access history. Please try again.",
    };
  }
}
