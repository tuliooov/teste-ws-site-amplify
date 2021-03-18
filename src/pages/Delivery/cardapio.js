import React, { Component, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import QrReader from 'react-qr-reader'
import * as Sentry from "@sentry/react";
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import {Card,  Row, Col, Container } from 'react-bootstrap';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import StarsIcon from '@material-ui/icons/Stars';
import CachedIcon from '@material-ui/icons/Cached';
import ReactPixel from 'react-facebook-pixel';
import LinearProgress from '@material-ui/core/LinearProgress';
import Skeleton from '@material-ui/lab/Skeleton';


import {
  CadastrarUsuario,
  eventoTagManager,
  ObterEnderecosComTaxaEntrega,
  CadastrarCartaoCliente,
  BuscarPedidosCliente,
  ObterCartoesCredito,
  BuscarUltimoPedidoCliente,
  EstabelecimentoAberto,
  ObterCardapioPedidoMesa,
  ObterCardapioCompletoV1,
  ObterCardapio,
  CadastrarPedido,
  AtualizarDispositivoUsuario,
  AtualizarStatusPedido,
  LoginGeral,
  ObterCupomDescontoCompleto,
  removeAcento,
  isNumeric, 
  getMoney,
  formatReal,
  TestaCPF,
  CadastrarEnderecoCliente,
  identificarEstabelecimentoSelecionado,
} from '../../services/functions';


import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

import InfoCardapio from "./infoCardapio"
import ClearIcon from '@material-ui/icons/Clear';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
//loading
//import Loading from '../loading';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
//alert
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import Prato from '../../assets/pratos.svg';
import Megafone from '../../assets/megafone.svg';
import Comida from '../../assets/comida.svg';
import DesenvolvidoPor from '../../assets/desenvolvidoPor.png';
import {fade, makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ListIcon from '@material-ui/icons/List';
import ViewColumnOutlinedIcon from '@material-ui/icons/ViewColumnOutlined';

import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import TextField from '@material-ui/core/TextField';

import Slide from '@material-ui/core/Slide';

import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import PaymentIcon from '@material-ui/icons/Payment';

import AlertFixo from '@material-ui/lab/Alert';
import Carrinho from './carrinho'

/* carrinho */
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';


import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import api from '../../services/api';
/*import './styles.css';*/


import Divider from '@material-ui/core/Divider';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MotorcycleIcon from '@material-ui/icons/Motorcycle';

import ListSubheader from '@material-ui/core/ListSubheader';
import carrinhoVazio from '../../assets/cart-empty-flat.gif';


import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
// import Estabelecimentos from '../Deslogado/estabelecimentos';


import ButtonGroup from '@material-ui/core/ButtonGroup';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import OpcoesProdutos from './opcoesProdutos';




function AvatarTipoEntrega(props){
  return(
    <Avatar>
      {
        props.retirada
        ? <DirectionsWalkIcon />
        : <MotorcycleIcon />
      }
    </Avatar>
  )
}



function TabPanel(props) {
  const { children, ...other } = props;

  return (
    <div 
      role="tabpanel"
      {...other}
    >
      
        <Box p={3}>
          <div>{children}</div>
        </Box>
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
};



const useStyles = makeStyles((theme) => ({
  progress: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
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
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
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
  rootCardapio: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: '#f7f7f7',
  },
  root: {
    width: '100%',
    padding: "2em 0 2em 0",
  },
  heading: {
    textTransform: "uppercase",
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  devHeading:{   
    color: "#fff",  
  },
  rootProduto: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  backdrop: {
    zIndex: "99999",
    color: '#fff',
  },
  rootAlert: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  rootAlerts: {
    margin: "0 0 1em 0",
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  fixedMesa: {
    position: 'fixed',
    padding: '0!important',
    minHeight: '57px',
    zIndex: 1200,
    width: '100%!important', 
    borderRadius: '0!important',
    left: 0,
    bottom: '0px',
    boxShadow: 'none',
  },
  fixed: {
    position: 'fixed',
    // bottom: theme.spacing(9),
    // right: theme.spacing(2),
    padding: '0!important',
    minHeight: '57px',
    zIndex: 1200,
    width: '100%!important', 
    borderRadius: '0!important',
    left: 0,
    bottom: '56px',
    boxShadow: 'none',
  },
  rootCarrinho: {
    width: '100%',
    //maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const android = navigator.userAgent.includes('Android')
const iphone = navigator.userAgent.includes('iPad') || navigator.userAgent.includes('iPhone') //|| navigator.userAgent.includes('Mac OS')


const ajustarCardapioQuantidade = (ajustarCardapio) => {
  //console.log("ajustarCardapio", ajustarCardapio)
  ajustarCardapio.categorias.forEach(categoria => {
    categoria.produtos.forEach(produto => {
      produto.quantidade = 0
    })
  });
  return ajustarCardapio;
}

export default function Cardapio(props) {
  
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  //loading

  const aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF"))

  const usuarioIzza = JSON.parse(localStorage.getItem("usuarioIzzaCF"))  
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioCF"))  
  const [nomeMesa, setNomeMesa] = useState(usuarioLogado?.cliente?.nome.replace('Mesa ', '')); 


  const valorTotalItens = () => {
    let total = 0;
    if(carrinho?.pedido?.itens?.length > 0){
      carrinho.pedido.itens.forEach(item => {
        total += item.valorProdutoHistorico
      });
    }
    return total
  }

  const tempCart = JSON.parse(localStorage.getItem('carrinhoCF'))
  if(!tempCart?.data || (new Date() - new Date(tempCart?.data)) > 3600000 ){
    try {
      tempCart.pedido.itens = []
      localStorage.setItem("carrinhoCF", JSON.stringify(tempCart))
    } catch (error) {
      //Sentry.captureMessage(localStorage.getItem('versao')+`buscar itens pro carrinho - ${aplicativoDados?.appNome} - ${error}`);
    }
  }

  
  const [carrinho, setCarrinho] = useState(JSON.parse(localStorage.getItem("carrinhoCF"))); 
  const [estabelecimentoAtual, setEstabelecimentoAtual] = useState(JSON.parse(localStorage.getItem("estabelecimentoAtualCF")));
  const [cardapio, setCardapio] = useState(JSON.parse(localStorage.getItem("cardapioCF")));
  const [carrinhoOpen, setCarrinhoOpen] = useState(false);
  const [pagamentoOpen, setPagamentoOpen] = useState(false);
  const [formaDePagamento, setFormaDePagamento] = React.useState('');
  const [informacoesPedido, setInformacoesPedido] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [troco,  setTroco] = React.useState([false, '']);
  const [PagamentoOnline,  setPagamentoOnline] = React.useState([false, {}]);
  const [InformacoesDoTipoEntrega,  setInformacoesDoTipoEntrega] = React.useState(false);
  const [MeusCartoes,  setMeusCartoes] = React.useState([]);
  const [CriarCartao,  setCriarCartao] = React.useState(true);
  const [continuarSemCadastro,  setContinuarSemCadastro] = React.useState(false);
  const [TelaRetiradaOuEntrega,  setTelaRetiradaOuEntrega] = React.useState(false);
  const [MostrarFotoProduto,  setMostrarFotoProduto] = React.useState({});
  const [AbrirMostrarFotoProduto,  setAbrirMostrarFotoProduto] = React.useState(false);
  const [AdicionarCupom,  setAdicionarCupom] = React.useState(false);
  const [ultimoPedido, setUltimoPedido] = React.useState({});
  const [layoutCardapio, setLayoutCardapio] = useState(estabelecimentoAtual.adicionarItensNaTelaInicial ? "AdicionarInicial" : (aplicativoDados?.cardapioEmGrid ? "Grid" : "List")); //true = list || false = grid || 
  const [removeItem, setRemoveItem] = useState(false);
  const [removeItemSelecionado, setRemoveItemSelecionado] = useState(0);
  const [valueCategoria, setValueCategoria] = React.useState(0);
  const [RodarFuncaoAposIsso, setRodarFuncaoAposIsso] = React.useState('');
  const [qrCodeModal, setQrCodeModal] = React.useState(false);
  const [enderecoAtual, setEnderecoAtual] = useState(JSON.parse(localStorage.getItem("enderecoAtualCF")));
  
  const numeroMesas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];
  const usuarioPedidoMesa = JSON.parse(localStorage.getItem("usuarioPedidoMesaCF"))
  const temEndereco = !!enderecoAtual?.bairro
  const isEntregaNoEndereco =  !(enderecoAtual.taxaEntrega === -1 || carrinho?.pedido?.taxaEntrega === -1) && temEndereco
  const valorTaxaEntrega = ((carrinho?.pedido && carrinho?.pedido?.taxaEntrega !== null) ? carrinho?.pedido?.taxaEntrega  : enderecoAtual.taxaEntrega) || 0.0
  const isRetiradaNoLocal =  enderecoAtual?.id === "retirada"
  const isUsuarioPedidoMesa = usuarioPedidoMesa?.logado
  const isUsuarioIzzaBot = usuarioIzza?.logado
  const itensValor = carrinho?.pedido?.itens?.length > 0 ? valorTotalItens() : 0
  const isFreteGratisMinimoEntrega =  carrinho?.pedido?.itens?.length > 0 && (carrinho?.minimoEntregaGratis < 999  && carrinho?.minimoEntregaGratis > 0) && (itensValor > carrinho?.minimoEntregaGratis)
  const solicitarNomeAoFinalizar = !(isUsuarioPedidoMesa && aplicativoDados.solicitarNomePedidoMesa === false)
  const solicitarTelefoneAoFinalizar = !(isUsuarioPedidoMesa && aplicativoDados.solicitarTelefonePedidoMesa === false)
  const descontoCardapio = carrinho.percentualDescontoValor ? carrinho.percentualDescontoValor : (cardapio?.valorDesconto ? cardapio.valorDesconto : (carrinho?.valorDesconto ? carrinho.valorDesconto : 0))

  

  var prevScrollpos = window.pageYOffset;

  console.log('carrinho', carrinho)
  console.log('cardapio', cardapio)

  
  window.onscroll = function scrollFunction() {
    if(window.location.pathname === "/delivery"){
      if((iphone || android)){
        var currentScrollPos = window.pageYOffset;
        if( carrinho && carrinho.pedido && carrinho.pedido.itens.length > 0 ){
          if (prevScrollpos > currentScrollPos) {

            if(!usuarioPedidoMesa){
              if(document.getElementById("botaoCarrinho")) document.getElementById("botaoCarrinho").style.bottom = '56px';
              if(document.getElementById("RodapeComponente")) document.getElementById("RodapeComponente").style.bottom = '0px';
            }
  
          } else {
            if(!usuarioPedidoMesa){
              if(document.getElementById("botaoCarrinho")) document.getElementById("botaoCarrinho").style.bottom = '0px';
              if(document.getElementById("RodapeComponente")) document.getElementById("RodapeComponente").style.bottom = '-56px';
            }
            
          }
          prevScrollpos = currentScrollPos;
  
        }

        if((window.scrollY + 28  + document.getElementById('cabecalhoDeCategorias')?.offsetHeight) > document.getElementById('campoOpcoesProdutos')?.offsetTop){
          document.getElementById('cabecalhoDeCategorias').style.position = "fixed"
          document.getElementById('produtosDasCategorias').style.marginTop = "47px" //"45px"
          document.getElementById('cabecalhoDeCategorias').style.top = "0px"; //document.getElementById('cabecalhoApp').offsetHeight+'px'
          document.getElementById('cabecalhoDeCategorias').style.width = document.getElementById('produtosDasCategorias').offsetWidth+'px'
        }else if( document.getElementById('cabecalhoDeCategorias')){
          document.getElementById('cabecalhoDeCategorias').style.position = "static"
          document.getElementById('produtosDasCategorias').style.marginTop = "0"
          document.getElementById('cabecalhoDeCategorias').style.top = ""
        }
      }else{
        if((window.scrollY + 28 + document.getElementById('cabecalhoApp')?.offsetHeight  + document.getElementById('cabecalhoDeCategorias')?.offsetHeight) > document.getElementById('campoOpcoesProdutos')?.offsetTop){
          document.getElementById('cabecalhoDeCategorias').style.position = "fixed"
          document.getElementById('produtosDasCategorias').style.marginTop = "45px"
          document.getElementById('cabecalhoDeCategorias').style.top = document.getElementById('cabecalhoApp').offsetHeight+'px'
          document.getElementById('cabecalhoDeCategorias').style.width = document.getElementById('produtosDasCategorias').offsetWidth+'px'
        }else if( document.getElementById('cabecalhoDeCategorias')){
          document.getElementById('cabecalhoDeCategorias').style.position = "static"
          document.getElementById('produtosDasCategorias').style.marginTop = "0"
          document.getElementById('cabecalhoDeCategorias').style.top = ""
        }
      }

      

      const categorias = document.getElementsByClassName('CardCategoriaCol');
      for(let i = valueCategoria-1; i < categorias.length; i++ ){
        const atual = window.scrollY 
        const ultimo = categorias[categorias.length-1]?.offsetTop - 130
        const inicio = categorias[i]?.offsetTop - 130
        const ate = categorias[i+1]?.offsetTop - 130
        if(((atual > inicio) && (atual < ate))){
          const valor = categorias[i].id.replace("primerioC", '')
          setValueCategoria(i);
          break;
        }else if((atual > ultimo)){
          setValueCategoria((categorias.length-1));
          break;
        }
      }

      

    }
  }

  


  const alterarNoCardapio = (produtoSelecionado, quantidade) => {
    //altera o valor de quatnidade na tela
    cardapio.categorias.forEach(categoria=>{
      categoria.produtos.forEach(produto=>{
        if(produto.id == produtoSelecionado.id){
          produto.quantidade = quantidade
        }
      })
    })
    return cardapio
  }
  
  const removerProdutoCarrinho = (produto) => {
    //funcao para remover quantidade ou produto na tela de cardapio


    var temNoCarrinho = false;
    var novoCardapio = cardapio

    //verificar se exite o produto no carrinho
    //altera a quantidade ou remove do carrinho
    carrinho.pedido.itens.forEach((item, index) => {
      if(temNoCarrinho == false && item.produto.id == produto.id){
        const valorProduto = item.valorProdutoHistorico / item.quantidade 

        const qtdRemover = item.produto.qntMultiplicativaProdutos ? item.produto.qntMultiplicativaProdutos : 1
        item.quantidade -= qtdRemover

        // //console.log('item ', item)
        // //console.log('pedido', produto)
        // //console.log('quantidade minima', item.produto.qntMinimaProdutos)
        // //console.log('quantidade ', item.quantidade)
        if(item.quantidade == 0 || item.quantidade < item.produto.qntMinimaProdutos){
          item.quantidade = 0; // para item.quantidade < item.qntMinimaProdutos
          carrinho.pedido.itens.splice(index,1) //remvoer do carrinho
        }else{
          item.valorProdutoHistorico -= (valorProduto * qtdRemover)
          temNoCarrinho = true
        }
        //atualiza na tela
        novoCardapio = alterarNoCardapio(produto, item.quantidade);
      }
    })


    //atualiza os JSON's
    carrinho.data = new Date()
    localStorage.setItem('cardapioCF', JSON.stringify(novoCardapio))
    setCarrinho(novoCardapio)
    localStorage.setItem('carrinhoCF', JSON.stringify(carrinho))
    setCarrinho(carrinho)
    //console.log('carrinho ', carrinho)

    //calcula valor total
    calcularValorTotal()
  }
  
  const adicionarProdutoCarrinho = (produto) => {
    //funcao para adicionar produto na tela de cardapio

    if(produto.quantidade == produto.qntMaximaProdutos){
      alertStart(`Máximo ${produto.qntMaximaProdutos} já selecionado!`, "warning")
      return false
    }


    var temNoCarrinho = false;
    var novoCardapio = cardapio

    //verificar se exite o produto no carrinho
    //altera a quantidade ou adiciona no carrinho
    carrinho.pedido.itens.forEach(item => { //item == produto
      if(temNoCarrinho == false && item.produto.id == produto.id){
        const valorProduto = item.valorProdutoHistorico / item.quantidade 
        const qtdAdicionar = item.produto.qntMultiplicativaProdutos ? item.produto.qntMultiplicativaProdutos : 1
        item.quantidade += qtdAdicionar
        item.valorProdutoHistorico += (valorProduto * qtdAdicionar)
        temNoCarrinho = true

        //altera na tela
        novoCardapio = alterarNoCardapio(produto, item.quantidade);
      }
    })


    // se nao tiver no carrinho ele adiciona no carrinho
    if(temNoCarrinho == false){
      //console.log('adicionarProdutoCarrinho', produto)

      //limpando variaveis que o sistema adm nao aceita
      var produtoLimpo = JSON.parse(JSON.stringify(produto))
      delete produtoLimpo.valorDeCalculado
      delete produtoLimpo.valorRealCalculado
      delete produtoLimpo.quantidade
      const qtdAdd = produto.qntMinimaProdutos ? produto.qntMinimaProdutos : (produto.qntMultiplicativaProdutos ? produto.qntMultiplicativaProdutos : 1)
      const produtoProCarrinho = {
        "id": null,
        "produto": produtoLimpo,
        "quantidade": qtdAdd,
        "valorProdutoHistorico": produto.valor * qtdAdd,
        "itensOpcaoProduto": [],
        "observacao": '',
        "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
      } 
      produtoProCarrinho.valorProdutoHistorico *= produtoProCarrinho.quantidade
      carrinho.pedido.itens.push(produtoProCarrinho)

      //altera na tela
      novoCardapio = alterarNoCardapio(produto, produtoProCarrinho.quantidade);

    }

    //atualiza os JSON's

    localStorage.setItem('cardapioCF', JSON.stringify(novoCardapio))
    setCarrinho(novoCardapio)
    carrinho.data = new Date()
    localStorage.setItem('carrinhoCF', JSON.stringify(carrinho))
    setCarrinho(carrinho)
    //console.log('carrinho ', carrinho)

    //calcula valor total
    calcularValorTotal()
  }


  const mudarCategoria = (event, newValue) => {
    setValueCategoria(newValue);
  };

  const [openInformacoes, setOpenInformacoes] = React.useState(false);


  const buscarUltimoPedido = async () => {
      try {
        if(usuarioLogado.logado){
          const data = usuarioLogado.cliente
          data.token = `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`
          
          const retorno = await BuscarUltimoPedidoCliente(data, aplicativoDados)
        
          if(retorno.retornoErro){
            // verificar se o erro é pq não tem ultimo pedido
            // alertStart(retornoCep.mensagem, "error")
          }else{

            if(retorno == ""){
              localStorage.setItem('semUltimoPedido', "true")
            }else{
              localStorage.removeItem('semUltimoPedido')
            }
            
            if(retorno.status == 0){
              localStorage.setItem('atualizarUsuarioCF', true)
            }
            setUltimoPedido(retorno)
            
          }
        }
      } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions BuscarUltimoPedidoCliente - ${aplicativoDados.appNome} - ${error}`);
        alertStart("Procure os desenvolvedores! Erro BuscarUltimoPedidoCliente: "+error.message, "error")    
      }
  }  

  //alerts    
  const [alert, setAlert] = useState({"status": false, "tipo": "success", "mesangem": ""});

  function Alert(props) {
      return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  
  const alertStart = (msg, tipo) => {
      setAlert({"status": true, "tipo": tipo, "mesangem": msg});
  };

  const alertClose = (event, reason) => {
      if (reason === 'clickaway') {
          return;
      }
      setAlert({"status": false, "tipo": alert.tipo, "mesangem": alert.mesangem});
  };

  ////console.log("carrinho", carrinho)
  ////console.log("usuarioLogado", usuarioLogado)
  ////console.log("estabelecimentoAtual", estabelecimentoAtual)
  


  const verificarAberto = async () =>{
    ////console.log("atualizando aberto-fechado")    
    try {
      const resposta = await EstabelecimentoAberto(estabelecimentoAtual.id, aplicativoDados)
      //console.log("EstabelecimentoAberto", resposta)
      if(resposta.retornoErro){
        //algum erro verificarAberto
        // alertStart(response.mensagem, "error")
      }else{
        if(estabelecimentoAtual.online !== resposta.online || estabelecimentoAtual.pausado !== resposta.pausado){
          if(resposta.online){
            if(resposta.pausado){
              alertStart("O estabelecimento está aberto, porém pausado no momento!", "info")
            }else{
              alertStart("O estabelecimento está aberto!", "info")
            }
          }else{
            alertStart("O estabelecimento está fechado!", "info")
          }
          setTimeout(() => {
            estabelecimentoAtual.online = resposta.online
            estabelecimentoAtual.pausado = resposta.pausado
            setEstabelecimentoAtual(estabelecimentoAtual)
            localStorage.setItem('estabelecimentoAtualCF', JSON.stringify(estabelecimentoAtual))
            window.location.reload()
          }, 3000);
        }
      }

    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions EstabelecimentoAberto - ${aplicativoDados.appNome} - ${error}`);
      alertStart("Procure os desenvolvedores! Erro EstabelecimentoAberto: "+error.message, "error")    
    }
  }

  const quantidadeProdutos = () => {
    var qtd = 0
    carrinho.pedido.itens.forEach(item => {
      qtd += item.quantidade
    });
    return qtd
  } //carrinho.pedido?.itens.length
  const lerQrCodeComanda = () => {
    setQrCodeModal(true)
  }

  const enviarPedidoWhatsapp = async() => {
    setLoading(true)
    const carrinho = JSON.parse(localStorage.getItem('carrinhoCF'));
    let data = new Date();

    let dataPedido = `*Data*: ${data.toLocaleDateString()} - ${data.toLocaleTimeString()}%0A`
    let nome = `*Nome*: ${carrinho.pedido.nomePedido}%0A`
    let telefone = `*Telefone*: ${carrinho.pedido.telefonePedido}%0A`
    let formaPagamento = `*Forma de Pagamento*: ${carrinho.formaPagamentoDescricao}%0A`
    let trocoDinheiro = ''
    let observacaoPedido = ''
    if(carrinho.pedido.observacao){
      observacaoPedido = `*Observação*: ${carrinho.pedido.observacao}%0A`
    }
    if(carrinho.pedido.formaPagamento.id == 1 && carrinho.pedido.troco != 0){
      trocoDinheiro = `%0A*Troco Para*: ${Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(carrinho.pedido.troco)}`
    }
    let valorTotal = `%0A*VALOR TOTAL PEDIDO*: ${Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(carrinho.pedido.valorTotal)}%0A`

    let traco = `_____________%0A`
    var produto = ''
    for(var i = 0; i < carrinho.pedido.itens.length; i++){
      //console.log('carrinho.pedido.itens.length', carrinho.pedido.itens.length)
      let produtoAtual = carrinho.pedido.itens[i];
      //`Monte seu açaí\n1 X Açaí 500 ML\n> 1 X Sem calda\n> 1 X Banana\nValor: R$ 13.00\n`
      var textoProdutoAtual = `*${produtoAtual.quantidade} X* ${produtoAtual.produto.nome}%0A`
      
      for(var j = 0; j < produtoAtual.itensOpcaoProduto.length; j++){
        //console.log('produtoAtual.itensOpcaoProduto.length', produtoAtual.itensOpcaoProduto.length)
        var opcaoAtual = produtoAtual.itensOpcaoProduto[j]
        textoProdutoAtual += ` >>> *${opcaoAtual.quantidade} X* ${opcaoAtual.opcaoProduto.nome}%0A`
      }

      if(produtoAtual.observacao){
        textoProdutoAtual += `*Observação*: ${produtoAtual.observacao}%0A`
      }
      textoProdutoAtual += `*Valor*: ${Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produtoAtual.valorProdutoHistorico)}%0A`

      if(carrinho.pedido.itens.length > 1 && i < (carrinho.pedido.itens.length-1)){
        textoProdutoAtual += `%0A`
      }
      
      produto += textoProdutoAtual
    }

    let final = '%0A_Plataforma ClienteFielStart_'

    var comanda = dataPedido + nome + telefone + observacaoPedido + formaPagamento + traco + produto + traco + trocoDinheiro +  valorTotal + traco + final
    // comanda = comanda.replace(/ /g, '%20');
    await resetarCarrinho()
    //console.log(comanda)
    //console.log(`https://api.whatsapp.com/send?phone=55${estabelecimentoAtual.numeroWhatsapp}&text=${comanda}`)
    window.location.href =  `https://api.whatsapp.com/send?phone=55${estabelecimentoAtual.numeroWhatsapp}&text=${comanda}`
    setLoading(false)
  }
  


  const realizarLogin_DosSemContinuarSemCadastro = async (nome, telefone, aplicativoDados) => {
    try {
      
      let telefoneReplace = telefone.replace(' ', '').replace('.','').replace('-','').replace('(','').replace(')','').replace('/','')
      
      if(telefoneReplace.charAt(0) == "0"){
        telefoneReplace = telefoneReplace.substring(1)
      }

      
      
      if(!(telefoneReplace.length >= 10 && telefoneReplace.length <= 11)){
        alertStart("Seu telefone esta incompleto, verifique se você digitou o DDD e o digito 9!", "warning")
        return false
      }

      setLoading(true)

      //ENVIAR CADASTRO
      
      const data = {
        "appNome": aplicativoDados.appNome,
        "nome": nome,
        "telefone": telefone,
        "dataNascimentoTexto": '',
        "email": `${telefone}_${Math.floor(Math.random() * (1000000 - 10))}@${telefone}.${telefone}`,
        "hashSenha": `${telefone}_${Math.floor(Math.random() * (1000000 - 10))}@${telefone}.${telefone}`,
        "cpf": '',
        "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
      }

      const response = await CadastrarUsuario(data, aplicativoDados)
  
      if(response.retornoErro){
        //algum erro
        alertStart(response.mensagem, "error")
        setLoading(false)
        return false
      }else{ 
        const data_Login = {
          "appNome": aplicativoDados.appNome,
          "cliente":{
            "email": `${response.email}`,
            "hashSenha": `${response.hashSenha}`,
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
        
        const response_LoginGeral = await LoginGeral(data_Login, aplicativoDados)
    
        if(response_LoginGeral.retornoErro){
          //algum erro LoginGeral
          alertStart(response_LoginGeral.mensagem, "error")
          setLoading(false)
        }else{ 
          alertStart("Sucesso!", "success")
          setLoading(false)
          // setUsuarioSemCadastro(response_LoginGeral)
          enviarPedido(response_LoginGeral)
        }

      }
    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions realizarLogin_DosSemContinuarSemCadastro - ${aplicativoDados.appNome} - ${error}`);
      alertStart("Procure os desenvolvedores! Erro realizarLogin_DosSemContinuarSemCadastro: "+error.message, "error")    
    }
  }

  const confirmacaoInformacoes = () => {
    var telefone = ""
    var nome = ""

    

    if( solicitarTelefoneAoFinalizar ){
      document.getElementById('telefonePedido').value = (document.getElementById('telefonePedido').value)?.replace(' ', '').replace('.','').replace('-','').replace('(','').replace(')','').replace('/','')
      telefone = document.getElementById('telefonePedido').value
      

      if(telefone.length > 11 || telefone.length < 10){
        alertStart("Digite um telefone válido", "warning")
        return false
      }
    }

    if( solicitarNomeAoFinalizar ){
      nome = document.getElementById('nomePedido').value
      
      if(!nome || nome === "Cliente" || nome === "cliente"){
        alertStart("Digite seu nome", "warning")
        return false
      }
      carrinho.pedido.nomePedido = nome
    }
    
    const obs = document.getElementById('observacaoPedido').value
    carrinho.pedido.observacao = obs

    if(aplicativoDados.clienteFielStart){ 
      carrinho.pedido.telefonePedido = telefone
      localStorage.setItem('carrinhoCF', JSON.stringify(carrinho));
      setCarrinho(carrinho)
      enviarPedidoWhatsapp()
    }else if(continuarSemCadastro === true){
      realizarLogin_DosSemContinuarSemCadastro(nome, telefone, aplicativoDados)
      
    }else{
      
      usuarioLogado.cliente.telefone = telefone

      if( isUsuarioPedidoMesa ){
        
        carrinho.pedido.formaPagamento = {"id": 41}
  
        const mesa = document.getElementById("numeroDaMesa").innerText
        if(mesa === "Não Selecionada" || mesa === "​"){
          alertStart("Selecione a mesa para entregar", "warning")
          return true
        }
        carrinho.pedido.mesa = mesa.replace('Mesa ', '')
        carrinho.mesa = mesa.replace('Mesa ', '')
        setNomeMesa(mesa)

        //pedido de mesa e nao quer nome e telefone
        if( isUsuarioPedidoMesa && !solicitarNomeAoFinalizar ){
          carrinho.pedido.nomePedido = mesa
          usuarioPedidoMesa.cliente.nome = mesa
        }else{
          usuarioPedidoMesa.cliente.nome = nome
        }
  
      }else if( isUsuarioIzzaBot ){
        carrinho.pedido.nomePedido = nome
      }
      localStorage.setItem('carrinhoCF', JSON.stringify(carrinho));
      localStorage.setItem('usuarioPedidoMesaCF', JSON.stringify(usuarioPedidoMesa));
      localStorage.setItem('usuarioCF', JSON.stringify(usuarioLogado));
      setCarrinho(carrinho)
  
      if( (isUsuarioPedidoMesa && estabelecimentoAtual.solicitarComanda) )
        lerQrCodeComanda()
      else
        enviarPedido()
    }
  }

  const retornoVerificarCardapio = (response, cardapio) => {
    try {
      //console.log('retornoVerificarCardapio', response, cardapio)
      if(!response.codErro > 0){
        const retorno = response
        const endereco = enderecoAtual
        let end = null
        if((retorno.enderecos != null && retorno.enderecos.length > 0) && !isRetiradaNoLocal){
          end = retorno.enderecos[0]
          retorno.enderecos.forEach(endereco => {
            if(enderecoAtual.id == endereco.id){
              end = endereco
            }
          })
          localStorage.setItem("enderecoAtualCF", JSON.stringify(end)) 
          setEnderecoAtual(end) 
        }
        
        if(!carrinho.pedido){
          carrinho.pedido = {}
        }

        if( (cardapio?.cupomDesconto && !retorno?.cupomDesconto) && !retorno?.idCartelaCompleta){
          retorno.cupomDesconto = cardapio?.cupomDesconto

          if(retorno.cupomDesconto?.valorDesconto){
            retorno.valorDesconto = retorno.cupomDesconto.valorDesconto
          }

          if(retorno.cupomDesconto?.valorDescontoPercentual){
            retorno.percentualDesconto = retorno.cupomDesconto.valorDescontoPercentual
          }
        } 

        //INICIO ATUALIZANDO CARRINHO
        carrinho.valorMinimoPedido = retorno.valorMinimoPedido
        carrinho.valorDesconto = retorno.valorDesconto
        carrinho.percentualDesconto = retorno.percentualDesconto
        carrinho.minimoEntregaGratis = retorno.minimoEntregaGratis
        carrinho.maximoPedidoComDesconto = retorno.maximoPedidoComDesconto
        carrinho.maximoDesconto = retorno.maximoDesconto
        carrinho.cupomDesconto = retorno.cupomDesconto
        const taxa = (retorno.enderecos != null && retorno.enderecos.length > 0 && !isRetiradaNoLocal) ? end.taxaEntrega : null
        carrinho.valorEntrega = taxa
        carrinho.taxaEntrega = taxa
        //pedido
        carrinho.pedido.taxaEntrega = taxa
        carrinho.pedido.valorEntrega = taxa
        if(carrinho.percentualDesconto){
          carrinho.pedido.valorDesconto = carrinho.percentualDescontoValor
        }else{
          carrinho.pedido.valorDesconto = carrinho.valorDesconto
        }
        //FIM ATUALIZANDO CARRINHO
        

        

        if(retorno?.cupomDesconto?.freteGratis){
          //console.log('mudando Taxa ')
          carrinho.pedido.valorEntrega = 0;
          carrinho.pedido.taxaEntrega = 0;
          if(endereco.bairro){
            endereco.taxaEntrega = 0;          
            localStorage.setItem('enderecoAtualCF', JSON.stringify(endereco))
          }
        }else if(retorno?.enderecos?.length && !isRetiradaNoLocal){
          carrinho.pedido.valorEntrega = end.taxaEntrega;
          carrinho.pedido.taxaEntrega = end.taxaEntrega;
        }    

        localStorage.setItem('carrinhoCF', JSON.stringify(carrinho))
        setCarrinho(carrinho)
        setEnderecoAtual(endereco)
        

        ////console.log("atualizarCardapio", retorno)
        if(!JSON.parse(localStorage.getItem('usuarioCF'))?.logado){
          retorno.id = "usuarioDeslogado"
        }

        retorno.categorias.forEach(categoria => {
          categoria.produtos.forEach(produto => {
            produto.valorRealCalculado = calcularValorAPartirDe(produto)
            produto.valorDeCalculado = calcularValorAPartirDe(produto, true)
          })
        });
        // //console.log('valores', cardapio)
        // localStorage.setItem('cardapioCF', JSON.stringify(cardapio))

        var attCardapio = retorno
        if(estabelecimentoAtual.adicionarItensNaTelaInicial){
          attCardapio = adicionarQuantidadeZeroProdutos(retorno)
        }
        
        localStorage.setItem("cardapioCF", JSON.stringify(attCardapio))         
        setCardapio(attCardapio)

        calcularValorTotal()
      }
    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions retornoVerificarCardapio - ${aplicativoDados.appNome} - ${error}`);
      alertStart("Procure os desenvolvedores! Erro retornoVerificarCardapio: "+error.message, "error")    
    }
  }

  const adicionarQuantidadeZeroProdutos = (retornoCardapio) => {
    if(carrinho.pedido?.itens?.length > 0){
      retornoCardapio.categorias.forEach(categoria=>{
        categoria.produtos.forEach(produto=>{
          var temNoCarrinho = false
          carrinho.pedido.itens.forEach(item=>{
            if(item.produto.id == produto.id){
              produto.quantidade = item.quantidade
              temNoCarrinho = true
            }
          })

          if(temNoCarrinho == false){
            produto.quantidade = 0
          }       
        })
      })
    }else{
      retornoCardapio.categorias.forEach(categoria=>{
        categoria.produtos.forEach(produto=>{
          produto.quantidade = 0
        })
      })
    }    
    return retornoCardapio
  }

  const verificarCardapio =  async (estabelecimento) => {  
   
    try {
      let tmpCardapio = cardapio
      if(new Date() - new Date(localStorage.getItem('dateCardapioCF')) > 3000000){
        tmpCardapio = []
      }

      //console.log('buscando cardapio')
      localStorage.setItem('dateCardapioCF', new Date())
      ////console.log("atualizando cardapio")
  
      let data = {
        "idCliente": usuarioLogado?.cliente?.id,
        "idEstabelecimento": estabelecimento.id,
        "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
      }    
  
      if(enderecoAtual.ativo){
        data.idEndereco = enderecoAtual.id
      }

      const mesaLogada = !!JSON.parse(localStorage.getItem('usuarioPedidoMesaCF'))?.logado
      const response = mesaLogada ? await ObterCardapioPedidoMesa(data, aplicativoDados) : await ObterCardapioCompletoV1(data, aplicativoDados)

      //console.log("Atualização Cardapio", response)

      if(response.retornoErro){
        //algum erro verificarCardapio
        // alertStart(response.mensagem, "error")
      }else{
        retornoVerificarCardapio(response, tmpCardapio)
      }
      
    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions verificarCardapio - ${aplicativoDados.appNome} - ${error}`);
      alertStart("Procure os desenvolvedores! Erro verificarCardapio: "+error.message, "error")    
    }
  }


  useEffect(() => {
    verificarCardapio(estabelecimentoAtual)
    

    if(!aplicativoDados.clienteFielStart){
      verificarAberto()
      buscarUltimoPedido()  
    }
    

    const interval = setInterval(() => {
        ////console.log("procurando atualizações ")
        if(!aplicativoDados.clienteFielStart){
          verificarAberto()
          if(!localStorage.getItem('semUltimoPedido')){
            buscarUltimoPedido()  
          }
          
        }
        
    }, 10000);
    return () => clearInterval(interval);
  }, []);


  function calcularValorAPartirDe(prod, valorPromocional = false){
    
    try {

      const produto = JSON.parse(JSON.stringify(prod));
      if(valorPromocional){
        produto.valor = produto.valorDe
      }

      var valorProdutoHistorico = produto.valor ? produto.valor : 0.0


      produto.opcoes.forEach((grupo) => {

        // //console.log('Produto>', produto.nome)
        if(grupo.quantidadeMinima > 0 ){
          // //console.log('Grupo>', grupo.nome)
           //considerar maior  valor - prioridade 1
          const verificarMaiorValor = grupo.opcoes.length > 0 ? grupo.opcoes[0].considerarMaiorValor : false
          var maiorValorDoGrupo = 0
    
          //considerar media dos valores - prioridade 2
          const verificarMediaValor = grupo.opcoes.length > 1 ? grupo.opcoes[0].considerarMedia : false
          var valorTotalDasOpcoes = 0
          var quantidadeDeOpcoes = 0

          //console.log('verificarMaiorValor> ', verificarMaiorValor)
          //console.log('verificarMediaValor> ', verificarMediaValor)



          
          grupo.opcoes.sort(function (a, b) {
            if (a.valor > b.valor) {
              return 1;
            }
            if (a.valor < b.valor) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });

          var qtd = 0
          grupo.opcoes.forEach((opcao) => {

            if(qtd < grupo.quantidadeMinima){
              qtd++

              let quantidadeSelecionada = (grupo.adicional === 2 || grupo.adicional === 3 )? grupo.quantidadeMinima : 1
              if(quantidadeSelecionada > 1){
                qtd = grupo.quantidadeMinima
              }

              if(verificarMaiorValor && (opcao.valor > maiorValorDoGrupo)){
                maiorValorDoGrupo = opcao.valor
              }else if(verificarMediaValor && valorTotalDasOpcoes >= 0){
                valorTotalDasOpcoes += (opcao.valor * quantidadeSelecionada)
                quantidadeDeOpcoes += quantidadeSelecionada
              }
    
              if( grupo.adicional === 0 && opcao.quantidade === 1 && opcao.valor > 0){
                valorProdutoHistorico = (valorProdutoHistorico - produto.valor) + opcao.valor
              }else if(!verificarMaiorValor && !verificarMediaValor){
                //console.log('nao verificar maior nem media', qtd)
                valorProdutoHistorico += (opcao.valor * quantidadeSelecionada)
              }
              
            }
          })

          if(verificarMaiorValor){
            valorProdutoHistorico += maiorValorDoGrupo
          }else if(verificarMediaValor && valorTotalDasOpcoes >= 0){
            valorProdutoHistorico += valorTotalDasOpcoes / quantidadeDeOpcoes
          }
        }else if(grupo.adicional === 0){
          // //console.log('adicional igual 0 ', grupo)
          valorProdutoHistorico+=grupo.opcoes[0].valor
        }

        
      })

      return valorProdutoHistorico
    
     } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions calcularValorAPartirDe ${window.location.hostname} - ${error}`);
      alertStart("Procure os desenvolvedores! Erro calcularValorAPartirDe: "+error.message, "error")   
     }

     return prod.valor
  }

  

  async function calcularValorTotal(){
    try {
      //console.log(">> calcularValorTotal")

      const cardapio = JSON.parse(localStorage.getItem("cardapioCF"))
      const carrinho = JSON.parse(localStorage.getItem("carrinhoCF"))
      const enderecoAtual = JSON.parse(localStorage.getItem("enderecoAtualCF"))
      
      var valorTotalItens = 0;
      let valorProdutosPromocionais = 0;


      //calculando valores dos items do carrinho
      carrinho.pedido.itens.forEach(item => {
        valorTotalItens += item.valorProdutoHistorico      
        if(item.produto.promocional){
          valorProdutosPromocionais += item.valorProdutoHistorico
        }
      })

      
      
      //verificar mudanças com cupom de frete gratis
      if(cardapio.cupomDesconto?.freteGratis){

        //apaga cupom se selecionar retirada no local
        // if(carrinho.pedido?.entregaAgendada == "Retirar(Buscar) no local"){
        // if(isRetiradaNoLocal){
        //   cardapio.cupomDesconto = null
        //   cardapio.percentualDesconto = 0
        //   alertStart('Você selecionou Retirada então removemos o cupom de Frete Grátis!' , "warning")  
        // }else{
        //   //tudo certo para o cupom de frete gratis
        //   carrinho.pedido.valorEntrega = 0;
        //   carrinho.pedido.taxaEntrega = 0;
          
        //   if(enderecoAtual.bairro){
        //     enderecoAtual.taxaEntrega = 0;          
        //     localStorage.setItem('enderecoAtualCF', JSON.stringify(enderecoAtual))
        //   }
        // }

        //tudo certo para o cupom de frete gratis
        carrinho.pedido.valorEntrega = 0;
        carrinho.pedido.taxaEntrega = 0;
        
        if(enderecoAtual.bairro && !isRetiradaNoLocal){
          enderecoAtual.taxaEntrega = 0;          
          localStorage.setItem('enderecoAtualCF', JSON.stringify(enderecoAtual))
        }
      }

      let taxaDeEntrega = 0
      if(!isRetiradaNoLocal && carrinho.pedido.tipoPedido !== 2 && !(valorTotalItens > cardapio.minimoEntregaGratis  && cardapio.minimoEntregaGratis > 0)){ // NAO FOR RETIRADA NO LOCAL e PEDIDO MESA
        //console.log('ENTREI AQUI')
        taxaDeEntrega = carrinho.pedido.valorEntrega ? carrinho.pedido.valorEntrega : (enderecoAtual.taxaEntrega ? enderecoAtual.taxaEntrega : 0)

        if(taxaDeEntrega < 0){
          taxaDeEntrega = 0
        }
      }

      var valorFinalProdutos = 0;

      //acho q pode deletar esse comentario abaixo
      // if(!(carrinho.pedido?.entregaAgendada == "Retirar(Buscar) no local" && cardapio.cupomDesconto?.freteGratis)){
          
      carrinho.percentualDescontoValor = 0.0
      
      if(cardapio.percentualDesconto && (cardapio.valorDesconto === 0 || !cardapio.valorDesconto)){
        // //console.log("valor fixo percentual")

        //desconto percetual - apenas em produtos nao promocionais
        var descontoPercentual = ((valorTotalItens - valorProdutosPromocionais) * cardapio.percentualDesconto) / 100

        //maximo que pode dar de desconto
        if(cardapio.maximoDesconto && descontoPercentual > cardapio.maximoDesconto){
          descontoPercentual = cardapio.maximoDesconto
        }
        

        carrinho.percentualDescontoValor = descontoPercentual
        carrinho.pedido.valorDesconto = descontoPercentual
        valorFinalProdutos = ( valorTotalItens - descontoPercentual ) 

      }else{
        
        //desconto fixo - apenas em produtos nao promocionais
        var descontoFixo = carrinho.pedido.valorDesconto ? carrinho.pedido.valorDesconto : cardapio.valorDesconto
        // //console.log("valor fixo desconto", descontoFixo)
        // maximo que pode dar de desconto
        if(cardapio.maximoDesconto && descontoFixo > cardapio.maximoDesconto){
          descontoFixo = cardapio.maximoDesconto
          // //console.log("maximo >", descontoFixo)
        }

        // let produtosNaoPromocionais = valorTotalItens - valorProdutosPromocionais
        // produtosNaoPromocionais -= descontoFixo      
        // valorFinalProdutos = valorProdutosPromocionais + (produtosNaoPromocionais > 0 ? produtosNaoPromocionais : 0)     
        valorFinalProdutos = valorTotalItens - descontoFixo   
        
      }


      

      if(valorFinalProdutos < 0){
        carrinho.pedido.valorTotal = taxaDeEntrega
      }else{
        carrinho.pedido.valorTotal = valorFinalProdutos + taxaDeEntrega
      }

      
      if(carrinho.pedido?.formaPagamento && carrinho.pedido?.formaPagamento?.id){
        const formaPagamentoSelecionado = carrinho.pedido.formaPagamento
        if(formaPagamentoSelecionado.desconto){
          carrinho.pedido.descontoFormaPagamento = (formaPagamentoSelecionado.desconto / 100 ) *  carrinho.pedido.valorTotal
          carrinho.pedido.valorTotal -= carrinho.pedido.descontoFormaPagamento
        }else{
          carrinho.pedido.descontoFormaPagamento = 0
        }
      }
      



      if(carrinho.pedido.valorTotal < 0){
        carrinho.pedido.valorTotal = 0.0
      }
      


      localStorage.setItem('carrinhoCF', JSON.stringify(carrinho))
      localStorage.setItem('cardapioCF', JSON.stringify(cardapio))
      setCarrinho(carrinho)
      setCardapio(cardapio)

    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions calcularValorTotal ${window.location.hostname} - ${error}`);
      alertStart("Procure os desenvolvedores! Erro calcularValorTotal: "+error.message, "error")   
    }
  }


  
  class QRCode extends Component {

    state = {
        result: 'No result',
        leu: false,
    }

    handleScan = data =>  {           
        if (data && !this.state.leu) {  
            setQrCodeModal(false) 

            this.setState({
                result: data,
                leu: true,
            })

            carrinho.pedido.comanda = data


            localStorage.setItem('carrinhoCF', JSON.stringify(carrinho));
            setCarrinho(carrinho)            
            //alertStart("Enviando Pedido!", "success")
            enviarPedido()
            
        }
    }

    handleError = err => {
        setQrCodeModal(false) 
        Sentry.captureMessage(localStorage.getItem('versao')+`RegistrarSelo - ${aplicativoDados.appNome}`);
        alertStart("Algo deu errado ao registrar selo  (handleError)", "error")
    }

    render() {
        if(qrCodeModal){
          return (
            <div>
                <QrReader
                    delay={300}
                    onError={this.handleError}
                    onScan={this.handleScan}
                    style={{ width: '100%' }}
                />
                {/*<p>{this.state.result}</p>*/}
            </div>
          )
        }else{
          return (
            <div>
               
            </div>
          )
        }
    }
}


  async function atualizarUsuario(usuarioLogado) {    
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
      
      const response = await LoginGeral(clientefiel, aplicativoDados)
  
      if(response.retornoErro){
        //algum erro LoginGeral
        alertStart(response.mensagem, "error")
      }else{ 
        //tudo certo LoginGeral

        if(localStorage.getItem('tokenNotificationFirebase')){
          if( response.cliente.codigoDispositivo !== localStorage.getItem('tokenNotificationFirebase') ){
            response.cliente.codigoDispositivo = localStorage.getItem('tokenNotificationFirebase')
            response.cliente.token = `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`
            AtualizarDispositivoUsuario(response.cliente, aplicativoDados)
          }
        }

        
        localStorage.setItem('usuarioCF', JSON.stringify(response));
      }

    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions atualizarUsuario ${window.location.hostname} - ${error}`);
      alertStart("Procure os desenvolvedores! Erro atualizarUsuario: "+error.message, "error")    
    }
  }

  const removerCupom = async () => {
    try {
      setLoading(true)

      if(!isRetiradaNoLocal && (cardapio.cupomDesconto?.freteGratis || cardapio.idCartelaCompleta)){

        const data = {
          "idCliente": usuarioLogado?.cliente?.id,
          "idEstabelecimento": estabelecimentoAtual?.id,
          "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
        }
  
        let end = enderecoAtual
        const retornoEnderecos = await ObterEnderecosComTaxaEntrega(data, aplicativoDados)
        retornoEnderecos.forEach((endereco) => {
          if(endereco.id === end.id){
            end = endereco
          }
        })
        carrinho.pedido.valorEntrega = end.taxaEntrega;
        carrinho.pedido.taxaEntrega = end.taxaEntrega;
        localStorage.setItem('enderecoAtualCF', JSON.stringify(end))
        setEnderecoAtual(end)
      }

      
      cardapio.idCartelaCompleta = null
      cardapio.percentualDesconto = 0
      cardapio.valorDesconto = 0
      carrinho.percentualDescontoValor = 0
      carrinho.valorDesconto = 0
      carrinho.pedido.valorDesconto = 0

      carrinho.pedido.desconto = null
      
      cardapio.cupomDesconto = null
      cardapio.informacao = null
      localStorage.setItem('cardapioCF', JSON.stringify(cardapio))
      localStorage.setItem('carrinhoCF', JSON.stringify(carrinho))
      setCarrinho(carrinho)
      setCardapio(cardapio)
      
      calcularValorTotal()
    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions removerCupom ${window.location.hostname} - ${error}`);
      alertStart("Procure os desenvolvedores! Erro removerCupom: "+error.message, "error")    
    }
    setLoading(false)
  }
  const adicionarCupom = async () => {

    try {
      setLoading(true)
      const data = JSON.parse(JSON.stringify(carrinho.pedido))
      data.estabelecimento = estabelecimentoAtual
      data.cliente = usuarioLogado.cliente
      data.token = `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`
      data.desconto = {
        "codigoCupom": document.getElementById('codigoAddCupom').value,
        "appNome": aplicativoDados.appNome,
        "mensagem": aplicativoDados.appNome,
        "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
      }


      const response = await ObterCupomDescontoCompleto(data, aplicativoDados)
  
      if(response.retornoErro){
        //algum erro ObterCupomDescontoCompleto
        setAdicionarCupom(false)  
        alertStart(response.mensagem, "error")
      }else{ 
        //tudo certo ObterCupomDescontoCompleto

        // if(response.freteGratis && carrinho.pedido?.entregaAgendada == "Retirar(Buscar) no local"){
        if(response.freteGratis && isRetiradaNoLocal){
          setAdicionarCupom(false)  
          alertStart('Esse cupom possui Frete Grátis e você está como Retirada no Local!' , "warning")  
          setLoading(false)
        }else{
          // alertStart(response.mensagem , "success")    
          if(response.freteGratis){
            carrinho.pedido.valorEntrega = 0;
            carrinho.pedido.taxaEntrega = 0;
            localStorage.setItem('carrinhoCF', JSON.stringify(carrinho))
            if(enderecoAtual.bairro){
              enderecoAtual.taxaEntrega = 0;          
              localStorage.setItem('enderecoAtualCF', JSON.stringify(enderecoAtual))
            }
            setCarrinho(carrinho)
          }      
          cardapio.cupomDesconto = response
          cardapio.percentualDesconto = response.valorDescontoPercentual
          cardapio.valorDesconto = response.valorDesconto
          setCardapio(cardapio)
          localStorage.setItem('cardapioCF', JSON.stringify(cardapio))
          localStorage.setItem('carrinhoCF', JSON.stringify(carrinho))
          calcularValorTotal()
          setAdicionarCupom(false)
        }

      }

      document.getElementById('codigoAddCupom').value = ''
      setLoading(false)

    }
    catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions adicionarCupom ${window.location.hostname} - ${error}`);
      alertStart("Procure os desenvolvedores! Erro adicionarCupom: "+error.message, "error")    
      setLoading(false)
    }
    
  }

  const opcoesParaEntregaeRetirada = () => {
    if(estabelecimentoAtual.permiteRetiradaBalcao){
      setTelaRetiradaOuEntrega(true)
    }else{
      irParaEnderecos()
    }
  }


  const irParaEnderecos = () => {

    if(usuarioLogado.logado){
      history.push(`/delivery/enderecos${identificarEstabelecimentoSelecionado(aplicativoDados)}`)
    }else{
      setTelaRetiradaOuEntrega(false)
    }
  }
  const irParaHistoricoDePedidos = () => {
    history.push(`/delivery/historicoPedidos`)
  }
  const irParaLogin = () => {
    history.push(`/login`)
  }
  const irParaProduto = (produtoId) => {
    history.push(`/produto/${produtoId}${identificarEstabelecimentoSelecionado(aplicativoDados)}`)
  }
  const irParaStatusPedido = (pedidoId, pedidoStatusInicial, veioDoEnviarPedido) => {
    if(veioDoEnviarPedido == true){
      history.push(`/delivery/pedido${identificarEstabelecimentoSelecionado(aplicativoDados, pedidoId, pedidoStatusInicial)}?pedidoEnviado=true`)
    }else{
      history.push(`/delivery/pedido${identificarEstabelecimentoSelecionado(aplicativoDados, pedidoId, pedidoStatusInicial)}`)
    }
    // history.push(`/delivery/pedido/${pedidoId}/${pedidoStatusInicial}${identificarEstabelecimentoSelecionado(aplicativoDados)}`)

  }

  const selecioneiEndereco = async () => {

    if(continuarSemCadastro || !usuarioLogado?.logado){
      setEnderecoAtual({})
      localStorage.setItem("enderecoAtualCF", JSON.stringify({}))
      setTelaRetiradaOuEntrega(false)

    }else {
      if(!!JSON.parse(localStorage.getItem('carrinhoCF')).pedido?.itens){
        localStorage.setItem('backupItensCarrinhoCF', JSON.stringify(JSON.parse(localStorage.getItem('carrinhoCF')).pedido.itens))
      }
      irParaEnderecos()
    }
    
  }

  const selecioneiRetiradaNoLocal = async () => {
    const cardapio = JSON.parse(localStorage.getItem("cardapioCF"))

    //SALVAR PRODUTOS DO CARRINHO
    const produtosDoCarrinho = JSON.parse(localStorage.getItem('carrinhoCF'))?.pedido?.itens
    ////console.log("produtosDoCarrinho", produtosDoCarrinho)
    
    //LIMPAR ENDEREÇO SELECIONADO
    

    

    const pedidoNovo = {
      "entregaImediata": false,
      "formaPagamento": {},
      "itens": produtosDoCarrinho.length > 0 ? produtosDoCarrinho : [],
      "taxaEntrega": 0,
      "entregaAgendada": "Retirar(Buscar) no local",
      "tokenCartaoCredito": null,
      "troco": null,
      "valorDesconto": cardapio.valorDesconto,
      "valorEntrega": 0,
      "valorTotal": 0,
      "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
    }

    carrinho.pedido = pedidoNovo
    cardapio.enderecos = []
    localStorage.setItem('carrinhoCF', JSON.stringify(carrinho))
    localStorage.setItem('cardapioCF', JSON.stringify(cardapio))
    localStorage.setItem("enderecoAtualCF", JSON.stringify({id: "retirada"}))
    setEnderecoAtual({id: "retirada"})
    setCarrinho(carrinho)
    setCardapio(cardapio)

    if(produtosDoCarrinho?.length > 0){
      await calcularValorTotal()
    }

    
    setTelaRetiradaOuEntrega(false)
    setInformacoesDoTipoEntrega(false)

    if(RodarFuncaoAposIsso === 'formaPagamento'){
      setRodarFuncaoAposIsso('')
      setPagamentoOpen(true) 
    }

    if(RodarFuncaoAposIsso.includes('produto')){
      irParaProduto(RodarFuncaoAposIsso.replace('produto',''))
    }
    
  }


  const EnderecoPedidoMesa = async () => {
    //SALVAR PRODUTOS DO CARRINHO
    const produtosDoCarrinho = JSON.parse(localStorage.getItem('carrinhoCF'))?.pedido?.itens
    ////console.log("produtosDoCarrinho", produtosDoCarrinho)
    
    //LIMPAR ENDEREÇO SELECIONADO
    const endereco ={
      "cep": "99999999",
      "uf": "mesa",
      "cidade": "mesa",
      "bairro": "mesa",
      "numero": 0,
      "complemento": "mesa",
      "taxaEntrega": 0.0,
      "referencia": "mesa",
      "logradouro": "mesa",
      "id": -1,
    }
    localStorage.setItem("enderecoAtualCF", JSON.stringify(endereco))
    setEnderecoAtual(endereco)


    const pedidoNovo = {
      "entregaImediata": false,
      "formaPagamento": {},
      "itens": produtosDoCarrinho.length > 0 ? produtosDoCarrinho : [],
      "taxaEntrega": 0,
      "tipoPedido": 2,
      "entregaAgendada": "Pedido Mesa",
      "tokenCartaoCredito": null,
      "troco": null,
      "valorDesconto": cardapio.valorDesconto,
      "valorEntrega": 0,
      "valorTotal": 0,
      "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
    }

    carrinho.pedido = pedidoNovo

    localStorage.setItem('carrinhoCF', JSON.stringify(carrinho))    
    setCarrinho(carrinho)

    if(produtosDoCarrinho?.length > 0){
      await calcularValorTotal()
    }
    

  }

  

  async function resetarCarrinho()  {    
    try {

      const estabelecimento = estabelecimentoAtual
      estabelecimento.token = `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`  

      const response = await ObterCardapio(estabelecimento, aplicativoDados)

      if(response.retornoErro){
        //algum erro
        alertStart(response.mensagem, "error")
      }else{ 
        //tudo certo
        const retorno = response

        const carrinhoRetorno = {}
        carrinhoRetorno.valorMinimoPedido = retorno.valorMinimoPedido
        carrinhoRetorno.valorDesconto = retorno.valorDesconto
        carrinhoRetorno.percentualDesconto = retorno.percentualDesconto
        carrinhoRetorno.minimoEntregaGratis = retorno.minimoEntregaGratis
        carrinhoRetorno.maximoPedidoComDesconto = retorno.maximoPedidoComDesconto
        carrinhoRetorno.maximoDesconto = retorno.maximoDesconto
        carrinhoRetorno.cupomDesconto = retorno.cupomDesconto
  
        carrinhoRetorno.pedido = {
          "entregaImediata": false,
          "formaPagamento": {},
          "itens": [],
          "taxaEntrega": null,
          "tokenCartaoCredito": null,
          "troco": null,
          "valorDesconto": null,
          "valorEntrega": null,
          "valorTotal": 0,
          "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
        }
        
        localStorage.setItem("carrinhoCF", JSON.stringify(carrinhoRetorno)) 

        var attCardapio = retorno
        if(estabelecimentoAtual.adicionarItensNaTelaInicial){
          //preciso do "categorias" pq o retorno vem apenas as cateogrias
          //adiciona o quantidade 0 para adicioanr no carrinho direto pelo cardapio
          attCardapio = adicionarQuantidadeZeroProdutos({"categorias": retorno})
        }

        const dataRetorno = {}
        dataRetorno.categorias = attCardapio
        dataRetorno.id = "usuarioDeslogado"
        
        if(!localStorage.getItem('usuarioCF')){
          localStorage.setItem("usuarioCF", JSON.stringify({}))   
        }
        
        if(!localStorage.getItem('enderecoAtualCF')){
          localStorage.setItem("enderecoAtualCF", JSON.stringify({}))  
        }
        
        setCarrinho(carrinhoRetorno)
        
        localStorage.setItem("cardapioCF", JSON.stringify(dataRetorno))                      
        setCardapio(dataRetorno)
  
      }
    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions resetarCarrinho ${window.location.hostname} - ${error}`);
      alertStart("Procure os desenvolvedores! Erro resetarCarrinho: "+error.message, "error")    
    }
  }

  async function atualizarCardapioECarrinho(endereco)  {  
    try {
      const usuarioLogado = JSON.parse(localStorage.getItem('usuarioCF')) 
      let data = {
        "idCliente": usuarioLogado?.cliente?.id,
        "idEstabelecimento": estabelecimentoAtual.id,
        "idEndereco": endereco.id,
        "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
      }              
      
      const mesaLogada = !!JSON.parse(localStorage.getItem('usuarioPedidoMesaCF'))?.logado
      const response = mesaLogada ? await ObterCardapioPedidoMesa(data, aplicativoDados) : await ObterCardapioCompletoV1(data, aplicativoDados)
      
      if(response.retornoErro){
        //algum erro
        alertStart(response.mensagem, "error")
        setLoading(false)
      }else{ 
        //tudo certo
        const retorno = response
        const carrinhoRetorno = JSON.parse(localStorage.getItem("carrinhoCF")) 
        
        
        
        let end = null      
        if(retorno.enderecos != null && retorno.enderecos.length > 0){
          end = retorno.enderecos[0]
          retorno.enderecos.forEach(endereco => {
            if(enderecoAtual.id == endereco.id){
              end = endereco
            }
          })

          localStorage.setItem("enderecoAtualCF", JSON.stringify(end)) 
          setEnderecoAtual(end) 
        }
        
        carrinhoRetorno.valorMinimoPedido = retorno.valorMinimoPedido
        carrinhoRetorno.valorDesconto = retorno.valorDesconto
        carrinhoRetorno.percentualDesconto = retorno.percentualDesconto
        carrinhoRetorno.minimoEntregaGratis = retorno.minimoEntregaGratis
        carrinhoRetorno.maximoPedidoComDesconto = retorno.maximoPedidoComDesconto
        carrinhoRetorno.maximoDesconto = retorno.maximoDesconto
        carrinhoRetorno.cupomDesconto = retorno.cupomDesconto
        const taxa = (retorno.enderecos != null && retorno.enderecos.length > 0) ? end.taxaEntrega : null
  
        carrinhoRetorno.pedido = {
          "entregaImediata": false,
          "formaPagamento": {},
          "itens": [],
          "taxaEntrega": taxa,
          //"tipoDesconto": null,
          "tokenCartaoCredito": null,
          "troco": null,
          "valorDesconto": carrinhoRetorno.valorDesconto,
          "valorEntrega": taxa,
          "valorTotal": taxa,
          "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
        }

        if(!JSON.parse(localStorage.getItem('usuarioCF')).logado){
          retorno.id = "usuarioDeslogado"
        }
        
        let attCardapio = retorno
        if(estabelecimentoAtual.adicionarItensNaTelaInicial){
          attCardapio = adicionarQuantidadeZeroProdutos(retorno)
        }
        localStorage.setItem("cardapioCF", JSON.stringify(attCardapio))  
        localStorage.setItem("carrinhoCF", JSON.stringify(carrinhoRetorno)) 
        setCardapio(attCardapio)
        setCarrinho(carrinhoRetorno)
      }


    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions atualizarCardapioECarrinho ${window.location.hostname} - ${error}`);
      alertStart("Procure os desenvolvedores! Erro atualizarCardapioECarrinho: "+error.message, "error")    
    }
  }

  const adicionarEndereco = async (usuarioLogado, enderecoAtual) => {  
    var resp = enderecoAtual;

    try {
      const enderecoBackUp = JSON.parse(JSON.stringify(enderecoAtual))
      const data = {
        "idCliente": usuarioLogado.cliente.id,
        "idEstabelecimento": JSON.parse(localStorage.getItem("estabelecimentoAtualCF"))?.id ? JSON.parse(localStorage.getItem("estabelecimentoAtualCF"))?.id  : null,
        "cep": enderecoBackUp.cep,
        "uf": enderecoBackUp.uf,
        "cidade": enderecoBackUp.cidade,
        "bairro": enderecoBackUp.bairro,
        "logradouro": enderecoBackUp.logradouro,
        "numero": enderecoBackUp.numero,
        "complemento": enderecoBackUp.complemento,
        "referencia":  enderecoBackUp.referencia,
        "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
      }

      if(enderecoBackUp.bairroEspecifico){
        data.bairroEspecifico = 1
      }else{
        data.bairroEspecifico = 0
      }

      const response = await CadastrarEnderecoCliente(data, aplicativoDados)
  
      if(response.retornoErro){
        //algum erro
        alertStart(response.mensagem, "error")
        setLoading(false)
      }else{ 
        //tudo certo
        usuarioLogado.cliente.enderecos.push(response)
        if(localStorage.getItem('usuarioCF') != "{}" || localStorage.getItem('usuarioCF') != ""){
          localStorage.setItem('usuarioCF', JSON.stringify(usuarioLogado))
        }
        localStorage.setItem("enderecoAtualCF", JSON.stringify(response))
        resp = response
      }
    }
    catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions CadastrarEnderecoCliente ${window.location.hostname} - ${error}`);
        alertStart("Procure os desenvolvedores! Erro CadastrarEnderecoCliente: "+error.message, "error")  
        setLoading(false)  
    }
    return resp
  }

  async function enviarPedido(usuarioSemCadastro = {}) {
    
    try {

      let usuarioEnviarPedido = usuarioSemCadastro.appNome ? usuarioSemCadastro : JSON.parse(JSON.stringify(usuarioLogado))
      let endereco = enderecoAtual

      if( isUsuarioIzzaBot && !carrinho.pedido.nomePedido ){
        setInformacoesPedido(true)         
        return true       
      }
      
      setLoading(true)


      if(isEntregaNoEndereco && !enderecoAtual.id){
        //cadastrar endereço no usuario
        const retornoEndereco = await adicionarEndereco(usuarioEnviarPedido, enderecoAtual)
        retornoEndereco.taxaEntrega = enderecoAtual.taxaEntrega
        carrinho.pedido.taxaEntrega = enderecoAtual.taxaEntrega
        if(!retornoEndereco.id){
          alertStart("Aconteceu um erro no seu endereço. Tente novamente!", "error")
          return false
        }
        setEnderecoAtual(retornoEndereco)
        endereco = retornoEndereco
      }

      const valorTotalPixelFacebook = carrinho.pedido.valorTotal

      //PREENCHIMENTO
      carrinho.pedido.estabelecimento = estabelecimentoAtual
      carrinho.pedido.cliente = usuarioEnviarPedido.cliente
      carrinho.pedido.end = endereco
      carrinho.pedido.appNome = aplicativoDados.appNome      
      carrinho.pedido.idCartelaCompleta = cardapio.idCartelaCompleta
      carrinho.pedido.token= `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`
      const pedido = carrinho.pedido;

      //tentando corrigir erro de endereço ao enviar pedido
      if(usuarioEnviarPedido?.logado && usuarioEnviarPedido?.cliente?.enderecos?.length > 0){
        usuarioEnviarPedido.cliente.enderecos.forEach(endereco => {
          if(aplicativoDados.tipoEntregaBairro == 1){
            endereco.bairroEspecifico = 1
          }else{
            endereco.bairroEspecifico = 0
          }
        })
      }else if(usuarioEnviarPedido?.logado && typeof usuarioEnviarPedido?.cliente?.enderecos == "string"){
        usuarioEnviarPedido.cliente.enderecos = null
      }

      //tentando corrigir erro de endereço ao enviar pedido
      if(aplicativoDados.tipoEntregaBairro == 1 && carrinho.pedido?.end){
        carrinho.pedido.end.bairroEspecifico = 1
      }else{
        carrinho.pedido.end.bairroEspecifico = 0
      }

      //COMPLETA A RETIRIDA NO LOCAL
      if(isRetiradaNoLocal){
        // endereco.taxaEntrega = 0.0;
        // endereco.id = -1;
        // endereco.logradouro = "Retirar no local";
        pedido.tipoPedido = 1
        pedido.end.taxaEntrega = 0.0;
        pedido.end.id = -1;
        pedido.end.logradouro = "Retirar no local";
      }

      if(cardapio.cupomDesconto){
        pedido.desconto = cardapio.cupomDesconto;
      }

      if(carrinho.percentualDesconto){
        pedido.valorDesconto = carrinho.percentualDescontoValor
      }else if(carrinho.valorDesconto){
        pedido.valorDesconto = carrinho.valorDesconto
      }
      


      //DE ONDE FOI O PEDIDO
      if(usuarioPedidoMesa?.logado){
        pedido.plataforma = 'Mesa'
        pedido.tipoPedido = 2

      }else if( isUsuarioIzzaBot ){
        pedido.plataforma = 'IzzaBot'
      }else{
        pedido.plataforma = 'Site'
      }

      if(pedido.valorDesconto == null){
        pedido.valorDesconto = 0
      }

      if(isFreteGratisMinimoEntrega || (!pedido.valorEntrega && !pedido.taxaEntrega)){
        pedido.valorEntrega = 0;
        pedido.taxaEntrega = 0;
      }
      //VERIFICA SE TA ABERTO A LOJA
      const retornoAberto = await EstabelecimentoAberto(estabelecimentoAtual.id, aplicativoDados)
      if(retornoAberto.retornoErro){
        //algum erro EstabelecimentoAberto
        alertStart(retornoAberto.mensagem, "error")
        setLoading(false)
        // if((retornoAberto.mensagem).includes("valor mínimo")){
        setInformacoesPedido(false)
        setPagamentoOpen(false)
        // }
        
      }else{ 
        //tudo certoEstabelecimentoAberto
        
        estabelecimentoAtual.online = retornoAberto.online
        setEstabelecimentoAtual(estabelecimentoAtual)
        if(retornoAberto.online == false){
          alertStart('Esse estabelecimento está fechado no momento!', "warning") 
          setLoading(false)
          return true
        }else if(retornoAberto.online === true){
          

          if(retornoAberto.pausado){
            alertStart('Esse estabelecimento está pausado no momento!', "warning") 
            setLoading(false)
            return true
          }
          
          console.log('pedido>>', pedido)
          const retornoPedido = await CadastrarPedido(pedido, aplicativoDados)

          if(retornoPedido.retornoErro){
              //algum erro CadastrarPedido
              alertStart(retornoPedido.mensagem, "error")
              setLoading(false)
          }else{ 
            //tudo certo CadastrarPedido

            //confirmar pedido
            const data = {
              "id": retornoPedido.id,
              "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
              "status": 0
            }

            const retornoPedidoCorreto = await AtualizarStatusPedido(data, aplicativoDados)

            if(retornoPedidoCorreto.retornoErro){
              //algum erro AtualizarStatusPedido
              alertStart(retornoPedidoCorreto.mensagem, "error")
              setLoading(false)
            }else{ 
              //tudo certo AtualizarStatusPedido

              //backup para caso o pedido seja cancelado
              const pedidoCancelado = {
                "carrinho": JSON.parse(localStorage.getItem('carrinhoCF')),
                "usuario": JSON.parse(localStorage.getItem('usuarioCF')),
              }
              localStorage.setItem('PedidoCanceladoBackupCF', JSON.stringify(pedidoCancelado))

              //SELOS E HISTORICOS
              if(!usuarioPedidoMesa?.logado){
                await atualizarUsuario(usuarioEnviarPedido)
              }

              //NECESSARIO PARA PROXIMO PEDIDO
              await atualizarCardapioECarrinho(endereco)


              localStorage.setItem('ultimoPedidoCF', JSON.stringify(retornoPedidoCorreto))            
              if(usuarioPedidoMesa?.logado){
                buscarHistoricoPedido();
                alertStart("Pedido Enviado!", "success");
                //setLoading(false);
              }else{

                if(aplicativoDados.pixelFacebook){
                      ReactPixel.track('Purchase', {value: valorTotalPixelFacebook, currency: 'BRL'})
                }
                
                eventoTagManager(aplicativoDados.tagManager, "Purchase", valorTotalPixelFacebook)
                eventoTagManager(estabelecimentoAtual.tagManager, "Purchase", valorTotalPixelFacebook)

                irParaStatusPedido(retornoPedidoCorreto.id, retornoPedidoCorreto.status, true)//true significa que eu estou vindo do enviarPedido
              }
            }

          }

        }
      }
      
    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions enviarPedido ${window.location.hostname} - ${error}`);
      alertStart("Procure os desenvolvedores! Erro enviarPedido: "+error.message, "error")  
      setLoading(false)  
    }
  }
  
  


  
  /* ============== PRINCIPAL - OK DO PAGAMENTO ONLINE ============== */
  const VerificarPagamentoOnline = async (e) => {

  
  

    try {
      e.preventDefault();
      setLoading(true)

      //finalCartao = document.querySelector(".credit_card_number").value;
      window.Iugu.setAccountID(aplicativoDados.tokenIuguId);
      window.Iugu.setTestMode(false);
      window.Iugu.setup();
      let formPayment = document.getElementById('payment-form');
      ////console.log('IuguIugu', window.Iugu, formPayment)
      window.Iugu.createPaymentToken(formPayment, function(data) {

        //console.log("cartao: ", data)

        if(validaDadosCartaoPagamentoOnline(data)){          
          carrinho.pedido.cpfTitular = document.getElementById('cpf_PagamentoOnline').value
          localStorage.setItem('carrinhoCF', JSON.stringify(carrinho))
          setCarrinho(carrinho)
          //console.log("pagamento online:", JSON.stringify(data))
          carrinho.pedido.tokenCartaoCredito = data.id
          setPagamentoOnline([false, {}])

          salvarCartaoPagamentoOnline(data)  
          setInformacoesPedido(true)    
          //enviarPedido()
        }
      });
    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`VerificarPagamentoOnline ${aplicativoDados.appNome} - ${error}`);
      //console.log(error)
      alertStart('Erro inesperado em VerificarPagamentoOnline! Avise os desenvolvedores', "error")     
      setLoading(false)
    }
  }

  const EscolhiMeuCartaoPagamentoOnline = async (index) => {
    carrinho.pedido.cartaoCreditoCliente = MeusCartoes[index]
    carrinho.pedido.tokenCartaoCredito = MeusCartoes[index].numeroCartao

    ////console.log('carrinho.pedido', carrinho.pedido)
    setPagamentoOnline([false, {}])
    setInformacoesPedido(true)    
    //enviarPedido()
  }


  /* ============== SALVA PRO NO CLIENTE ============== */
  async function salvarCartaoPagamentoOnline(data) {
    try {
      const data_cartaoCredito = {}
      data_cartaoCredito.codigoPagamento = null
      data_cartaoCredito.nomeImpressoCartao = data.extra_info.holder_name
      data_cartaoCredito.numeroCartao = data.extra_info.display_number
      data_cartaoCredito.bandeira = data.extra_info.brand
      data_cartaoCredito.bin = data.extra_info.bin
      data_cartaoCredito.mesValidade = data.extra_info.month
      data_cartaoCredito.anoValidade = data.extra_info.year
      data_cartaoCredito.cpf = document.getElementById("cpf_PagamentoOnline").value
      usuarioLogado.cliente.cpf = document.getElementById("cpf_PagamentoOnline").value
      data_cartaoCredito.cliente = usuarioLogado.cliente
      data_cartaoCredito.tokenCartao = btoa(data.id)
      data_cartaoCredito.tokenIugu = aplicativoDados.tokenIuguId
      data_cartaoCredito.tokenLive = aplicativoDados.tokenIuguCabecalho
      data_cartaoCredito.ativo = true
      data_cartaoCredito.descricao = null
      data_cartaoCredito.appNome = aplicativoDados.appNome
      data_cartaoCredito.appName = aplicativoDados.appNome

      const response = await CadastrarCartaoCliente(data_cartaoCredito, aplicativoDados)
  
      if(response.retornoErro){
        //algum erro
        alertStart(response.mensagem, "error")
        setLoading(false)
      }else{ 
        //tudo certo
        setMeusCartoes(response)
        setCriarCartao(false)
        setLoading(false)
      }
    }
    catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions salvarCartaoPagamentoOnline ${window.location.hostname} - ${error}`);
        alertStart("Procure os desenvolvedores! Erro salvarCartaoPagamentoOnline: "+error.message, "error")    
    }

  }

  async function obterMeusCartoesSalvos(){
    try {
      usuarioLogado.cliente.token = `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`
      usuarioLogado.cliente.plataforma = aplicativoDados.appNome

      const response = await ObterCartoesCredito(usuarioLogado.cliente, aplicativoDados)
  
      if(response.retornoErro){
        //algum erro
        alertStart(response.mensagem, "error")
      }else{ 
        //tudo certo
        setMeusCartoes(response)
        setCriarCartao(false)
      }
    }
    catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions obterMeusCartoesSalvos ${window.location.hostname} - ${error}`);
        alertStart("Procure os desenvolvedores! Erro obterMeusCartoesSalvos: "+error.message, "error")    
    }
  }


  /* ============== VERIFICA OS ERROS DO CARTAO ============== */
  const validaDadosCartaoPagamentoOnline= (data) => {
    if(data.errors?.expiration){
      alertStart('Data de Expiração: Inválido'/* + JSON.stringify(data.errors.expiration)*/, "error")
      document.getElementById('expiracao_PagamentoOnline').focus()
      setLoading(false)
    }else if(data.errors?.last_name || data.errors?.full_name || data.errors?.first_name){
      alertStart('Nome no Cartão: Inválido'/* + JSON.stringify(data.errors.last_name)*/, "error")
      document.getElementById('titular_PagamentoOnline').focus()
      setLoading(false)

    }else if(data.errors?.number){
      alertStart('Numero do Cartão: Inválido'/* + JSON.stringify(data.errors.number)*/, "error")
      document.getElementById('numeroCartao_PagamentoOnline').focus()
      setLoading(false)

    }else if(data.errors?.verification_value){
      alertStart('CVV do Cartão: Inválido'/* + JSON.stringify(data.errors.verification_value)*/, "error")
      document.getElementById('cvv_PagamentoOnline').focus()
      setLoading(false)

    }else if(data.errors?.record_invalid){
      alertStart(JSON.stringify(data.errors?.record_invalid), "error")
      setLoading(false)

    }else if(data.errors?.year){
      alertStart('Data de Expiração: Inválido'/* + JSON.stringify(data.errors.expiration)*/, "error")
      setLoading(false)

    }else if(data?.errors){
      alert('Erro no pagamento online não identificado')
      setLoading(false)

    }else if(!document.getElementById('cpf_PagamentoOnline').value){
      alertStart('Você precisa informar seu CPF'/* + JSON.stringify(data.errors.expiration)*/, "error")
      document.getElementById('cpf_PagamentoOnline').focus()
      setLoading(false)
      return false
    }else if(!TestaCPF(document.getElementById('cpf_PagamentoOnline').value)){
      alertStart('CPF Inválido'/* + JSON.stringify(data.errors.expiration)*/, "error")
      document.getElementById('cpf_PagamentoOnline').focus()
      setLoading(false)
      return false
    }else{
      return true
    }
  }

  const buscarStatus = (idPedido) => {
    /* 
      AGUARDANDO_ACEITACAO = 0;
      ACEITO = 1;
      CONFIRMACAO_VISUALIZADA = 2;
      EM_ENTREGA = 3;
      ENTREGUE = 4;
      PAGO = 5;
      PRONTO = 6;
      EM_PRODUCAO = 7;
      AGUARDANDO ATUALIZAR STATUS = 10;

      CANCELADO_PELO_DISTRIBUIDOR = -1;
      CANCELADO_PELO_CLIENTE = -2;
      NAO_ENTREGUE = -3;
      EXPIRADO = -4;
      CHARGEBACK = -10;
    */
    switch (idPedido) {
      case 0:
        return 'Aguardando Aceitacao'
      case 1:
      case 2:
        return 'Aceito'
      case 3:
        return 'Saiu P/ Entrega'
      case 4:
        return 'Entregue'
      case 5:
        return 'Pago'
      case 6:
        return 'Pronto P/ Entrega'
      case 7:
        return 'Em Produção'
      case -1:
        return 'Cancelado Pelo Estabelecimento'
      case -2:
        return 'Cancelado Pelo Cliente'
      case -3:
        return 'Não Entregue'
      case -4:
        return 'Expirado'
      case -10:
        return 'ChargeBack'
    
      default:
        return 'Não Identificado'
    }
  }

  const procurarProduto = (e) => {
      const valorPesqusa = removeAcento(e.target.value.toLocaleLowerCase())
      const categorias = document.getElementsByClassName("CardCategoriaCol")
      for(let j = 0; j < categorias.length; j++){
        const produtos = categorias[j].getElementsByClassName("CardProdutoCol")
        var qtd = 0;

        for(let i = 0; i < produtos.length; i++){
          const nomeProduto = removeAcento(produtos[i].getElementsByClassName("nomeProduto")[0].innerHTML.toLocaleLowerCase()).includes(valorPesqusa)
          const descricaoProduto = removeAcento(produtos[i].getElementsByClassName("descricaoProduto")[0].innerHTML.toLocaleLowerCase()).includes(valorPesqusa)

          if(nomeProduto || descricaoProduto){
            produtos[i].style.display = ""
            qtd++
          }else{
            produtos[i].style.display = "none"
          }
        }

        if(!valorPesqusa){
          categorias[j].style.display = "" 
        }else if(qtd > 0){
          categorias[j].style.display = ""           
        }else{
          categorias[j].style.display = "none"
        }

      }
  }

  const buscarHistoricoPedido = async () => {    

    try {
      setLoading(true)
      const data = usuarioLogado.cliente
      data.appNome = aplicativoDados.appNome
      data.token = `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`

      const response = await BuscarPedidosCliente(data, aplicativoDados)
  
      if(response.retornoErro){
        //algum erro
        alertStart(response.mensagem, "error")
      }else{ 
        //tudo certo
        localStorage.setItem('historicoPedidosCF', JSON.stringify(response))
        if(response.length > 0){
          irParaHistoricoDePedidos()
        }else{
            alertStart("Você ainda não fez pedidos", "warning")
            setLoading(false)
        }
      }
    }
    catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions BuscarPedidosCliente ${window.location.hostname} - ${error}`);
        alertStart("Procure os desenvolvedores! Erro BuscarPedidosCliente: "+error.message, "error")    
    }

  }





  // inicio HTML (RETURN)
  return (
    <div className={classes.root, "divCardapio"}>

    {loading && <div className={classes.progress} 
      style={{
        "zIndex": 9999,
        "position": "fixed",
        "top": 0,
        "padding": 0,
        "margin": 0,
        "left":0,
      }}
    > 
      {/* <LinearProgress /> */}
      <LinearProgress color="secondary" />
    </div>}
      
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar open={alert.status} autoHideDuration={6000} onClose={alertClose}>
          <Alert onClose={alertClose} severity={alert.tipo}>
            {alert.mesangem}
          </Alert>
      </Snackbar>

      {
        /* 3 lugar buscam o cardapio
          - clicando pra selecionar endereço
          - clicando pra selecionar estabelecimento
          - clicando no menu delivery sem selecionar estabelecimento ( ele escolhe por padrao o estabelecimento da posição 0 )

        */
      }

      {
        /* Existe 2 tipos de cardapio ( GRID e LIST )
          cada um tem suas funções, então caso for mexer em algum é necessario mexer nos 2.
        */
      }

      <InfoCardapio
        isEntregaNoEndereco={isEntregaNoEndereco}
        isRetiradaNoLocal={isRetiradaNoLocal}
        estabelecimentoAtual={estabelecimentoAtual}
        enderecoAtual={enderecoAtual}
        setRodarFuncaoAposIsso={setRodarFuncaoAposIsso}
        opcoesParaEntregaeRetirada={opcoesParaEntregaeRetirada}
        irParaEnderecos={irParaEnderecos}
        cardapio={cardapio}
        aplicativoDados={aplicativoDados}
        history={history}
        temEndereco={temEndereco}
        usuario={usuarioLogado}
        visualizacao={props.visualizacao}
        usuarioPedidoMesa={usuarioPedidoMesa}
        isUsuarioPedidoMesa={isUsuarioPedidoMesa}
      />


      {(!ultimoPedido.id ) ? null
      :   <Row style={{"marginBottom": "1em", "cursor": "pointer"}}>
            <Col xs={12} md={12} lg={12}  >
              <AlertFixo onClick={() => {
                if(usuarioPedidoMesa?.logado){
                  buscarHistoricoPedido();
                }else{
                  irParaStatusPedido(ultimoPedido.id, ultimoPedido.status, false)
                }
              }} className="campoDeUmAlert" severity={ultimoPedido.status >= 0 ? "success" : "error"}>
                Pedido de <b>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ultimoPedido.valorTotal)}</b> realizado em <b>{ultimoPedido.strDataRealizacao}</b> está com status <b>{buscarStatus(ultimoPedido.status)}</b>
              </AlertFixo>                        
            </Col>
          </Row>}


          

          
      
          { !usuarioPedidoMesa?.logado && ( (carrinho.minimoEntregaGratis < 999  && carrinho.minimoEntregaGratis > 0) || carrinho.valorMinimoPedido > 0 || (cardapio.valorDesconto > 0 || cardapio.percentualDesconto > 0) || enderecoAtual.id) &&
          <Dialog
            open={openInformacoes}//true,openInformacoes
            TransitionComponent={Transition}
            keepMounted
            onClose={() => {setOpenInformacoes(false)}}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">{"Informações Importantes"}</DialogTitle>
            <DialogContent>
              <div className={classes.rootAlerts}>

                { /* ========== ALERTA FRETE GRÁTIS ACIMA DE X REAIS ============ */
                (carrinho.minimoEntregaGratis < 999  && carrinho.minimoEntregaGratis > 0) && <AlertFixo severity={isFreteGratisMinimoEntrega ? "success" : "warning"} className="campoDeUmAlert">Frete Grátis acima de <b>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(carrinho.minimoEntregaGratis)}</b> no total dos produtos.</AlertFixo>}

                { /* ========== ALERTA MINIMO PARA REALIZAR PEDIDO ============ */
                carrinho.valorMinimoPedido > 0 && <AlertFixo severity={carrinho.pedido.valorTotal  > carrinho.valorMinimoPedido ? "success" : "warning"} className="campoDeUmAlert">O valor minimo do pedido é de <b>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(carrinho.valorMinimoPedido)} </b></AlertFixo>}

                  
                { /* ========== ALERTA DESCONTO PROXIMO PEDIDO ============ */
                  (cardapio.valorDesconto > 0 || cardapio.percentualDesconto > 0) &&
                  <AlertFixo className="campoDeUmAlert" severity="success">{"Desconto no próximo pedido  "}
                  <b>{cardapio.valorDesconto  > 0
                    ? Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cardapio.valorDesconto)  + " no valor dos produtos"
                    : cardapio.percentualDesconto + "% no valor dos produtos" }</b>
                  </AlertFixo>          
                }


                {/* {enderecoAtual.taxaEntrega === -1  */}
                {(isEntregaNoEndereco === false && temEndereco)

                ? /* ========== ALERTA ESTABELECIMENTO NAO ENTREGA NESSE ENDEREÇO ============ */ 
                (<AlertFixo className="campoDeUmAlert" onClick={() => {
                  if(estabelecimentoAtual.permiteRetiradaBalcao){
                    setTelaRetiradaOuEntrega(true)
                  }else{
                    irParaEnderecos()
                  }
                }} severity="error"> Essa loja não entrega no seu endereço <b>{enderecoAtual.logradouro}, {enderecoAtual.numero}</b> </AlertFixo>)

                : /* ========== ALERTA ENDEREÇO SELECIONADO ============ */
                ((enderecoAtual.logradouro && !isRetiradaNoLocal) ? <AlertFixo onClick={() => {
                  if(estabelecimentoAtual.permiteRetiradaBalcao){
                    setTelaRetiradaOuEntrega(true)
                  }else{
                    irParaEnderecos()
                  }
                }} severity="success"> Endereço selecionado é <b>{enderecoAtual.logradouro}, {enderecoAtual.numero}</b>  </AlertFixo> : null) }



                { /* ========== ALERTA RETIRADA NO LOCAL ============ */
                isRetiradaNoLocal && <AlertFixo style={{"cursor": "pointer"}} className="campoDeUmAlert" severity="success" onClick={() => {
                  if(estabelecimentoAtual.permiteRetiradaBalcao){
                    setTelaRetiradaOuEntrega(true)
                  }else{
                    irParaEnderecos()
                  }
                }}>Você selecionou Buscar no Local</AlertFixo>}


              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() =>{setOpenInformacoes(false)}} style={{"color": "#dc3545"}}>
                voltar
              </Button>
            </DialogActions>
          </Dialog>}
      

                    
      
      

      {cardapio.id && cardapio.categorias.length > 0 
      ? <><Row >
          <div className={classes.rootCardapio} style={(iphone || android) ? {"zIndex": '999'} : null}>
          <AppBar position="static" color="default" id="cabecalhoDeCategorias">
            <Tabs
              value={valueCategoria}
              onChange={mudarCategoria}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              { (cardapio.categorias.map((categoria, index) => (
                categoria.produtos.length > 0 
                ? <Tab key={index}
                onClick={() => {
                  //document.getElementById("primerioC"+index).scrollIntoView()
                  window.scrollTo(0, document.getElementById('primerioC'+index).offsetTop - 125);
                }} 
                label={categoria.nome} />   
                : null         
              )))}
              
            </Tabs>
          </AppBar>


          <TabPanel id="produtosDasCategorias">

          <OpcoesProdutos
            classes={classes}
            procurarProduto={procurarProduto}
            layoutCardapio={layoutCardapio}
            cardapio={cardapio}
          ></OpcoesProdutos>
                    
            {/* // ====== GRID E LIST ====== */}

            {(cardapio.categorias.map((categoria, indexC) => (     
              categoria.produtos.length > 0
              ? 
                <Row key={indexC} id={"primerioC"+indexC} className={"CardCategoriaCol"} >
                  <Col xs={12} md={12} lg={12} style={{"marginTop":"1em"}}><Typography style={{"fontSize": "1.5rem"}}> {categoria.nome[0].toLocaleUpperCase() + categoria.nome.substring(1).toLocaleLowerCase()} </Typography></Col>
                  
                {(categoria.produtos.map((produto, indexP) => (
                    
                    (layoutCardapio == "AdicionarInicial" &&
                    //====== AdicionarInicial ======
                    <Col xs={6} md={4} lg={4} key={produto.id} className="CardProdutoCol" style={{"textAlign":"center"}}>
                      <Card className={classes.rootProduto} style={{ "height": '100%' }} >
                          <CardMedia
                            className={`${produto.urlImagem ? '': 'opacity05'}  ${estabelecimentoAtual.fazerZoomExibicaoFoto ? "produtoDeGridZoom" : "produtoDeGrid"}`} 
                            image={produto.urlImagem ? produto.urlImagem : (produto.produtoExibicao ? Megafone : /**Prato */ Comida)}
                            title={produto.nome}
                          />

                          {produto.promocional 
                          ? <StarsIcon className={"ProdutoPromocional"}/>
                          : null}

                            <CardContent style={{"paddingRight": "5px"}}>
                            <Typography gutterBottom variant="h5" component="h2" className="nomeProduto">
                              {produto.nome}
                            </Typography>
                            <Typography variant="subtitle2" color="textSecondary" className="descricaoProduto" component="p">
                            {(produto.descricao && produto.descricao.length > 80) ? produto.descricao.substring(0, 80) + " [...]" : produto.descricao}

                            </Typography> 

                            { produto.produtoExibicao 
                            ? <Typography variant="body2" color="textSecondary" className="valorProduto" component="p">Aviso</Typography>
                            : <Typography variant="body2" color="textSecondary" className="valorProduto" component="p">
                                {
                                produto.valorRealCalculado >= 0 
                                ? <span>
                                    {aplicativoDados?.mostrarAPartirDe ? <span className="aPartirDe">a partir de </span> : null }
                                    {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }). format(produto.valorRealCalculado)}
                                  </span>
                                : <Skeleton variant="rect" width={80} height={30} />
                                }

                                {
                                produto.valorDe && 
                                produto.valorDeCalculado > 0 
                                ? <span className="valorProdutoPromocional"> {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.valorDeCalculado)} </span>
                                : ""
                                }
                                
                                {/* {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.valorRealCalculado)}
                                {(produto.valorDe && <span className="valorProdutoPromocional"> {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.valorDeCalculado)} </span>) } */}
                              </Typography>}
                              
                              {
                                !produto.produtoExibicao &&
                                <Row style={{"marginTop":"1em"}}>
                                  <Col xs={12} md={12} lg={12} className="colOpcaoAdicional">
                                    
                                  <ButtonGroup>
                                    <Button
                                      aria-label="reduce"
                                      onClick={() => {
                                        removerProdutoCarrinho(produto)
                                      }}
                                      disabled={produto.quantidade == 0 ? true : false}
                                      // style={{"background":"#dc3545", "color":"white"}}
                                      style={produto.quantidade == 0 ? {"background": "#7e7e7e", "color":"white"} : {"background":"#dc3545", "color":"white"}}

                                    >
                                      <RemoveIcon fontSize="small" />
                                    </Button>

                                    <Button
                                      aria-label="increase"
                                    >
                                      <span >{!(produto.quantidade == NaN || produto.quantidade == undefined) ? produto.quantidade  : 0}</span>
                                    </Button>


                                    <Button
                                      aria-label="increase"
                                      disabled={produto.quantidade == produto.qntMaximaProdutos ? true : false}
                                      style={produto.quantidade == produto.qntMaximaProdutos ? {"background": "#7e7e7e", "color":"white"} : {"background":"#28a745", "color":"white"}}
                                      onClick={() => {
                                        adicionarProdutoCarrinho(produto)
                                      }}
                                    >
                                      <AddIcon fontSize="small" />
                                    </Button>
                                  </ButtonGroup>

                                  
                                    
                                    {/* <Button color="secondary" onClick={() => {
                                      removerProdutoCarrinho(produto)
                                    }}>
                                      <RemoveCircleIcon></RemoveCircleIcon>
                                    </Button>
                                    <span >{!(produto.quantidade == NaN || produto.quantidade == undefined) ? produto.quantidade  : 0}</span>
                                    <Button color="primary" onClick={() => {
                                      adicionarProdutoCarrinho(produto)
                                    }}>
                                      <AddCircleIcon></AddCircleIcon>
                                    </Button> */}


                                  </Col>
                                </Row>
                              }
                              
                          </CardContent>
                      </Card>
                    </Col>) 

                    ||//====== LIST ======

                    (layoutCardapio == "List" && 
                    <Col xs={12} md={12} lg={6} key={produto.id} className="CardProdutoCol" >
                      <Card style={{"height": "100%"}} onClick={produto.produtoExibicao ? null : () => {
                            // if(carrinho?.pedido?.valorEntrega === -1 || carrinho?.pedido?.taxaEntrega === -1){
                            if(isEntregaNoEndereco === false && temEndereco){
                              if(estabelecimentoAtual.permiteRetiradaBalcao){
                                setRodarFuncaoAposIsso(`produto${produto.id}`)                                    
                                setTelaRetiradaOuEntrega(true)
                              }else{
                                irParaEnderecos()
                              }
                            }else{
                              irParaProduto(produto.id)
                            }                                
                          }}>
                      <CardActionArea >
                        <Row style={{"width": "100%", "alignItems": "center"}}>
                          <Col xs={8} md={8} lg={8} >
                            <CardContent>
                                <Typography component="h5" variant="h5" className="nomeProduto">
                                  {produto.nome}
                                </Typography>
                                <Typography variant="subtitle2" color="textSecondary" className="descricaoProduto">
                                  {(produto.descricao && produto.descricao.length > 80) ? produto.descricao.substring(0, 80) + " [...]" : produto.descricao}
                                </Typography>

                                
                                { produto.produtoExibicao 
                                ? <Typography variant="body2" color="textSecondary" className="valorProduto" component="p">Aviso</Typography>
                                : (<Typography variant="body2" color="textSecondary" className="valorProduto" component="p">
                                    {
                                    produto.valorRealCalculado >= 0 
                                    ? <span>
                                        {aplicativoDados?.mostrarAPartirDe ? <span className="aPartirDe">a partir de </span> : null }
                                        {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }). format(produto.valorRealCalculado)}
                                      </span>
                                      
                                    : <Skeleton variant="rect" width={80} height={30} />
                                    }

                                    {
                                    produto.valorDe && 
                                    produto.valorDeCalculado > 0 
                                    ? <span className="valorProdutoPromocional"> {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.valorDeCalculado)} </span>
                                    : ""
                                    }
                                    
                                  </Typography>)}
                              
                              </CardContent>
                          </Col>
                            <CardMedia
                              className={`${produto.urlImagem ? '' : 'opacity05'} col-lg-4 col-md-4 col-4 produtoDeList ${estabelecimentoAtual.fazerZoomExibicaoFoto ? "produtoDeListFotoZoom" : "produtoDeListFoto"}`}

                              
                              // onClick={() => {
                              //   setMostrarFotoProduto(produto)
                              //   setAbrirMostrarFotoProduto(true)
                              // }}
                              image={produto.urlImagem ? produto.urlImagem : (produto.produtoExibicao ? Megafone : /**Prato */ Comida)}
                              title={produto.nome}
                            />
                            {produto.promocional 
                            ? <StarsIcon className={"ProdutoPromocional"}/>
                            : null}
                        </Row>
                        </CardActionArea>
                      </Card>
                    </Col>)

                  ||//====== GRID ======
                  (layoutCardapio == "Grid" &&
                      <Col xs={6} md={4} lg={4} key={produto.id} className="CardProdutoCol">
                        <Card className={classes.rootProduto} style={{ "height": '100%' }} onClick={produto.produtoExibicao ? null : () => {
                                // if(carrinho?.pedido?.valorEntrega === -1 || carrinho?.pedido?.taxaEntrega === -1){
                                if(isEntregaNoEndereco == false && temEndereco){
                                  if(estabelecimentoAtual.permiteRetiradaBalcao){
                                    setTelaRetiradaOuEntrega(true)
                                  }else{
                                    irParaEnderecos()
                                  }
                                }else{
                                  irParaProduto(produto.id)
                                }  
                              }}>
                          <CardActionArea style={{/*"height": "100%"*/}} >
                            <CardMedia
                              className={`${produto.urlImagem ? '' : 'opacity05'}  ${estabelecimentoAtual.fazerZoomExibicaoFoto ? "produtoDeGridZoom " : "produtoDeGrid"}`} 
                              image={produto.urlImagem ? produto.urlImagem : (produto.produtoExibicao ? Megafone : /**Prato */ Comida)}
                              title={produto.nome}
                            />

                            {produto.promocional 
                            ? <StarsIcon className={"ProdutoPromocional"}/>
                            : null}

                              <CardContent >
                              <Typography gutterBottom variant="h5" component="h2" className="nomeProduto">
                                {produto.nome}
                              </Typography>
                              <Typography variant="subtitle2" color="textSecondary" className="descricaoProduto" component="p">
                              {(produto.descricao && produto.descricao.length > 80) ? produto.descricao.substring(0, 80) + " [...]" : produto.descricao}

                              </Typography> 

                              { produto.produtoExibicao 
                              ? <Typography variant="body2" color="textSecondary" className="valorProduto" component="p">Aviso</Typography>
                              : <Typography variant="body2" color="textSecondary" className="valorProduto" component="p">
                                  {
                                    produto.valorRealCalculado >= 0 
                                    ? <span>
                                        {aplicativoDados?.mostrarAPartirDe ? <span className="aPartirDe">a partir de </span> : null }
                                        {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }). format(produto.valorRealCalculado)}
                                      </span>
                                    : <Skeleton variant="rect" width={80} height={30} />
                                    }

                                    {
                                    produto.valorDe && 
                                    produto.valorDeCalculado > 0 
                                    ? <span className="valorProdutoPromocional"> {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.valorDeCalculado)} </span>
                                    : ""
                                  }
                                  
                                {/* {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.valorRealCalculado)}
                                  {(produto.valorDe && <span className="valorProdutoPromocional"> {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.valorDeCalculado)} </span>) } */}
                                </Typography>}
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Col>)
                )))}
              </Row>
              : null
            )))}

          </TabPanel> 
          </div>
      </Row>
      </>
      : <div className="divImageCentroCardapio" >
        <Row>
          <Col  xs={12} md={12} lg={12} >
            <h4 style={{"fontWeight": "100", "marginTop": "1em"}}>Cardápio Não Encontrado...</h4>  
          </Col>
          <Col  xs={12} md={12} lg={12} >
            <Button
              variant="contained"
              color="primary"
              onClick={()=>verificarCardapio(estabelecimentoAtual)}
              className={classes.button}
            >
                Buscar Cardápio Novamente
            </Button>
          </Col>
          <Col  xs={12} md={12} lg={12} >
            <img src={carrinhoVazio} alt={"carrinho vazio"} className="pretoEBranco" />
          </Col>
        </Row>

       
          
         
        </div>}
           
        {
          aplicativoDados?.exibirDesenvolvidoPor &&
          <Row>
            <Col xs={12} md={12} lg={12} style={{"textAlign": "center"}} >
              <a target="new_blank" href={"http://appclientefiel.com.br/?utm_source=siteDeAlgumCliente"}>
                <img className="desenvolvidopor" src={DesenvolvidoPor} />
              </a>
            </Col>
          </Row>
        }
        
             
        <Carrinho
                carrinho={carrinho}
                solicitarTelefoneAoFinalizar={solicitarTelefoneAoFinalizar}
                solicitarNomeAoFinalizar={solicitarNomeAoFinalizar}
                iphone={iphone}
                valorTaxaEntrega={valorTaxaEntrega}
                android={android}
                classes={classes}
                setCarrinhoOpen={setCarrinhoOpen}
                estabelecimentoAtual={estabelecimentoAtual}
                aplicativoDados={aplicativoDados}
                quantidadeProdutos={quantidadeProdutos}
                removeItem={removeItem}
                setRemoveItem={setRemoveItem}
                removeItemSelecionado={removeItemSelecionado}
                setCarrinho={setCarrinho}
                calcularValorTotal={calcularValorTotal}
                setAdicionarCupom={setAdicionarCupom}
                adicionarCupom={adicionarCupom}
                fullScreen={fullScreen}
                carrinhoOpen={carrinhoOpen}
                isEntregaNoEndereco={isEntregaNoEndereco}
                usuarioPedidoMesa={usuarioPedidoMesa}
                setInformacoesDoTipoEntrega={setInformacoesDoTipoEntrega}
                isRetiradaNoLocal={isRetiradaNoLocal}
                isUsuarioPedidoMesa={isUsuarioPedidoMesa}
                temEndereco={temEndereco}
                setEnderecoAtual={setEnderecoAtual}
                enderecoAtual={enderecoAtual}
                setTelaRetiradaOuEntrega={setTelaRetiradaOuEntrega}
                usuarioLogado={usuarioLogado}
                setContinuarSemCadastro={setContinuarSemCadastro}
                continuarSemCadastro={continuarSemCadastro}
                isFreteGratisMinimoEntrega={isFreteGratisMinimoEntrega}
                setPagamentoOpen={setPagamentoOpen}
                alertStart={alertStart}
                setRodarFuncaoAposIsso={setRodarFuncaoAposIsso}
                setInformacoesPedido={setInformacoesPedido}
                irParaEnderecos={irParaEnderecos}
                qrCodeModal={qrCodeModal}
                setQrCodeModal={setQrCodeModal}
                informacoesPedido={informacoesPedido}
                isNumeric={isNumeric}
                nomeMesa={nomeMesa}
                numeroMesas={numeroMesas}
                confirmacaoInformacoes={confirmacaoInformacoes}
                formaDePagamento={formaDePagamento}
                setFormaDePagamento={setFormaDePagamento}
                setLoading={setLoading}
                obterMeusCartoesSalvos={obterMeusCartoesSalvos}
                setPagamentoOnline={setPagamentoOnline}
                troco={troco}
                setTroco={setTroco}
                formatReal={formatReal}
                getMoney={getMoney}
                setCriarCartao={setCriarCartao}
                setAbrirMostrarFotoProduto={setAbrirMostrarFotoProduto}
                irParaProduto={irParaProduto}
                selecioneiRetiradaNoLocal={selecioneiRetiradaNoLocal}
                selecioneiEndereco={selecioneiEndereco}
                cardapio={cardapio}
                descontoCardapio={descontoCardapio}
                removerCupom={removerCupom}
                setRemoveItemSelecionado={setRemoveItemSelecionado}
                pagamentoOpen={pagamentoOpen}
                irParaLogin={irParaLogin}
                AdicionarCupom={AdicionarCupom}
                AvatarTipoEntrega={AvatarTipoEntrega}
                ReactPixel={ReactPixel}
                EnderecoPedidoMesa={EnderecoPedidoMesa}
                QRCode={QRCode}
                PagamentoOnline={PagamentoOnline}
                MeusCartoes={MeusCartoes}
                CriarCartao={CriarCartao}
                VerificarPagamentoOnline={VerificarPagamentoOnline}
                EscolhiMeuCartaoPagamentoOnline={EscolhiMeuCartaoPagamentoOnline}
                InformacoesDoTipoEntrega={InformacoesDoTipoEntrega}
                AbrirMostrarFotoProduto={AbrirMostrarFotoProduto}
                MostrarFotoProduto={MostrarFotoProduto}
                TelaRetiradaOuEntrega={TelaRetiradaOuEntrega}
            />
       

      
        
    </div>

  );
}