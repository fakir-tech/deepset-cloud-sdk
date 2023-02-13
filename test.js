import axios from 'axios';
axios({
  url: 'https://www.fakir.tech',
  headers: {authorization: 'Bearer token'},
  params: {
      key: 'value'
  }
})
.then((data) => console.log(data))
