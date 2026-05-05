export const LoadingSpinner = () => (
  <div className="flex justify-center py-12">
    <div className="w-10 h-10 border-4 border-neo-black border-t-neo-yellow rounded-full animate-spin" />
  </div>
);

export const ErrorMessage = ({ message }: { message: string }) => (
  <div role="alert" className="border-3 border-red-500 bg-red-100 p-4 font-bold text-red-900 shadow-[4px_4px_0px_#EF4444]">
    {message}
  </div>
);