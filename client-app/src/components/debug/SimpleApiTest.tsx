"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/services/api";

export function SimpleApiTest() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testProtectedApi = async () => {
    setLoading(true);
    setResult("Testing protected API...");

    try {
      // This will trigger token refresh if needed
      const response = await apiCall("GET", "/auth/profile");
      setResult("✅ API call successful: " + JSON.stringify(response));
    } catch (error: any) {
      setResult("❌ API call failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border z-50 max-w-xs">
      <h3 className="font-bold mb-2 text-sm">API Test</h3>
      <Button
        onClick={testProtectedApi}
        disabled={loading}
        size="sm"
        className="w-full text-xs mb-2"
      >
        {loading ? "Testing..." : "Test Protected API"}
      </Button>
      {result && (
        <div className="text-xs break-words max-h-20 overflow-y-auto">
          {result}
        </div>
      )}
    </div>
  );
}
