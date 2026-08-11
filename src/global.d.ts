declare namespace google {
  namespace script {
    const run: {
      withSuccessHandler<T>(callback: (result: T) => void): {
        withFailureHandler<U>(callback: (error: unknown) => void): {
          [method: string]: (...args: unknown[]) => void;
        };
      };
    };
  }
}
