export async function getMerval() {
  try {
    const headers = {
      'Authorization': `BEARER ${process.env.BCRA_TOKEN}`,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Cache-Control': 'no-cache'
    };

    const res = await fetch('https://api.estadisticasbcra.com/merval', { headers });
    console.log('BCRA Merval status:', res.status);

    if (!res.ok) {
      console.error('BCRA Merval respondió con status:', res.status);
      return {
        valor: 'No disponible',
        variacion: '-',
        fecha: new Date().toISOString().split('T')[0]
      };
    }

    const data = await res.json();
    const ultimo = data[data.length - 1];
    const anterior = data[data.length - 2];
    const variacion = ((ultimo.v - anterior.v) / anterior.v * 100).toFixed(2) + '%';

    return {
      valor: ultimo.v,
      fecha: ultimo.d,
      variacion: variacion
    };
  } catch (error) {
    console.error('Error scraper BCRA Merval:', error);
    throw error;
  }
}
