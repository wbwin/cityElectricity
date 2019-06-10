const getConfig = (type) => {
  let config = {};
  switch (type) {
    case 'dev':
      config = {
        ApiUrl: 'https://vd.3weijia.com',
        imageUrl: 'https://qyoss.3weijia.com',
        shareUrl: 'https://vd.3weijia.com',
        DIY: 'https://m3d.3weijia.com/h5/index.html'
      }
      break;
    case 'test':
      config = {
        ApiUrl: 'https://vd-test.3weijia.com',
        imageUrl: 'https://swjoss.3vjia.com',
        shareUrl: 'https://vd-test.3weijia.com',
        DIY: 'https://m3d.3weijia.com/h5/index.html'
      }
      break;
    case 'pre':
      config = {
        ApiUrl: 'https://pre-vd.3vjia.com',
        imageUrl: 'https://swjoss.3vjia.com',
        shareUrl: 'https://pre-vd.3vjia.com',
        DIY: 'https://m3d.3vjia.com/index.html'
      }
      break;
    case 'pro':
      config = {
        ApiUrl: 'https://vd.3vjia.com',
        imageUrl: 'https://swjoss.3vjia.com',
        shareUrl: 'https://vd.3vjia.com',
        DIY: 'https://m3d.3vjia.com/index.html'
      }
      break;
    default:
      config = {
        ApiUrl: 'https://vd.3vjia.com',
        imageUrl: 'https://swjoss.3vjia.com',
        shareUrl: 'https://vd.3vjia.com',
        DIY: 'https://m3d.3vjia.com/index.html'
      }
      break;
  }

  config['dimensionalUrl'] = 'https://720.3vjia.com/S';
  config['appKey'] = type == 'pro' ? "1104181212107132#vshop" : "1104181212107132#honeycomb";

  return config;
}


const CONFIG = getConfig('pro');


export default {
  ApiUrl: CONFIG.ApiUrl,
  DIY: CONFIG.DIY,
  imageUrl: CONFIG.imageUrl,
  _720: CONFIG.dimensionalUrl,
  _720_1: CONFIG.shareUrl,
  appKey: CONFIG.appKey
}