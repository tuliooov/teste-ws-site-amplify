import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {Card,  Row, Col } from 'react-bootstrap';
import Slide from '@material-ui/core/Slide';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from '../../services/api';


import apresentacao_diaDosPais from '../../assets/geradorDeImagens/diaDosPais/apresentacao.jpg';
import apresentacao_blackFriday from '../../assets/geradorDeImagens/blackFriday/apresentacao.jpg';
import apresentacao_natal from '../../assets/geradorDeImagens/natal/apresentacao.jpg';
import apresentacao_revellion from '../../assets/geradorDeImagens/revellion/apresentacao.jpg';
import apresentacao_diaDasMulheres from '../../assets/geradorDeImagens/diaDasMulheres/apresentacao.jpg';



import useMediaQuery from '@material-ui/core/useMediaQuery';

import './styles.css';
import DiaDosPais from './DiaDosPais';
import BlackFriday from './BlackFriday';
import Natal from './Natal';
import Revellion from './Revellion';
import DiaDasMulheres from './DiaDasMulheres';




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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Downloads() {

  const aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF"))  
  

  const classes = useStyles();
  const theme = useTheme();

  const history = useHistory();
  

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

  //console.log('location', window.location.pathname)

  
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = useState({"status": false, "tipo": "success", "mesangem": ""});
  const [logo64, setLogo64] = useState('');
  const [openImage, setOpenImage] = useState(false);
  const [criarImagem, setCriarImagem] = useState('');

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  useEffect(() => {
    get64Logo()
  }, []);
  

  const get64Logo = async () => {
    const logo64 = await api.get('siteutil/LogoBase64/'+ aplicativoDados.appNome, {
      headers: {"Content-Type": "application/json"}
    })    
    setLogo64(logo64.data)
  }
  
  return (

      <Container>
      
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>


        <div className={classes.paper}>
          <Row>

            <Col xs={12} md={4} lg={3} >
              <img className={"apresentacao"} src={apresentacao_diaDasMulheres} />   
              <Button
                fullWidth
                onClick={() => {
                  setOpenImage(true)
                  setCriarImagem("diaDasMulheres")
                }}
                type="submit"
                variant="contained">Acessar</Button>
            </Col>

            <Col xs={12} md={4} lg={3} >
              <img className={"apresentacao"} src={apresentacao_revellion} />   
              <Button
                fullWidth
                onClick={() => {
                  setOpenImage(true)
                  setCriarImagem("revellion")
                }}
                type="submit"
                variant="contained">Acessar</Button>
            </Col>
            
            <Col xs={12} md={4} lg={3} >
              <img className={"apresentacao"} src={apresentacao_natal} />   
              <Button
                fullWidth
                onClick={() => {
                  setOpenImage(true)
                  setCriarImagem("natal")
                }}
                type="submit"
                variant="contained">Acessar</Button>
            </Col>


            <Col xs={12} md={4} lg={3} >
              <img className={"apresentacao"} src={apresentacao_blackFriday} />   
              <Button
                fullWidth
                onClick={() => {
                  setOpenImage(true)
                  setCriarImagem("blackFriday")
                }}
                type="submit"
                variant="contained">Acessar</Button>
            </Col>


            <Col xs={12} md={4} lg={3} >
              <img className={"apresentacao"} src={apresentacao_diaDosPais} />   
              <Button
                fullWidth
                onClick={() => {
                  setOpenImage(true)
                  setCriarImagem("diaDosPais")
                }}
                type="submit"
                variant="contained">Acessar</Button>
            </Col>

            

            <Col xs={12} md={4} lg={3} >
             
            </Col>
          </Row>
        </div>


        <Dialog
          open={openImage}
          TransitionComponent={Transition}
          fullScreen={fullScreen}
          keepMounted
          onClose={() => {setOpenImage(false)}}
          aria-labelledby="imagem-gerada-title"
          aria-describedby="imagem-gerada-description">
          <DialogContent>          
                {
                  logo64 ? 
                    (criarImagem === "diaDosPais" && <DiaDosPais logo={logo64}/>) 
                  : <CircularProgress color="inherit" />
                }
                {
                  logo64 ? 
                    (criarImagem === "blackFriday" && <BlackFriday logo={logo64}/>) 
                  : <CircularProgress color="inherit" />
                }
                {
                  logo64 ? 
                    (criarImagem === "natal" && <Natal logo={logo64}/>) 
                  : <CircularProgress color="inherit" />
                }

                {
                  logo64 ? 
                    (criarImagem === "revellion" && <Revellion logo={logo64}/>) 
                  : <CircularProgress color="inherit" />
                }

                {
                  logo64 ?    
                    (criarImagem === "diaDasMulheres" && <DiaDasMulheres logo={logo64}/>) 
                  : <CircularProgress color="inherit" />
                }


          </DialogContent>
          <DialogActions>
            <Button onClick={() =>{setOpenImage(false)}} >
              voltar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

  );
}
