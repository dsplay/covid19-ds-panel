/* eslint-disable  import/prefer-default-export */
import axios from 'axios';

export async function detectUserLocation() {
  try {
    const response = await axios.get('https://manager.dsplay.tv/service/getMyIpInfo');
    return response.data.geoplugin_countryName;
  } catch (error) {
    return 'Global';
  }
}
