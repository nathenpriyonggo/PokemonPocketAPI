import Navbar from "../features/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-50">
      <Navbar />
      <div className="flex-grow">{children}</div>
    </div>
  );
}
