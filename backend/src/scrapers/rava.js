export async function getMerval() {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json'
    };

    const res = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5EMERV', { headers });
    console.log('Yahoo Merval status:', res.status);

    if (!res.ok) {
      console.error('Yahoo Merval respondió con status:', res.status);
      return {
        valor: 'No disponible',
        variacion: '-',
        fecha: new Date().toISOString().split('T')[0]
      };
    }

    const data = await res.json();
    const meta = data.chart.result[0].meta;
    const price = meta.regularMarketPrice;
    const previousClose = meta.chartPreviousClose;
    const variacion = ((price - previousClose) / previousClose * 100).toFixed(2) + '%';
    const fecha = new Date(meta.regularMarketTime * 1000).toISOString().split('T')[0];

    return {
      valor: price,
      variacion: variacion,
      fecha: fecha
    };
  } catch (error) {
    console.error('Error scraper Yahoo Merval:', error);
    throw error;
  }
}
