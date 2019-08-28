const getConfig = (type) => {
  let config = {};
  switch (type) {
    case 'dev':
      config = {
        ApiUrl: 'https://www.tongchengwg.com', 
      }
      break;
    case 'pro':
      config = {
        ApiUrl: 'https://www.tongchengwg.com',
      }
      break;
  }
  return config;
}


const CONFIG = getConfig('dev');


export default {
  ApiUrl: CONFIG.ApiUrl
}