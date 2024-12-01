export type QuestionResponse = {
    id: string;
    number: number;
    text: string;
    choices: Choice[];
};

export type Choice = {
    id: string;
    description: string;

}

export type AssessmentQuestion = {
    order: number
    id: string
    title: string;
    answer1Id: string;
    answer1Title: string;
    answer2Id: string;
    answer2Title: string;
}
//-----------------------------------------//
export type ClientDetail = {
  gender: string;
  age: number;
}

export type Answer = {
  questionId: string;
  questionText: string;
  id: string;
  text: string;
  startTime: string;
  endTime: string;
}

export type SubmitAnswer = {
  deviceDetail: string;
  clientDetail: ClientDetail;
  answers: Answer[];
  startTime: string;
  endTime: string;
}
