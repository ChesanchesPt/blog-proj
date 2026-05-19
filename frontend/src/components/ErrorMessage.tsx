export const ErrorMessage = ({ message }: { message: string }) => (
  <div role="alert" className="border-3 border-red-500 bg-red-100 p-3 font-bold text-red-900 shadow-[4px_4px_0px_#EF4444]">
    {message}
  </div>
);
