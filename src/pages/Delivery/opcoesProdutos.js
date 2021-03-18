import React from "react"
import {Card,  Row, Col, Container } from 'react-bootstrap';
import AlertFixo from '@material-ui/lab/Alert';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { TramRounded } from "@material-ui/icons";

export default function opcoesProdutos(props){

    const {
        classes,
        procurarProduto,
        cardapio
    } = props

    return(
        <>
            <Row style={{"textAlign":"center"}} id="campoOpcoesProdutos">
              {/* <Col xs={12} md={9} lg={9}>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="Procurar..."
                    onChange={procurarProduto}
                    style={{"display": "block"}}
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </div>
              
              </Col> */}
              <Col xs={9} md={9} lg={9} style={{"textAlign":"left"}} >
                 <span>
                  {
                      cardapio.minimoEntregaGratis && cardapio.minimoEntregaGratis < 9000
                        ? `Mínimo para entrega grátis: ${Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cardapio.minimoEntregaGratis)}`
                        : !cardapio.valorMinimoPedido
                            ? "Não possui pedido mínimo"
                            : `Pedido mínimo: ${Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cardapio.valorMinimoPedido)}`
                  } 
                 </span>

                 <InputBase
                      placeholder="Procurar..."
                      onChange={procurarProduto}
                      style={{"display": "block"}}
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
                      id="InputPesquisar"
                      className="inputSearch"
                      inputProps={{ 'aria-label': 'search' }}
                    /> 
              </Col>
              <Col xs={3} md={3} lg={3} style={{"textAlign":"right"}} 
                onClick={() => {
                  document.getElementsByClassName('inputSearch')[0].children[0].focus()
                }}>
                    {/* // onMouseOver={()=>{
                    //   console.log('onmouseover')
                    //   document.getElementsByClassName('inputSearch')[0].children[0].focus()
                    // }}
                    // onMouseLeave={ () => {
                    //   console.log('onmouseout')
                    //   setTimeout(() => {
                    //   document.getElementById('InputInvisible').focus()
                    //   }, 300);
                    // }}> */}
                  
                  <SearchIcon
                  className="SearchIconPesquisar"
                    
                  />
                    <input id="InputInvisible" ></input>
              </Col>
              
            </Row>
        </>
    )
}