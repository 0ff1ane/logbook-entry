import LogBookForm from "../components/logbook/LogBookForm";

export default function NewLogBook() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 items-center">
        <LogBookForm logbook={null} />
      </div>
    </div>
  );
}
