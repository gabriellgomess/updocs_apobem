import { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, IconButton, Divider } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Header from './Header';

const UploadDocs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cpf, decodedToken, empregador, nome } = location.state || {};

  const [documentTypes, setDocumentTypes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});

  useEffect(() => {
    if (!cpf || !decodedToken || !empregador || !nome) {
      navigate('/'); // Redireciona para a página de login se os dados necessários não estiverem presentes
    } else {
      fetchDocumentTypes(empregador);
    }
  }, [cpf, decodedToken, empregador, nome, navigate]);

  const fetchDocumentTypes = (employer) => {
    axios.post('https://apobem.com.br/updocs/updocs_api/consulta_tipos_anexos.php', {
      empregador: employer
    })
      .then(response => {
        if (Array.isArray(response.data)) {
          setDocumentTypes(response.data);
        } else {
          console.error('Resposta inesperada da API', response.data);
          setDocumentTypes([]);
        }
      })
      .catch(error => {
        console.error('Erro ao buscar tipos de documentos:', error);
        setDocumentTypes([]);
      });
  };

  const handleFileUpload = async (file, documentType) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('cliente_cpf', cpf);
    formData.append('documento-upload', file);
    formData.append('tipo_documento', documentType);
    formData.append('vendas_id', decodedToken);

    try {
      const response = await axios.post('https://apobem.com.br/updocs/updocs_api/salvar.php', formData);
      if (response.data.success) {
        Swal.fire({
          title: 'Sucesso!',
          text: 'Arquivo enviado com sucesso!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        setUploadedFiles(prevState => ({
          ...prevState,
          [documentType]: true
        }));
      } else {
        Swal.fire({
          title: 'Erro!',
          text: 'Erro ao enviar o arquivo.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Erro!',
        text: 'Erro ao enviar o arquivo.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      console.error('Erro ao enviar o arquivo:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e, documentType) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file, documentType);
    }
  };

  const handleFinalize = () => {
    navigate('/');
  };

  if (!cpf || !decodedToken || !empregador || !nome) {
    return null; // Retorna null enquanto redireciona
  }

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="body1" gutterBottom mt={3}>
          {nome && `Olá ${nome.split(' ')[0]}! Faça upload dos seus documentos.`}
        </Typography>
        <p>ID: {decodedToken}</p>
        <Box display="flex" flexDirection="column" alignItems="center" mt={4} sx={{ width: '100vw', maxWidth: '400px' }}>
          {documentTypes.map((type) => (
            <>
              <Box key={type.tipo_id} mb={0} textAlign="center" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <img width="50px" src={`https://apobem.com.br/updocs/updocs_api/img/${type.tipo_icone}`} alt="" />
                <Typography variant="overline">{type.tipo_nome}</Typography>
                <IconButton
                  component="label"
                  disabled={uploading}
                  color="primary"
                >
                  {uploadedFiles[type.tipo_id] ? <CheckCircleIcon color="success" /> : <FileUploadIcon />}
                  <input
                    type="file"
                    hidden
                    accept="image/*,video/*"
                    onChange={(e) => handleFileChange(e, type.tipo_id)}
                  />
                </IconButton>
              </Box>
              <Divider sx={{borderColor: '#f5642e52', width: '100%', margin: '3px'}} />
            </>

          ))}
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleFinalize}
          sx={{ mt: 4 }}
        >
          Finalizar
        </Button>
      </Container>
    </>
  );
};

export default UploadDocs;
