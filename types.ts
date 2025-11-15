
export enum AppState {
  WELCOME,
  TRAINING,
  FEEDBACK,
}

export interface TrainingScenario {
  imageUrl: string;
  question: string;
}
