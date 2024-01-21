import ViewPrinters from "./view-printers";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-w-64">
        <ViewPrinters />
      </div>
      <div className="divider divider-horizontal">{children}</div>
    </>
  );
}
