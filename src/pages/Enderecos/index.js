import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './styles.css';
import Cabecalho from '../Global/cabecalho';
import Rodape from '../Global/rodape';
import CardMedia from '@material-ui/core/CardMedia';

import {
  ComumCep,
  CadastrarEnderecoCliente,
  ObterCardapioCompletoV1, 
  ObterCardapioPedidoMesa,
  identificarEstabelecimentoSelecionado
} from '../../services/functions';
import * as Sentry from "@sentry/react";

import api from '../../services/api';

import {  Row, Col } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import enderecosVazios from '../../assets/endereco-flat.svg';

import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle';

import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


//alert
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

/* modal */
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';


//import Loading from '../loading';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';


const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  rootAlert: {
    zIndex: theme.zIndex.drawer + 9999,
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  pos: {
    marginBottom: 12,
  },
  rootForm: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1, 0),
      //width: '25ch',
    },
  },
  alertIndex: {
    zIndex: '999999',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 999,
    color: '#fff',
  },
}));

function qtdEnderecos(enderecos){
  let qtd = 0;
  enderecos.forEach(endereco => {
    if(endereco.ativo === true){
      qtd++;
    }
  });
  return qtd;
}


export default function Estabelecimento() {
  const classes = useStyles();
  const history = useHistory();
  
  const aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF"))
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioCF"))
  const [enderecos, setEnderecos] = useState(usuarioLogado.cliente?.enderecos ? usuarioLogado.cliente.enderecos : []);  
  const qtdEnd = qtdEnderecos(enderecos)

  const estabelecimentoAtual = JSON.parse(localStorage.getItem("estabelecimentoAtualCF"))
  const enderecoAtual = JSON.parse(localStorage.getItem("enderecoAtualCF"))
  const [loading, setLoading] = React.useState(false);
  
  //console.log("aplicativoDados", aplicativoDados)
  //console.log("enderecos", enderecos)


  // dados para adicionar cep
  const [temCEP, setTemCEP] = React.useState(false);
  
  const [cidadesNaoSeiCep, setCidadesNaoSeiCep] = React.useState([]);
  const [bairrosCepUnico, setBairrosCepUnico] = React.useState([]);
  const [bairroCepUnicoSelecionado, setBairroCepUnicoSelecionado] = React.useState('');
  const [cep, setCep] = React.useState('');
  const [uf, setUf] = React.useState('');
  const [cidade, setCidade] = React.useState('');
  const [bairro, setBairro] = React.useState('');
  const [rua, setRua] = React.useState('');
  const [numero, setNumero] = React.useState('');
  const [complemento, setComplemento] = React.useState('');
  const [referencia, setReferencia] = React.useState('');

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

  const [openAdicionarEndereco, setOpenAdicionarEndereco] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const closeAdicionarEndereco = () =>{
    setOpenAdicionarEndereco(false)    
    setTimeout(() => {
      setTemCEP(false)
    }, 300);
  }

  const removerEndereco = (index) => {
    try {
      setLoading(true)
      enderecos[index].ativo = false
      const data = enderecos[index]
      data.idCliente = usuarioLogado.cliente.id
      data.idEstabelecimento = estabelecimentoAtual.id
      data.token = `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`

      if(enderecoAtual.id === enderecos[index].id){
        localStorage.setItem('enderecoAtualCF', JSON.stringify({}))
      }
      const response = CadastrarEnderecoCliente(data, aplicativoDados)
  
      if(response.retornoErro){
        //algum erro
        alertStart(response.mensagem, "error")
      }else{ 
        //tudo certo
        // DEU CERTO
        usuarioLogado.cliente.enderecos[index] = response
        localStorage.setItem('usuarioCF', JSON.stringify(usuarioLogado))
        
        setEnderecos(usuarioLogado.cliente.enderecos)
        alertStart("Endereço Removido!", "success")
      }
    }
    catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions CadastrarEnderecoCliente ${window.location.hostname} - ${error}`);
        alertStart("Procure os desenvolvedores! Erro: "+error.message, "error")    
    }

    setLoading(false)
    
  }

  const adicionarEndereco = async () => {

    try {
      
  
      

      const data = {
        "idCliente": usuarioLogado.cliente.id,
        "idEstabelecimento": estabelecimentoAtual.id,
        "cep": cep,
        "uf": uf,
        "cidade": cidade,
        "bairro": bairro,
        "logradouro": rua,
        "numero": numero,
        "complemento": complemento,
        "referencia": referencia,
        "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
      }

      
      if(aplicativoDados.tipoEntregaBairro == 1){
        data.bairroEspecifico = 1
      }else{
        data.bairroEspecifico = 0
      }

      if(!cep){
        alertStart("Necessario o preenchimento do CEP!", "warning")     
        document.getElementById("cadastroCep").focus()
        return false
      }else if(!uf){
        alertStart("Necessario o preenchimento da sigla do estado!", "warning")     
        document.getElementById("cadastroUf").focus()
        return false
      }else if(!cidade){
        alertStart("Necessario o preenchimento da cidade!", "warning")     
        document.getElementById("cadastroCidade").focus()
        return false
      }else if(!bairro){
        alertStart("Necessario o preenchimento do bairro!", "warning")     
        document.getElementById("cadastroBairro").focus()
        return false
      }else if(!rua){
        alertStart("Necessario o preenchimento da rua!", "warning")     
        document.getElementById("cadastroRua").focus()
        return false
      }else if(!numero){
        alertStart("Necessario o preenchimento do numero!", "warning")     
        document.getElementById("cadastroNumero").focus()
        return false
      }
      // }else if(!complemento){
      //   alertStart("Necessario o preenchimento do complemento!", "warning")     
      //   document.getElementById("cadastroComplemento").focus()
      //   return false
      // }
      setLoading(true)

      const response = await CadastrarEnderecoCliente(data, aplicativoDados)

      if(response.retornoErro){
          //algum erro
          alertStart(response.mensagem, "error")
          setLoading(false)
          closeAdicionarEndereco()
      }else{ 
          //tudo certo
          // DEU CERTO

          /*const newEnderecos = enderecos
          newEnderecos.push(retorno.data)
          //console.log("newEnderecos", newEnderecos)
          setEnderecos(newEnderecos)*/
          alertStart(response.mensagem, "success")     


          usuarioLogado.cliente.enderecos.push(response)
          localStorage.setItem('usuarioCF', JSON.stringify(usuarioLogado))
          
          buscarCardapio(response)
          
      }
    }
    catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions buscarCardapioOffline ${window.location.hostname} - ${error}`);
        alertStart("Procure os desenvolvedores! Erro: "+error.message, "error")    
        setLoading(false)
    }
  

    
  }



  async function calcularValorTotal(){
    const cardapio = JSON.parse(localStorage.getItem("cardapioCF"))
    const carrinho = JSON.parse(localStorage.getItem("carrinhoCF"))
    const enderecoAtual = JSON.parse(localStorage.getItem("enderecoAtualCF"))
    
    

    let valorTotalItens = 0;
    let valorProdutosPromocionais = 0;

    carrinho.pedido.itens.forEach(item => {
      valorTotalItens += item.valorProdutoHistorico      
      if(item.produto.promocional){
        valorProdutosPromocionais += item.valorProdutoHistorico
      }
    })

    //console.log("valorProdutosPromocionais", valorProdutosPromocionais)
    //console.log("valorPrduto", valorTotalItens)
    
    


    let taxaDeEntrega = 0
    if(enderecoAtual?.id !== "retirada" && !(valorTotalItens > cardapio.minimoEntregaGratis && cardapio.minimoEntregaGratis > 0)){ // NAO FOR RETIRADA NO LOCAL
      taxaDeEntrega = carrinho.pedido.valorEntrega ? carrinho.pedido.valorEntrega : enderecoAtual.taxaEntrega ? enderecoAtual.taxaEntrega : 0
    }

    let valorFinalProdutos = 0;
    if(cardapio.percentualDesconto && (cardapio.valorDesconto === 0 || !cardapio.valorDesconto)){
      //desconto percetual - apenas em produtos nao promocionais
      var descontoPercentual = ((valorTotalItens - valorProdutosPromocionais) * cardapio.percentualDesconto) / 100

      //maximo que pode dar de desconto
      if(cardapio.maximoDesconto && descontoPercentual > cardapio.maximoDesconto){
        descontoPercentual = cardapio.maximoDesconto
      }
      

      carrinho.percentualDescontoValor = descontoPercentual
      valorFinalProdutos = ( valorTotalItens - descontoPercentual ) 

    }else{
      //desconto fixo - apenas em produtos nao promocionais
      var descontoFixo = carrinho.pedido.valorDesconto

      //maximo que pode dar de desconto
      if(cardapio.maximoDesconto && descontoFixo > cardapio.maximoDesconto){
        descontoFixo = cardapio.maximoDesconto
      }

      // let produtosNaoPromocionais = valorTotalItens - valorProdutosPromocionais
      // produtosNaoPromocionais -= descontoFixo      
      // valorFinalProdutos = valorProdutosPromocionais + (produtosNaoPromocionais > 0 ? produtosNaoPromocionais : 0)    
      valorFinalProdutos = valorTotalItens - descontoFixo   

    }

    //console.log("valorFinalProdutos", valorFinalProdutos)
    if(valorFinalProdutos < 0){
      carrinho.pedido.valorTotal = taxaDeEntrega
    }else{
      carrinho.pedido.valorTotal = valorFinalProdutos + taxaDeEntrega
    }

    if(carrinho.pedido.valorTotal < 0){
      carrinho.pedido.valorTotal = 0.0
    }

    localStorage.setItem("carrinhoCF", JSON.stringify(carrinho)) 
  }

  const buscarCardapio = async (endereco) => {  
    setLoading(true)

    try {
      let data = {
        "idCliente": usuarioLogado.cliente.id,
        "idEstabelecimento": estabelecimentoAtual.id,
        "idEndereco": endereco.id,
        "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
      }              

      
      const mesaLogada = !!JSON.parse(localStorage.getItem('usuarioPedidoMesaCF'))?.logado
      const response = mesaLogada ? await ObterCardapioPedidoMesa(data, aplicativoDados) : await ObterCardapioCompletoV1(data, aplicativoDados)

        if(response.retornoErro){
            //algum erro
            setLoading(false)
          alertStart(response.mensagem, "error")
        }else{ 
            //tudo certo
            const retorno = response
            if(!JSON.parse(localStorage.getItem('usuarioCF')).logado){
              retorno.id = "usuarioDeslogado"
            }
            const carrinhoRetorno = JSON.parse(localStorage.getItem("carrinhoCF")) 
            const cardapio = JSON.parse(localStorage.getItem("cardapioCF"))
            
            
    
            carrinhoRetorno.valorMinimoPedido = retorno.valorMinimoPedido
            carrinhoRetorno.valorDesconto = retorno.valorDesconto
            carrinhoRetorno.percentualDesconto = retorno.percentualDesconto
            carrinhoRetorno.minimoEntregaGratis = retorno.minimoEntregaGratis
            carrinhoRetorno.maximoPedidoComDesconto = retorno.maximoPedidoComDesconto
            carrinhoRetorno.maximoDesconto = retorno.maximoDesconto
            carrinhoRetorno.cupomDesconto = retorno.cupomDesconto
      
            
            let enderecoSelecionadoNoRetorno = retorno?.enderecos[0]
            if(retorno.enderecos.length > 1){
              for(let j = 0; j < retorno.enderecos.length; j++){
                if(endereco.id === retorno.enderecos[j].id){
                  enderecoSelecionadoNoRetorno = retorno.enderecos[j]
                  break;
                }
              }
            }
            const produtosDoCarrinho = JSON.parse(localStorage.getItem('backupItensCarrinhoCF'))
            
            carrinhoRetorno.pedido = {
              "entregaImediata": false,
              "formaPagamento": {},
              "itens": produtosDoCarrinho?.length > 0 ? produtosDoCarrinho : [],
              "taxaEntrega": enderecoSelecionadoNoRetorno ? enderecoSelecionadoNoRetorno.taxaEntrega : null,
              //"tipoDesconto": null,
              "tokenCartaoCredito": null,
              "troco": null,
              "valorDesconto": carrinhoRetorno.valorDesconto,
              "valorEntrega": enderecoSelecionadoNoRetorno ? enderecoSelecionadoNoRetorno.taxaEntrega : null,
              "valorTotal": enderecoSelecionadoNoRetorno ? enderecoSelecionadoNoRetorno.taxaEntrega : null,
              "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
            }
      
            if(!retorno?.cupomDesconto?.codigoCupom){
              retorno.cupomDesconto = cardapio.cupomDesconto
              if(cardapio?.cupomDesconto?.freteGratis){
                carrinhoRetorno.pedido.valorEntrega = 0;
                carrinhoRetorno.pedido.taxaEntrega = 0;
                if(enderecoSelecionadoNoRetorno.bairro){
                  enderecoSelecionadoNoRetorno.taxaEntrega = 0;          
                }
              }
            }
            
            localStorage.setItem("cardapioCF", JSON.stringify(retorno))          
      
            localStorage.setItem("enderecoAtualCF", JSON.stringify(enderecoSelecionadoNoRetorno?.bairro ? enderecoSelecionadoNoRetorno : {}))    
      
            localStorage.setItem("carrinhoCF", JSON.stringify(carrinhoRetorno)) 
            
            if(produtosDoCarrinho?.length > 0){
              await calcularValorTotal()
            }else{
              if(carrinhoRetorno.pedido.taxaEntrega == -1 && aplicativoDados.estabelecimentos.length > 1){
                history.push(`/estabelecimento`) 
                return true
              }
            }
      
            history.push(`/delivery${identificarEstabelecimentoSelecionado(aplicativoDados)}`)
        }
    }
    catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions ObterCardapioPedidoMesa, ObterCardapioCompletoV1 ${window.location.hostname} - ${error}`);
        alertStart("Procure os desenvolvedores! Erro: "+error.message, "error")    
    }
  }

  const naoSeiCep = async (e) => {
    setLoading(true)
    try {
      await api.post("comum/CidadesAtendidasPorAplicativo", {"appNome": aplicativoDados.appNome}, {
        headers: {"Content-Type": "application/json"}
      }).then(retorno => {
        console.log('CidadesAtendidasPorAplicativo> ', retorno)
        setTemCEP(true)
        setCidadesNaoSeiCep(retorno.data);
      })
    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`${aplicativoDados.appNome} - ${error} - CidadesAtendidasPorAplicativo`);

      alertStart("Erro não identificado ao buscar CidadesAtendidasPorAplicativo", "error")   
    }
    setLoading(false);
  }

  const alterarCidade = async (e) => {      
    setLoading(true)                        
    try {
      await api.post("comum/Bairros", cidadesNaoSeiCep[e.target.value], {
        headers: { "Content-Type": "application/json", "app": aplicativoDados.appNome}
      }).then(retorno => {
        console.log("Bairros", retorno)
        setBairrosCepUnico(retorno.data)
        setCep("00000000");
        setBairroCepUnicoSelecionado(0)
      })
    } catch (error) {
      Sentry.captureMessage(localStorage.getItem('versao')+`${aplicativoDados.appNome} - ${error} - comum/Bairros`);

      alertStart("Erro não identificado ao buscar Bairros", "error")                                   
    }
    setLoading(false)                        
  }

  const digitandoCep = async (e) => {

    try {
      let valorInput = e.target.value
      valorInput = valorInput.replace(/-/g, '')
      valorInput = valorInput.replace(/ /g, '')
      valorInput = valorInput.replace(/\//g, '')
      
      console.log("valorInput", valorInput)
      if(valorInput.length == 8 ){
        setCep(valorInput)

        setLoading(true)
        //buscar dados do cep
        const response = await ComumCep(valorInput, aplicativoDados)
    
        if(response.retornoErro){
          //algum erro
          alertStart(response.mensagem, "error")
        }else{ 
          //tudo certo
          if(response.id || response.logradouro){
            //TEM 1 ENDEREÇO
            alertClose()
            setBairro(response.bairro)
            setCidade(response.localidade)
            setRua(response.logradouro)
            setUf(response.uf)
            setTemCEP(true)                            
          }else if(response.bairros.length >= 1){
            //CIDADE COM CEP UNICO, TEM VARIOAS BAIRROS
            alertClose()
            setTemCEP(true)
            setBairrosCepUnico(response.bairros)
            
          }else{
            //DEU ERRO, OU NAO EXISTE
            alertStart("CEP não encontrado", "error")   
            setCep('')
            document.getElementById("cepDigitando").focus()

          }
        }
        setLoading(false)
      }
    }
    catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions digitandoCep ${window.location.hostname} - ${error}`);
        alertStart("Procure os desenvolvedores! Erro: "+error.message, "error")   
        setLoading(false)
    }
  }

  return (
    <>
      {loading &&
        (<Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>)}

      <Snackbar open={alert.status} autoHideDuration={6000} onClose={alertClose} className={classes.alertIndex}>
          <Alert onClose={alertClose} severity={alert.tipo}>
          {alert.mesangem}
          </Alert>
      </Snackbar>
        
      <Cabecalho voltar={true} produtoNome={usuarioLogado?.cliente?.nome} ></Cabecalho>
      <div className="container container-Estabelecimento">
        <Row>
          <Col xs={12} md={12} lg={12} >
            <Typography gutterBottom variant="h5" >
              Selecione o endereço para entrega
            </Typography>
          </Col>

          <Col xs={7} md={7} lg={7} style={{"alignSelf": "center"}}>            
            {qtdEnd} {qtdEnd > 1 ? "Endereços cadastrados" : "Endereço cadastrado"} 
          </Col>
          <Col xs={5} md={5} lg={5} >            
            <Button variant="contained" onClick={() => { 
                setBairrosCepUnico([])
                setBairroCepUnicoSelecionado(null)
                setCep('')
                setUf('')
                setCidade('')
                setBairro('')
                setRua('')
                setNumero('')
                setComplemento('')
                setReferencia('')
                setOpenAdicionarEndereco(true) 
              }} style={{"backgroundColor": `#28a745`, "color":"white"}} >
              Adicionar 
            </Button>
          </Col>
          
          { enderecos.length

            //TEM ENDEREÇO
            ? (enderecos.map( (endereco, index) => (
              endereco.ativo === true ?
                (<React.Fragment key={index}>
                  <Col xs={12} md={6} lg={4} key={index} style={{"margin": "1em 0"}}  >
                      
                      <Card className={classes.root} style={{"height": "100%"}}>
                        <CardActionArea  style={{ "height": "calc(100% - 30px)", "flexFlow": "column-reverse", "alignItems": "normal"}}>
                          
                          <Row style={{"margin":0,"textAlign": "", "width": "100%", "padding": "1em", "alignItems": "center"}}>
                            <Col xs={3} md={3} lg={3} style={{"padding":0}}>
                              <PersonPinCircleIcon style={{
                                "width": "100%",
                                "height": "100%"
                              }}/>
                            </Col>
                            <Col xs={9} md={9} lg={9}>
                              
                              <Typography variant="body2" color="textSecondary" component="p" >
                              {endereco.cidade} / {endereco.uf}
                              </Typography>

                              <Typography gutterBottom  component="h2" >                    
                              {endereco.bairro}
                              </Typography>
                              
                              <Typography className={"StatusEstabelecimento"} variant="body2"  component="p">
                              {endereco.logradouro} n° {endereco.numero}
                              </Typography>


                              {endereco.complemento && <Typography variant="body2" color="textSecondary" component="p" >
                              {endereco.complemento}
                              </Typography>}

                              {endereco.referencia && <Typography variant="body2" color="textSecondary" component="p" >
                              {endereco.referencia}
                              </Typography>}

                              
                            </Col>
                          
                          </Row>
                          
                          <CardContent style={{"padding": "0 16px"}}>
                          
                          </CardContent>
                        </CardActionArea>
                        <CardActions style={{"padding":"0"}}>
      
                          
                          <Button size="small" className={"botaoVerde naoArredondado"} 
                            onClick={() =>{
                              buscarCardapio(endereco)
                            }}>
                              Selecionar
                            </Button>
      
                            <Button size="small" className={"botaoVermelho naoArredondado"} 
                              onClick={() =>{
                                removerEndereco(index)
                            }}>
                              Remover
                            </Button>
                          
                        </CardActions>
                      </Card>
                    </Col>
              </React.Fragment>
                
                
                
                
                
                
                
                
                
                
                
                
                
                
              //   <Col xs={12} md={6} lg={4} key={endereco.id} className="enderecoAtivo" style={{"margin": "1em 0"}}>                
              //   <Card className={classes.root}>
              //     <CardActionArea onClick={() =>{
              //         buscarCardapio(endereco)
              //       }}>                   
              //       <CardContent>
              //         <PersonPinCircleIcon/>
              //         <Typography  variant="h6" component="h3">                    
              //         {endereco.logradouro}
              //         </Typography>
              //         <Typography variant="body2" color="textSecondary" component="p">
              //         n° {endereco.numero}, {endereco.bairro} - {endereco.cidade} / {endereco.uf}
              //         </Typography>
              //       </CardContent>
              //     </CardActionArea>
              //     <CardActions>
              //       <Button size="small" color="primary" onClick={() =>{
              //         buscarCardapio(endereco)
              //       }}>
              //         Selecionar
              //       </Button>
              //       <Button size="small" style={{"position": "absolute", "right": "3em", "color": "#dc3545"}} onClick={() =>{
              //         removerEndereco(index)
              //       }}>
              //         Excluir
              //       </Button>
              //     </CardActions>
              //   </Card>
              // </Col>
              
              ) 
              : null             
            )))
            
            //NAO TEM ENDEREÇO
            : <div className="divImageCentroCardapio" >
                <img alt={"sem endereços cadastrados"} src={enderecosVazios} className="pretoEBranco" />
              </div>
          }   
        </Row>


        <Dialog
        fullScreen={fullScreen}
        open={openAdicionarEndereco}
        onClose={closeAdicionarEndereco}
        aria-labelledby="adicionar-endereco">
        <DialogTitle id="adicionar-endereco">{"Adicionar Endereço"}</DialogTitle>
        <DialogContent>
            <form className={classes.rootForm} noValidate autoComplete="off" name="adicionarEndereco">
              
              {
                temCEP
                //COM CEP
                ?                     
                 (<Row style={{"textAlign": "center"}}>
                  <Col xs={12} md={12} lg={12}>
                    <Typography gutterBottom variant="h5" >
                      Complete o endereço 
                    </Typography>
                  </Col>
                  
                  {
                    (cidadesNaoSeiCep.length > 0 && (cep == "00000000" || !cep)) &&
                    (<Col xs={12} md={12} lg={12}>

                        <FormControl variant="outlined" style={{"width": "100%", "marginBottom": "1em"}}>
                          <InputLabel>Selecione a Cidade</InputLabel>
                          <Select                           
                            fullWidth
                            onChange={alterarCidade}
                            label="Selecione a Cidade"
                          >
                            
                             {cidadesNaoSeiCep.map((cidade, index) => (
                                <MenuItem key={cidade.id} value={index}>{cidade.nomeCompleto}</MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                    </Col>)
                  }

                  {
                    bairrosCepUnico.length > 0 &&
                    (<Col xs={12} md={12} lg={12}>

                        <FormControl variant="outlined" style={{"width": "100%", "marginBottom": "1em"}}>
                          <InputLabel id="demo-simple-select-outlined-label">Selecione o Bairro</InputLabel>
                          <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            fullWidth
                            // value={bairroCepUnicoSelecionado == null ? null : bairroCepUnicoSelecionado}
                            onChange={(e) => {
                              console.log("bairro selecionei", bairrosCepUnico[e.target.value])
                              setBairroCepUnicoSelecionado(e.target.value)
                              setUf(bairrosCepUnico[e.target.value]?.cidade?.estado?.sigla)
                              setCidade(bairrosCepUnico[e.target.value]?.cidade?.nome)
                              setBairro(bairrosCepUnico[e.target.value].nome)
                            }}
                            label="Selecione o Bairro"
                          >
                             {bairrosCepUnico.map((bairro, index) => (
                                <MenuItem key={bairro.id} value={index}>{bairro.nome}</MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                    </Col>)
                  }

                  { ((bairroCepUnicoSelecionado != null || bairrosCepUnico.length === 0 ) && (cidadesNaoSeiCep.length === 0 || bairroCepUnicoSelecionado != null)) && 
                    (<>
                    
                    {
                      bairrosCepUnico.length > 0
                      ? null
                      :   <Col xs={12} md={12} lg={12}>
                            <TextField
                              disabled                    
                              fullWidth
                              name="CEP"
                              // value={cep}
                              id="cadastroCep"
                              label="CEP"
                              /*defaultValue="Hello World"*/
                              variant="outlined"
                            />
                          </Col>
                    }
                   
                    <Col xs={12} md={6} lg={6} >
                      <TextField
                        disabled
                        fullWidth                    
                        required
                        value={uf}
                        name="UF"
                        id="cadastroUf"
                        label="UF"
                        variant="outlined"
                      />
                    </Col>

                    {
                      !cidadesNaoSeiCep.length > 0
                      ? <Col xs={12} md={6} lg={6} >                                           
                      <TextField
                        required
                        fullWidth
                        disabled
                        value={cidade}
                        name="CIDADE"
                        id="cadastroCidade"
                        label="CIDADE"
                        variant="outlined"
                      />
                    </Col>
                    : null
                    }
                    
                    {
                      bairrosCepUnico.length > 0
                      ? null
                      : <Col xs={12} md={6} lg={6} >
                          <TextField
                            disabled
                            fullWidth                 
                            required
                            value={bairro}
                            name="BAIRRO"
                            id="cadastroBairro"
                            label="BAIRRO"
                            variant="outlined"
                          />
                        </Col>
                    }
                    
                    <Col xs={12} md={6} lg={6} >
                      <TextField
                        required
                        fullWidth
                        //autoFocus={bairrosCepUnico.length ? true : false}
                        disabled={bairrosCepUnico.length ? false : true}                      
                        name="RUA"
                        onChange={(e) => {
                          setRua(e.target.value)
                        }}
                        value={rua}
                        id="cadastroRua"
                        label="RUA"
                        variant="outlined"
                      />
                    </Col>
                    <Col xs={12} md={6} lg={6} >
                      <TextField
                        //autoFocus
                        fullWidth
                        required
                        name="NUMERO"
                        value={numero}
                        onChange={(e) => {
                          setNumero(e.target.value)
                        }}
                        id="cadastroNumero"
                        label="NUMERO"
                        variant="outlined"
                        type="number"
                      />
                    </Col>
                    <Col xs={12} md={6} lg={6} >
                      <TextField
                        fullWidth
                        value={complemento}
                        onChange={(e) => {
                          setComplemento(e.target.value)
                        }}
                        name="COMPLEMENTO"
                        id="cadastroComplemento"
                        label="COMPLEMENTO"
                        variant="outlined"
                      />
                    </Col>
                    <Col xs={12} md={6} lg={6} >
                    <TextField
                      fullWidth
                      value={referencia}
                      onChange={(e) => {
                        setReferencia(e.target.value)
                      }}
                      name="REFERENCIA"
                      id="cadastroReferencia"
                      label="REFERENCIA"
                      variant="outlined"
                    />
                  </Col></>)
                  }                  
                  </Row>)
                //SEM CEP
                : (<Row style={{"textAlign": "center"}}><Col xs={12} md={12} lg={12}>
                  <Typography gutterBottom variant="h5" >
                    Digite o seu CEP
                  </Typography>
                </Col>
                <Col xs={12} md={12} lg={12}>
                  <TextField
                    type="text"
                    // value={cep}
                    disabled={cep.length >= 8 ? true : false}
                    autoFocus
                    fullWidth
                    required
                    name="CEP"
                    id="cepDigitando"
                    label="CEP"
                    variant="outlined"
                    onChange={digitandoCep}
                  />
                </Col>
                <Col xs={12} md={12} lg={12} className="mt-3 mb-3">
                  <Button variant="contained" onClick={naoSeiCep} color="default" >
                    Não Sei CEP 
                  </Button>
                  </Col></Row>)
              }              
            </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAdicionarEndereco} style={{"color": "#dc3545"}}>
            Fechar
          </Button>
           {temCEP && (bairroCepUnicoSelecionado != null || bairrosCepUnico.length === 0 ) && ( <Button onClick={adicionarEndereco} style={{"backgroundColor": `#28a745`, "color":"white"}}>
            Adicionar
          </Button>)}
        </DialogActions>
      </Dialog>


      </div>
      <Rodape valor={"Endereco"}></Rodape>

    </>
  );
}