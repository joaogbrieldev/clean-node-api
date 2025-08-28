export interface SurveyAnswerModel {
  image?: string;
  answer: string;
}

export interface AddSurveyModel {
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
}

export interface AddSurvey {
  add(survey: AddSurveyModel): Promise<void>;
}
