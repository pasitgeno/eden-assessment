import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { fircardContent, secoundCardContent } from "./cardContent";
import { Box } from "@mui/material";
import { getQuestion, postAnswer, postResult } from "../../services/question.ts";
import { Answer, AssessmentQuestion, QuestionResponse, SubmitAnswer } from "../../services/types.ts";

// ฟังก์ชันสำหรับแปลงเวลาเป็นรูปแบบ "HH:mm:ss.SSSSSS"
const formatTime = (date: Date) => {
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
  return `${hours}:${minutes}:${seconds}.${milliseconds.padEnd(6, '0')}`;
};

export const CardContainer: React.FC = () => {
  const [onboard, setIsOnBoard] = useState<number>(1);
  const [questions, setQuestions] = useState<QuestionResponse[]>();
  const [assessment, setAssessment] = useState<AssessmentQuestion[]>();
  const [userAnswersList, setUserAnswersList] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleAnswerSelect = (questionId: string, title: string, answerId: string, answerText: string) => {
    const endTime = formatTime(new Date());
    const answer: Answer = {
      questionId: questionId,
      questionText: title,
      id: answerId,
      text: answerText,
      startTime: startTime || formatTime(new Date()),
      endTime: endTime,
    };

    setSelectedAnswer(answerId);
    setUserAnswersList((prevAnswers) => [...prevAnswers, answer]);
    const newIndex = currentQuestionIndex + 1;

    if (newIndex >= (assessment?.length || 0)) {
      submitAssessment();  // เรียกใช้ submitAssessment ตอนจบคำถามทั้งหมด
    } else {
      setCurrentQuestionIndex(newIndex);
    }
  };

  const handleNextOnboard = () => {
    if (selectedAnswer) {
      setIsOnBoard(onboard + 1);
      setSelectedAnswer(null);
    } else {
      console.error("Please select an answer before proceeding.");
    }
  };

  const submitAssessment = async () => {
    const endTime = formatTime(new Date());
    const submitData: SubmitAnswer = {
      deviceDetail: "Device Information Placeholder",
      clientDetail: { gender: "", age: 0 },
      answers: userAnswersList,
      startTime: startTime || formatTime(new Date()),
      endTime: endTime,
    };

    try {
      const response = await postAnswer(submitData);
      console.log("Post answer response:", response);
      
      if (response) {
        const assessmentId = response; // ใช้ response โดยตรงเป็น assessmentId
        console.log("Assessment ID:", assessmentId);
        
        const resultData = await postResult(assessmentId); // ดึงผลลัพธ์
        console.log("Result data:", resultData);
        
        if (resultData) {
          setResult(resultData); // บันทึกผลลัพธ์เพื่อแสดงในหน้าผลลัพธ์
          setIsOnBoard(4); // เปลี่ยนเป็นหน้าผลลัพธ์
        } else {
          console.error("Failed to fetch result data");
        }
      } else {
        console.error("Failed to get assessmentId from response");
      }
    } catch (error) {
      console.error("Error during assessment submission or result fetching:", error);
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      const data = await getQuestion();
      setQuestions(data);
      if (data) {
        setAssessment(mapQuestions(data));
        setStartTime(formatTime(new Date()));
      }
    };
    fetchQuestions();
  }, []);

  const mapQuestions = (assessment: QuestionResponse[] | undefined): AssessmentQuestion[] | undefined => {
    if (!assessment) {
      return [];
    }
    return assessment.map((question) => ({
      order: question.number,
      id: question.id,
      title: question.text,
      answer1Id: question.choices[0].id,
      answer1Title: question.choices[0].description,
      answer2Id: question.choices[1].id,
      answer2Title: question.choices[1].description,
    }));
  };

  return (
    <Card sx={{ minWidth: 600, minHeight: 500 }} style={{ borderRadius: 40 }}>
      {onboard === 1 && (
        <Box>
          <CardContent style={{ paddingTop: 100 }}>
            <Typography gutterBottom variant="h4" style={{ paddingBottom: 20 }}>{fircardContent.header}</Typography>
            <Typography gutterBottom variant="h4" style={{ paddingBottom: 40 }}>{fircardContent.subHeader}</Typography>
            <Box style={{ paddingTop: 50 }}>
              <Typography gutterBottom variant="h5" style={{ paddingBottom: 20 }}>{fircardContent.description}</Typography>
              <Typography gutterBottom variant="h5" style={{ paddingBottom: 20 }}>{fircardContent.subDescription}</Typography>
            </Box>
          </CardContent>
          <CardActions style={{ flex: "row", alignItems: "center", justifyContent: "center", padding: 50 }}>
            <Button
              variant="contained"
              style={{ margin: 20, minWidth: 150, borderRadius: 50, backgroundColor: '#646cff', color: '#ffffff', transition: 'transform 0.3s' }}
              onClick={() => setIsOnBoard(2)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Typography variant="h6" style={{ margin: 10 }}>{fircardContent.button}</Typography>
            </Button>
          </CardActions>
        </Box>
      )}
      {onboard === 2 && (
        <Box>
          <CardContent style={{ paddingTop: 100 }}>
            <Typography gutterBottom variant="h5" style={{ paddingBottom: 20 }}>{secoundCardContent.title}</Typography>
            <Typography gutterBottom variant="h6" style={{ paddingTop: 20, paddingBottom: 20 }}>{secoundCardContent.content1}</Typography>
            <Typography gutterBottom variant="h6" style={{ paddingBottom: 20 }}>{secoundCardContent.content2}</Typography>
            <Typography gutterBottom variant="h6" style={{ paddingBottom: 20 }}>
              {`${secoundCardContent.content3}${secoundCardContent.content4}${secoundCardContent.content5}`}
            </Typography>
            <Typography gutterBottom variant="h6" style={{ paddingBottom: 20 }}>{secoundCardContent.content6}</Typography>
            <Typography gutterBottom variant="h6" style={{ paddingBottom: 20 }}>{secoundCardContent.content7}</Typography>
          </CardContent>
          <CardActions style={{ flex: "row", alignItems: "center", justifyContent: "center", padding: 50 }}>
            <Button
              variant="contained"
              style={{ margin: 20, minWidth: 150, borderRadius: 50, backgroundColor: '#646cff', color: '#ffffff', transition: 'transform 0.3s' }}
              onClick={() => setIsOnBoard(3)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Typography variant="h6" style={{ margin: 10 }}>{secoundCardContent.button}</Typography>
            </Button>
          </CardActions>
        </Box>
      )}
      {onboard === 3 && assessment && currentQuestionIndex < assessment.length && (
        <CardContent style={{ paddingTop: 100, textAlign: 'center' }}>
          <Typography gutterBottom variant="h5" style={{ paddingBottom: 20 }}>
            เธอเปิดประตูเข้ามาในห้องที่ {currentQuestionIndex + 1}
          </Typography>
          <Typography gutterBottom variant="h6" style={{ paddingBottom: 40 }}>
            เธอสนใจทำอะไรเป็นอันดับแรก?
          </Typography>
          <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <Button
              variant="outlined"
              style={{ width: '300px', padding: '20px', borderRadius: '50px', borderColor: '#646cff', color: '#ffffff', backgroundColor: '#000000', transition: 'transform 0.3s' }}
              onClick={() => handleAnswerSelect(
                assessment[currentQuestionIndex].id,
                assessment[currentQuestionIndex].title,
                assessment[currentQuestionIndex].answer1Id,
                assessment[currentQuestionIndex].answer1Title
              )}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {assessment[currentQuestionIndex].answer1Title}
            </Button>
            <Button
              variant="outlined"
              style={{ width: '300px', padding: '20px', borderRadius: '50px', borderColor: '#646cff', color: '#ffffff', backgroundColor: '#000000', transition: 'transform 0.3s' }}
              onClick={() => handleAnswerSelect(
                assessment[currentQuestionIndex].id,
                assessment[currentQuestionIndex].title,
                assessment[currentQuestionIndex].answer2Id,
                assessment[currentQuestionIndex].answer2Title
              )}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {assessment[currentQuestionIndex].answer2Title}
            </Button>
          </Box>
        </CardContent>
      )}
      {onboard === 4 && result && (
        <CardContent style={{ paddingTop: 100, textAlign: 'center' }}>
          <Typography gutterBottom variant="h4" style={{ paddingBottom: 20 }}>ผลลัพธ์การทดสอบของคุณ</Typography>
          <Typography gutterBottom variant="h5" style={{ paddingBottom: 20 }}>รหัสผลลัพธ์: {result.result}</Typography>
          <Box style={{ padding: 20 }}>
            {result.onetCareerResponse.map((career: any, index: number) => (
              <Box key={career.id} style={{ marginBottom: 20 }}>
                <Typography variant="h6">{index + 1}. {career.titleTH} ({career.titleEN})</Typography>
              </Box>
            ))}
          </Box>
          <CardActions style={{ flex: "row", alignItems: "center", justifyContent: "center", padding: 50 }}>
            <Button
              variant="contained"
              style={{ margin: 20, minWidth: 150, borderRadius: 50, backgroundColor: '#646cff', color: '#ffffff', transition: 'transform 0.3s' }}
              onClick={() => setIsOnBoard(1)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Typography variant="h6" style={{ margin: 10 }}>ทำอีกครั้ง</Typography>
            </Button>
          </CardActions>
        </CardContent>
      )}
    </Card>
  );
};

