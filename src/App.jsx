import { Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Login from './components/Login';
import UploadDocs from './components/UploadDocs';

const App = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#b4c2dc',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path={`/`} element={<Login />} />
        <Route path={`/upload-docs`} element={<UploadDocs />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
