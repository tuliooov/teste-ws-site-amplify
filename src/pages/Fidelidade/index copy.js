import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import './styles.css';
import Cabecalho from '../Global/cabecalho';
import Rodape from '../Global/rodape';
import * as Sentry from "@sentry/react";
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

import {
  identificarEstabelecimentoSelecionado
} from '../../services/functions';
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

export default function Fidelidade() {
  const history = useHistory();
  const [usuarioLogado, setUsuarioLogado]= useState(JSON.parse(localStorage.getItem("usuarioCF")))
  const cartelas = usuarioLogado.cartelas
  const aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF"))
  const [estabelecimentoAtual, setEstabelecimentoAtual] = useState(JSON.parse(localStorage.getItem("estabelecimentoAtualCF")));
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
              ? cartelas.map(cartela => (
    
    
                /* VERIFICAÇÃO */
                (cartela.status === 0)
                
                /* ATIVA */
                ? (<Col xs={12} md={6} lg={4} key={cartela.id}  style={{ "margin": "0.75em 0", "textAlign": "center" }} >
                  {/* cartela.diasExpiracao */}
                  <Card className={classes.root}>
                    <CardContent>
                      <img alt={"cartela de fidelidade"} src={cartela.promocaoFidelidade.estabelecimento.urlLogo} width={"150px"}></img>
                      {/*<Typography className={classes.title} color="textSecondary" gutterBottom>
                          {cartela.descricaoCartela}
                      </Typography>*/}
                      <Typography variant="h5" component="h2">
                        {cartela.promocaoFidelidade.premio}
                      </Typography>
                      <Typography className={classes.pos} color="textSecondary">
                        Validade: {cartela.dataValidadeTexto}
                      </Typography>
                      
                      <div>      
    
                        {/*SELOS PREENCHIDOS*/cartela.selos.length > 0 ? cartela.selos.map(selo =>(
                          <FavoriteIcon key={selo.id}/> 
                        )) : null}
    
                        {/*SELOS FALTANTES*/function(){
                          let rows = []
                          for(let i =0 ; i <  (cartela.promocaoFidelidade.quantidadeNecessaria - cartela.selos.length); i++){
                            rows.push( <FavoriteBorderIcon key={i}/>)
                          }
                          return rows
                        }()}
                        
                      </div>
                    
                    </CardContent>
                    <CardActions>
                    <Button size="small" onClick={() =>{
                      let texto = []
                      cartela.selos.map(selo =>(
                        texto.push(<span key={selo.id}>{selo.dataHoraAtribuicaoTexto}<br></br></span>)
                      ))
                      setTextoHistoricoCartela(texto)
                      setOpenHistorico(true)
                    }}>Histórico</Button>
    
    
                    <Button size="small" onClick={() =>{
                      const el = document.createElement( 'span' );
                      el.innerHTML = cartela.promocaoFidelidade.regulamento.texto
                      setTextoRegulamento(el)
                      setOpenRegulamento(true) 
                     
                    }}>Regulamento</Button>
                    </CardActions>
                  </Card>
                </Col>)
    
                /* VENCIDA */
                : (<Col xs={12} md={6} lg={4} key={cartela.id}  style={{ "margin": "0.75em 0", "textAlign": "center" }} >
                <Card className={classes.root}>
                  <CardContent>
                    <img alt={"cartela de fidelidade"} src={cartela.promocaoFidelidade.estabelecimento.urlLogo} width={"150px"}></img>
                    {/*<Typography className={classes.title} color="textSecondary" gutterBottom>
                        {cartela.descricaoCartela}
                    </Typography>*/}
                    <Typography variant="h5" component="h2">
                      {cartela.promocaoFidelidade.premio}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      Validade: {cartela.dataValidadeTexto}
                    </Typography>
                    
                    <div>      
    
                      { cartela.descricaoCartela }
                      
                    </div>
                  
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() =>{
                      let texto = []
                      cartela.selos.map(selo =>(
                        texto.push(<span key={selo.id}>{selo.dataHoraAtribuicaoCartela}<br></br></span>)
                      ))
                      setTextoHistoricoCartela(texto)
                      setOpenHistorico(true)
                    }}>Histórico</Button>
    
    
                    <Button size="small" onClick={() =>{
                       const el = document.createElement( 'span' );
                       el.innerHTML = cartela.promocaoFidelidade.regulamento.texto
                       setTextoRegulamento(el)
                       setOpenRegulamento(true)  
                    }}>Regulamento</Button>
                  </CardActions>
                </Card>
              </Col>)))
            
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