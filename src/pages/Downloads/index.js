import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';


import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';




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


export default function Downloads() {

  const [aplicativoDados, setAplicativoDados] = useState(JSON.parse(localStorage.getItem("aplicativoCF")))

  const classes = useStyles();

  const history = useHistory();

  useEffect(() => {
    setInterval(() => {
      if(JSON.stringify(aplicativoDados) != localStorage.getItem("aplicativoCF") ){
        setAplicativoDados( JSON.parse(localStorage.getItem("aplicativoCF")) )
      }
    }, 1500);
  });
  

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

  
  const [loading, setLoading] = React.useState(window.location.pathname.includes('/escolha') ? false : true);
  const [tentativasDirecionamento, setTentativasDirecionamento] = React.useState(window.location.pathname.includes('/escolha') ? 1 : 0);
  const [alert, setAlert] = useState({"status": false, "tipo": "success", "mesangem": ""});

  const android = navigator.userAgent.includes('Android')
  const iphone = navigator.userAgent.includes('iPad') || navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('Mac OS')

  if(!tentativasDirecionamento){
    setTentativasDirecionamento(1)
    if(android){
      if(aplicativoDados.urlAppAndroid){
        window.location.href= 'https://play.app.goo.gl/?link='+ aplicativoDados.urlAppAndroid
      }
      setLoading(false)
    }else if(iphone){
      if(aplicativoDados.urlAppIphone){
        window.location.href= aplicativoDados.urlAppIphone
      }
      setLoading(false)
    }else{
      history.push(`/`) 
    }  
  }
  
  return (

      <Container>
      
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>


      <div className={classes.paper}>
      <img src={aplicativoDados.urlLogo} style={{"height": "150px"}} alt="" />
      <Typography component="h1" variant="h5" className="mt-3 mb-3">
        Selecione a melhor opção para acessar o aplicativo
      </Typography>
      

      <Button
      
      type="submit"
      variant="contained"
      color="primary"
      onClick={( ) => { history.push(`/`) }}
      className="mt-2 mb-2"
      style={{"background": aplicativoDados.corPadrao}}
      > Aplicativo Web </Button>

      {
        aplicativoDados.urlAppAndroid && <Button
        
        type="submit"
        variant="contained"
        color="primary"
        className="mt-2 mb-2"
        onClick={( ) => { window.location.href= 'https://play.app.goo.gl/?link='+ aplicativoDados.urlAppAndroid }}
        style={{"background": aplicativoDados.corPadrao}}
        > Play Store (Android) </Button>
      }

      {
        aplicativoDados.urlAppIphone && <Button
        
        type="submit"
        variant="contained"
        color="primary"
        onClick={( ) => { window.location.href=aplicativoDados.urlAppIphone }}
        className="mt-2 mb-2"
        style={{"background": aplicativoDados.corPadrao}}
        > App Store (Iphone) </Button>
      }



      </div>
      </Container>

  );
}
