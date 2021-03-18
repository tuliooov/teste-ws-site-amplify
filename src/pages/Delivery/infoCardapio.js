import React, {useState} from "react"
import {Card,  Row, Col, Container } from 'react-bootstrap';
import AlertFixo from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import GanheDescontos from './ganheDescontos'


import {
  identificarEstabelecimentoSelecionado
} from '../../services/functions';

export default function InfoCardapio(props){

    const [openGanheDescontos, setOpenGanheDescontos] = useState(false);

    const {
        isEntregaNoEndereco,
        isRetiradaNoLocal,
        estabelecimentoAtual,
        enderecoAtual,
        opcoesParaEntregaeRetirada,
        temEndereco,
        cardapio,
        setRodarFuncaoAposIsso,
        aplicativoDados,
        history,
        usuario,
        visualizacao,
        usuarioPedidoMesa,
        isUsuarioPedidoMesa  = usuarioPedidoMesa?.logado,
    } = props

    const taxa = enderecoAtual.taxaEntrega == null || enderecoAtual.taxaEntrega == undefined ? estabelecimentoAtual.taxaEntrega : enderecoAtual.taxaEntrega

    const temDesconto = cardapio.valorDesconto || cardapio.percentualDesconto || (cardapio?.cupomDesconto?.freteGratis)
    return(
        <>

            <Row className="infoCardapio">
                <Col xs={12} md={12} lg={12} className="colLogoEstabelecimento" >
                    <img src={estabelecimentoAtual.urlLogo} className="logoEstabelecimento">
                      
                    </img>
                </Col>
                <Col xs={12} md={12} lg={12} style={{"height": "35px"}}>
                    
                </Col>
                <Col xs={12} md={12} lg={12} className="colInfosMenu">
                    {estabelecimentoAtual.categoria} • {
                          estabelecimentoAtual.tempoEntregaTexto 
                            ? estabelecimentoAtual.tempoEntregaTexto
                            : ' 70-80 min'
                        }
                </Col>
              {
                !(visualizacao || aplicativoDados.clienteFielStart)
                  ? <Col xs={12} md={12} lg={12} className="colInfosMenu colInfoEntrega">
                      {
                        !usuarioPedidoMesa?.logado
                        ? temEndereco
                            ?  (isEntregaNoEndereco && taxa >= 0)
                              ?
                                  <Button variant="outlined" className="caixaInfo" onClick={() =>{ opcoesParaEntregaeRetirada() }}>
                                    Entrega: { taxa === 0 ? 'Grátis' :  Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(taxa)}
                                  </Button>
                              : 
                                  <Button variant="outlined" className="caixaInfo" onClick={() =>{ opcoesParaEntregaeRetirada() }}>
                                    NÃO ENTREGA
                                  </Button>
                            : usuario.logado
                              ? isRetiradaNoLocal
                                ? <Button variant="outlined" className="caixaInfo" onClick={() =>{ 
                                    setRodarFuncaoAposIsso("")  
                                    opcoesParaEntregaeRetirada() 
                                  }}>
                                    Retirada No Local
                                  </Button>
                                : <Button variant="outlined" className="caixaInfo" onClick={ () => {
                                    history.push(`/delivery/enderecos`)
                                  }}>
                                    Adicione endereço
                                  </Button>
                              :  <Button variant="outlined" className="caixaInfo" onClick={ () => {
                                history.push(`/login`)
                              }}>
                                  Faça Login
                                </Button>
                        : null
                    }

                    {
                      temDesconto
                        ?
                            <Button variant="outlined" className="caixaInfo"
                              onClick={ () => {
                                setOpenGanheDescontos(true);
                            }}>
                                {
                                  cardapio.valorDesconto
                                    ? `Desconto: ${Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cardapio.valorDesconto)}`
                                    :  cardapio.percentualDesconto
                                      ? `Desconto: ${cardapio.percentualDesconto}%`
                                      : `Frete Grátis`
                                }
                              </Button>
                        :  !isUsuarioPedidoMesa
                          ?  <Button variant="outlined" className="caixaInfo" onClick={ () => {
                            setOpenGanheDescontos(true);
                          }}>
                              GANHE DESCONTOS
                            </Button>
                          : null

                    }

                    

                </Col>
                : null
              }
            </Row>

            {
              openGanheDescontos && <GanheDescontos 
              setOpenGanheDescontos={setOpenGanheDescontos}
              openGanheDescontos={openGanheDescontos}
              usuario={usuario}
              temDesconto={temDesconto}
              cardapio={cardapio}
              aplicativoDados={aplicativoDados}
              estabelecimentoAtual={estabelecimentoAtual}
            /> }

        </>
    
    )
    
}