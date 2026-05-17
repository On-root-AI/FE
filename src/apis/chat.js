import axios from 'axios';

const chatClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 30000,
});

const fallbackStudyPlan = [
  {
    date: '5월 7일 (1일차)',
    tasks: ['시험 범위 전체 확인', '강의 자료 및 필기 정리'],
  },
  {
    date: '5월 8일 (2일차)',
    tasks: ['주요 심리학자 암기', '핵심 개념 요약노트 작성'],
  },
  {
    date: '5월 9일 (3일차)',
    tasks: ['성격심리 파트 공부', '틀린 개념 다시 정리'],
  },
];

function normalizeStudyPlan(rawPlan) {
  if (!Array.isArray(rawPlan)) {
    return undefined;
  }

  return rawPlan
    .map((day) => ({
      date: day.date || day.day || day.title || '',
      tasks: Array.isArray(day.tasks)
        ? day.tasks
        : [day.task1, day.task2, day.content].filter(Boolean),
    }))
    .filter((day) => day.date && day.tasks.length > 0);
}

function normalizeChatResponse(data, message) {
  const answer =
    data?.answer ||
    data?.message ||
    data?.content ||
    data?.result ||
    data?.data?.answer ||
    data?.data?.message ||
    '답변을 받았어요.';

  const studyPlan = normalizeStudyPlan(
    data?.studyPlan || data?.study_plan || data?.plan || data?.data?.studyPlan
  );

  const shouldShowFallbackPlan =
    !studyPlan &&
    /학습|계획|공부|기말|시험|일주일|7일/.test(`${message} ${answer}`);

  return {
    answer,
    studyPlan:
      studyPlan || (shouldShowFallbackPlan ? fallbackStudyPlan : undefined),
  };
}

export async function sendChatMessage(message) {
  const endpoint = import.meta.env.VITE_CHAT_API_URL || '/api/chat';
  const { data } = await chatClient.post(endpoint, { message });

  return normalizeChatResponse(data, message);
}

export const demoPrompt = '심리학 기말고사 일주일 학습 계획 짜줘.';
