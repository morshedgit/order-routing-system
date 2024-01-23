// 403Page.tsx
import React from "react";

const ForbiddenPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold">403</h1>
        <p className="text-xl font-medium">Access Forbidden</p>
        <p className="mt-4">
          Sorry, you do not have permission to access this page.
        </p>
        {/* You can add more details or navigation options here */}
      </div>
    </div>
  );
};

export default ForbiddenPage;
