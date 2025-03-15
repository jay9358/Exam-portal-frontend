import "../../assets/css/Dashboard.css"; 

const subjects = [
  { id: 1, name: "Math" },
  { id: 2, name: "Science" },
  { id: 3, name: "History" },
  { id: 4, name: "Geography" },
  { id: 5, name: "English" },
  { id: 6, name: "Physics" },
];

export default function Dashboard() {
  const adminName = "Admin"; 

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {adminName}!</p>

    

      <div className="subject-cards">
        <div className="cards-container">
         
          {subjects.slice(0, 4).map((subject) => (
            <div key={subject.id} className="subject-card">
              <h3>{subject.name}</h3>
              <button className="start-button">Start</button>
            </div>
          ))}
        </div>
        
        <div className="cards-container">
          {/* Render remaining subjects */}
          {subjects.slice(4).map((subject) => (
            <div key={subject.id} className="subject-card">
              <h3>{subject.name}</h3>
              <button className="start-button">Start</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
