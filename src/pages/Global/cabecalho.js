import React from 'react';
import { useHistory } from 'react-router-dom';
import { RiArrowLeftLine } from 'react-icons/ri';
/*import { Button, Navbar, Nav, NavDropdown } from 'react-bootstrap';


import './styles.css';*/
import LocationOnIcon from '@material-ui/icons/LocationOn';
import {
  identificarEstabelecimentoSelecionado
} from '../../services/functions';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { fade, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';




const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    flexGrow: "1",
    top: "0",
    width: "100%",
    zIndex: "999",
    cursor: "pointer",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    textTransform: "capitalize",
    flexGrow: 1,
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  titleProduto: {
    textTransform: "uppercase",
    position: "absolute",
    right: 0,
    flexGrow: 0,
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      width: 'auto',
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '150px',
    [theme.breakpoints.up('lg')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  voltarIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    left: "0",
    fontSize: "1.5rem",
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));



export default function Cabecalho(props) {
  const history = useHistory();

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioCF"))


  const estabelecimentoAtual = JSON.parse(localStorage.getItem("estabelecimentoAtualCF"))
  const aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF"))
  const aberto = estabelecimentoAtual?.online
  
  const desconctarMesa = () =>{
    /* 
     localStorage.removeItem('backupItensCarrinhoCF');
    localStorage.removeItem('PedidoCanceladoBackupCF');
    localStorage.removeItem('usuarioPedidoMesaCF');
    localStorage.removeItem('produtoSelecionadoCF');
    localStorage.removeItem('ultimoPedidoCF');
    localStorage.removeItem('cardapioCF');
    localStorage.removeItem('carrinhoCF');
    localStorage.removeItem('usuarioCF');
    localStorage.removeItem('enderecoAtualCF');
    localStorage.removeItem('estabelecimentoAtualCF');


    localStorage.removeItem('dateCardapioCF');
    localStorage.removeItem('usuarioPedidoMesaCF_Date');
    */
    localStorage.clear()
    history.push(`/`)
  }
  
  const classes = useStyles();
    if(props.visualizacao){
      return (
        <div className={classes.root} id="cabecalhoApp">
          <AppBar position="static" className="cabecalhoApp">
            <Toolbar  className="container"  >
                <Typography className={classes.title} variant="h6" noWrap>
                  Cardápio {estabelecimentoAtual ? (estabelecimentoAtual.nomeAlternativo ? estabelecimentoAtual.nomeAlternativo : estabelecimentoAtual.nome) : aplicativoDados.projectName}
                </Typography>
            </Toolbar>
          </AppBar>
        </div>
        
      )
    }else if(usuarioLogado?.logado){
      return (
        <div className={classes.root} id="cabecalhoApp">
          <AppBar position="static" className="cabecalhoApp">
            <Toolbar  className="container"  >
              
              {(props.mesaHistorico)
              ?(<>
                 <div
                    className={classes.voltarIcon}
                    color="inherit"
                    onClick={() => history.goBack()} 
                    aria-label="open drawer"
                  > 
                    <RiArrowLeftLine ></RiArrowLeftLine>
                  </div>
                  <Typography className={classes.titleProduto}  style={{"width": "calc( 100% - 57px)"}} variant="h6" noWrap>
                    {props.mesaHistorico}
                  </Typography>
                </>) 
              : null
              }

              {(props.mesa)
              ?(<>
                  <Typography className={classes.title} variant="h6" noWrap style={{"textTransform": "uppercase"}}>
                    {props.mesa}
                  </Typography>

                  {
                    estabelecimentoAtual.permitirDesconectarMesa
                    ? <Button variant="contained" style={{"background": "#28a745", "color":"white"}} onClick={desconctarMesa}>
                        Desconectar
                      </Button>
                    : null
                  }
                  
                </>) 
              : null
              }


              {(props.statusEstabelecimento && props.nomeEstabelecimentoCardapio)
              ?(<>
                  <Typography className={classes.title} variant="h6" noWrap>
                    {estabelecimentoAtual ? (estabelecimentoAtual.nomeAlternativo ? estabelecimentoAtual.nomeAlternativo : estabelecimentoAtual.nome) : aplicativoDados.projectName}
                  </Typography>
                  <Button variant="contained" style={aberto ? (estabelecimentoAtual.pausado ? {"background": "#ffc107", "color":"black"} : {"background": "#28a745", "color":"white"}) : {"background": "#dc3545", "color":"white"}} >
                    {aberto ? (estabelecimentoAtual.pausado ? "Pausado": "Aberto") : `Fechado`}
                  </Button>
                </>) 
              : null
              }
    
              {(props.nomeUsuario)
              ?(<>
                  <Typography className={classes.title}  variant="h6" noWrap>
                    {usuarioLogado.cliente ? usuarioLogado.cliente.nome : ''}
                  </Typography>             
                </>) 
              : null
              }

              {(props.nomeUsuarioFidelidade)
              ?(<>
                  <Typography className={classes.titleProduto} style={{"width": "calc( 100% - 57px)"}} variant="h6" noWrap>
                    {usuarioLogado.cliente ? usuarioLogado.cliente.nome : ''}
                  </Typography>             
                </>) 
              : null
              }
              
              {/* NOME */}
              { (props.produtoNome && props.voltarApenasFidelidade)
              
              ?  (<>
              <div
                  edge="start"
                  className={classes.voltarIcon}
                  color="inherit"
                  onClick={() => history.goBack()}
                  aria-label="open drawer"
                > 
                <RiArrowLeftLine ></RiArrowLeftLine>
                </div>
                <Typography className={classes.titleProduto} style={{"width": "calc( 100% - 57px)"}} variant="h6" noWrap>
                    {props.produtoNome}
                  </Typography>
                  </>)
              : null}
            
    
              
    
              {(!props.produtoNome && props.voltarApenasFidelidade) ? (<div
                  edge="start"
                  className={classes.voltarIcon}
                  color="inherit"
                  onClick={() => history.goBack()}
                  aria-label="open drawer"
                > 
                <RiArrowLeftLine ></RiArrowLeftLine>
                </div>) : null}
              
                {(props.nomeEstabelecimentoLojas)
                ?(<>
                    <Typography className={classes.title}  style={{"width": "calc( 100% - 125px)"}} variant="h6" noWrap>
                      {aplicativoDados.projectName}
                    </Typography>
                   <Button variant="contained" onClick={() => history.push(`/delivery/enderecos${identificarEstabelecimentoSelecionado(aplicativoDados)}`) }>
                      <LocationOnIcon/> Enderecos
                    </Button>
                  </>) 
                : null
                }

    
              {props.produtoNome && props.voltar
              ?(<>
                  
                  <div
                    className={classes.voltarIcon}
                    color="inherit"
                    onClick={() => history.goBack()} 
                    aria-label="open drawer"
                  > 
                    <RiArrowLeftLine ></RiArrowLeftLine>
                  </div>
                  <Typography className={classes.titleProduto}  style={{"width": "calc( 100% - 57px)"}} variant="h6" noWrap>
                    {props.produtoNome}
                  </Typography>
                  
                </>)
              : null}
    
            </Toolbar>
          </AppBar>
        </div>
        
        )
    }else{
      return (
        <div className={classes.root} id="cabecalhoApp">
        <AppBar position="static" className="cabecalhoApp">
          <Toolbar  className="container"  >            
            
                {props.produtoNome && props.voltar
                ?(<>
                  
                  <div
                    className={classes.voltarIcon}
                    color="inherit"
                    onClick={() => history.goBack()} 
                    aria-label="open drawer"
                  > 
                    <RiArrowLeftLine ></RiArrowLeftLine>
                  </div>

                  <Typography className={classes.titleProduto} style={{"width": "calc( 100% - 57px)"}} variant="h6" noWrap>
                    {props.produtoNome}
                  </Typography>
                </>)
              : null}


                {(props.clienteFielStart)
                ?(<>
                    <Typography className={classes.title}  style={{"width": "calc( 100% - 125px)"}} variant="h6" noWrap>
                    {estabelecimentoAtual ? (estabelecimentoAtual.nomeAlternativo ? estabelecimentoAtual.nomeAlternativo : estabelecimentoAtual.nome) : aplicativoDados.projectName}

                    </Typography>
                  </>) 
                : null
                }

                {(props.nomeEstabelecimentoCardapio)
                ?(<>
                    <Typography className={classes.title}  style={{"width": "calc( 100% - 125px)"}} variant="h6" noWrap>
                    {estabelecimentoAtual ? (estabelecimentoAtual.nomeAlternativo ? estabelecimentoAtual.nomeAlternativo : estabelecimentoAtual.nome) : aplicativoDados.projectName}

                    </Typography>
                    <Button variant="contained" style={aberto ? (estabelecimentoAtual.pausado ? {"background": "#ffc107", "color":"black"} : {"background": "#28a745", "color":"white"}) : {"background": "#dc3545", "color":"white"}} >
                      {aberto ? (estabelecimentoAtual.pausado ? "Pausado": "Aberto") : `Fechado`}
                    </Button>
                  </>) 
                : null
                }


                {(props.nomeEstabelecimentoLojas)
                ?(<>
                    <Typography className={classes.title}  style={{"width": "calc( 100% - 125px)"}} variant="h6" noWrap>
                      {aplicativoDados.projectName}
                    </Typography>
                   <Button variant="contained" onClick={() => history.push(`/login`)}style={ {"background": "#28a745", "color":"white"}} >
                      Fazer Login
                    </Button>
                  </>) 
                : null
                }
              
          </Toolbar>
        </AppBar>
      </div>       
      )
    }
}