import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Navigation from "./Navigation";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-muted">
      <Navigation username="Rahul" />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">
          What are you looking for today?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PG Card */}
          <Card
            className="cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate("/pg")}
          >
            <CardHeader>
              <CardTitle>🏠 PG Accommodation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Find comfortable PGs with verified owners, amenities, and
                flexible stays.
              </p>
            </CardContent>
          </Card>

          {/* Mess Card */}
          <Card
            className="cursor-pointer hover:shadow-lg transition"
            onClick={() => navigate("/mess")}
          >
            <CardHeader>
              <CardTitle>🍽️ Mess & Food Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Explore hygienic mess services with daily & monthly plans.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-muted-foreground py-6">
        © {new Date().getFullYear()} PG Stay & Food Services
      </footer>
    </div>
  );
};

export default HomePage;
