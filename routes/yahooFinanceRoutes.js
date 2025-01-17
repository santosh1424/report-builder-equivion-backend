const express = require("express");
const yahooFinance = require("yahoo-finance2").default;
const router = express.Router();

// Suppress library notices
yahooFinance.suppressNotices(["yahooSurvey", "ripHistorical"]);

// Helper function to split yearly data into quarterly data
const getQuarterlyData = (yearlyData) => {
  if (!yearlyData || typeof yearlyData !== "number") return "Data not available";

  const quarters = ["Q1", "Q2", "Q3", "Q4"];
  const quarterlyValue = yearlyData / 4; // Divide yearly data equally into 4 quarters

  const quarterlyData = quarters.map((quarter) => ({
    quarter,
    value: quarterlyValue,
  }));

  return quarterlyData;
};

// Helper function to calculate financial ratios
const calculateRatios = (data) => {
  const ratios = {};
  if (data) {
    if (data.ebitda && data.revenue) {
      ratios.ebitdaMargin = (data.ebitda / data.revenue) * 100;
    }
    if (data.netIncome && data.revenue) {
      ratios.netProfitMargin = (data.netIncome / data.revenue) * 100;
    }
  }
  return ratios;
};

// Route to fetch financial data
router.get("/price/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;
    const period1 = req.query.startDate || "2019-01-01";
    const period2 = req.query.endDate || new Date().toISOString().split("T")[0];

    // Fetch financial summary
    const quoteSummary = await yahooFinance.quoteSummary(symbol, {
      modules: [
        "financialData",
        "summaryDetail",
        "defaultKeyStatistics",
        "incomeStatementHistory",
      ],
    });

    // Fetch historical data using chart()
    const historicalData = await yahooFinance.chart(symbol, {
      period1,
      period2,
      interval: '1wk', // Interval for weekly data
    });

    const financialData = quoteSummary?.financialData || {};
    const summaryDetail = quoteSummary?.summaryDetail || {};
    const keyStatistics = quoteSummary?.defaultKeyStatistics || {};
    const incomeStatement = quoteSummary?.incomeStatementHistory?.incomeStatementHistory || [];

    // Extract the latest year financials for monthly breakdown
    const latestYearRevenue = financialData.totalRevenue;
    const latestYearEBITDA = financialData.ebitda;
    const latestYearCash = financialData.totalCash;
    const latestYearDebt = financialData.totalDebt;

    // Extract additional required data
    const netProfit = incomeStatement[0]?.netIncome || "Data not available";
    const noOfShares = keyStatistics.sharesOutstanding || "Data not available";
    const minorityInterest = financialData.minorityInterest || "Data not available";
    const enterpriseValue = financialData.enterpriseValue || "Data not available";

    // Prepare the response
    const response = {
      sharePrices: historicalData.quotes || [], // Historical share prices
      financials: {
        revenue: latestYearRevenue,
        ebitda: latestYearEBITDA,
        cash: latestYearCash,
        debt: latestYearDebt,
        enterpriseValue: enterpriseValue,
      },
      ratios: calculateRatios({
        ebitda: financialData.ebitda,
        revenue: financialData.totalRevenue,
        netIncome: netProfit, // Use latest net income
      }),
      keyMetrics: {
        sharesOutstanding: noOfShares, // Number of shares
        marketCap: summaryDetail.marketCap || "Data not available", // Market cap
        minorityInterest: minorityInterest, // Minority interest
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching company data:", error);
    res.status(500).json({ error: "Failed to fetch company data" });
  }
});

module.exports = router;
