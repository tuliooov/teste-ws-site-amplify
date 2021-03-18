import React from 'react';
import './styles.css';
import Cabecalho from '../Global/cabecalho';

import { Row, Col } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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

export default function Cartelas() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioCF"))
  const cartelas = usuarioLogado.cartelas

  const classes = useStyles();



  const [openHistorico, setOpenHistorico] = React.useState(false);
  const [openRegulamento, setOpenRegulamento] = React.useState(false);
  

  const el = document.createElement( 'span' );

  const [textoRegulamento, setTextoRegulamento] = React.useState(el);
  const [textoHistoricoCartela, setTextoHistoricoCartela] = React.useState("vazio");
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));




  const closeHistoricoFuncao = () =>{
    setOpenHistorico(false)
  }

  const closeRegulamentoFuncao = () =>{
    setOpenRegulamento(false)
  }


  return (
    <>
      <Cabecalho nomeUsuarioFidelidade={true} voltarApenasFidelidade={true}></Cabecalho>
      <div className="container container-Fidelidade">
        <Row className="rowGlobalFidelidade">
          <Col xs={12} md={12} lg={12} >
            <Typography gutterBottom variant="h5" >
              Programa de Fidelidade
          </Typography>
          </Col>

          {cartelas.length

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
                }}>Historico</Button>


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
                }}>Historico</Button>


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
            Registre um selo <b>Lendo um QRCode</b><br></br>              
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
            {textoHistoricoCartela.length > 0 ? textoHistoricoCartela : "Sem Historico"}
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

              { openRegulamento && (setTimeout(() => {
                document.getElementById("textoRegulamento").appendChild(textoRegulamento)
              }, 100))}

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={closeRegulamentoFuncao} color="primary">
            Fechar
          </Button>          
        </DialogActions>
      </Dialog>

      </div>
    
      {/* 
        <Rodape valor="Fidelidade"></Rodape>
      */}





      

    </>
  );
}