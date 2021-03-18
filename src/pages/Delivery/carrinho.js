import React, {useState} from 'react'
import Fab from '@material-ui/core/Fab';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel'; 
import Select from '@material-ui/core/Select';
import CadastroEndereco from '../../components/cadastroEndereco';

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

export default function Carrinho (props) {
    const{
        carrinho,
        iphone,
        android,
        classes,
        valorTaxaEntrega,
        setCarrinhoOpen,
        estabelecimentoAtual,
        aplicativoDados,
        quantidadeProdutos,
        removeItem,
        setRemoveItem,
        removeItemSelecionado,
        setCarrinho,
        calcularValorTotal,
        setAdicionarCupom,
        adicionarCupom,
        fullScreen,
        carrinhoOpen,
        isEntregaNoEndereco,
        usuarioPedidoMesa,
        setInformacoesDoTipoEntrega,
        isRetiradaNoLocal,
        isUsuarioPedidoMesa,
        temEndereco,
        enderecoAtual,
        setTelaRetiradaOuEntrega,
        usuarioLogado,
        isFreteGratisMinimoEntrega,
        setPagamentoOpen,
        setContinuarSemCadastro,
        continuarSemCadastro,
        alertStart,
        setRodarFuncaoAposIsso,
        setInformacoesPedido,
        irParaEnderecos,
        qrCodeModal,
        setQrCodeModal,
        informacoesPedido,
        isNumeric,
        nomeMesa,
        numeroMesas,
        confirmacaoInformacoes,
        formaDePagamento,
        setFormaDePagamento,
        setLoading,
        obterMeusCartoesSalvos,
        setPagamentoOnline,
        troco,
        setTroco,
        formatReal,
        getMoney,
        setCriarCartao,
        setAbrirMostrarFotoProduto,
        irParaProduto,
        selecioneiRetiradaNoLocal,
        selecioneiEndereco,
        cardapio,
        descontoCardapio,
        removerCupom,
        setRemoveItemSelecionado,
        pagamentoOpen,
        irParaLogin,
        AdicionarCupom,
        AvatarTipoEntrega,
        ReactPixel,
        EnderecoPedidoMesa,
        QRCode,
        PagamentoOnline,
        MeusCartoes,
        CriarCartao,
        VerificarPagamentoOnline,
        EscolhiMeuCartaoPagamentoOnline,
        InformacoesDoTipoEntrega,
        AbrirMostrarFotoProduto,
        MostrarFotoProduto,
        TelaRetiradaOuEntrega,
        setEnderecoAtual,
        solicitarNomeAoFinalizar,
        solicitarTelefoneAoFinalizar,
    } = props

    const [abrirAdicionarEndereco, setAbrirAdicionarEndereco] = useState(false)
    const [popUpCep, setPopUpCep] = useState(false);


    const prontoTroco = () => {
        var valorTroco = parseFloat(troco[1].replace('R$ ', '').replace('.', '').replace(',', '.'))
        ////console.log("valorTroco", /*valorTroco */)

        if(document.getElementsByName('naoPrecisoDeTroco')[0].checked && !valorTroco){
        valorTroco = 0   
        }else if(valorTroco < carrinho.pedido.valorTotal){
        alertStart("Valor do troco deve ser maior que o total.", "warning")
        document.getElementById('valorTroco').focus()
        return false
        }else if(!valorTroco){
        alertStart("Valor inválido!", "warning")
        document.getElementById('valorTroco').focus()
        return false
        }      

        carrinho.pedido.troco = valorTroco
        setTroco([false, troco[1]])
        
        if(continuarSemCadastro && !temEndereco && !isRetiradaNoLocal){
            setPopUpCep(true)
            setAbrirAdicionarEndereco(true)
        }else{
            setInformacoesPedido(true)   
        }
    }

    const selecionarFormaDePagamento = async (valor) => {

        setFormaDePagamento(valor)
        const formaPagamentoSelecionado = cardapio.formasPagamento[valor.replace("forma","")]
        carrinho.formaPagamentoDescricao = formaPagamentoSelecionado.descricao
        carrinho.pedido.formaPagamento = formaPagamentoSelecionado
        localStorage.setItem('carrinhoCF', JSON.stringify(carrinho));
        setCarrinho(carrinho)
        ////console.log("formaPagamentoSelecionado", /**formaPagamentoSelecionado */)
        if(formaPagamentoSelecionado.descricao === "DINHEIRO"){
            setTroco([true, ''])
        }else if(formaPagamentoSelecionado.descricao === "Pagamento Online"){
            setLoading(true)
            await obterMeusCartoesSalvos()
            setLoading(false)
            setPagamentoOnline([true, {}])
        }else if(continuarSemCadastro === true && !isRetiradaNoLocal && !temEndereco){
            setPopUpCep(true)
            setAbrirAdicionarEndereco(true)
        }else{
            setInformacoesPedido(true)    
            //enviarPedido()
        }
        calcularValorTotal()

    }

    const calcularValorProdutos = () => {
        let valor = 0.0
        if(carrinho?.pedido && carrinho?.pedido?.itens){
            if(carrinho.pedido.itens.length === 0){

            }else if(carrinho.pedido.itens.length === 1){
                valor = carrinho.pedido.itens[0].valorProdutoHistorico
            }else{
                valor = carrinho.pedido.itens.reduce((acumulado, x) => {
                    return acumulado.valorProdutoHistorico + x.valorProdutoHistorico;
                });
            }
        }
        return valor
    }

    const valorDesconto = informacoesPedido === true ? (calcularValorProdutos() + valorTaxaEntrega) - carrinho.pedido.valorTotal : 0.0
    
    return(
        <>
            {
                (aplicativoDados?.permitirContinuarSemCadastro && continuarSemCadastro === true) && 
                <CadastroEndereco
                    setInformacoesPedido={setInformacoesPedido}
                    telaDeCardapio={true}
                    setInformacoesDoTipoEntrega={setInformacoesDoTipoEntrega}
                    setPagamentoOpen={setPagamentoOpen}
                    calcularValorTotal={calcularValorTotal}
                    estabelecimentoAtual={estabelecimentoAtual}
                    setLoading={setLoading}
                    alertStart={alertStart}
                    aplicativoDados={aplicativoDados}
                    enderecoAtual={enderecoAtual}
                    retirarNoLocal={isRetiradaNoLocal}
                    usuarioLogado={usuarioLogado}
                    setEnderecoAtual={setEnderecoAtual}
                    abrirAdicionarEndereco={abrirAdicionarEndereco}
                    setAbrirAdicionarEndereco={setAbrirAdicionarEndereco}
                    setPopUpCep={setPopUpCep}
                    popUpCep={popUpCep}
                    continuarSemCadastro={continuarSemCadastro}
                />
            }

            {
            (carrinho.pedido?.itens?.length > 0 && !props.visualizacao) && 
                <Fab
                    variant="extended"
                    size="small"
                    color="primary"
                    aria-label="add"
                    style={(iphone || android) ? null : {"padding": "25px"}  }
                    onClick={() => {setCarrinhoOpen(true)}}
                    className={ usuarioPedidoMesa ? classes.fixedMesa : classes.fixed  } id="botaoCarrinho"
                    >
                    <ShoppingBasketIcon className={classes.extendedIcon} />
                    {/* carrinho.pedido?.itens?.length + " " */}
                    {/* { carrinho.pedido?.itens?.length > 1 ? "Produtos" : "Produto" } */}
                    Meu Pedido
                    <span className="valorFinalizarPedido" style={{"color":aplicativoDados.corSitePrimaria}}>
                        {
                        estabelecimentoAtual.somarQtdItens == true 
                        ? quantidadeProdutos() //carrinho.pedido?.itens.length
                        : Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(carrinho.pedido?.valorTotal)      
                        }
                    </span>
                </Fab>
            }
            
            {/* {
                (carrinho.pedido?.itens?.length > 0)
                &&
                <Dialog
                open={removeItem}
                aria-labelledby="excluirProduto">
                <DialogTitle id="excluirProduto">{"Remover Produto"}</DialogTitle>
                <DialogActions style={{"justifyContent": "center"}}>  
                    <Button onClick={() => {
                    setRemoveItem(false)
                    }} style={{"color": "#dc3545"}}>
                        Não
                    </Button>

                    <Button onClick={async () => {

                    setRemoveItem(false)


                    carrinho.pedido.itens.splice(removeItemSelecionado, 1)
                    
                    localStorage.setItem("carrinhoCF", JSON.stringify(carrinho))
                    setCarrinho(carrinho)

                    //calcula valor total
                    await calcularValorTotal()

                    

                    
                    }} style={{"color": "white", "backgroundColor": "#28a745"}}>
                    Sim
                    </Button>    
                                
                </DialogActions>
                </Dialog> 
            } */}

            {(carrinho.pedido?.itens?.length > 0) &&
                <Dialog
                open={AdicionarCupom}
                aria-labelledby="adicionarCupom">
                <DialogTitle id="adicionarCupom">{"Adicionar Cupom"}</DialogTitle>
                <DialogContent>
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    autoFocus
                    id="codigoAddCupom"
                    label="Código Cupom"
                    name="codigoAddCupom"
                />  
                </DialogContent>
                <DialogActions style={{"justifyContent": "center"}}>  
                <Button onClick={() => {
                    setAdicionarCupom(false)
                }} style={{"color": "#dc3545"}}>
                    Cancelar
                </Button>

                <Button onClick={adicionarCupom} style={{"color": 'white', 'backgroundColor': '#28a745'}}>
                    Adicionar
                </Button>    
                                
                </DialogActions>
            </Dialog>
            }

            { (carrinho.pedido?.itens?.length > 0) ?
            (<>
                <Dialog
                fullScreen={true}
                // fullScreen={fullScreen}
                open={carrinhoOpen}
                onClose={() => {
                    setCarrinhoOpen(false)
                }}
                aria-labelledby="Carrinho-de-Pedidos">
                <DialogTitle id="Carrinho-de-Pedidos">{"Pedido"}</DialogTitle>


                
                <DialogContent>
                
                {
                    (isEntregaNoEndereco || isRetiradaNoLocal)
                    ? <DialogActions>
                        <Button 
                            // onClick={!usuarioPedidoMesa?.logado ? () => { setInformacoesDoTipoEntrega(true) } : null}
                            onClick={!usuarioPedidoMesa?.logado ? () => { 
                                setRodarFuncaoAposIsso("")
                                setTelaRetiradaOuEntrega(true) 
                            } : null}
                        >
                        {((isRetiradaNoLocal || isEntregaNoEndereco) && !isUsuarioPedidoMesa)
                        ? isEntregaNoEndereco ? "Entrega - " : "Retirada - " 
                        : null}  Valor Total
                        </Button>
                        <Button >
                        {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(carrinho.pedido.valorTotal)}
                        </Button>
                    </DialogActions>
                    : null
                }

                        <List
                        component="div"
                        aria-labelledby="nested-list-subheader"
                        className={classes.rootCarrinho}
                        >

                            {
                                (isEntregaNoEndereco === false  && temEndereco)
                                && 
                                (<>
                                    <AlertFixo style={{"marginBottom": "1em"}} severity="error"> Essa loja não entrega no seu endereço <b>{enderecoAtual.logradouro}, {enderecoAtual.numero}</b> <Button onClick={() => { setTelaRetiradaOuEntrega(true)}} style={{"padding": "0px", "fontSize": "80%"}}>Trocar</Button></AlertFixo>
                                </>)
                            }
                            
                            
                                
                            {/* { (!isUsuarioPedidoMesa && usuarioLogado?.logado && (isRetiradaNoLocal || isEntregaNoEndereco))  && */}
                            { (!isUsuarioPedidoMesa && (isRetiradaNoLocal || isEntregaNoEndereco))  &&
                                
                                (<span>
                                    {( !isUsuarioPedidoMesa && !isRetiradaNoLocal && isEntregaNoEndereco && carrinho.minimoEntregaGratis > 0 && carrinho.minimoEntregaGratis < 999) &&
                                    <AlertFixo style={{"marginBottom": "1em"}} severity={isFreteGratisMinimoEntrega ? "success" : "warning"} className="campoDeUmAlert">
                                        Frete Grátis acima de <b>
                                        {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(carrinho.minimoEntregaGratis)}</b> no total dos produtos.
                                    </AlertFixo>}

                                    { /* ========== ALERTA MINIMO PARA REALIZAR PEDIDO ============ */
                                        carrinho.valorMinimoPedido > 0 && <AlertFixo severity={carrinho.pedido.valorTotal  > carrinho.valorMinimoPedido ? "success" : "warning"} className="campoDeUmAlert">O valor minimo do pedido é de <b>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(carrinho.valorMinimoPedido)} </b></AlertFixo>}


                                    <ListItem button  onClick={() =>{
                                            setRodarFuncaoAposIsso("")
                                            setTelaRetiradaOuEntrega(true)
                                        }}>
                                        <ListItemAvatar>
                                        <AvatarTipoEntrega retirada={isRetiradaNoLocal}/>
                                        </ListItemAvatar>
                                        <ListItemText 
                                        primary={isRetiradaNoLocal ? "Retirada" : isEntregaNoEndereco && "Entrega"}
                                        />
                                        <ListItemText 
                                        primary={(isRetiradaNoLocal || isFreteGratisMinimoEntrega) ? "" : Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format((carrinho?.pedido && carrinho?.pedido?.taxaEntrega !== null) ? carrinho?.pedido?.taxaEntrega  : enderecoAtual.taxaEntrega)} className="carrinho-produto-valor"
                                        secondary={
                                            <Button 
                                            // onClick={() => { /*setTelaRetiradaOuEntrega(true) */}} 
                                            style={{"padding": "0px", "float": "right", "fontSize": "80%" /*,"color": `${aplicativoDados.corSitePrimaria}` */}}
                                            >
                                            Trocar
                                            </Button>
                                        }    
                                        />
                                    </ListItem>
                                    <List component="div" disablePadding  >
                                        <ListItem  className={classes.nested} style={{"paddingTop": "0"}}>
                                        <ListItemText 
                                            secondary={
                                            isRetiradaNoLocal 
                                            ? `${estabelecimentoAtual?.nome}: ${estabelecimentoAtual?.endereco} - ${estabelecimentoAtual?.telefone}`
                                            : `${enderecoAtual.logradouro} - nº ${enderecoAtual.numero}`
                                            } 
                                        />
                                        </ListItem>
                                    </List>            
                                    <Divider/>
                                </span>)
                            }
                            


                            
                        

                        {((cardapio.percentualDesconto || cardapio.valorDesconto) && cardapio.informacao)
                        ? (
                        <span>
                            <ListItem button  >
                            <ListItemAvatar>
                                <Avatar>
                                <FavoriteIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={cardapio.informacao.includes("resgate de cartela") ? "Fidelidade" : "Desconto"} />
                            <ListItemText 
                                primary={Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format( -descontoCardapio )} className="carrinho-produto-valor-negativo"
                                secondary={
                                <Button 
                                    onClick={removerCupom} 
                                    style={{"padding": "0px", "float": "right", "fontSize": "80%" /*,"color": `${aplicativoDados.corSitePrimaria}` */}}
                                >
                                    Não Usar
                                </Button>
                                }   
                            />
                            </ListItem> 
                            <List component="div" disablePadding >
                                <ListItem  className={classes.nested} style={{"paddingTop": "0"}}>
                                    <ListItemText secondary={cardapio.informacao} />
                                </ListItem>
                            </List>  
                            <Divider/>
                        </span>
                        ): null}


                        {cardapio.cupomDesconto 
                        ? (
                        <span>
                            <ListItem button >
                            <ListItemAvatar>
                                <Avatar>
                                <ConfirmationNumberIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={cardapio.cupomDesconto.codigoCupom} />
                            <ListItemText 
                                primary={Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format( -descontoCardapio )} className="carrinho-produto-valor-negativo"
                                secondary={
                                <Button 
                                    onClick={removerCupom} 
                                    style={{"padding": "0px", "float": "right", "fontSize": "80%" /*,"color": `${aplicativoDados.corSitePrimaria}` */}}
                                >
                                    Remover
                                </Button>
                                }    
                            />
                            </ListItem>                       
                            <List component="div" disablePadding >
                            <ListItem  className={classes.nested} style={{"paddingTop": "0"}}>
                                <ListItemText secondary={cardapio.cupomDesconto.mensagem ? cardapio.cupomDesconto.mensagem : 
                                `Cupom de desconto ${cardapio.cupomDesconto.codigoCupom} ${cardapio.cupomDesconto.freteGratis ? "com frete grátis" : ""}`} />
                            </ListItem>
                            </List>   
                            <Divider/>
                        </span> 
                        ): (usuarioLogado.logado && !usuarioPedidoMesa?.logado && !(cardapio.percentualDesconto || cardapio.valorDesconto)) &&
                            <span> 
                                <ListItem button onClick={()=>{setAdicionarCupom(true)}} >
                                <ListItemAvatar>
                                    <Avatar>
                                    <ConfirmationNumberIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={'Adicionar Cupom'} />
                                </ListItem>        
                                <Divider/>
                            </span> }
                            

                        {
                            (carrinho?.pedido && carrinho.pedido?.formaPagamento && carrinho.pedido.formaPagamento?.desconto) &&
                            <span>
                                <ListItem button  >
                                    <ListItemAvatar>
                                        <Avatar>
                                        <PaymentIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={`Desconto em ${carrinho.pedido.formaPagamento.descricao}`} />
                                    <ListItemText 
                                        primary={`${carrinho.pedido.formaPagamento.desconto} %`} className="carrinho-produto-valor-negativo"
                                    />
                                </ListItem> 
                                <Divider/>
                            </span>
                        }
                            



                        <ListSubheader component="div" id="nested-list-subheader" className="mt-4">
                            <b> ({carrinho.pedido?.itens.length}) Produtos adicionados:</b>
                        </ListSubheader>
                        
                        
                        
                        {carrinho.pedido?.itens.map((item, index) => (
                            
                            <div key={index} style={{"position": "relative"}}>
                            
                            <ListItem button onClick={() => {
                                setRemoveItemSelecionado(index)
                                setRemoveItem(true)
                                }} >
                                <ListItemAvatar>
                                {
                                    item.produto.urlImagem ? 
                                    <Avatar style={{"backgroundImage": `url(${item.produto.urlImagem})`, "backgroundSize": "cover"}}>
                                        <> </>
                                    </Avatar>
                                    : <Avatar className={"opacity05"} style={{"backgroundImage": `url(${(item.produto.produtoExibicao ? Megafone : /**Prato */ Comida)})`, "backgroundSize": "cover", "backgroundColor": "white"}}>
                                        <> </>
                                    </Avatar>
                                }
                                </ListItemAvatar>
                                <ListItemText primary={item.quantidade + "x "+ item.produto.nome} />
                                <ListItemText 
                                primary={Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valorProdutoHistorico)} 
                                secondary={
                                    <Button
                                    style={{"padding": "0px", "float": "right", "fontSize": "80%", "color": `#dc3545`}}
                                    // onClick={() => {
                                        // setRemoveItemSelecionado(index)
                                        // setRemoveItem(true)
                                    // }}
                                    onClick={async () => {
                                        setRemoveItem(false)
                                        carrinho.pedido.itens.splice(index, 1)
                                        localStorage.setItem("carrinhoCF", JSON.stringify(carrinho))
                                        setCarrinho(carrinho)
                                        //calcula valor total
                                        await calcularValorTotal()
                                    }}
                                    >Remover</Button>
                                }
                                className="carrinho-produto-valor"/>
                                
                            </ListItem>    

                            {
                                (item.produto.promocional && cardapio.percentualDesconto && !cardapio.valorDesconto)
                                ?
                                <List key={index} component="div" disablePadding >
                                    <ListItem  className={classes.nested} style={{"paddingTop": "0"}}>
                                       <p className="promocionalElement">
                                           É promocional, então não recebe descontos percentuais.
                                       </p>
                                    </ListItem>
                                </List> 
                                
                                : null 
                            }
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
                            </div>
                            
                        ))}
                        
                    </List>     

                </DialogContent>

                <DialogActions>
                
                <Button onClick={() => {setCarrinhoOpen(false)}} style={{"color": "#dc3545"}}>
                    Voltar ao Cardápio
                </Button>
                
                
                
                <Button variant="contained" fullWidth onClick={() => {
                    if(aplicativoDados.clienteFielStart){
                    setPagamentoOpen(true)
                    }else{
                    if(estabelecimentoAtual.online === false){
                        alertStart("Estamos fechados no momento. Tente novamente mais tarde!", "warning")              
                    // }else if( enderecoAtual.taxaEntrega === -1 || carrinho?.pedido?.taxaEntrega === -1){
                    }else if(estabelecimentoAtual.online && estabelecimentoAtual.pausado){
                        alertStart("Estamos abertos, porém pausados nesse momento. Tente novamente mais tarde!", "warning")              
                    }else if( isEntregaNoEndereco === false && temEndereco){
                        alertStart("Não entregamos no seu endereço atualmente.", "warning")  
                    }else if( carrinho.pedido.valorTotal < carrinho.valorMinimoPedido && !usuarioPedidoMesa?.logado){
                        alertStart(`O valor mínimo para pedido é de ${Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(carrinho.valorMinimoPedido)}.`, "warning")  
                    }else{

                        if(aplicativoDados.pixelFacebook){
                        ReactPixel.track('InitiateCheckout')
                        }

                        setRodarFuncaoAposIsso('formaPagamento')
                        if(!usuarioLogado.logado && !usuarioPedidoMesa?.logado ){
                        //PEDE PRA FAZER LOGIN
                        setInformacoesDoTipoEntrega(true)
                        }else if(usuarioPedidoMesa?.logado){
                        EnderecoPedidoMesa()
                        if(cardapio.formasPagamento?.length > 0){
                            setPagamentoOpen(true) 
                        }else if(continuarSemCadastro){
                            setPopUpCep(true)
                            setAbrirAdicionarEndereco(true)
                        }else{
                            setInformacoesPedido(true)
                        }
                        }else if((isRetiradaNoLocal || temEndereco)){
                            setPagamentoOpen(true) 
                        }else{
                        if(estabelecimentoAtual.permiteRetiradaBalcao){
                            setTelaRetiradaOuEntrega(true)
                        }else{
                            localStorage.setItem('backupItensCarrinhoCF', JSON.stringify(JSON.parse(localStorage.getItem('carrinhoCF')).pedido.itens))
                            irParaEnderecos()
                        }
                        }                             
                    }}
                    // }} style={(enderecoAtual.taxaEntrega === -1 || carrinho?.pedido?.taxaEntrega === -1) ? {} : {"background": "#28a745", "color":"white"}}>
                    }} style={( isEntregaNoEndereco === false && temEndereco) ? {} : {"background": "#28a745", "color":"white"}}>
                    Finalizar  
                    {
                    // (enderecoAtual.taxaEntrega === -1 || carrinho?.pedido?.taxaEntrega === -1)
                    ( isEntregaNoEndereco === false && temEndereco)
                    ? null
                    : <span className="valorFinalizarPedido">
                        {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(carrinho.pedido.valorTotal ? carrinho.pedido.valorTotal : 0.0)}
                        </span>
                    }
                    
                </Button>          
                
                
                </DialogActions>
            </Dialog>

                    
                {
                ( usuarioPedidoMesa?.logado && estabelecimentoAtual.solicitarComanda ) &&
                <Dialog
                    fullScreen={fullScreen}
                    open={qrCodeModal}
                    aria-labelledby="qrCodeComanda">

                    <DialogTitle id="qrCodeComanda">{"Leia o QRCode na COMANDA"}</DialogTitle>
                    <DialogContent>

                    <QRCode/>

                    </DialogContent>
                    <DialogActions>                
                    <Button onClick={() => {setQrCodeModal(false)}} >
                        Cancelar
                    </Button>                
                    </DialogActions>
                </Dialog>
                }
                
                <Dialog
                // fullScreen={fullScreen}
                fullScreen={true}
                open={informacoesPedido}
                onClose={() => {setInformacoesPedido(false)}}
                aria-labelledby="responsive-dialog-informacoes-nome-pedido">
                <DialogTitle id="responsive-dialog-informacoes-nome-pedido">{"Confirmação Dados"}</DialogTitle>
                <DialogContent>

                    {/* { (!isRetiradaNoLocal && !usuarioPedidoMesa?.logado)
                    && <Typography>
                        <b>Entregar</b> na {enderecoAtual.logradouro + " - n°: " + enderecoAtual.numero} - Bairro {enderecoAtual.bairro} - {enderecoAtual.cidade + " - " + enderecoAtual.uf}
                        <b> Complemento:</b> {enderecoAtual.complemento} e <b>Referência: </b>{enderecoAtual.referencia}
                        <br/>
                        </Typography>
                    } */}
                    <div style={{"textAlign": "center"}}>
                        {
                            !isUsuarioPedidoMesa &&
                            <Button onClick={() => {
                                if(continuarSemCadastro === true){
                                    setPopUpCep(true)
                                    setAbrirAdicionarEndereco(true)
                                    window.setTimeout(function(){
                                        setInformacoesPedido(false)
                                    },500)
                                    
                                }else{
                                    setTelaRetiradaOuEntrega(true)
                                    // irParaEnderecos()
                                }
                            }} style={{"padding": "0px", "color": `${aplicativoDados.corSitePrimaria}`}}>Trocar forma de entrega</Button>
                        }
                    </div>
                    <br></br>
                    {
                        (!isUsuarioPedidoMesa &&
                            temEndereco 
                            ? <Typography style={{"textAlign": "center"}}>
                                <b>Entregar</b> na {enderecoAtual.logradouro + " - n°: " + enderecoAtual.numero} - Bairro {enderecoAtual.bairro} - {enderecoAtual.cidade + " - " + enderecoAtual.uf}
                                <b> Complemento:</b> {enderecoAtual.complemento} e <b>Referência: </b>{enderecoAtual.referencia}
                                <br/>
                                </Typography>
                            : isRetiradaNoLocal
                                ? <Typography style={{"textAlign": "center"}}>
                                    <b>Retirar no estabelecimento: </b>{estabelecimentoAtual.nome}<br/>
                                    Endereco: {estabelecimentoAtual.endereco}<br/>
                                    Telefone: {estabelecimentoAtual.telefone}<br/>
                                </Typography>
                                : null
                        )
                    }
                    <br></br>
                    <Typography>
                        Produtos: + {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format( calcularValorProdutos() )}<br/>
                        {valorDesconto ? <>Descontos: - {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format( valorDesconto )}<br/></> : null}
                        {(temEndereco && !isUsuarioPedidoMesa) ? <>Taxa Entrega: + {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format( valorTaxaEntrega )}<br/></>: null}
                        <b>Valor Final = {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format( carrinho.pedido.valorTotal  )}</b><br/>

                    </Typography>

                    

                    {
                    ( solicitarNomeAoFinalizar ) &&
                        <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        autoFocus={(usuarioLogado?.cliente?.nome && !usuarioPedidoMesa?.logado) ? false : true}
                        defaultValue={usuarioPedidoMesa?.logado ? usuarioPedidoMesa?.cliente?.nome : usuarioLogado?.cliente?.nome}
                        id="nomePedido"
                        label="Seu Nome"
                        name="nomePedido"
                        />  
                    }

                    {
                    ( solicitarTelefoneAoFinalizar ) &&
                        <TextField
                        variant="outlined"
                        autoFocus={(!usuarioPedidoMesa?.logado && usuarioLogado?.cliente?.nome && !usuarioLogado?.cliente?.telefone ) ? true : false}
                        defaultValue={(usuarioLogado?.cliente?.telefone)?.replace(' ', '').replace('.','').replace('-','').replace('(','').replace(')','').replace('/','')}
                        margin="normal"
                        fullWidth
                        id="telefonePedido"
                        label="Seu Telefone"
                        name="telefonePedido"
                        />  
                    }
                    
                    {
                    usuarioPedidoMesa?.logado &&
                    
                    <FormControl disabled={(isNumeric(nomeMesa) || carrinho?.mesa) ? true : false} variant="outlined" style={{"width": "100%", "marginTop": "1.5em"}}>
                        <InputLabel id="numeroDaMesaLabel">Mesa</InputLabel>
                        <Select
                        defaultValue={isNumeric(nomeMesa) ? nomeMesa : (carrinho?.mesa ? carrinho?.mesa : 0)}
                        labelId="numeroDaMesaLabel"
                        id="numeroDaMesa"
                        label="Mesa"
                        fullWidth
                        > 
                        <MenuItem key={0} value={0}>{"Não Selecionada"} </MenuItem>
                        {
                            numeroMesas.map((num) => (
                            <MenuItem key={num} value={num}>{"Mesa " + num} </MenuItem>
                            ))
                        }
                        </Select>
                    </FormControl>              
                    }

                    <TextField style={{"margin": "1em 0"}}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="observacaoPedido"
                        label="Observação"
                        name="observacaoPedido"
                        type="text"
                        ></TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {setInformacoesPedido(false)}} style={{"color": "#dc3545"}}>
                    Fechar
                    </Button> 
                    <Button variant="contained" style={{"background": "#28a745", "color":"white"}} onClick={confirmacaoInformacoes}>
                    Enviar Pedido
                    <span className="valorFinalizarPedido">
                    {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(carrinho.pedido.valorTotal ? carrinho.pedido.valorTotal : 0.0)}
                    </span>
                    </Button>
                </DialogActions>
                </Dialog>

                {cardapio.formasPagamento ? <Dialog
                // fullScreen={fullScreen}
                fullScreen={true}
                open={pagamentoOpen}
                onClose={() => {setPagamentoOpen(false)}}
                aria-labelledby="responsive-dialog-pagamento">
                <DialogTitle id="responsive-dialog-pagamento">{"Formas de Pagamento"}</DialogTitle>
                <DialogContent style={{padding: '8px 15px'}}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Selecione a melhor opção</FormLabel>
                        <RadioGroup aria-label="formaDePagamento" name="formaDePagamento" value={formaDePagamento} onChange={async (e) => {
                        
                            selecionarFormaDePagamento(e.target.value)

                        }}>
                        {
                        cardapio.formasPagamento.map((formaDePagamento, index) => (                  
                            <span key={formaDePagamento.id} >
                            {formaDePagamento.urlImagem ? <img src={formaDePagamento.urlImagem} alt={formaDePagamento.descricao} className="bandeiraCartao"/> : <PaymentIcon className="bandeiraCartao"/>}                    
                            <FormControlLabel value={"forma"+index} control={<Radio />} label={`${formaDePagamento.descricao} ${formaDePagamento.desconto ? ` - ${formaDePagamento.desconto}% Desconto` : ""}` } />                
                            </span>
                        ))
                        }       
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {setPagamentoOpen(false)}} style={{"color": "#dc3545"}}>
                    Fechar
                    </Button>  
                    { formaDePagamento
                    ? (<Button variant="contained" style={{"background": "#28a745", "color":"white"}} onClick={ async () => {

                        selecionarFormaDePagamento(formaDePagamento)

                    }}>Confirmar
                    </Button>)
                    : (<Button variant="contained" disabled >Confirmar
                    </Button>)
                    }
                
                    
                
                </DialogActions>
                </Dialog> : null} 

                </>) : null}


                <Dialog
                open={troco[0]}
                aria-labelledby="trocoModal">
                <DialogTitle id="trocoModal">{"Insira o valor para trocar"}</DialogTitle>
                <DialogContent>
                            <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            autoFocus
                            value={troco[1]}
                            onChange={(e) => {
                                setTroco([true, e.target.value === "" ? "R$ 0,00"  : "R$ "+formatReal(getMoney(e.target.value))])
                            }}
                            id="valorTroco"
                            label="Valor para Trocar"
                            name="valorTroco"
                            />  

                <FormControlLabel
                    control={
                    <Checkbox
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                        checkedIcon={<CheckBoxIcon fontSize="small" />}
                        name="naoPrecisoDeTroco"
                        onClick={() => { 
                            setTroco([true, '' ]) 
                            prontoTroco()
                        }}
                    />
                    }
                    label="Não preciso de troco"
                />

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {setTroco([false, ''])}} style={{"color": "#dc3545"}}>
                    Trocar
                    </Button>  
                    <Button onClick={prontoTroco} style={{"backgroundColor": "#28a745", "color": "white"}}>
                    Pronto
                    </Button>  
                </DialogActions>
                </Dialog>


                <Dialog
                open={PagamentoOnline[0]}
                aria-labelledby="pagamentoOnlineModal">
                <DialogTitle id="pagamentoOnlineModal">{MeusCartoes === 0 ? "Pagamento Online" : "Meus Cartões"}</DialogTitle>
                
                { MeusCartoes.length === 0 || CriarCartao === true
                ?(<form id="payment-form"  name="payment-form" method="POST" autoComplete="off" onSubmit={(e) => {VerificarPagamentoOnline(e)}}>

                <DialogContent>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        
                        //autoFocus
                        //value={troco[1]}
                        /*onChange={(e) => {
                            setTroco([true, "R$ "+formatReal(getMoney(e.target.value))])
                        }}*/
                        id="numeroCartao_PagamentoOnline"
                        label="Número Cartão"
                        name="numeroCartao_PagamentoOnline"
                        className="credit_card_number"
                        inputProps={{ 'data-iugu': 'number' }} 
                        required
                        type="number"

                    />  
                    <TextField
                        variant="outlined"
                        margin="normal"
                        type="number"
                        fullWidth
                        //autoFocus
                        //value={troco[1]}
                        /*onChange={(e) => {
                            setTroco([true, "R$ "+formatReal(getMoney(e.target.value))])
                        }}*/
                        id="cvv_PagamentoOnline"
                        label="CVV"
                        name="cvv_PagamentoOnline"
                        inputProps={{ 'data-iugu': 'verification_value' }} 
                        required
                        className="credit_card_cvv"

                    /> 
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        inputProps={{ 'data-iugu': 'full_name' }} 
                        //autoFocus
                        //value={troco[1]}
                        /*onChange={(e) => {
                            setTroco([true, "R$ "+formatReal(getMoney(e.target.value))])
                        }}*/
                        id="titular_PagamentoOnline"
                        label="Titular do Cartão"
                        name="titular_PagamentoOnline"
                        className="credit_card_name"
                    />  
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        //value={troco[1]}
                        id="expiracao_PagamentoOnline"
                        className="credit_card_expiration"
                        inputProps={{ 'data-iugu': 'expiration' }} 
                        label="MM/AA"
                        name="expiracao_PagamentoOnline"
                    />    

                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        id="cpf_PagamentoOnline"
                        label="CPF"
                        name="cpf_PagamentoOnline"
                    />
                    
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {setPagamentoOnline([false, {}])}} style={{"color": "#dc3545"}}>
                    Trocar
                    </Button>  
                    <Button type="submit" style={{"backgroundColor": "#28a745", "color": "white"}} >
                    Pronto
                    </Button>  
                </DialogActions>
                </form>)
                
                : MeusCartoes.length && (<div>
                    <DialogContent>
                        {
                        MeusCartoes.map((cartao, index) => (
                            <div key={index}>
                            <ListItem button onClick={() => EscolhiMeuCartaoPagamentoOnline(index)}  style={{"padding": "8px 0"}}>
                                <ListItemAvatar>
                                <Avatar>
                                    <PaymentIcon />
                                </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={cartao.numeroCartao} />
                            </ListItem>   
                            <Divider/>
                            </div>                   
                        ))
                        }
                    </DialogContent>
                    <DialogActions> 
                        <Button onClick={() => {setPagamentoOnline([false, {}])}} style={{"color": "#dc3545"}}>
                        Trocar
                        </Button>  
                        <Button onClick={() =>{ setCriarCartao(true) }} style={{"color": "#28a745"}}>
                        Outro Cartão
                        </Button>  
                    </DialogActions>
                </div>)}
                
                </Dialog>





                {cardapio.id ?
                <><Dialog
                open={InformacoesDoTipoEntrega}
                // fullScreen={fullScreen}

                onClose={() => {
                    setContinuarSemCadastro(false)
                    setInformacoesDoTipoEntrega(false)  
                }}
                aria-labelledby="informacoesFormaDeEntregaModal">

                

                {
                (usuarioLogado?.logado) 
                ? <DialogTitle id="informacoesFormaDeEntregaModal">
                    {
                        (isRetiradaNoLocal
                        ? "Para Retirada" 
                        : "Para Entrega" )
                    }
                    </DialogTitle>
                : <DialogTitle id="informacoesFormaDeEntregaModal">
                    Você Não Está Logado
                    </DialogTitle>
                }

                
                <DialogContent>
                {/* {
                    temEndereco
                        ?<Typography>
                            <b>Rua: </b>{enderecoAtual.logradouro + " - n°: " + enderecoAtual.numero}<br/><br/>
                            <b>Bairro: </b>{enderecoAtual.bairro}<br/><br/>
                            <b>Cidade: </b>{enderecoAtual.cidade + " - " + enderecoAtual.uf}<br/><br/>
                            <b>Complemento: </b>{enderecoAtual.complemento}<br/><br/>            
                            <b>Referencia: </b>{enderecoAtual.referencia}<br/><br/>
                            <b>Taxa: </b>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(enderecoAtual?.taxaEntrega)}<br/><br/>
                        </Typography>
                
                        : isRetiradaNoLocal 
                            ? <Typography>
                                <b>Retirar no estabelecimento: </b>{estabelecimentoAtual.nome}<br/><br/>
                                <b>Endereco: </b>{estabelecimentoAtual.endereco}<br/><br/>
                                <b>Telefone: </b>{estabelecimentoAtual.telefone}<br/><br/>
                            </Typography>

                        :   <Typography>
                                Você não esta logado com nenhum usuário
                            </Typography>
                } */}

                    <Typography>
                        Você pode continuar e fazer login no final ou pode se conectar agora
                    </Typography>
                </DialogContent>
                <DialogActions>
                    {
                        // true
                        aplicativoDados.permitirContinuarSemCadastro
                        ?   <Button onClick={() => {
                                setContinuarSemCadastro(true)
                                setInformacoesDoTipoEntrega(false)  
                                if(cardapio.formasPagamento?.length > 0){
                                    setPagamentoOpen(true) 
                                }else{
                                    setInformacoesPedido(true)
                                }
                            }} style={{"color": "#dc3545"}}>
                                Continuar sem Cadastro
                            </Button>  
                        :   <Button onClick={() => {setInformacoesDoTipoEntrega(false)}} style={{"color": "#dc3545"}}>
                                Voltar
                            </Button>  
                    }
                
                
                {usuarioLogado?.logado
                
                ? /* LOGADO */ <Button onClick={() =>{
                    if(estabelecimentoAtual.permiteRetiradaBalcao){
                        setTelaRetiradaOuEntrega(true)
                    }else{
                        irParaEnderecos()
                    }
                    }} style={{"backgroundColor": "#28a745", "color": "white"}} >
                    {(isRetiradaNoLocal || temEndereco) ? "Trocar" : "Adicionar"}
                    </Button> 
                
                : /* DESLOGADO */ <Button onClick={() =>{
                    if(!!JSON.parse(localStorage.getItem('carrinhoCF')).pedido?.itens){
                        localStorage.setItem('backupItensCarrinhoCF', JSON.stringify(JSON.parse(localStorage.getItem('carrinhoCF')).pedido.itens))
                    }
                    irParaLogin()
                    }} style={{"color": "white", 'backgroundColor': '#28a745'}}>
                    Fazer Login
                    </Button>  }
                </DialogActions>
            </Dialog>


            <Dialog
                open={AbrirMostrarFotoProduto}
                aria-labelledby="MostrarFotoProdutoModal">

                <DialogContent style={{"textAlign": "center"}}>
                <img className={MostrarFotoProduto.urlImagem ? '' : "opacity05"} style={{"width": "250px"}} alt={MostrarFotoProduto.nome} src={MostrarFotoProduto.urlImagem ? MostrarFotoProduto.urlImagem : (MostrarFotoProduto.produtoExibicao ? Megafone : /**Prato */ Comida)}/>
                <Typography component="h5" variant="h5" >
                    {MostrarFotoProduto.nome}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {MostrarFotoProduto.descricao}
                </Typography>
                </DialogContent>
                <DialogActions>
                {MostrarFotoProduto.produtoExibicao ? null : 
                    <Button onClick={() => {
                    // if(carrinho?.pedido?.valorEntrega === -1 || carrinho?.pedido?.taxaEntrega === -1){
                    if( isEntregaNoEndereco === false && temEndereco){
                        if(estabelecimentoAtual.permiteRetiradaBalcao){
                        setTelaRetiradaOuEntrega(true)
                        }else{
                        irParaEnderecos()
                        }
                    }else{
                        irParaProduto(MostrarFotoProduto.id)
                    }
                    }} style={{"color": "#28a745"}}>
                    Adicionar 
                    </Button>
                }
                <Button onClick={() => {
                    setAbrirMostrarFotoProduto(false)}} style={{"color": "#dc3545"}}>
                    Voltar
                </Button>  
                </DialogActions>
            </Dialog>

            <Dialog
                open={TelaRetiradaOuEntrega}
                fullWidth
                onClose={() => {setTelaRetiradaOuEntrega(false)}}
                aria-labelledby="TelaRetiradaOuEntregaModal">
                <DialogTitle id="TelaRetiradaOuEntregaModal">{"Melhor Opção"}</DialogTitle>
                <DialogContent style={{"textAlign": "center"}}>

                {( isEntregaNoEndereco === false && temEndereco)
                ? /* ========== ALERTA ESTABELECIMENTO NAO ENTREGA NESSE ENDEREÇO ============ */ 
                (<AlertFixo style={{"marginBottom": "1em"}} severity="error"> Essa loja não entrega no seu endereço <b>{enderecoAtual.logradouro}, {enderecoAtual.numero}</b> </AlertFixo>)
                : null}
                
                <Button variant="contained"  onClick={selecioneiRetiradaNoLocal} style={{"background": `#28a745`, "color":"white", "margin": "5px 10px"}} >
                    Para Retirada 
                </Button>

                <Button variant="contained" onClick={selecioneiEndereco} style={{"background": `#28a745`, "color":"white"}} >
                    {/* {enderecoAtual.taxaEntrega === -1 ? "Outro Endereço" : "Entregar No Endereço"} */}
                    Para Entrega
                </Button>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => {setTelaRetiradaOuEntrega(false)}} style={{ "margin": "5px 10px", "color": "#dc3545"}}>
                    Voltar
                </Button>  
                </DialogActions>
            </Dialog></>
            : null}
        </>
    )
}