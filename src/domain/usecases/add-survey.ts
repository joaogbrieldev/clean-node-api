export interface SurveyAnswerModel {
  image?: string;
  answer: string;
}

export interface AddSurveyModel {
  question: string;
  answers: SurveyAnswerModel[];
}

export interface AddSurvey {
  add(survey: AddSurveyModel): Promise<void>;
}
