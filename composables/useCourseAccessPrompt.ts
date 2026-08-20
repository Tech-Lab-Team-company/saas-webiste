interface CourseAccessPromptState {
  visible: boolean;
  isPending: boolean;
}

export const useCourseAccessPrompt = () => {
  const subscriptionPrompt = useState<CourseAccessPromptState>(
    "course-access-subscription-prompt",
    () => ({
      visible: false,
      isPending: false,
    }),
  );

  const promptCourseSubscription = (status?: number) => {
    subscriptionPrompt.value.isPending = status === 1;
    subscriptionPrompt.value.visible = true;
  };

  const closeCourseSubscriptionPrompt = () => {
    subscriptionPrompt.value.visible = false;
  };

  return {
    subscriptionPrompt,
    promptCourseSubscription,
    closeCourseSubscriptionPrompt,
  };
};
