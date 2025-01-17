const probe42Service = require('../services/probe42Service');

exports.getCompanyData = async (req, res) => {
  try {
    const { cin } = req.query;
    if (!cin) {
      return res.status(400).json({ error: 'CIN is required' });
    }
    const data = await probe42Service.getCompanyData({ cin });
    res.json(data);
  } catch (error) {
    console.error('Error fetching company data:', error);
    res.status(500).json({ error: error.message });
  }
}; 