import React, { useState, useEffect } from 'react';

import * as Sentry from "@sentry/react"; 
import enderecosVazios from '../assets/endereco-flat.svg';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import Divider from '@material-ui/core/Divider';
import {fade, makeStyles, useTheme } from '@material-ui/core/styles';

import {identificarEstabelecimentoSelecionado, Post_ListarEstabelecimentosPorEndereco, CadastrarEnderecoCliente, ObterCardapio, ObterCardapioCompletoV1, ComumCep } from '../services/functions';


import BackspaceIcon from '@material-ui/icons/Backspace';
import { Row, Col } from 'react-bootstrap';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';


import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import FormControlLabel from '@material-ui/core/FormControlLabel';


import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

import useMediaQuery from '@material-ui/core/useMediaQuery';

export default function CadastroEndereco(props) {

    
    const {
        telaDeEstabelecimentos = false,
        telaDeCardapio = false,
        setLoading,
        calcularValorTotal,
        estabelecimentoAtual,
        alertStart,
        aplicativoDados,
        enderecoAtual,
        retirarNoLocal,
        usuarioLogado,
        setInformacoesPedido,
        setVerTodasAsLojas,
        filtroTipoRetirada,
        setEnderecoAtual,
        listarEstabelecimentosPorEndereco,
        abrirAdicionarEndereco,
        setAbrirAdicionarEndereco,
        popUpCep,
        setPopUpCep,
        buscarCardapio,
        estabelecimentoDesejado,
        continuarSemCadastro=false,
        setInformacoesDoTipoEntrega,
        setPagamentoOpen,
    } = props

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));


    const [cep, setCep] = React.useState('');
    const [uf, setUf] = React.useState('');
    const [cidade, setCidade] = React.useState('');
    const [bairro, setBairro] = React.useState('');
    const [rua, setRua] = React.useState('');
    const [numero, setNumero] = React.useState('');
    const [complemento, setComplemento] = React.useState('');
    const [referencia, setReferencia] = React.useState('');
    const [bairrosCepUnico, setBairrosCepUnico] = React.useState([]);
    const [bairroCepUnicoSelecionado, setBairroCepUnicoSelecionado] = React.useState('');

    const limparEnderecos = () =>{
        setCep('')
        setUf('')
        setCidade('')
        setBairro('')
        setRua('')
        setNumero('')
        setComplemento('')
        setReferencia('')
        setBairrosCepUnico('')
        setBairroCepUnicoSelecionado('')
    }

    const verificarDadosCadastroEndereco = () => {
        if(bairrosCepUnico.length && !bairro){
            alertStart("Necessario a escolha do bairro!", "warning")     
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
        }else if(!complemento){
            alertStart("Necessario o preenchimento do complemento!", "warning")     
            document.getElementById("cadastroComplemento").focus()
            return false
        }
    }

    const criarEndereco = () => {
        const data = {
            //"idCliente": usuarioLogado.cliente.id,
            //"idEstabelecimento": estabelecimentoAtual.id,
            "cep": cep,
            "uf": uf,
            "cidade": cidade,
            "bairro": bairro,
            "logradouro": rua,
            "numero": numero,
            "complemento": complemento,
            "referencia": referencia,
            "appNome": aplicativoDados.appNome,
            "latitude": 0,
            "longitude": 0,
            "token": `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`,
        } 

        if(aplicativoDados.tipoEntregaBairro == 1){
            localStorage.removeItem('bairroEspecifico')
            data.bairroEspecifico = 1
        }else{
            data.bairroEspecifico = 0
        }

        return data
    }

    const cadastroEnderecoCardapio = async () => {
        let deuCerto = false
        try {
            
            if(continuarSemCadastro && !retirarNoLocal){
                if(verificarDadosCadastroEndereco() === false) return false
                setLoading(true)
                const data = criarEndereco()

                data.token = `${process.env.REACT_APP_CLIENTEFIEL_TOKEN}`  
                data.appNome = aplicativoDados.appNome


                const retorno = await Post_ListarEstabelecimentosPorEndereco(data, aplicativoDados)
            
                if(retorno.retornoErro){
                alertStart(retorno.mensagem, "error") 
                setLoading(false)
                }else{
                    console.log('Post_ListarEstabelecimentosPorEndereco', retorno)
                    const estabelecimentosQueEntregam = retorno.filter(estabelecimento => estabelecimento.taxaEntrega != -1)
                    const estabelecimentoAtualComTaxa = estabelecimentosQueEntregam.filter(estabelecimento => estabelecimento.id === estabelecimentoAtual.id)

                    if(estabelecimentoAtualComTaxa.length){
                        data.taxaEntrega = estabelecimentoAtualComTaxa[0].taxaEntrega
                        // alertStart(`${Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estabelecimentoAtualComTaxa[0].taxaEntrega)} é a taxa de entrega para o endereço cadastrado.`, "success") 
                        deuCerto = true
                    }else{
                        data.taxaEntrega = -1
                        if(estabelecimentosQueEntregam.length){
                            alertStart(`Este estabelecimento não entrega no endereço cadastrado. Porém, outro estabelecimento entrega em seu endereço!`, "error") 
                        }else{
                            alertStart(`Este estabelecimento não entrega no endereço cadastrado.`, "error") 
                        }
                        setInformacoesDoTipoEntrega(false)
                        setPagamentoOpen(false)
                    }
                }

                
                localStorage.setItem("enderecoAtualCF", JSON.stringify(data))
                setEnderecoAtual(data)
                calcularValorTotal()

            }
            

            
            setAbrirAdicionarEndereco(false)
            if(deuCerto === true){
                setInformacoesPedido(true)
            }

        } catch (error) {
            Sentry.captureMessage(localStorage.getItem('versao')+localStorage.getItem('versao')+`cadastroEnderecoCardapio - ${aplicativoDados.appNome} - ${error}`);
            alertStart("Procure os desenvolvedores "+error.message, "error")    
            setLoading(false)
            setAbrirAdicionarEndereco(false)
        }

        setLoading(false)

        limparEnderecos()

    }
    const buscarLojasQueEntregam = async () =>{
        
        if(verificarDadosCadastroEndereco() === false) return false

        setVerTodasAsLojas(false)
        setAbrirAdicionarEndereco(false)
        setLoading(true)
        
        try {
            
            const data = criarEndereco()

            if(usuarioLogado?.logado){
                await cadastrarEnderecoNoUsuario(data)
            }else{
                localStorage.setItem("enderecoAtualCF", JSON.stringify(data))
                //console.log("data", data)
                listarEstabelecimentosPorEndereco(data)
            }

        
        
        } catch (error) {
            Sentry.captureMessage(localStorage.getItem('versao')+localStorage.getItem('versao')+`ListarEstabelecimentosPorEndereco - ${aplicativoDados.appNome} - ${error}`);
            alertStart("Procure os desenvolvedores "+error.message, "error")    
            setLoading(false)
            setAbrirAdicionarEndereco(false)
        }

        limparEnderecos()

    }

    const cadastrarEnderecoNoUsuario = async (data) => {
        try {
  
          data.idCliente = usuarioLogado.cliente.id
  
          
          if(aplicativoDados.tipoEntregaBairro == 1){
            data.bairroEspecifico = 1
          }else{
            data.bairroEspecifico = 0
          }
  
          const retorno = await CadastrarEnderecoCliente(data, aplicativoDados)
        
          console.log("CadastrarEnderecoCliente", retorno)
          if(retorno.retornoErro){
            alertStart(retorno.mensagem, "error")
            listarEstabelecimentosPorEndereco(data)
            setLoading(false)
          }else{
            usuarioLogado.cliente.enderecos.push(retorno)
            localStorage.setItem('usuarioCF', JSON.stringify(usuarioLogado))
            localStorage.setItem("enderecoAtualCF", JSON.stringify(retorno))
            setEnderecoAtual(retorno)
            listarEstabelecimentosPorEndereco(retorno)//data com id
          }
  
        } catch (error) {
          Sentry.captureMessage(localStorage.getItem('versao')+localStorage.getItem('versao')+`NotFunctions cadastrarEnderecoNoUsuario - ${aplicativoDados.appNome} - ${error}`);
          alertStart("Procure os desenvolvedores!. Erro: "+error.message, "error")    
        }
    }
    

    const verificarCep = async (e) =>{
        try {
          let valorInput = e.target.value
          valorInput = valorInput.replace(/-/g, '')
          valorInput = valorInput.replace(/ /g, '')
          valorInput = valorInput.replace(/\//g, '')
          // valorInput = valorInput.substring(0,8)
          console.log("valorInput", valorInput)
          if(valorInput.length == 8 ){
            setCep(valorInput)
            setLoading(true)
            //buscar dados do cep
            const retornoCep = await ComumCep(valorInput, aplicativoDados)
            
            console.log("retornoCep", retornoCep)
            if(retornoCep.retornoErro){
              alertStart(retornoCep.mensagem, "error")
            }else{
              if(retornoCep.id || retornoCep.logradouro){
                setBairrosCepUnico('')
                setBairro(retornoCep.bairro)
                setCidade(retornoCep.localidade)
                setRua(retornoCep.logradouro)
                setUf(retornoCep.uf)
                setPopUpCep(false)
                setAbrirAdicionarEndereco(true)
              }else if(retornoCep.bairros.length >= 1){     
                setBairrosCepUnico(retornoCep.bairros)
                setPopUpCep(false)
                setAbrirAdicionarEndereco(true)
              }else{
                //DEU ERRO, OU NAO EXISTE
                alertStart("CEP não encontrado", "error")   
                // setAbrirAdicionarEndereco(false)
                limparEnderecos()
    
                if(popUpCep){
                  document.getElementById("cepDigitando2").value = ''
                  document.getElementById("cepDigitando2").focus()
                }else{
                  document.getElementById("cepDigitando").value = ''
                  document.getElementById("cepDigitando").focus()
                }
                
              }
            }
    
            setLoading(false)
          } 
        } catch (error) {
          Sentry.captureMessage(localStorage.getItem('versao')+localStorage.getItem('versao')+`NotFunctions verificarCep - ${aplicativoDados.appNome} - ${error}`);
          alertStart("Procure os desenvolvedores! Erro: "+error.message, "error")    
        }
      }

      const selecionarRetirada = () => {
        if(telaDeEstabelecimentos){
            filtroTipoRetirada(false)
            setAbrirAdicionarEndereco(false)
        }else if(telaDeCardapio){
            if(retirarNoLocal === true){
                setEnderecoAtual({})
                localStorage.setItem('enderecoAtualCF', '{}')
            }else{
                setEnderecoAtual({
                    id: "retirada"
                })
                localStorage.setItem('enderecoAtualCF', JSON.stringify({id:"retirada"}))
                setAbrirAdicionarEndereco(false)
                setInformacoesPedido(true)
                calcularValorTotal()
            }
        }
      }

    return (
        <>
            {
                telaDeEstabelecimentos &&
                <Row style={(enderecoAtual?.logradouro || retirarNoLocal) ? {"display":"none"}:null}>
                    <Col xs={12} md={12} lg={12} >
                        <Typography gutterBottom variant="h6" >
                        Digite seu CEP para entrega
                        </Typography>
                    </Col>


                    <Col xs={12} md={12} lg={12} style={{"marginTop": "1em"}}>
                        <TextField
                            disabled={retirarNoLocal}                  
                            style={{"width":"300px", "maxWidth":"100%", "background":"white"}}
                            name="CEP"
                            //value={cep}
                            id="cepDigitando"
                            label="CEP"
                            onChange={verificarCep}
                            variant="outlined"
                        />
                    </Col>
                    <Col xs={12} md={12} lg={12}>
                        <FormControlLabel
                            style={{"margin": "0 0 0 0"}}
                            checked={retirarNoLocal}
                            control={
                            <Checkbox
                                id="botaoRetirada"
                                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                name="retirarNoLocal"
                                onClick={() => filtroTipoRetirada(false)}
                            />
                            }
                            label="Retirar no Local"
                        />

                    </Col>

                    <Divider style={{"width": "100%", "margin": "0 0 1em 0"}}/>

                </Row>
            }

            <Dialog
                // fullScreen={fullScreen}
                fullScreen={true}
                open={abrirAdicionarEndereco}
                aria-labelledby="codigoIndicacao">
                <DialogTitle id="codigoIndicacao">{"Adicionar Endereço"}</DialogTitle>


                <DialogContent>
                <Row>     
                {
                    popUpCep
                    ? <React.Fragment>
                        <Col xs={12} md={12} lg={12} style={{"marginTop": "1em"}}>
                        <TextField
                            // disabled={retirarNoLocal}                  
                            fullWidth
                            onFocus={() => {
                                if(retirarNoLocal === true){
                                    selecionarRetirada()
                                }
                            }}
                            name="CEP"
                            //value={cep}
                            id="cepDigitando2"
                            label="CEP"
                            onChange={verificarCep}
                            variant="outlined"
                        />
                        </Col>
                        <Col xs={12} md={12} lg={12}>
                        <FormControlLabel
                            style={{"margin": "0 0 0 0"}}
                            checked={retirarNoLocal}
                            control={
                            <Checkbox
                                id="botaoRetirada2"
                                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                name="retirarNoLocal2"
                                onClick={selecionarRetirada}
                            />
                            }
                            label="Retirar no Local"
                        />
                    
                        </Col>

                        <div className="divImageCentroCardapio" >
                            <img alt={"sem endereços cadastrados"} src={enderecosVazios} className="pretoEBranco" />
                        </div>
                        
                    </React.Fragment>
                    : <React.Fragment>
                        {bairrosCepUnico 
                        ? <Col xs={12} md={12} lg={12}>
                            <FormControl variant="outlined" style={{"width": "100%", "margin": "0.5em 0"}}>
                            <InputLabel id="demo-simple-select-outlined-label">Bairros do Cep</InputLabel>
                                <Select
                                labelId="demo-simple-select-outlined-label"
                                fullWidth
                                id="cadastroBairro"
                                value={bairroCepUnicoSelecionado}
                                onChange={(e) => {
                                    //console.log(e.target.value)
                                    setBairroCepUnicoSelecionado(e.target.value)
                                    setUf(bairrosCepUnico[e.target.value].cidade.estado.sigla)
                                    setCidade(bairrosCepUnico[e.target.value].cidade.nome)
                                    setBairro(bairrosCepUnico[e.target.value].nome)
                                }}
                                label="Bairros do Cep"
                                >

                                {bairrosCepUnico.map((bairro, index) => (
                                <MenuItem key={bairro.id} value={index}>{bairro.nome}</MenuItem>
                                ))}
                            </Select>
                            </FormControl>
                        </Col>
                        : <Col xs={12} md={6} lg={6} style={{"margin": "0.5em 0"}}>
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
                        </Col>}       
                    <Col xs={12} md={6} lg={6} style={{"margin": "0.5em 0"}}>
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
                    <Col xs={12} md={6} lg={6} style={{"margin": "0.5em 0"}}>                                           
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
                    <Col xs={12} md={6} lg={6} style={{"margin": "0.5em 0"}}>
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
                    <Col xs={12} md={6} lg={6} style={{"margin": "0.5em 0"}}>
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
                    <Col xs={12} md={6} lg={6} style={{"margin": "0.5em 0"}}>
                        <TextField
                        required
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
                    <Col xs={12} md={6} lg={6} style={{"margin": "0.5em 0"}}>
                        <TextField
                        required
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
                    </Col>
                    </React.Fragment>
                }
                    
                    
                </Row>
                </DialogContent>

                <DialogActions>
                
                <Button style={{"color": "#dc3545"}} onClick={(e) => {
                    limparEnderecos()
                    setAbrirAdicionarEndereco(false)
                    if(popUpCep){
                        setTimeout(() => {
                        setPopUpCep(false)
                        }, 500);
                    }
                    
                    }} >
                    Cancelar
                </Button>
                

                {
                    telaDeEstabelecimentos 
                    ? (
                        !popUpCep
                            ? <Button onClick={() => {
                                buscarLojasQueEntregam()
                                }} style={{"color": "#fff", "backgroundColor": "#28a745"}}>
                                Pronto
                            </Button>
                            : <Button onClick={() => {
                                if(telaDeEstabelecimentos){
                                    buscarCardapio(estabelecimentoDesejado)
                                }else{
                                    
                                }
                                }} style={{"color": "#fff", "backgroundColor": "#28a745"}}>
                                Cardápio
                            </Button>
                        )
                    : ((telaDeCardapio && cep.length >=8) && <Button onClick={() => {
                                cadastroEnderecoCardapio()
                            }} style={{"color": "#fff", "backgroundColor": "#28a745"}}>
                            Pronto
                        </Button>)
                            
                        
                }
                
                
                </DialogActions>
            </Dialog>
        </>
    )
}
