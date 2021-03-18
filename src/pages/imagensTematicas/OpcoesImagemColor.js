import React from 'react'

export default function OpcoesImagemColor(props){
    
    const aplicativoDados = JSON.parse(localStorage.getItem("aplicativoCF"))  

    const {
        criarFeed,
        criarStories,
    } = props
    return (
        <input type="color" style={{width: '100%'}} defaultValue={aplicativoDados.corSitePrimaria} onChange={() => {
            criarFeed()
            criarStories()
        }} id="colorBackground"/>
    )
}