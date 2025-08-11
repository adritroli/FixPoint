import DefaultLayout from "@/config/layout";

export default function HomePage() {
  return (
    <DefaultLayout>
      <div className="flex min-h-svh flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Welcome to FixPoint!</h1>
        <p className="text-lg">
          This is a simple example of a React component within the home page.
        </p>
      </div>
    </DefaultLayout>
  );
}
