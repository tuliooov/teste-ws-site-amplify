import axios from 'axios';
const url = localStorage.getItem('teste') ? localStorage.getItem('teste') : 'https://ws.appclientefiel.com.br/rest/'

const api = axios.create({
      baseURL: url,
      // baseURL: 'https://4c9efd5d9ee9.ngrok.io/clientefiel/rest/'
      // baseURL: 'https://51b358f21f01.ngrok.io/clientefiel/rest/',
      // baseURL:  'https://preproducao-adm.us-east-1.elasticbeanstalk.com/rest/',
      // baseURL: 'http://localhost:8080/clientefiel/rest/',
  })

export default api;
