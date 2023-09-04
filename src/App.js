import logo from "./logo.svg";
import "./App.css";
import Logs from "./pages/Logs/Logs";
import LogsProvider from "./context/Logs";

function App() {
  return (
    <div className="App">
      <LogsProvider>
        <Logs />
      </LogsProvider>
    </div>
  );
}

export default App;
