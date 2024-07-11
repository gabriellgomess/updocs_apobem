import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Card, CardContent, Box } from '@mui/material';
import axios from 'axios';
import Logo from '../assets/logo.png';

const useQuery = () => new URLSearchParams(useLocation().search);

const Login = () => {
  const query = useQuery();
  const navigate = useNavigate(); // Hook para navegação
  const [decodedToken, setDecodedToken] = useState('');
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [empregador, setEmpregador] = useState('');
  const [password, setPassword] = useState(''); // Senha padrão definida como "000000"

  useEffect(() => {
    const token = query.get('c');
    if (token) {
      const decoded = atob(token);
      setDecodedToken(decoded);
    }
  }, [query]);

  useEffect(() => {
    if (decodedToken) {
      fetchCpf(decodedToken);
    }
  }, [decodedToken]);

  const fetchCpf = (token) => {
    axios.post('https://apobem.com.br/updocs/updocs_api/consulta_cliente.php', {
      vendas_id: token
    }).then((response) => {
      setCpf(response.data.clients_cpf);
      setPassword('000000')
      setNome(response.data.cliente_nome);
      setEmpregador(response.data.cliente_empregador);
    }).catch((error) => {
      console.error('Erro ao buscar CPF:', error);
    });
  };

  const handleLogin = () => {
    navigate(`/upload-docs`, {
      state: {
        cpf,
        decodedToken,
        empregador,
        nome
      }
    });
  };

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#b4c2dc', height: '100vh', paddingTop: '100px', width: '100%'}}>
      <img  width="200px" src={Logo} alt="" />
      <Card elevation={5} sx={{marginTop: '10px', width: '90%', maxWidth: '450px'}}>
        <CardContent>
          {/* Boas vindas ao usuário */}
          <Typography variant="body1" gutterBottom>
            {nome && `Olá ${nome.split(' ')[0]}! Faça login para continuar.`}
          </Typography>
          <TextField
            label="Usuário (CPF)"
            variant="outlined"
            fullWidth
            margin="normal"
            value={cpf}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            InputProps={{
              readOnly: true,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
          >
            Entrar
          </Button>
          <Typography variant="body2" color="textSecondary" align="center" marginTop="1rem">
            {decodedToken}
          </Typography>
        </CardContent>
      </Card>
      <Typography variant="body2" color="textSecondary" align="center" marginTop="1rem">
        O acesso à essa página deverá ser realizado através do link enviado por SMS.
        </Typography>
    </Box>
  );
};

export default Login;
