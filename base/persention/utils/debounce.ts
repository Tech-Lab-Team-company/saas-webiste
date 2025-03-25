function debouncing<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  defaultDelay: number = 1000,
): {
  debouncedFunction: (...args: Parameters<T>) => Promise<ReturnType<T>>;
  setDelay: (newDelay: number) => void;
} {
  let timeoutId: ReturnType<typeof setTimeout>;
  let delay = defaultDelay; // Set the default delay initially

  // Function to dynamically set the delay
  const setDelay = (newDelay: number) => {
    delay = newDelay;
  };

  // The debounced function
  const debouncedFunction = (
    ...args: Parameters<T>
  ): Promise<ReturnType<T>> => {
    return new Promise((resolve, reject) => {
      // Clear the previous timeout if it exists
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set a new timeout with the current delay
      timeoutId = setTimeout(() => {
        fn(...args)
          .then(resolve)
          .catch(reject);
      }, delay);
    });
  };

  return { debouncedFunction, setDelay };
}

export default debouncing;
