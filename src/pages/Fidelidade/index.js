import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import './styles.css';
import Cabecalho from '../Global/cabecalho';
import Rodape from '../Global/rodape';
import * as Sentry from "@sentry/react";

import ErrorIcon from '@material-ui/icons/Error';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';

import {
  AtualizarDispositivoUsuario,
  identificarEstabelecimentoSelecionado
} from '../../services/functions';
import api from '../../services/api';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Row, Col } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import fidelidadeVazia from '../../assets/love-flat.svg';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';


/* HISTORICO */
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';


const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

function dataSelo(text){
  const data = new Date(text)
  return (data.toISOString().substr(0, 10).split('-').reverse().join('/') + " " + data.getHours()+":"+data.getMinutes())
}

export default function Fidelidade() {
  const history = useHistory();
  const [estabelecimentoAtual, setEstabelecimentoAtual] = useState(JSON.parse(localStorage.getItem("estabelecimentoAtualCF")));
  const [usuarioLogado, setUsuarioLogado]= useState(JSON.parse(localStorage.getItem("usuarioCF")))
  const cartelas = usuarioLogado.cartelas
  const aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF"))

  const classes = useStyles();



  const [openHistorico, setOpenHistorico] = React.useState(false);
  const [openRegulamento, setOpenRegulamento] = React.useState(false);
  

  const el = document.createElement( 'span' );
  const [loadingUsuario, setLoadingUsuario] = React.useState(true);
  const [textoRegulamento, setTextoRegulamento] = React.useState(el);
  const [textoHistoricoCartela, setTextoHistoricoCartela] = React.useState("vazio");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const atualizarUsuario = async () => {
    localStorage.setItem('dateUsuarioCF', new Date())
    try {
      const clientefiel = {
        "appNome": aplicativoDados.appNome,
        "cliente":{
          "email": usuarioLogado.cliente.email,
          "hashSenha": usuarioLogado.cliente.hashSenha, 
          "appNome": aplicativoDados.appNome,
          "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
        },
        "localizacao":{
          "latitude": "",
          "longitude": "",
          "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
          "appNome": aplicativoDados.appNome,
        },
        "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
      }
      await api.post('clientefiel/LoginGeral', clientefiel, {
        headers: {"Content-Type": "application/json"}
      }).then((response)=>{
        console.log('LoginGeral', response)
        if(response.data.codErro > 0 ){        
          if(response.data.mensagem.includes("inseridos estão incorretos.")){
            localStorage.clear()
            history.push(`/`)
          }
        }else{

          if(localStorage.getItem('tokenNotificationFirebase')){
            if( response.data.cliente.codigoDispositivo !== localStorage.getItem('tokenNotificationFirebase') ){
              response.data.cliente.codigoDispositivo = localStorage.getItem('tokenNotificationFirebase')
              response.data.cliente.token = `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`
              AtualizarDispositivoUsuario(response.data.cliente, aplicativoDados)
            }
          }

          setUsuarioLogado(response.data)
          localStorage.setItem('usuarioCF', JSON.stringify(response.data));
          console.log(" ===== usuario atualizado em tela de fidelidade ===== ") 
        }
      });
    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`${aplicativoDados.appNome} - ${error} - AtualizarUsuario`);
      // alertStart("Erro inesperado ao atualizar usuario", "error")
    }

    setLoadingUsuario(false)
  }
  
  useEffect(() => {
    atualizarUsuario()
  }, []);
  

  const closeHistoricoFuncao = () =>{
    setOpenHistorico(false)
  }

  const closeRegulamentoFuncao = () =>{
    setOpenRegulamento(false)
  }


  return (
    <>
      <Cabecalho nomeUsuario={true}></Cabecalho>
      <div className="container container-Fidelidade">
        <Row className="rowGlobalFidelidade">
          <Col xs={12} md={12} lg={12} >
            <Typography gutterBottom variant="h5" >
              Programa de Fidelidade
          </Typography>
          </Col>

          { loadingUsuario 
            ? <Col  xs={12} md={12} lg={12} style={{"textAlign": "center", "marginTop": "3em"}}>
                <CircularProgress color="inherit" />
                <Typography color="textSecondary" gutterBottom>
                        Atualizando Cartelas
                </Typography>
              </Col>
            : cartelas?.length

            // TEM CARTELAS
            
              ? cartelas.map((cartela, index) => (
                <React.Fragment key={index}>
                  <Col xs={12} md={6} lg={4} key={index} style={{"margin": "1em 0"}}  >
                      
                      <Card className={classes.root} style={{"height": "100%"}}>
                        <CardActionArea  style={{ "height": "calc(100% - 30px)", "flexFlow": "column-reverse", "alignItems": "normal"}}>
                          
                          <Row style={{"margin":0,"textAlign": "center", "width": "100%", "padding": "1em", "alignItems": "center"}}>
                            <Col xs={3} md={3} lg={3} style={{"padding":0}}>
                              <CardMedia
                                component="img"
                                className={"logoLojas"}
                                alt={cartela.promocaoFidelidade.estabelecimento.nome}
                                image={cartela.promocaoFidelidade.estabelecimento.urlLogo}
                                title={cartela.promocaoFidelidade.estabelecimento.nome}
                              />
                            </Col>
                            <Col xs={9} md={9} lg={9}>

                             {
                               !(cartela.descricaoCartela).includes("Em Cadastro") && <Typography className={"StatusEstabelecimento"} variant="body2"  component="p">
                                { (cartela.descricaoCartela).includes("Completa") 
                                  ? <><ErrorIcon style={{"fontSize": "initial", "color":"#ffc107"}}/> Completa</> 
                                  : ( (cartela.descricaoCartela).includes("Resgatada") 
                                    ? <><CheckCircleIcon style={{"fontSize": "initial", "color":"#28a745"}}/> Resgatada</> 
                                    : (cartela.descricaoCartela).includes("Expirada") 
                                      ? <><CancelIcon style={{"fontSize": "initial", "color":"#dc3545"}}/> Expirada</> 
                                      : null)}

                                      {/* (cartela.descricaoCartela).includes("Em Cadastro") 
                                        ? <><HourglassFullIcon style={{"fontSize": "initial"}}/> Carregando</> 
                                        : null) */}
                              </Typography>}


                              <Typography className={"StatusEstabelecimento"} variant="body2"  component="p">
                                { cartela.promocaoFidelidade.estabelecimento.nome }
                                {/* { cartela.status === 0 ? " ativa" : " vencida" } */}
                                {/* {cartela.promocaoFidelidade.estabelecimento.online ? <><CheckCircleIcon style={{"fontSize": "initial", "color":"#28a745"}}/> Aberto</> : <><CancelIcon style={{"fontSize": "initial"}}/> Fechado</>} */}
                              </Typography>

                              <Typography gutterBottom  component="h2" className={"nomeLoja"}>                    
                                { cartela.promocaoFidelidade.premio }
                              </Typography>
                              <Typography variant="body2" color="textSecondary" component="p" className={"descricaoLoja"}>
                                { cartela.descricaoCartela }
                              </Typography>
                              <Typography variant="body2" color="textSecondary" component="p" className={"descricaoLoja"}>
                                Validade: {cartela.dataValidadeTexto}
                              </Typography>
                              {/* <Typography variant="body2" color="textSecondary" component="p">
                                {cartela.promocaoFidelidade.estabelecimento.tempoEntregaTexto}
                              </Typography> */}

                               {
                                 cartela.status == 0
                                 ? <>
                                    {/*SELOS PREENCHIDOS*/cartela.selos.length > 0 ? cartela.selos.map(selo =>(
                                    <FavoriteIcon style={{"fontSize": "1.3rem"}} key={selo.id}/> 
                                    )) : null}

                                    {/*SELOS FALTANTES*/function(){
                                      let rows = []
                                      for(let i =0 ; i <  (cartela.promocaoFidelidade.quantidadeNecessaria - cartela.selos.length); i++){
                                        rows.push( <FavoriteBorderIcon style={{"fontSize": "1.3rem"}} key={i}/>)
                                      }
                                      return rows
                                    }()}
                                 </>
                                 : null
                               }
                                
                            </Col>
                          
                          </Row>
                          
                          <CardContent style={{"padding": "0 16px"}}>
                          
                          </CardContent>
                        </CardActionArea>
                        <CardActions style={{"padding":"0"}}>
      
                          
                          <Button size="small" className={"botaoCinza naoArredondado"} 
                            onClick={() =>{
                              let texto = []
                              cartela.selos.map(selo =>(
                                // texto.push(<span key={selo.id}>{ dataSelo(selo.dataHoraAtribuicaoCartela) }<br></br></span>)
                                texto.push(<span key={selo.id}>{ selo.dataHoraAtribuicaoTexto }<br></br></span>)
                              ))
                              setTextoHistoricoCartela(texto)
                              setOpenHistorico(true)
                            }}>
                              Historico
                            </Button>
      
                            <Button size="small" className={"botaoCinza naoArredondado"} 
                              onClick={() =>{
                                const el = document.createElement( 'span' );
                                el.innerHTML = cartela.promocaoFidelidade.regulamento.texto
                                setTextoRegulamento(el)
                                setOpenRegulamento(true)  
                            }}>
                              Regulamento
                            </Button>
                          
                        </CardActions>
                      </Card>
                    </Col>
              </React.Fragment> ))

              //SEM CARTELAS
              : (<Col xs={12} md={12} lg={12} >
                Você não possui nenhuma cartela de fidelidade!<br></br><br></br>
                Registre um selo <b>Lendo um QRCode</b> ou <b>Fazendo um Pedido</b> na plataforma para iniciar uma nova cartela.  <br></br>  
                <Button variant="contained" onClick={() => {
                  history.push(`/delivery${identificarEstabelecimentoSelecionado(aplicativoDados)}`)
                }} className="mt-3" style={{"background": `#28a745`, "color":"white"}} /*style={{"background": `${aplicativoDados.corSitePrimaria}`, "color":"white"}}*/ >Realizar um Pedido
              </Button>  
    
              <div className="divImageCentroCardapio" >
                <img src={fidelidadeVazia} alt={"sem cartelas de fidelidade"} className="pretoEBranco" style={{"marginTop": "2em"}}/>
              </div> 
              </Col>)
          }
          


        </Row>




        <Dialog
        fullScreen={fullScreen}
        open={openHistorico}
        onClose={closeHistoricoFuncao}
        aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">{"Histórico da Cartela"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {textoHistoricoCartela.length > 0 ? textoHistoricoCartela : "Sem Histórico"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={closeHistoricoFuncao} color="primary">
            Fechar
          </Button>
          {/* <Button onClick={historicoClose} color="primary" autoFocus>
            Agree
          </Button> */}
        </DialogActions>
      </Dialog>


      <Dialog
        fullScreen={fullScreen}
        open={openRegulamento}
        onClose={closeRegulamentoFuncao}
        aria-labelledby="responsive-dialog-regulamento">
        <DialogTitle id="responsive-dialog-regulamento">{"Regulamento Programa de Fidelidade"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="textoRegulamento">

              { openRegulamento ? (setTimeout(() => {
                document.getElementById("textoRegulamento").appendChild(textoRegulamento)
              }, 100)) : null}

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={closeRegulamentoFuncao} color="primary">
            Fechar
          </Button>          
        </DialogActions>
      </Dialog>

      </div>
      <Rodape valor="Fidelidade"></Rodape>





      

    </>
  );
}