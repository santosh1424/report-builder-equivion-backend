const axios = require('axios');

class Probe42Service {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.PROBE42_BASE_URL || 'https://api.probe42.in',
      headers: {
        // 'Authorization': `Bearer ${process.env.PROBE42_API_KEY}`,
        'x-api-version': '1.3',
        'x-api-key': process.env.PROBE42_X_API_KEY,
        'Accept': 'application/json'
      }
    });
  }

  async getCompanyData(query) {
    try {
      const endpoint = `/probe_pro_sandbox/companies/${query.cin}/comprehensive-details`;
      console.log('Requesting Probe42 API:', endpoint);

      const response = await this.api.get(endpoint);
      
      console.log('Probe42 API Response Status:', response.status);
      
      return response.data;
    } catch (error) {
      console.error('Probe42 API Error Details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });

      if (error.response) {
        throw new Error(`Probe42 API Error (${error.response.status}): ${error.response.data.message || error.response.statusText}`);
      }
      throw new Error(`Probe42 API Error: ${error.message}`);
    }
  }
}

module.exports = new Probe42Service(); 