import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Sentry from "@sentry/react";

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';

import {
  AvaliarPedido
} from '../../services/functions';

import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import { Row, Col } from 'react-bootstrap';

import Box from '@material-ui/core/Box';

import api from '../../services/api';

import './styles.css';



const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  rootAlert: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  root: {
    width: "100%",
    margin: "1em 0",
  },
  pos: {
    marginBottom: 12,
  },
}));


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default function Login(props) {

  const aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF"))  
  const classes = useStyles();
  const history = useHistory();

  const search = props.location.search;
  const params = new URLSearchParams(search); 
  const avaliacaoParamsCliente = params.get('Cliente')
  const avaliacaoParamsPedido = params.get('Pedido')

  if(!avaliacaoParamsCliente || !avaliacaoParamsPedido){
    history.push(`/`)
  }

  

  // FUNCOES
  
  //alerts e loading
  const alertStart = (msg, tipo) => {
    setAlert({"status": true, "tipo": tipo, "mesangem": msg});
  };
  
  const alertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({"status": false, "tipo": alert.tipo, "mesangem": alert.mesangem});

  };

  const avaliarPedido = async () => {

    try {
      if(nota <= 0 || nota > 10){
        alertStart('Nota inválida!', "warning") 
        return false
      }
      setLoading(true)

      const data = {
        "cliente": {"appNome": aplicativoDados.appNome, "id": parseInt(atob(avaliacaoParamsCliente)), "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`},
        "pedido": {"appNome": aplicativoDados.appNome, "id": parseInt(atob(avaliacaoParamsPedido)), "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`},
        "nota": nota ? nota : 0,
        "respondido": false,
        'comentario': comentario,
        "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
        "appNome": aplicativoDados.appNome,
      }

      const response = await AvaliarPedido(data, aplicativoDados)
  
      if(response.retornoErro){
        //algum erro
        alertStart(response.mensagem, "error")
        setLoading(false)
      }else{ 
        //tudo certo
        alertStart(response.mensagem, "success") 
        setTimeout(() => {
          history.push(`/`)
        }, 3000);
      }
    }
    catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions buscarCardapioOffline ${window.location.hostname} - ${error}`);
        alertStart("Procure os desenvolvedores! Erro: "+error.message, "error")    
    }

    

  }

  
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = useState({"status": false, "tipo": "success", "mesangem": ""});
  const [nota, setNota] = React.useState(0);
  const [comentario, setComentario] = React.useState('');

  return (



    <Container component="main" maxWidth="xs">

      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar open={alert.status} autoHideDuration={6000} onClose={alertClose}>
        <Alert onClose={alertClose} severity={alert.tipo}>
          {alert.mesangem}
        </Alert>
      </Snackbar>


      <CssBaseline />
            
      


      <div className={classes.paper}>
       
          <Row>
            <Col>
              <img src={aplicativoDados?.urlLogo} style={{"height": "150px"}} alt="" />
            </Col>
          </Row>

          <Row style={{"textAlign": "center", "marginTop": "1em"}}>
            <Col xs={12} md={12} lg={12} >
              <Typography gutterBottom variant="h5" >
                {'#'+atob(avaliacaoParamsPedido)}
              </Typography>
            </Col>
            <Col xs={12} md={12} lg={12} >
              <Typography >
                Baseado na experiência do seu pedido, quais as chances de você indicar o aplicativo para um amigo ou familiar?
              </Typography>
            </Col>
            <Col xs={12} md={12} lg={12} style={{"textAlign": "center", "marginTop": "1em"}}>
              <Box component="fieldset" mb={3} borderColor="transparent">
                <Typography component="legend">{nota} de 10</Typography>
                <Rating name="customized-10"  max={10}
                value={nota}
                onChange={(event, newValue) => {
                  setNota(newValue);
                }}
                 />
              </Box>
            </Col>
            <Col xs={12} md={12} lg={12} >
              <TextField
                id="outlined-multiline-static"
                label="Comentário"
                fullWidth
                rows={1}
                value={comentario}
                onChange={(e) =>{setComentario(e.target.value)}}
                variant="outlined"
              />
            </Col>
            <Col xs={12} md={12} lg={12} >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={avaliarPedido}
                className={classes.submit}
              >
                Avaliar
              </Button>
            </Col>
            
          </Row>
         
      </div>
    </Container>


  );
}
