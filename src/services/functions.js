

import api from './api';
import React from 'react';
import * as Sentry from "@sentry/react";
import TagManager from 'react-gtm-module'




export function getMoney( str ){
    var tmp = str.replace(/[\D]+/g,'')
    return parseInt(  tmp === "" ? 0 : tmp );
}

export function formatReal( int ){
    var tmp = int+'';
    tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
    if( tmp.length > 6 )
            tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");

    return tmp;
}


export function isNumeric(str){
    var er = /^[0-9]+$/;
    return (er.test(str));
}
  
export function TestaCPF(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;
    if (strCPF === "00000000000") return false;
     
    for (let i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;
   
    if ((Resto === 10) || (Resto === 11))  Resto = 0;
    if (Resto !== parseInt(strCPF.substring(9, 10)) ) return false;
   
    Soma = 0;
    for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;
   
    if ((Resto === 10) || (Resto === 11))  Resto = 0;
    if (Resto !== parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
}


export const identificarEstabelecimentoSelecionado = (aplicativoDados, id1 = -1, id2 = -1) => {
    let resp = ''
    try {
        if(id1 !== -1){//indo pra tela de status do pedido
            resp += `/${id1}`
            if(id2 !== -1){
                resp += `/${id2}`
            }
        }
        if(aplicativoDados?.estabelecimento?.length !== 1){
            let estabelecimento = localStorage.getItem('estabelecimentoAtualCF') ? JSON.parse(localStorage.getItem('estabelecimentoAtualCF')) : null
            
            if(estabelecimento?.codigo){
                if(id1 !== -1 || id2 !== -1){//indo pra tela de status
                    resp = `/${estabelecimento.codigo}${resp}`
                }else{//outras telas
                    resp += `?loja=${estabelecimento.codigo}`
                }
            }else if(estabelecimento?.id){
                if(id1 !== -1 || id2 !== -1){
                    resp = `/${estabelecimento.id}${resp}`
                }else{
                    resp += `?loja=${estabelecimento.id}`
                }
            }
        }
    } catch (error) {
        
    }
    return resp;
} 
// try {
      
//     const response = await chamada(data, aplicativoDados)

//     if(response.retornoErro){
//         //algum erro
//     }else{ 
//         //tudo certo
    
//     }
// }
// catch (error) {
//     Sentry.captureMessage(localStorage.getItem('versao')+`NotFunctions buscarCardapioOffline ${window.location.hostname} - ${error}`);
//     alertStart("Procure os desenvolvedores! Erro: "+error.message, "error")    
// }

/*
    Evitar repetição de codigo, trata a resposta do sistema adm
*/
function tratamentoResponse(response, chamada){
    if(response.data.codErro > 0) return {retornoErro: response.data.codErro, mensagem: response.data.mensagem}
    
    else if(typeof response.data == 'string' && response.data != "") return {retornoErro: 1, mensagem: chamada+' - Erro inesperado, entre em contato com os reponsáveis.'}
    
    else return response.data
}

/*
    Evitar repetição de codigo, trata o erro na chamada da requisição
*/
const ErroRequisicao = function(data, aplicativoDados = {}){
    try {
        console.log('ErroRequisicao> ', data.request, data.message)
        if(data.message == 'Network Error'){
            return 'Verifique sua conexão!'
            // return 'Sem Internet ou sistema fora do ar!'
        }else if(data.message){
            return 'Erro: ' + data.message
        }
        return false
    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`ErroRequisicao - ${aplicativoDados?.appNome} - ${error}`);
    }
}




/*
    Apenas para remover acentos de strings
*/
export function removeAcento (text)
{       
    text = text.toLowerCase();                                                         
    text = text.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
    text = text.replace(new RegExp('[Ç]','gi'), 'c');
    return text;                 
}

export const Buscardescontos = async function(idEstabelecimento, aplicativoDados){
    try {
        const response = await api.get(`integracao/buscardescontos/${idEstabelecimento}/${aplicativoDados.appNome}`, {
            headers: {"Content-Type": "application/json",}
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('Buscardescontos => ', response)

        return tratamentoResponse(response, 'Buscardescontos')
        
    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`Buscardescontos - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}




export const ObterEnderecosComTaxaEntrega = async function(data, aplicativoDados){
    try {
        const response = await api.post('cliente/ObterEnderecosComTaxaEntrega', data, {
            headers: {"Content-Type": "application/json", "app": aplicativoDados.appNome}
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('ObterEnderecosComTaxaEntrega => ', response)

        return tratamentoResponse(response, 'ObterEnderecosComTaxaEntrega')
        
    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`ObterEnderecosComTaxaEntrega - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}


/*
    1º cadastrar o pedido
*/
export const CadastrarPedido = async function(data, aplicativoDados){
    try {
        const response = await api.post('cliente/CadastrarPedido', data, {
            headers: {"Content-Type": "application/json"}
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('CadastrarPedido => ', response)

        return tratamentoResponse(response, 'CadastrarPedido')
        
    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`CadastrarPedido - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}


/*
    Cancelar pedido
*/
export const CancelarPedido = async function(data, aplicativoDados){
    try {
        const response = await api.post('cliente/CancelarPedido', data, {
            headers: {"Content-Type": "application/json"}
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('CancelarPedido => ', response)

        return tratamentoResponse(response, 'CancelarPedido')
        
    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`CancelarPedido - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}


/*
    Atualizar status
*/
export const AtualizarStatusPedido = async function(data, aplicativoDados){
    try {
        const response = await api.post('cliente/AtualizarStatusPedido', data, {
            headers: {"Content-Type": "application/json"}
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('AtualizarStatusPedido => ', response)

        return tratamentoResponse(response, 'AtualizarStatusPedido')
        
    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`AtualizarStatusPedido - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}

/*
    extrato cashback
*/
export const ExtratoCashback = async function(data, aplicativoDados){

    try {
        
        const response = await api.get('clientefiel/ExtratoCashback/'+ data, {
            headers: {"Content-Type": "application/json"}
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('ExtratoCashback => ', response)

        return tratamentoResponse(response, 'ExtratoCashback')
        
    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`ExtratoCashback - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }

}



/*
    verificar se um estabelecimento está aberto
*/
export const ObterStatusPedido = async function(data, aplicativoDados){
    try {
        const response = await api.get('cliente/ObterStatusPedido/'+ data, {
            headers: {"Content-Type": "application/json"}
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('ObterStatusPedido => ', response)

        return tratamentoResponse(response, 'ObterStatusPedido')
        
    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`ObterStatusPedido - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}



/*
    verificar se um estabelecimento está aberto
*/
export const EstabelecimentoAberto = async function(data, aplicativoDados){
    try {
        const response = await api.get('clientefiel/EstabelecimentoAberto/'+ data, {
            headers: {"Content-Type": "application/json"}
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('EstabelecimentoAberto => ', response)

        return tratamentoResponse(response, 'EstabelecimentoAberto')
        
    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`EstabelecimentoAberto - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}


/*
    buscar ultimo pedido do cliente nas ultimas x horas
*/
export const BuscarUltimoPedidoCliente = async function(data, aplicativoDados){
    try {
        const response = await api.post('cliente/BuscarUltimoPedidoCliente', data, {
            headers: {"Content-Type": "application/json"}
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('BuscarUltimoPedidoCliente => ', response)

        return tratamentoResponse(response, 'BuscarUltimoPedidoCliente')
        
    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`BuscarUltimoPedidoCliente - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}

/*
    realizar login, usuario e senha, telefone e etc...
*/
export const LoginGeral = async function(data, aplicativoDados){
    try {
        const response = await api.post('clientefiel/LoginGeral', data, {
            headers: {"Content-Type": "application/json"}
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('LoginGeral => ', response)

        return tratamentoResponse(response, 'LoginGeral')
        
    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`LoginGeral - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}

export const AtualizarDispositivoUsuario = async function(data, aplicativoDados){
    try {
        const response = await api.post('cliente/AtualizarDispositivoUsuario', data, {
            headers: {"Content-Type": "application/json"}
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('AtualizarDispositivoUsuario => ', response)

        return tratamentoResponse(response, 'LoginGeral')
        
    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`AtualizarDispositivoUsuario - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}

/*
    buscar aplicativo dados
*/
export const AplicativoDadosUrl = async function(data, appNome){
    try {
        console.log('AplicativoDadosUrl', data, appNome)
        const response = await api.get('clientefiel/AplicativoDadosUrl/'+ data, {
            headers: {"Content-Type": "application/json"}
            // headers: {"Content-Type": "application/json", "app": appNome}
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('AplicativoDadosUrl => ', response)
        
        // return tratamentoResponse(response, 'AplicativoDadosUrl')
        return response.data

    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`AplicativoDadosUrl - ${appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}



/*
    retorna todos os bairros daquele cep
*/
export const ComumCep = async function(data, aplicativoDados){
    try {
        const response = await api.get('comum/Cep/'+ data, {
            headers: {"Content-Type": "application/json", "app": aplicativoDados.appNome}
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('comum/Cep/ => ', response)
        
        return tratamentoResponse(response, 'ComumCep')

    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`ComumCep - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}



/*
    buscar cardapio para pedido de mesa
*/
export const ObterCupomDescontoCompleto = async function(data, aplicativoDados){
    try {
        const response = await api.post('cliente/ObterCupomDescontoCompleto', data, {
            headers: { "Content-Type": "application/json", "plataforma": "site" }
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('ObterCupomDescontoCompleto => ', response)
        
        return tratamentoResponse(response, 'ObterCupomDescontoCompleto')

    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`ObterCupomDescontoCompleto - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}


export const eventoTagManager = function (id, evento, valor = null){
    if(id){
        const tagManagerArgs = {
            gtmId: id,
            events: {
                event: evento,
                venda: valor,
            }
          }
          TagManager.initialize(tagManagerArgs)
    }
}

/*
    buscar cardapio para pedido de mesa
*/
export const ObterCardapioPedidoMesa = async function(data, aplicativoDados){
    try {
        const response = await api.post('clientefiel/ObterCardapioPedidoMesa', data, {
            headers: { "Content-Type": "application/json", "plataforma": "site" }
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('ObterCardapioPedidoMesa => ', response)
        
        return tratamentoResponse(response, 'ObterCardapioPedidoMesa')

    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`ObterCardapioPedidoMesa - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}

/* 
ObterCardapioCompletoV1 retorna um json com as categorias dentro diferente do ObterCardapio
*/
export const ObterCardapioCompletoV1 = async function(data, aplicativoDados){
    try {
        const response = await api.post('clientefiel/ObterCardapioCompletoV1', data, {
            headers: { "Content-Type": "application/json", "plataforma": "site" }
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('ObterCardapioCompletoV1 => ', response)
        
        return tratamentoResponse(response, 'ObterCardapioCompletoV1')

    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`ObterCardapioCompletoV1 - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}


/* 
    cadastrar cartoes de pagamento online
*/
export const CadastrarCartaoCliente = async function(data, aplicativoDados){
    try {
        const response =  await api.post('cliente/CadastrarCartaoCliente', data, {
            headers: { "Content-Type": "application/json" }
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('CadastrarCartaoCliente => ', response)
        
        return tratamentoResponse(response, 'CadastrarCartaoCliente')

    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`CadastrarCartaoCliente - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}

/* 
    retorna todos os cartoes salvos do usuario
*/
export const BuscarPedidosCliente = async function(data, aplicativoDados){
    try {
        const response =  await api.post('cliente/BuscarPedidosCliente', data, {
            headers: { "Content-Type": "application/json" }
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('BuscarPedidosCliente => ', response)
        
        return tratamentoResponse(response, 'BuscarPedidosCliente')

    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`BuscarPedidosCliente - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}



/* 
    retorna todos os cartoes salvos do usuario
*/
export const ObterCartoesCredito = async function(data, aplicativoDados){
    try {
        const response =  await api.post('cliente/ObterCartoesCredito', data, {
            headers: { "Content-Type": "application/json" }
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('ObterCartoesCredito => ', response)
        
        return tratamentoResponse(response, 'ObterCartoesCredito')

    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`ObterCartoesCredito - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}



/* 
ObterCardapio retorna um array de categorias diferente do ObterCardapioCompletoV1
*/
export const ObterCardapio = async function(data, aplicativoDados){
    console.log('ObterCardapio antes', data)
    try {
        const response =  await api.post('clientefiel/ObterCardapio', data, {
            headers: { "Content-Type": "application/json", "plataforma": "site" }
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('ObterCardapio => ', response)
        
        return tratamentoResponse(response, 'ObterCardapio')

    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`ObterCardapio - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}



/*
    cadastrar endereço em um cliente
*/
export const CadastrarEnderecoCliente = async function(data, aplicativoDados){
    try {
        const response =  await api.post('cliente/CadastrarEnderecoCliente', data, {
            headers: { "Content-Type": "application/json" }
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('CadastrarEnderecoCliente => ', response)
        
        return tratamentoResponse(response, 'CadastrarEnderecoCliente')

    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`CadastrarEnderecoCliente - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}



/*
    buscar estabelecimentos que entregam naquele endereço
*/
export const Post_ListarEstabelecimentosPorEndereco = async function(data, aplicativoDados){
    try {
        const response =  await api.post('clientefiel/ListarEstabelecimentosPorEndereco', data, {
            headers: { "Content-Type": "application/json" }
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('ListarEstabelecimentosPorEndereco => ', response)
        
        return tratamentoResponse(response, 'ListarEstabelecimentosPorEndereco')

    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`ListarEstabelecimentosPorEndereco - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}


/*
    CadastrarUsuario
*/
export const CadastrarUsuario = async function(data, aplicativoDados){
    try {
        const response =  await api.post('cliente/CadastrarUsuario', data, {
            headers: { "Content-Type": "application/json" }
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('CadastrarUsuario => ', response)
        
        return tratamentoResponse(response, 'CadastrarUsuario')

    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`CadastrarUsuario - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}


/*
    RegistrarSeloSeguro2
*/
export const RegistrarSeloSeguro2 = async function(data, aplicativoDados){
    try { 
        const response =  await api.post('clientefiel/RegistrarSeloSeguro2', data, {
            headers: { "Content-Type": "application/json" }
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('RegistrarSeloSeguro2 => ', response)
        
        return tratamentoResponse(response, 'RegistrarSeloSeguro2')

    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`RegistrarSeloSeguro2 - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}



/*
    RegistrarSeloSeguro2
*/
export const ResgatarCashBack = async function(data, aplicativoDados){
    try {
        const response =  await api.post('clientefiel/ResgatarCashBack', data, {
            headers: { "Content-Type": "application/json" }
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('ResgatarCashBack => ', response)
        
        return tratamentoResponse(response, 'ResgatarCashBack')

    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`ResgatarCashBack - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}




/*
    AvaliarPedido
*/
export const AvaliarPedido = async function(data, aplicativoDados){
    try {
        const response =  await api.post('avaliacao/AvaliarPedido', data, {
            headers: { "Content-Type": "application/json" }
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('AvaliarPedido => ', response)
        
        return tratamentoResponse(response, 'AvaliarPedido')

    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`AvaliarPedido - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}




/*
    Redefinir senha
*/
export const RedefinirSenha = async function(data, aplicativoDados){
    try {
        const response =  await api.post('cliente/RedefinirSenha' , data , {
            headers: {"Content-Type": "application/json"}
        }).catch(function(error){
            const resp = ErroRequisicao(error)
            return {data:{codErro: 1, mensagem: resp}}
        });

        console.log('RedefinirSenha => ', response)
        
        return tratamentoResponse(response, 'RedefinirSenha')

    } catch (error) {
        Sentry.captureMessage(localStorage.getItem('versao')+`RedefinirSenha - ${aplicativoDados?.appNome} - ${error}`);
        return {retornoErro:1, mensagem:error.message}
    }
}