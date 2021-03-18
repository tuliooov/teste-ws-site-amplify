import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import Cabecalho from '../Global/cabecalho';
import Divider from '@material-ui/core/Divider';
import Prato from '../../assets/pratos.svg';
import ReactPixel from 'react-facebook-pixel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import * as Sentry from "@sentry/react";


import {
  eventoTagManager,
} from '../../services/functions';

import ButtonGroup from '@material-ui/core/ButtonGroup';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import FormGroup from '@material-ui/core/FormGroup';

import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';

import TextField from '@material-ui/core/TextField';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';






//alert
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';



const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  backdrop: {
    zIndex: '99999',
    color: '#fff',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  rootAlerts: {
    margin: "0 0 1em 0",
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));



export default function VerticalLinearStepper() {
  const { idProduto } = useParams()  //params id do produto selecionado

  const carrinho = JSON.parse(localStorage.getItem("carrinhoCF"))
  const cardapio = JSON.parse(localStorage.getItem("cardapioCF"))
  const aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF")) ;
  const [observacao, setObservacao] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [ScrollAtivo, setScrollAtivo] = useState(false);
  const enderecoAtual = JSON.parse(localStorage.getItem("enderecoAtualCF"))
  const history = useHistory();


    // busca infos do produto selecionado com id
    const getProdutoPorId = function (id) {
      const localSt = localStorage.getItem("produtoSelecionadoCF")
      //console.log("produtoSelecionadoCF", localSt)
      if(!localSt || JSON.parse(localSt).id !== idProduto){
        //console.log("getProdutoPorId")
        let produtoSelecionado;
        cardapio.categorias.forEach(categoria => {
          categoria.produtos.forEach(produto => {
            if (produto.id === id) {
              produtoSelecionado = produto
            }
          });
        });
        console.log('produtoSelecionado', produtoSelecionado,cardapio.categorias)

        produtoSelecionado.opcoes.forEach(function(grupo){    
          grupo.quantidade = 0
        })

        localStorage.setItem("produtoSelecionadoCF", JSON.stringify(produtoSelecionado))
        return produtoSelecionado
      }else{
        return JSON.parse(localStorage.getItem("produtoSelecionadoCF"))
      }
    }
  
  const [produtoSelecionado, setProdutoSelecionado] = useState(getProdutoPorId(parseInt(idProduto)));

  //console.log("produtoSelecionado",produtoSelecionado)  

  const [loading, setLoading] = React.useState(false);

  //produtoSelecionado.opcoes
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const [estabelecimento, setEstabelecimento] = useState(localStorage.getItem('estabelecimentoAtualCF') ? JSON.parse(localStorage.getItem('estabelecimentoAtualCF')): {});
  /*const handleNext = (min, max, qtd) => {
    //console.log("oiNext")
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };*/
  

  const voltar = () => {    
    history.goBack()
  }
  
  const handleBack = () => {
    if (activeStep === 0) {
      voltar()
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  /* const resetarAdicionais = () => {
    setActiveStep(0);
  }; */

  const calcularValorProduto = () => {

    const produtoSele = JSON.parse(JSON.stringify(produtoSelecionado))
    console.log('produtoSele', produtoSele)

    //deletar valores pre calculados no cardapio
    delete produtoSele.valorDeCalculado
    delete produtoSele.valorRealCalculado


    const produtoProCarrinho = {
      "id": null,
      "produto": produtoSele,
      "quantidade": quantidade,
      "valorProdutoHistorico": produtoSele.valor,
      "itensOpcaoProduto": [],
      "observacao": observacao ? observacao : '',
      "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
    } 

    

    produtoProCarrinho.produto.opcoes.forEach((grupo) =>{   
      
      
      //considerar maior  valor - prioridade 1
      const verificarMaiorValor = grupo.opcoes.length > 0 ? grupo.opcoes[0].considerarMaiorValor : false
      var maiorValorDoGrupo = 0

      //considerar media dos valores - prioridade 2
      const verificarMediaValor = grupo.opcoes.length > 1 ? grupo.opcoes[0].considerarMedia : false
      var valorTotalDasOpcoes = 0
      var quantidadeDeOpcoes = 0



      grupo.opcoes.forEach(opcao => {
        if(opcao.quantidade > 0){
          const temp = {
            "id": null,        
            "opcaoProduto" :  {}, 
            "valorHistorico": 0,      
            "quantidade": 0,
            "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
          } 


          temp.opcaoProduto = opcao
          temp.quantidade = opcao.quantidade
          temp.valorHistorico = (opcao.valor * opcao.quantidade)
          
          console.log('valorHistorico', temp.valorHistorico)

          if(verificarMaiorValor && (opcao.valor > maiorValorDoGrupo)){
            maiorValorDoGrupo = opcao.valor
          }else if(verificarMediaValor){
            valorTotalDasOpcoes += temp.valorHistorico
            quantidadeDeOpcoes += opcao.quantidade
          }

          if( grupo.adicional === 0 && opcao.quantidade === 1 && opcao.valor > 0){
            produtoProCarrinho.valorProdutoHistorico = (produtoProCarrinho.valorProdutoHistorico - produtoSele.valor) + opcao.valor
          }else if(!verificarMaiorValor && !verificarMediaValor){
            produtoProCarrinho.valorProdutoHistorico += temp.valorHistorico
          }


          

        }  
      });

      if(verificarMaiorValor){
        produtoProCarrinho.valorProdutoHistorico += maiorValorDoGrupo
      }else if(verificarMediaValor && valorTotalDasOpcoes > 0){
        produtoProCarrinho.valorProdutoHistorico += valorTotalDasOpcoes / quantidadeDeOpcoes
      }

    })

    produtoProCarrinho.valorProdutoHistorico *= produtoProCarrinho.quantidade
    console.log('produtoProCarrinho', produtoProCarrinho)
    return produtoProCarrinho.valorProdutoHistorico
    
  }

  
  const adicionarCarrinho = (e) => {

    
    eventoTagManager(estabelecimento.tagManager, "addCart")
    eventoTagManager(aplicativoDados.tagManager, "addCart")

    
    if(aplicativoDados.pixelFacebook){
      ReactPixel.track('AddToCart')
    } 

    console.log('adicionarCarrinho',produtoSelecionado )
    
    //deletar valores pre calculados no cardapio
    delete produtoSelecionado.valorDeCalculado
    delete produtoSelecionado.valorRealCalculado

    const produtoProCarrinho = {
      "id": null,
      "produto": produtoSelecionado,
      "quantidade": quantidade,
      "valorProdutoHistorico": produtoSelecionado.valor,
      "itensOpcaoProduto": [],
      "observacao": observacao ? observacao : '',
      "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
    } 

    

    produtoProCarrinho.produto.opcoes.forEach((grupo) =>{   
      
      
      //considerar maior  valor - prioridade 1
      const verificarMaiorValor = grupo.opcoes.length > 0 ? grupo.opcoes[0].considerarMaiorValor : false
      var maiorValorDoGrupo = 0

      //considerar media dos valores - prioridade 2
      const verificarMediaValor = grupo.opcoes.length > 1 ? grupo.opcoes[0].considerarMedia : false
      var valorTotalDasOpcoes = 0
      var quantidadeDeOpcoes = 0



      grupo.opcoes.forEach(opcao => {
        if(opcao.quantidade > 0){
          const temp = {
            "id": null,        
            "opcaoProduto" :  {}, 
            "valorHistorico": 0,      
            "quantidade": 0,
            "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
          } 


          temp.opcaoProduto = opcao
          temp.quantidade = opcao.quantidade
          temp.valorHistorico = (opcao.valor * opcao.quantidade)
          
          if(verificarMaiorValor && (opcao.valor > maiorValorDoGrupo)){
            maiorValorDoGrupo = opcao.valor
          }else if(verificarMediaValor){
            valorTotalDasOpcoes += temp.valorHistorico
            quantidadeDeOpcoes += opcao.quantidade
          }

          if( grupo.adicional === 0 && opcao.quantidade === 1 && opcao.valor > 0){
            produtoProCarrinho.valorProdutoHistorico = (produtoProCarrinho.valorProdutoHistorico - produtoSelecionado.valor) + opcao.valor
          }else if(!verificarMaiorValor && !verificarMediaValor){
            produtoProCarrinho.valorProdutoHistorico += temp.valorHistorico
          }

          delete temp.opcaoProduto.quantidade          
          produtoProCarrinho.itensOpcaoProduto.push(temp)

          

        }  
        delete opcao.quantidade;     
      });

      if(verificarMaiorValor){
        produtoProCarrinho.valorProdutoHistorico += maiorValorDoGrupo
      }else if(verificarMediaValor && valorTotalDasOpcoes>0 ){
        produtoProCarrinho.valorProdutoHistorico += valorTotalDasOpcoes / quantidadeDeOpcoes
      }

      delete grupo.quantidade;   
    })

    produtoProCarrinho.valorProdutoHistorico *= produtoProCarrinho.quantidade

    carrinho.pedido.itens.push(produtoProCarrinho)
    carrinho.data = new Date()

    let valorTotalItens = 0;
    let valorProdutosPromocionais = 0;

    carrinho.pedido.itens.forEach(item => {
      valorTotalItens += item.valorProdutoHistorico      
      if(item.produto.promocional){
        valorProdutosPromocionais += item.valorProdutoHistorico
      }
    })

    console.log("valorProdutosPromocionais", valorProdutosPromocionais)
    console.log("valorPrduto", valorTotalItens)
    
    


    let taxaDeEntrega = 0
    if(enderecoAtual?.id !== "retirada" && !(valorTotalItens > cardapio.minimoEntregaGratis  && cardapio.minimoEntregaGratis > 0)){ // NAO FOR RETIRADA NO LOCAL
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
      console.log("valorFinalProdutosIf", valorFinalProdutos)

    }else{
      //desconto fixo - apenas em produtos nao promocionais
      var descontoFixo = carrinho.pedido.valorDesconto ? carrinho.pedido.valorDesconto : 0

      //maximo que pode dar de desconto
      if(cardapio.maximoDesconto && descontoFixo > cardapio.maximoDesconto){
        descontoFixo = cardapio.maximoDesconto
      }

      // let produtosNaoPromocionais = valorTotalItens - valorProdutosPromocionais
      // produtosNaoPromocionais -= descontoFixo      
      // valorFinalProdutos = valorProdutosPromocionais + (produtosNaoPromocionais > 0 ? produtosNaoPromocionais : 0)     
      valorFinalProdutos = valorTotalItens - descontoFixo   
    
    }

    // console.log("valorFinalProdutos", valorFinalProdutos)
    if(valorFinalProdutos < 0){
      carrinho.pedido.valorTotal = taxaDeEntrega
    }else{
      carrinho.pedido.valorTotal = valorFinalProdutos + taxaDeEntrega
    }



    if(carrinho.pedido.valorTotal < 0){
      carrinho.pedido.valorTotal = 0.0
    }
    


    // console.log("fim carrinho", carrinho)
    localStorage.setItem('carrinhoCF', JSON.stringify(carrinho))
    //console.log("add CART")
    history.goBack()
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
    
  
    
  return (
    <div>

        {loading &&
        (<Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>)}


      <Snackbar open={alert.status} autoHideDuration={6000} onClose={alertClose}>
          <Alert onClose={alertClose} severity={alert.tipo}>
          {alert.mesangem}
          </Alert>
      </Snackbar>

      <Cabecalho voltar={true} produtoNome={produtoSelecionado.nome}></Cabecalho>
      <div className="container ProdutoComponente">         
      <Row className="fotoProdutoNoAdicional" style={{"margin": 0, "padding": "1em"}}>
          
          <Col xs={12} md={12} lg={4} style={{"cursor": "pointer"}}>
          <img
                className="d-block"
                style={{"borderRadius": "30px"}}
                src={produtoSelecionado.urlImagem ? produtoSelecionado.urlImagem : Prato}
                alt="First slide"
              />
          </Col>
          
          <Col xs={12} md={12} lg={8} style={{"cursor": "pointer"}}>
              <Typography style={{"textAlign": "center", "padding": "0.5em 0"}} variant="h6">{produtoSelecionado.nome}</Typography>
              <Typography style={{"textAlign": "center", "padding": "-0.5em 1em"}} >{produtoSelecionado.descricao}</Typography>
                 {
                 (produtoSelecionado.promocional && cardapio.percentualDesconto && !cardapio.valorDesconto)
                  ?
                  <List component="div" disablePadding  style={{"textAlign": "center", "padding": "0.5em 1em"}}>
                      <ListItem  className={classes.nested} style={{"paddingTop": "0", "display": "flex", "justifyContent": "center"}}>
                         <p className="promocionalElement promocionalProduct">
                             É promocional, então não recebe descontos percentuais.
                         </p>
                      </ListItem>
                  </List> 
                  
                  : null 
              }
          </Col>
        </Row>
          <Divider></Divider>
        <div>
           
          {produtoSelecionado.opcoes.length > 0 ? 
          (<Stepper activeStep={activeStep} id={`Stepper${activeStep}`} orientation="vertical">
            {console.log(activeStep)}
            {produtoSelecionado.opcoes.map((grupo, index) => (
              <Step  key={grupo.id} id={`Step${index}`}>
                <StepLabel>{grupo.nome}</StepLabel>
                
                <StepContent className="campoGrupo">
                {(!!grupo.quantidadeMaxima || !!grupo.quantidadeMinima) &&
                <FormLabel className="infoGrupoAdicionais"> 
                  {(!!grupo.quantidadeMaxima && grupo.quantidadeMaxima !== 99999999) && (<span>Maximo: {grupo.quantidadeMaxima}</span>)}
                  {((!!grupo.quantidadeMaxima && grupo.quantidadeMaxima != 99999999) && (!!grupo.quantidadeMinima && grupo.quantidadeMinima != 99999999)) && (<span> e </span>)}         
                  {!!grupo.quantidadeMinima && (<span>Minimo: {grupo.quantidadeMinima}</span>)}         
                </FormLabel>
                }
                  {
                    grupo.adicional === 0 //RADIO
                      ?
                      (
                        <RadioGroup aria-label={grupo.nome} name={grupo.nome} style={{"marginBottom": "5em"}}>
                          {grupo.opcoes.map(opcao => (
                            <span className="opcaoIndividual row" key={opcao.id}>
                              <Col xs={2} md={2} lg={2} style={{"cursor": "pointer"}} className="colOpcaoAdicional">
                                
                                <FormControlLabel
                                  value={"#"+opcao.id}
                                  control={<Radio id={"#"+opcao.id} color="primary" onClick={e => {

                                    grupo.opcoes.forEach(opcoesDoGrupo => {
                                      opcoesDoGrupo.quantidade = 0
                                    });
                                    grupo.quantidade = 1
                                    opcao.quantidade = 1
                                    
                                    //console.log(e.target, "g:", grupo.quantidade, "p:", opcao.quantidade)
                                    document.getElementsByClassName(`#butaoDo${grupo.id}`)[0].classList.remove("Mui-disabled")    
                                    //window.scrollTo(0, document.getElementById("BotaoDeAcoes")?.offsetTop)
                                  } }/>}
                                />
                              </Col>
                              <Col xs={7} md={7} lg={7}  className="colNomeAdicional" >
                                <FormLabel style={{"cursor": "pointer"}} htmlFor={"#"+opcao.id}>{opcao.nome}</FormLabel>
                              </Col>
                              { //se tiver valor
                                opcao.valor && <Col xs={3} md={3} lg={3} className="colValorAdicional">
                                  <FormLabel style={{"cursor": "pointer"}} htmlFor={"#"+opcao.id}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(opcao.valor)}</FormLabel>
                                </Col>
                              }

                              { //se tiver descricao
                                opcao.descricao && <Col xs={12} md={12} lg={12} style={{"cursor": "pointer"}} className="colDescricaoAdicional">
                                  <FormLabel style={{"cursor": "pointer"}} htmlFor={"#"+opcao.id}>{opcao.descricao}</FormLabel>
                                </Col>
                              }


                              <span style={{"display": "none"}}>
                                {
                                  console.log("nuns", `${opcao.id}`, opcao.quantidade, grupo.quantidade)
                                }
                                { //GAMBIARRA PARA AO GRUPO COM RADIO VOLTAR SELECIONADO
                                  setTimeout(() => {
                                    if(document.getElementById("#"+opcao.id)){
                                      document.getElementById("#"+opcao.id).checked = opcao.quantidade === 1 ? true : false                                      
                                    }
                                  }, 300) 
                                }
                              </span>

                            </span>
                          ))}

                         


                        </RadioGroup>)
                      : grupo.adicional === 1 //CHECK
                        ?
                        (
                          <FormGroup aria-label="position" name={grupo.id} style={{"marginBottom": "5em"}}>
                            {grupo.opcoes.map(opcao => (
                              <span className="opcaoIndividual row" key={opcao.id}>
                                <Col xs={2} md={2} lg={1} className="colOpcaoAdicional">
                                  <input type="checkbox" color="primary"  
                                    value={opcao.nome}
                                    name={opcao.nome}     
                                    id={"#"+opcao.id}                               
                                    className={"#OpcaoDe"+grupo.id}
                                    style={{"width": "23px", "height": "23px", "cursor": "pointer"}}
                                    //checked={opcao.quantidade ? true : false}
                                    //disabled={grupo.quantidade === 1 ? true : false}   
                                    onClick={e => {    
                                      //console.log(e.target.checked)
                                      if(e.target.checked && grupo.quantidade === grupo.quantidadeMaxima){                                         
                                        e.target.checked = false
                                        //console.log("1")              
                                      }else if(!e.target.checked && grupo.quantidade === grupo.quantidadeMaxima){
                                        //console.log("2")
                                        grupo.quantidade--
                                        opcao.quantidade--
                                        e.target.checked = false
                                      }else if(e.target.checked){
                                        //console.log("3")
                                        grupo.quantidade++
                                        opcao.quantidade++
                                      }else{
                                        //console.log("4")
                                        grupo.quantidade--
                                        opcao.quantidade--
                                      }

                                      if(grupo.quantidade < grupo.quantidadeMinima){
                                        document.getElementsByClassName(`#butaoDo${grupo.id}`)[0].classList.add("Mui-disabled")                                         
                                      }else{
                                        document.getElementsByClassName(`#butaoDo${grupo.id}`)[0].classList.remove("Mui-disabled")                                           
                                      }

                                      // if(grupo.quantidade === grupo.quantidadeMaxima){
                                      //   window.scrollTo(0, document.getElementById("BotaoDeAcoes")?.offsetTop)
                                      // }

                                      const newP = produtoSelecionado
                                      setProdutoSelecionado(newP)
                                      //console.log("qtd", grupo.quantidade, opcao.quantidade)
                                    }}  
                                    
                                    //onLoad={document.getElementById("#"+opcao.id).checked = opcao.quantidade === 1 ? true : false}
                                    
                                  />
                                </Col>
                                <Col xs={7} md={7} lg={8}  className="colNomeAdicional">
                                  <FormLabel style={{"cursor": "pointer"}} htmlFor={"#"+opcao.id} control={opcao.nome}>{opcao.nome}</FormLabel>
                                </Col>
                                { //se tiver valor
                                  <Col xs={3} md={3} lg={3} className="colValorAdicional">
                                    {opcao.valor ? <FormLabel htmlFor={"#"+opcao.id} style={{"cursor": "pointer"}}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(opcao.valor)}</FormLabel> : null}
                                  </Col>
                                }

                                { //se tiver descricao
                                  opcao.descricao ? <>
                                  <Col xs={12} md={12} lg={1}>
                                    
                                  </Col>

                                  <Col xs={12} md={12} lg={11} className="colDescricaoAdicional">
                                    <FormLabel htmlFor={"#"+opcao.id} style={{"cursor": "pointer"}}>{opcao.descricao}</FormLabel>
                                  </Col>
                                  </> : null
                                }

                                <span style={{"display": "none"}}>
                                { //GAMBIARRA PARA AO GRUPO COM CHECKBOX VOLTAR SELECIONADO
                                  setTimeout(() => {
                                    if(document.getElementById("#"+opcao.id)){
                                      document.getElementById("#"+opcao.id).checked = opcao.quantidade === 1 ? true : false                                      
                                    }
                                  }, 300) 
                                }
                                </span>
                                
                              </span>
                            ))}
                          </FormGroup>)
                        : grupo.adicional === 2 //QTD 
                          ?
                          (<FormGroup aria-label={grupo.id} name={grupo.id} style={{"marginBottom": "5em"}}>
                            {grupo.opcoes.map( (opcao, index2) => (
                              <span key={opcao.id} className="camposAddRemoveAdicionaisQuantitativos opcaoIndividual row" >
                                <Col xs={4} md={3} lg={2} className="colOpcaoAdicional">

                                  <ButtonGroup>
                                    <Button
                                      aria-label="reduce"
                                      onClick={()  => {
                                        // REMOVER QTD
                                        if(opcao.quantidade > 0){
                                          document.getElementById(`${opcao.id}`).innerHTML = parseInt(document.getElementById(`${opcao.id}`).innerHTML)-1                                      
                                          opcao.quantidade--
                                          grupo.quantidade--
                                          //console.log("remove", `${opcao.id}`, opcao.quantidade, grupo.quantidade)
                                        }   
                                        if(grupo.quantidade < grupo.quantidadeMinima){
                                          document.getElementsByClassName(`#butaoDo${grupo.id}`)[0].classList.add("Mui-disabled")                                         
                                        }else{
                                          document.getElementsByClassName(`#butaoDo${grupo.id}`)[0].classList.remove("Mui-disabled")                                           
                                        }                                 
                                      }} 
                                      style={{"background":"#dc3545", "color":"white"}}

                                    >
                                      <RemoveIcon fontSize="small" />
                                    </Button>

                                    <Button
                                      aria-label="increase"
                                    >
                                      <span id={opcao.id}>{ /*isNaN(opcao.quantidade) ? opcao.quantidade = 0 : opcao.quantidade = */ opcao.quantidade}</span>
                                    </Button>


                                    <Button
                                      aria-label="increase"
                                      style={{"background":"#28a745", "color":"white"}}
                                      onClick={() => {   
                                        // ADICIONAR QTD
                                        if(grupo.quantidade < grupo.quantidadeMaxima || !grupo.quantidadeMaxima){
                                          document.getElementById(`${opcao.id}`).innerHTML = parseInt(document.getElementById(`${opcao.id}`).innerHTML)+1
                                          opcao.quantidade++ 
                                          grupo.quantidade++
                                          //console.log("add", `${opcao.id}`, opcao.quantidade, grupo.quantidade)
                                        } 
    
                                        if(grupo.quantidade < grupo.quantidadeMinima){
                                          document.getElementsByClassName(`#butaoDo${grupo.id}`)[0].classList.add("Mui-disabled")                                         
                                        }else{
                                          document.getElementsByClassName(`#butaoDo${grupo.id}`)[0].classList.remove("Mui-disabled")                                           
                                        }
                                        // if(grupo.quantidade === grupo.quantidadeMaxima){
                                        //   window.scrollTo(0, document.getElementById("BotaoDeAcoes")?.offsetTop)
                                        // }
                                      }}
                                    >
                                      <AddIcon fontSize="small" />
                                    </Button>
                                  </ButtonGroup>

                                
                                  
                                  {/* <Button onClick={()  => {
                                    // REMOVER QTD
                                    if(opcao.quantidade > 0){
                                      document.getElementById(`${opcao.id}`).innerHTML = parseInt(document.getElementById(`${opcao.id}`).innerHTML)-1                                      
                                      opcao.quantidade--
                                      grupo.quantidade--
                                      //console.log("remove", `${opcao.id}`, opcao.quantidade, grupo.quantidade)
                                    }   
                                    if(grupo.quantidade < grupo.quantidadeMinima){
                                      document.getElementsByClassName(`#butaoDo${grupo.id}`)[0].classList.add("Mui-disabled")                                         
                                    }else{
                                      document.getElementsByClassName(`#butaoDo${grupo.id}`)[0].classList.remove("Mui-disabled")                                           
                                    }                                 
                                  }} color="secondary">

                                    <RemoveCircleIcon></RemoveCircleIcon>
                                  </Button> */}
                                  
                                  

                                  {/* <Button onClick={() => {   
                                    // ADICIONAR QTD
                                    if(grupo.quantidade < grupo.quantidadeMaxima || !grupo.quantidadeMaxima){
                                      document.getElementById(`${opcao.id}`).innerHTML = parseInt(document.getElementById(`${opcao.id}`).innerHTML)+1
                                      opcao.quantidade++ 
                                      grupo.quantidade++
                                      //console.log("add", `${opcao.id}`, opcao.quantidade, grupo.quantidade)
                                    } 

                                    if(grupo.quantidade < grupo.quantidadeMinima){
                                      document.getElementsByClassName(`#butaoDo${grupo.id}`)[0].classList.add("Mui-disabled")                                         
                                    }else{
                                      document.getElementsByClassName(`#butaoDo${grupo.id}`)[0].classList.remove("Mui-disabled")                                           
                                    }
                                    // if(grupo.quantidade === grupo.quantidadeMaxima){
                                    //   window.scrollTo(0, document.getElementById("BotaoDeAcoes")?.offsetTop)
                                    // }
                                  }} color="primary">

                                    <AddCircleIcon></AddCircleIcon>
                                  </Button> */}
                                </Col>
                                <Col xs={5} md={6} lg={7} className="colNomeAdicional"><FormLabel>{opcao.nome}</FormLabel> </Col>

                                { //se tiver valor
                                  <Col xs={3} md={3} lg={3} className="colValorAdicional">
                                    {(opcao.valor || opcao.valor > 0) &&  <FormLabel>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(opcao.valor)}</FormLabel>}
                                  </Col>
                                }

                                { //se tiver descricao
                                  opcao.descricao && <>
                                  <Col xs={12} md={12} lg={2}>
                                  </Col>
                                  <Col xs={12} md={12} lg={10} className="colDescricaoAdicional">
                                    <FormLabel>{opcao.descricao}</FormLabel>
                                  </Col>
                                  </>
                                }
                                <Divider/>
                              </span>
                            ))}
                          </FormGroup>)
                        : grupo.adicional === 3 
                          ?  (<FormGroup aria-label={grupo.id} name={grupo.id} style={{"marginBottom": "5em"}}>
                          {grupo.opcoes.map( (opcao, index2) => (
                            <span key={opcao.id} className="camposAddRemoveAdicionaisQuantitativos opcaoIndividual row" >
                              <Col xs={4} md={3} lg={2} className="colOpcaoAdicional">

                                <TextField
                                  // inputProps={{
                                  //   class:"InputQuantidadeDigitavel"
                                  // }}
                                  className= "InputQuantidadeDigitavel"
                                  size="small"
                                  label="Quantidade"
                                  defaultValue={opcao.quantidade}
                                  onChange={(e) => {
                                    e.target.value = e.target.value.replace(/([^\d])+/gim, '');
                                    if(!e.target.value){
                                      grupo.quantidade -= opcao.quantidade
                                      opcao.quantidade = 0
                                    }else{
                                        grupo.quantidade -= opcao.quantidade
                                        opcao.quantidade = parseInt(e.target.value)
                                        grupo.quantidade += opcao.quantidade
                                      } 
                                      // if(!e.target.value ){
                                      //   opcao.quantidade = 0
                                      //   grupo.quantidade = 0
                                      // }
                                      console.log("grupo quantidade" + grupo.quantidade)
                                      console.log("opcao quantidade" + opcao.quantidade)
                                      if(grupo.quantidade < grupo.quantidadeMinima || grupo.quantidade > grupo.quantidadeMaxima){
                                        document.getElementsByClassName(`#butaoDo${grupo.id}`)[0].classList.add("Mui-disabled")                                         
                                      }else{
                                        document.getElementsByClassName(`#butaoDo${grupo.id}`)[0].classList.remove("Mui-disabled")                                           
                                      }
                                  }}
                                  type="number"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  variant="outlined"
                                />
                              </Col>
                              <Col xs={5} md={6} lg={7} className="colNomeAdicional"><FormLabel>{opcao.nome}</FormLabel> </Col>

                              { //se tiver valor
                                <Col xs={3} md={3} lg={3} className="colValorAdicional">
                                  {(opcao.valor || opcao.valor > 0) &&  <FormLabel>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(opcao.valor)}</FormLabel>}
                                </Col>
                              }

                              { //se tiver descricao
                                opcao.descricao && <>
                                <Col xs={12} md={12} lg={2}>
                                </Col>
                                <Col xs={12} md={12} lg={10} className="colDescricaoAdicional">
                                  <FormLabel>{opcao.descricao}</FormLabel>
                                </Col>
                                </>
                              }
                              <Divider/>
                            </span>
                          ))}
                        </FormGroup>)
                        : null
                  }

                  


                  <span style={{"display": "none"}}>
                    {
                      setTimeout(() => {
                        if(document.getElementById(`Step${activeStep}`) && ScrollAtivo){
                          window.scrollTo(0, document.getElementById(`Step${activeStep}`)?.offsetTop-70)
                        }
                      }, 300)
                    }
                  </span>
                  

                  {
                    activeStep !== produtoSelecionado.opcoes.length
                    && <div className={classes.actionsContainer} id="BotaoDeAcoes">
                          <div>
                            <Button
                              onClick={handleBack}
                              className={classes.button}
                            >
                              Voltar
                          </Button>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => {   
                                setScrollAtivo(true)              
                                if((grupo.quantidadeMaxima === null || grupo.quantidade <= grupo.quantidadeMaxima) && (grupo.quantidadeMinima === null || grupo.quantidade >= grupo.quantidadeMinima)){
                                  setProdutoSelecionado(produtoSelecionado)
                                  setActiveStep((prevActiveStep) => prevActiveStep + 1)
                                }else if(grupo.quantidade > grupo.quantidadeMaxima){
                                  alertStart("Você ultrapassou quantidade maxima", "warning")
                                }else if(grupo.quantidade < grupo.quantidadeMinima){
                                  alertStart("Você tem uma quantidade minima de escolhas", "warning")
                                }else{
                                  Sentry.captureMessage(localStorage.getItem('versao')+`algum erro em relação aos adicionais nao identificado - ${aplicativoDados?.appNome}`);
                                  alertStart("algum erro em relação aos adicionais nao identificado", "warning")
                                }                 
                              }}
                              className={classes.button + ` #butaoDo${grupo.id} ` + ((((grupo.quantidadeMinima || grupo.adicional == 0) && (grupo.quantidade < grupo.quantidadeMinima)) || (grupo.adicional == 0 && grupo.quantidade == 0)) ? ' Mui-disabled ' : '') }
                            > 
                              {(activeStep === (produtoSelecionado.opcoes.length - 1)) ? 'Finalizar' : 'Proximo'}
                            </Button>
                          </div>
                        </div>
                  }


                </StepContent>
              </Step>
            ))}
          </Stepper>)
          : null}


          

          {activeStep === produtoSelecionado.opcoes.length && (
            <Paper id={`Step${produtoSelecionado.opcoes.length}`} square elevation={0} className={classes.resetContainer}>

              
              <Col xs={12} md={12} lg={12}>
                <Typography style={{"textAlign": "center"}}>Quantos desse produto?</Typography>
              </Col>
              <Col xs={12} md={12} lg={12} className="colOpcaoAdicionalProduto">


              <ButtonGroup>
                <Button
                  aria-label="reduce"
                  onClick={()  => {
                    if(quantidade > 1){
                      setQuantidade(quantidade-1)
                    }
                  }}
                  style={{"background":"#dc3545", "color":"white"}}
                >
                  <RemoveIcon fontSize="small" />
                </Button>

                <Button
                  aria-label="increase"
                  
                >
                   <span>{quantidade}</span>
                </Button>


                <Button
                  aria-label="increase"
                  style={{"background":"#28a745", "color":"white"}}
                  onClick={() => {setQuantidade(quantidade+1)}}
                >
                  <AddIcon fontSize="small" />
                </Button>
              </ButtonGroup>

              
                {/* <Button onClick={()  => {
                  if(quantidade > 1){
                    setQuantidade(quantidade-1)
                  }
                }} color="secondary">
                  <RemoveCircleIcon></RemoveCircleIcon>
                </Button>

                <span>{quantidade}</span>

                <Button onClick={() => {setQuantidade(quantidade+1)}} color="primary">
                  <AddCircleIcon></AddCircleIcon>
                </Button> */}


              </Col>

              {produtoSelecionado.permiteObservacao
              ? (<>
                <Col xs={12} md={12} lg={12} style={{"marginTop": "1em"}}>
                  <Typography style={{"textAlign": "center"}}>Alguma observação?</Typography>
                </Col>
                <Col xs={12} md={12} lg={12} style={{"marginBottom": "1em"}}>
                  <TextField style={{"margin": "0"}}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  value={observacao}
                  onChange={(e) => {setObservacao(e.target.value)}}
                  id="observacaoPedido"
                  label="Observação"
                  name="observacaoPedido"
                  type="text"
                  ></TextField>
                </Col>
              </>)
              : null}


              {
                /*activeStep === 0 && <Button onClick={handleBack} className={classes.button}>
                  Voltar
                </Button>
                
                <Button onClick={resetarAdicionais} className={classes.button}>
                  Voltar
                </Button>
              */
              }


              
              
              

              <Button onClick={voltar} className={classes.button}>
                Cancelar
              </Button>

              {
                activeStep > 0 &&
                <Button onClick={handleBack} className={classes.button}>
                  Voltar
              </Button>
              }

              <Button
                fullWidth
                variant="contained"
                color="primary"
                id="tag-manager-add-cart"
                onClick={adicionarCarrinho}
                className={classes.button}
              >
                Adicionar <span className={"valorFinalizarPedido"} style={{"color":"#000000de"}}>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calcularValorProduto())}</span>
            </Button>
            </Paper>
          )}

  
          
        </div>
      </div>
    </div>
  );
}
