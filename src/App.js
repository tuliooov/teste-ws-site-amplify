import React, {useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Routes from './routes';
import firebase from 'firebase'
import { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function App() {     
    const [open, setOpen] = React.useState(window.getCookie('lgpd-clientefiel') == "" ? true : false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

  useEffect(() => {

    
    // if( (window.location.hostname).includes("pablodelivery") ){
        var myRequest = new Request(`https://ws.appclientefiel.com.br/rest/clientefiel/FirebaseWeb/${window.location.hostname}`);
        // var myRequest = new Request(`https://ws.appclientefiel.com.br/rest/clientefiel/FirebaseWeb/pablodelivery.clientefiel.app`);
        fetch(myRequest).then(function(response) {
            return response.text().then(function(data) {
                if(data !== ""){

                    firebase.initializeApp(JSON.parse(data));
                    const messaging=firebase.messaging();
                    
                    function IntitalizeFireBaseMessaging() {
                        messaging
                            .requestPermission()
                            .then(function () {
                                console.log("Notification Permission");
                                return messaging.getToken();
                            })
                            .then(function (token) {
                                console.log("Token : "+token);
                                localStorage.setItem('tokenNotificationFirebase', token)
                            })
                            .catch(function (reason) {
                                console.log(reason);
                            });
                    }
                    
                    messaging.onMessage(function (payload) {
                        console.log('onMessage', payload);
                        const notificationOption={
                            body:payload.notification.body,
                            icon:payload.notification.icon
                        };
                        
                        window.registration.showNotification(payload.notification.title,notificationOption);

                        window.registration.onclick=function (ev) {
                            ev.preventDefault();
                            window.open(payload.notification.click_action,'_blank');
                            window.registration.close();
                        }

                        // window.registration.update();
                        
                    });

                    // messaging.onMessage(function (payload) {
                    //     console.log(payload);
                        
                    //     const notificationOption={
                    //         body:payload.notification.body,
                    //         icon:payload.notification.icon
                    //     };
                    
                    //     if(Notification.permission==="granted"){
                    //         var notification=new Notification(payload.notification.title,notificationOption);
                    
                    //         notification.onclick=function (ev) {
                    //             ev.preventDefault();
                    //             window.open(payload.notification.click_action,'_blank');
                    //             notification.close();
                    //         }
                    //     }
                    
                    // });
                    messaging.onTokenRefresh(function () {
                        messaging.getToken()
                            .then(function (newtoken) {
                                console.log("New Token : "+ newtoken);
                                localStorage.setItem('tokenNotificationFirebase', newtoken)

                            })
                            .catch(function (reason) {
                                console.log(reason);
                            })
                    })
                    IntitalizeFireBaseMessaging();
                    
                }

            });
        }).catch(console.error);
    // }

  },[])

  function aceitarLGPD(){
    window.setCookie('lgpd-clientefiel', 'aceitou', 365);
    setOpen(false)
  }
  
  return (
    <>
        <Routes />
        <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Ao usar nosso site, você reconhece que leu e entendeu nossa <a href="https://appclientefiel.com.br/politicaprivacidade.html"> Política de Privacidade e nossos Termos de Serviço</a>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={ () => {
            aceitarLGPD()
          }} color="primary" autoFocus fullWidth>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default App;
