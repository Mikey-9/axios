import Axios from './axios';

Axios.interceptors.request.use(function(config) {
  config.headers.interceptors = 'true';
  return config;
});

Axios.interceptors.response.use(function(config) {
  config.data = JSON.parse(config.data);
  config.data.a = 123;
  return config;
});

(async () => {
  let res = await Axios('/data/1.json', {
    headers: {
      a: 12,
      b: '321fho:fdsf vfds; : ',
    },
  });

  console.log(res);
})();
