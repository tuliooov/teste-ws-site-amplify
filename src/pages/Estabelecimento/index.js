import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './styles.css';
import Cabecalho from '../Global/cabecalho';
import Rodape from '../Global/rodape';

import api from '../../services/api';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';

import {  Row, Col } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {
  identificarEstabelecimentoSelecionado
} from '../../services/functions';

//alert
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';



//import Loading from '../loading';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  rootAlerts: {
    margin: "0 0 1em 0",
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));



export default function Estabelecimento() {
  const classes = useStyles();
  const history = useHistory();
  
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioCF"))
  const estabelecimentos = usuarioLogado.estabelecimentos 
  const enderecoAtual = JSON.parse(localStorage.getItem("enderecoAtualCF"))

  const [loading, setLoading] = React.useState(false);


  const buscarCardapioId = (id) => {
    estabelecimentos.forEach(estabelecimento => {
      if(estabelecimento.id == id){
        buscarCardapio(estabelecimento)
        return true
      }
    });
  }

  const buscarCardapio = async (estabelecimento) => {    
    setLoading(true)
    localStorage.setItem('estabelecimentoAtualCF', JSON.stringify(estabelecimento));

    let data = {
      "idCliente": usuarioLogado.cliente.id,
      "idEstabelecimento": estabelecimento.id,
      "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
    }    

    if(enderecoAtual.ativo){
      data.idEndereco = enderecoAtual.id
    }              
    
    
      
    var response = {};
    if(!!JSON.parse(localStorage.getItem('usuarioPedidoMesaCF'))?.logado){
      response = await api.post('clientefiel/ObterCardapioPedidoMesa', data, {
        headers: { "Content-Type": "application/json",  "plataforma": "site" }
      })
      console.log("ObterCardapioPedidoMesa", data, response)
    }else{
      response = await api.post('clientefiel/ObterCardapioCompletoV1', data, {
        headers: { "Content-Type": "application/json",  "plataforma": "site" }
      })
      console.log("ObterCardapioCompletoV1", data, response)
    }

    

    if(response.data.codErro > 0){
      alertStart(response.data.mensagem, "error")
      setLoading(false)
    }else{

      const retorno = response.data
      //console.log(retorno)
      /*retorno.categorias.forEach(function(categoria){    
        categoria.produtos.forEach(function(produto){    
          produto.opcoes.forEach(function(grupo){    
            grupo.quantidade = 0
          })
        })
      })*/

      if(!JSON.parse(localStorage.getItem('usuarioCF')).logado){
        retorno.id = "usuarioDeslogado"
      }
      
      localStorage.setItem("cardapioCF", JSON.stringify(retorno))                      
      localStorage.setItem("enderecoAtualCF", JSON.stringify((retorno.enderecos != null && retorno.enderecos.length > 0) ? retorno.enderecos[0] : {}))  

      const carrinhoRetorno = JSON.parse(localStorage.getItem("carrinhoCF")) 

      carrinhoRetorno.valorMinimoPedido = retorno.valorMinimoPedido
      carrinhoRetorno.valorDesconto = retorno.valorDesconto
      carrinhoRetorno.percentualDesconto = retorno.percentualDesconto
      carrinhoRetorno.minimoEntregaGratis = retorno.minimoEntregaGratis
      carrinhoRetorno.maximoPedidoComDesconto = retorno.maximoPedidoComDesconto
      carrinhoRetorno.maximoDesconto = retorno.maximoDesconto
      carrinhoRetorno.cupomDesconto = retorno.cupomDesconto
      const taxa = (retorno.enderecos != null && retorno.enderecos.length > 0) ? retorno.enderecos[0].taxaEntrega : null
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

      localStorage.setItem("carrinhoCF", JSON.stringify(carrinhoRetorno)) 

      history.push(`/delivery${identificarEstabelecimentoSelecionado(aplicativoDados)}`)
    }
  }

    
  const allBanners = () => {
    var array = []
    for(let i = 0; i < estabelecimentos.length; i++){
        // if(aplicativoDados.estabelecimentos[i].banners){
        //   array = array.concat({"url": aplicativoDados.estabelecimentos[i].banners, "id": aplicativoDados.estabelecimentos[i].id});
        // }

        if(estabelecimentos[i].banners){
          for(let j = 0; j < estabelecimentos[i].banners.length; j++){
            array.push({"url": estabelecimentos[i].banners[j], "id": estabelecimentos[i].id})
          }
        }
    }
    return array;
  }


  const [todosBanners, setTodosBanners] = React.useState(allBanners());
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
    <>
      <Snackbar open={alert.status} autoHideDuration={6000} onClose={alertClose}>
          <Alert onClose={alertClose} severity={alert.tipo}>
          {alert.mesangem}
          </Alert>
      </Snackbar>
      <Cabecalho nomeUsuario={true}></Cabecalho>
      <div className="container container-Estabelecimento">
        {
            (todosBanners.length > 3) && <Row>
            <AppBar position="static" color="default" id="todosBanners" style={{"marginTop":"1em","backgroundColor": "#f8f8f8", "zIndex":"1", "box-shadow":"none"}}>
                <Tabs
                  value={-1}
                  // onChange={mudarCategoria}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  { (todosBanners.map((banner, index) => (
                    <img style={{"cursor":"pointer"}} src={banner.url} key={index} onClick={() =>{
                      buscarCardapioId(banner.id)   
                    }}/>    
                  )))}
                  
                </Tabs>
            </AppBar>
          </Row>
        }


        <Row>
          <Col xs={12} md={12} lg={12} >
            <Typography gutterBottom variant="h5" >
              Selecione o estabelecimento desejado
            </Typography>
          </Col>

          <Col xs={12} md={12} lg={12} >            
            {estabelecimentos?.length} {estabelecimentos?.length > 1 ? "Estabelecimentos disponiveis" : "Estabelecimento disponivel"} 
          </Col>

          
         
          
          {
            estabelecimentos.map( (estabelecimento, index) => (
              <Col xs={6} md={6} lg={4} key={estabelecimento.id} style={{"margin": "1em 0"}}  className={estabelecimento.online ? "aberto" : "fechado"}>
                
                <Card className={classes.root}>
                  <CardActionArea onClick={() =>{
                    buscarCardapio(estabelecimento)   
                  }}>
                    <CardMedia
                      component="img"
                      alt="Contemplative Reptile"
                      height="140"
                      image={estabelecimento.urlLogo}
                      title="Contemplative Reptile"
                    />
                    <CardContent>
                      <Typography gutterBottom  component="h2">                    
                        {estabelecimento.nome}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {estabelecimento.endereco}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" color="primary" onClick={() =>{                       
                       buscarCardapio(estabelecimento)                       
                    }}>
                      Selecionar
                    </Button>
                  </CardActions>
                </Card>
              </Col>
            ))
          }   
        </Row>

        {loading &&
        (<Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>)}

      </div>
      <Rodape valor="Estabelecimento"></Rodape>

    </>
  );
}