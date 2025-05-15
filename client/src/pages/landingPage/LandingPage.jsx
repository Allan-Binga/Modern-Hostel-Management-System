import { useState } from "react";
import Spinner from "../../components/Spinner";

function LandingPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div>
      {loading && (
        <div className="flex justify-center my-4">
          <Spinner />
        </div>
      )}
    </div>
  );
}

export default LandingPage;
