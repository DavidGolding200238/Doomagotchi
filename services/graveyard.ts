import { db } from '@/services/firebase';
import {
    addDoc,
    collection,
    deleteField,
    doc,
    setDoc,
} from 'firebase/firestore';

export type ActivePet = {
  id: string;
  type: string;
  name: string;
  title?: string;
  createdAt: string;
  health?: number;
  happiness?: number;
};

export type GraveyardEntry = {
  name: string;
  type: string;
  days: number;
  cause: string;
  date: string;
  epitaph: string;
  diedAt: string;
};

const FUNNY_CAUSES = [
  'Doomscrolling',
  'One more Reel (it was not one)',
  'TikTok said “related videos”',
  'Opened Instagram for a second',
  '2am “quick check”',
  'Infinite scroll won',
  'Reply guy rabbit hole',
  'Just checking the news',
  'Story streak addiction',
  'Doomscrolling with both thumbs',
  '“I’ll sleep after this video”',
  'For You Page homicide',
];

function randomCause() {
  return FUNNY_CAUSES[Math.floor(Math.random() * FUNNY_CAUSES.length)];
}

function daysBetween(startIso: string, end = new Date()) {
  const start = new Date(startIso).getTime();
  const diff = Math.max(0, end.getTime() - start);
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function formatDate(d = new Date()) {
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Save pet to graveyard, remove active pet. */
export async function buryPet(
  uid: string,
  pet: ActivePet,
  epitaph: string
): Promise<void> {
  const now = new Date();
  const entry: GraveyardEntry = {
    name: pet.name,
    type: pet.type,
    days: daysBetween(pet.createdAt || now.toISOString(), now),
    cause: randomCause(),
    date: formatDate(now),
    epitaph: epitaph.trim() || 'Gone, but not scrolled past.',
    diedAt: now.toISOString(),
  };

  await addDoc(collection(db, 'users', uid, 'graveyard'), entry);

  await setDoc(
    doc(db, 'users', uid),
    { pet: deleteField() },
    { merge: true }
  );
}