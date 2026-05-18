import axios from 'axios';

const chatClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 30000,
});

function normalizeStudyPlan(rawPlan) {
  if (!Array.isArray(rawPlan)) {
    return undefined;
  }

  if (rawPlan.some((task) => task?.scheduledDate && task?.title)) {
    const grouped = rawPlan.reduce((acc, task) => {
      if (!task.scheduledDate || !task.title) {
        return acc;
      }

      const current = acc.get(task.scheduledDate) || [];
      current.push(task.title);
      acc.set(task.scheduledDate, current);

      return acc;
    }, new Map());

    return Array.from(grouped, ([date, tasks]) => ({ date, tasks }));
  }

  const normalizedPlan = rawPlan
    .map((day) => ({
      date: day.date || day.day || day.title || '',
      tasks: Array.isArray(day.tasks)
        ? day.tasks
        : [day.task1, day.task2, day.content].filter(Boolean),
    }))
    .filter((day) => day.date && day.tasks.length > 0);

  return normalizedPlan.length > 0 ? normalizedPlan : undefined;
}

function normalizeChatResponse(data) {
  const title = data?.title || data?.data?.title;
  const answer =
    data?.answer ||
    data?.message ||
    data?.content ||
    data?.result ||
    data?.data?.answer ||
    data?.data?.message ||
    (title ? `${title}을 생성했어요.` : '학습 계획을 생성했어요.');

  const studyPlan = normalizeStudyPlan(
    data?.studyPlan ||
      data?.study_plan ||
      data?.plan ||
      data?.tasks ||
      data?.data?.studyPlan ||
      data?.data?.tasks
  );

  return {
    answer,
    title,
    studyPlan,
  };
}

export async function sendChatMessage(message) {
  const endpoint = import.meta.env.VITE_CHAT_API_URL || '/api/ai/generate';
  const { data } = await chatClient.post(endpoint, { userInput: message });

  return normalizeChatResponse(data);
}

export const demoPrompt = '심리학 기말고사 일주일 학습 계획 짜줘.';
