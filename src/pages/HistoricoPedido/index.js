import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './styles.css';
import Cabecalho from '../Global/cabecalho';
import Rodape from '../Global/rodape';
import * as Sentry from "@sentry/react";
import api from '../../services/api';
import MuiAlert from '@material-ui/lab/Alert';
import CardMedia from '@material-ui/core/CardMedia';
import {
  identificarEstabelecimentoSelecionado,
  ObterStatusPedido,
} from '../../services/functions';
import {  Row, Col } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


/* modal */
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ImageIcon from '@material-ui/icons/Image';
import MotorcycleIcon from '@material-ui/icons/Motorcycle';


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
  pos: {
    marginBottom: 12,
  },
  rootForm: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 999,
    color: '#fff',
  },
}));


export default function Estabelecimento() {
  const classes = useStyles();
  const history = useHistory();
  
  const [loading, setLoading] = React.useState(false);
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioCF"))  
  const usuarioPedidoMesa = JSON.parse(localStorage.getItem("usuarioPedidoMesaCF"))
  const aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF"))
  const [estabelecimentoAtual, setEstabelecimentoAtual] = useState(JSON.parse(localStorage.getItem("estabelecimentoAtualCF")));
  const [verPedido, setVerPedido] = useState(false)
  const [verPedidoPosicao, setVerPedidoPosicao] = useState(0)
  const pedidos  =  JSON.parse(localStorage.getItem('historicoPedidosCF'))

  if(!pedidos || !pedidos.length){
    history.push(`/delivery${identificarEstabelecimentoSelecionado(aplicativoDados)}`)
  }
  
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
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {
        usuarioPedidoMesa?.logado
        ?<Cabecalho mesaHistorico={usuarioLogado.cliente.nome} ></Cabecalho>
        :<Cabecalho nomeUsuario={true}></Cabecalho>
      }
      <div className="container container-Estabelecimento">
        <Row>
          <Col xs={12} md={12} lg={12} >
            <Typography gutterBottom variant="h5" >
              Historico de Pedidos
            </Typography>
          </Col>

          <Col xs={6} md={6} lg={6} style={{"alignSelf": "center"}}>            
            {(!pedidos?.length)
            ? 'Nenhum pedido registrado'
            : (pedidos?.length > 1 
              ? pedidos?.length + " Pedidos realizados" 
              : pedidos?.length + " pedido realizado")} 
          </Col>
          <Col xs={6} md={6} lg={6} >            
            <Button variant="contained" onClick={() => { 
              localStorage.removeItem('historicoPedidosCF')
              history.push(`/delivery${identificarEstabelecimentoSelecionado(aplicativoDados)}`)
            }} style={{"background": `#28a745`, "color":"white"}} >
              Novo Pedido 
            </Button>
          </Col>

          { pedidos?.length
              //TEM ENDEREÇO
              ? (pedidos.map( (pedido, index) => (
                (<React.Fragment key={index}>
                  <Col xs={12} md={6} lg={4} key={index} style={{"margin": "1em 0"}}  >
                      
                      <Card className={classes.root} style={{"height": "100%"}}>
                        <CardActionArea  style={{ "height": "calc(100% - 30px)", "flexFlow": "column-reverse", "alignItems": "normal"}}>
                          
                          <Row style={{"margin":0,"textAlign": "", "width": "100%", "padding": "1em", "alignItems": "center"}}>
                            <Col xs={3} md={3} lg={3} style={{"padding":0}}>
                            <CardMedia
                                component="img"
                                className={"logoLojas"}
                                alt={pedido.estabelecimento.nome}
                                image={pedido.estabelecimento.urlLogo}
                                title={pedido.estabelecimento.nome}
                              />
                            </Col>
                            <Col xs={9} md={9} lg={9}>
                              

                              <Typography variant="body2" color="textSecondary" component="p" >
                              {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.valorTotal)} - {pedido.strDataRealizacao}
                              </Typography>

                              <Typography gutterBottom  component="h2" >                    
                              {pedido.estabelecimento.nome}
                              </Typography>
                              
                              <Typography className={"StatusEstabelecimento"} variant="body2"  component="p">
                              {pedido.estabelecimento.cidade.nome}
                              </Typography>



                              
                            </Col>
                          
                          </Row>
                          
                          <CardContent style={{"padding": "0 16px"}}>
                          
                          </CardContent>
                        </CardActionArea>
                        <CardActions style={{"padding":"0"}}>
      
                          
                          <Button size="small" className={"botaoVerde naoArredondado"} 
                            onClick={() =>{
                              setVerPedido(true)
                              setVerPedidoPosicao(index)
                            }}>
                              VER PEDIDO
                            </Button>
      
                            <Button size="small" className={pedido.idAvaliacao ? "botaoCinza naoArredondado" : "botaoVerde naoArredondado"} 
                              disabled={pedido.idAvaliacao ? true : false}
                              onClick={() =>{
                                history.push(`/delivery/avaliacaoPedido/?Cliente=${btoa(pedido.cliente.id)}&Pedido=${btoa(pedido.id)}`)
                            }}>
                              {pedido.idAvaliacao ? "Avaliado" : "Avaliar"}
                            </Button>
                          
                        </CardActions>
                      </Card>
                    </Col>
              </React.Fragment>)  
              )))
              
              //NAO TEM PEDIDO
              : null
              }   
          

              <Dialog
                open={verPedido}
                aria-labelledby="qrCodeModal">

                <DialogTitle id="qrCodeModal">#{pedidos[verPedidoPosicao]?.id}</DialogTitle>
                <DialogContent>
                    
                    
                    <span>
                      <ListItem button  >
                        <ListItemAvatar>
                          <Avatar>
                            <MotorcycleIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={pedidos[verPedidoPosicao].tipoPedido === 1 ? "Retirada" : pedidos[verPedidoPosicao].tipoPedido === 2 ? `Mesa ${pedidos[verPedidoPosicao].mesa}` : "Entrega"} />
                        <ListItemText primary={Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedidos[verPedidoPosicao]?.taxaEntrega)} className="carrinho-produto-valor"/>
                      </ListItem>
                      <Divider/>
                    </span>



                  {pedidos[verPedidoPosicao]?.itens?.map((item, index) => (                    
                    <span key={index}>
                      <ListItem button  >
                        <ListItemAvatar>
                          <Avatar>
                            <ImageIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={item.quantidade + "x "+ item.produto.nome} />
                        <ListItemText primary={Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valorProdutoHistorico)} className="carrinho-produto-valor"/>
                      </ListItem>    

                      {!!item.itensOpcaoProduto.length &&
                        item.itensOpcaoProduto.map((adicional, index) =>(
                          <List key={index} component="div" disablePadding >
                            <ListItem  className={classes.nested} style={{"paddingTop": "0"}}>
                              <ListItemText secondary={adicional.quantidade + "x " + adicional.opcaoProduto.nome} />
                            </ListItem>
                          </List>     
                        ))
                      }
                            
                      <Divider/>
                    </span>
                    
                  ))}


                <Button >
                  Total: {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedidos[verPedidoPosicao]?.valorTotal)}
                </Button>
                </DialogContent>
                <DialogActions>                
                  <Button style={{"color":"#dc3545"}} onClick={() => {setVerPedido(false)}} >
                    Cancelar
                  </Button>    

                  <Button style={{"background": `#28a745`, "color":"white"}} onClick={async () => 
                  {

                    try {
      
                      const response = await ObterStatusPedido(pedidos[verPedidoPosicao].id, aplicativoDados)
                  
                      if(response.retornoErro){
                        //algum erro
                        alertStart(response.mensagem, "error")
                      }else{ 
                        //tudo certo
                        // history.push(`/delivery/pedido/${estabelecimentoAtual.id}/${pedidos[verPedidoPosicao].id}/${response.status}${identificarEstabelecimentoSelecionado(aplicativoDados)}`)
                        history.push(`/delivery/pedido${identificarEstabelecimentoSelecionado(aplicativoDados, pedidos[verPedidoPosicao].id, response.status)}`)
                      }
                    }
                    catch (error) {
                        Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions ObterStatusPedido ${window.location.hostname} - ${error}`);
                        alertStart("Procure os desenvolvedores! Erro: "+error.message, "error")    
                    }
                  
                    setLoading(true)
                   }}>
                    Verificar Status
                  </Button>            
                </DialogActions>
              </Dialog>
          
        </Row>



      </div>
      <Rodape valor="DeliveryHistorico"></Rodape>

    </>
  );
}