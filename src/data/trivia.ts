// Populated during Faz 3 (detail mode). See docs/DATA.md.

export interface Trivia {
  planet: string;
  facts: string[];
  atmosphere?: Record<string, number>;
  notableFeatures?: string[];
}

export const TRIVIA: Trivia[] = [];
