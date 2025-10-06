import Sidebar from "./Sidebar";

function RootLayout({ children }) {
  return (
    <div className="flex gap-2">
      <Sidebar />
      <main className="max-w-7xl flex-1  ">{children}</main>
    </div>
  );
}

export default RootLayout;
