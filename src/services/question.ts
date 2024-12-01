

import axios from "axios";
import { QuestionResponse, SubmitAnswer } from "./types.ts";

// ฟังก์ชันสำหรับดึงคำถาม
export const getQuestion = async () => {
  try {
    const response = await axios.get("http://jenkins.thddns.net:4551/api/v1/form/questions");
    if (response.status === 200) {
      return response.data as QuestionResponse[];
    } else {
      console.error("Error: Unexpected response status", response.status);
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
};

// ฟังก์ชันสำหรับส่งคำตอบ
export const postAnswer = async (data: SubmitAnswer) => {
  try {
    const response = await axios.post("http://jenkins.thddns.net:4551/api/v1/personality/assessment", data);
    if (response.status === 200 || response.status === 201) {
      return response.data; // คาดว่าควรมี assessmentId อยู่ใน response
    } else {
      console.error("Error: Unexpected response status", response.status);
    }
  } catch (error) {
    console.error("Error posting answers:", error);
  }
};

// ฟังก์ชันสำหรับดึงผลลัพธ์จาก assessmentId
export const postResult = async (assessmentId: string) => {
  try {
    const response = await axios.post(
      `http://jenkins.thddns.net:4551/api/v1/personality/assessment/${assessmentId}/result`
    );
    if (response.status === 200) {
      return response.data; // ข้อมูลผลลัพธ์
    } else {
      console.error("Error: Unexpected response status", response.status);
    }
  } catch (error) {
    console.error("Error fetching result:", error);
  }
};
