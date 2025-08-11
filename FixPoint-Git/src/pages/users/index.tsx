import DefaultLayout from "@/config/layout";

export default function UsersPage() {
  return (
    <DefaultLayout>
      <div className="flex min-h-svh flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Users Page</h1>
        <p className="text-lg">
          This is a simple example of a React component within the users page.
        </p>
      </div>
    </DefaultLayout>
  );
}
