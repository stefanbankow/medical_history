import React, { useEffect } from "react";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { store } from "./store/store";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { restoreAuth, selectIsAuthenticated } from "./store/authSlice";
import { useAuth } from "./utils/auth";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import MedicalVisits from "./pages/MedicalVisits";
import Reports from "./pages/Reports";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

// Component to handle role-based default routing
function DefaultRoute() {
  const { isAdmin, isDoctor, isPatient } = useAuth();
  
  if (isPatient()) {
    return <Navigate to="/visits" replace />;
  } else if (isAdmin() || isDoctor()) {
    return <Navigate to="/reports" replace />;
  }
  
  // Fallback
  return <Navigate to="/visits" replace />;
}

function AppContent() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    // Restore authentication state from localStorage on app start
    dispatch(restoreAuth());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<DefaultRoute />} />
                  <Route path="/doctors" element={<Doctors />} />
                  <Route path="/patients" element={<Patients />} />
                  <Route path="/visits" element={<MedicalVisits />} />
                  <Route path="/reports" element={<Reports />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
