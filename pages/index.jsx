
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MapWithNoSSR = dynamic(() => import("../components/Map"), { ssr: false });

const Card = ({ children }) => <div style={{ border: '1px solid #ccc', borderRadius: '6px', marginBottom: '1rem' }}>{children}</div>;
const CardContent = ({ children }) => <div style={{ padding: '1rem' }}>{children}</div>;
const Input = (props) => <input {...props} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }} />;
const Button = ({ children, ...props }) => <button {...props} style={{ width: '100%', padding: '0.5rem', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', marginBottom: '0.5rem' }}>{children}</button>;

export default function GrantDashboard() {
  const [funders, setFunders] = useState([]);
  const [themeFilter, setThemeFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");

  useEffect(() => {
    async function fetchFunders() {
      const response = await fetch("https://data.threesixtygiving.org/data.json");
      const data = await response.json();
      const groupedFunders = {};
      data.grants.forEach((grant) => {
        const key = `${grant.funderName}-${grant.recipientPostcode}`;
        if (!groupedFunders[key]) {
          groupedFunders[key] = {
            name: grant.funderName || "Unknown Funder",
            theme: grant.subject || "General",
            postcode: grant.recipientPostcode || "",
            lat: grant.latitude || 51.5,
            lng: grant.longitude || -0.1,
            grants: 1,
            totalAmount: grant.amountAwarded || 0,
            scope: grant.geographicScope || "Unknown"
          };
        } else {
          groupedFunders[key].grants += 1;
          groupedFunders[key].totalAmount += grant.amountAwarded || 0;
        }
      });
      setFunders(Object.values(groupedFunders));
    }
    fetchFunders();
  }, []);

  const filteredFunders = funders.filter(
    f => (!themeFilter || f.theme.toLowerCase().includes(themeFilter.toLowerCase())) &&
         (!regionFilter || f.postcode.toUpperCase().startsWith(regionFilter.toUpperCase()))
  );

  const themeCounts = filteredFunders.reduce((acc, funder) => {
    acc[funder.theme] = (acc[funder.theme] || 0) + 1;
    return acc;
  }, {});

  const themeChartData = {
    labels: Object.keys(themeCounts),
    datasets: [{
      label: "Number of Funders",
      data: Object.values(themeCounts),
      backgroundColor: "rgba(75, 192, 192, 0.5)"
    }]
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Card>
        <CardContent>
          <h2>Filters</h2>
          <Input placeholder="Theme" value={themeFilter} onChange={(e) => setThemeFilter(e.target.value)} />
          <Input placeholder="Postcode prefix" value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h2>Theme Breakdown</h2>
          <Bar data={themeChartData} options={{ responsive: true }} />
        </CardContent>
      </Card>
      <MapWithNoSSR funders={filteredFunders} />
    </div>
  );
}
