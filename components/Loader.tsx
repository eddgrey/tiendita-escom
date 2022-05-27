type LoaderProps = {
  show: boolean;
};

const Loader = ({ show }: LoaderProps) => {
  return (
    <>
      {show && (
        <div
          className="w-10 h-10 border-blue-50 border-t-blue-500 animate-spin border-8 rounded-full"
          role="status"
        />
      )}
    </>
  );
};

export default Loader;
