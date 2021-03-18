import React, {useEffect, useState} from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function PopupDoacao(props) {

    const {
        aplicativoDados,
    } = props;

    const [abrirPopUp, setAbrirPopUp] = React.useState(false);
    // const [abrirPopUp, setAbrirPopUp] = React.useState(aplicativoDados.urlRibon ? true : false);


    const quandoFechar = () => {
        setAbrirPopUp(false);
    };

    const search = window.location.search;
    const params = new URLSearchParams(search); 

    useEffect(() => {
        if(aplicativoDados.urlRibon && window.getCookie('popup') == "" && params.get('pedidoEnviado')){
            setAbrirPopUp(true)
            window.setCookie('popup', 'true', 1 );
        }        
    })

    return (
        <div>
        <Dialog
            open={abrirPopUp}
            onClose={quandoFechar}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            {"Doe de graça para caridade!"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
            Fazendo um pedido com a gente, você acabou de ganhar créditos para doar para um causa gratuitamente!
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button 
                onClick={quandoFechar} color="secondary">
                Desta vez não
            </Button>
            <Button 
            variant="contained"
            style={{"background": "#28a745", "color":"white"}}
            onClick={() => {
                    window.open(
                        aplicativoDados.urlRibon,
                        '_blank'
                    );
                    setAbrirPopUp(false);
                }} 
                color="primary" autoFocus>
                Escolher causa
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}
