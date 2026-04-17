export async function getMarketData() {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'es-AR,es;q=0.9',
      'Referer': 'https://www.ambito.com/',
      'Origin': 'https://www.ambito.com',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors'
    };

    const [mepResponse, riesgoResponse] = await Promise.all([
      fetch('https://mercados.ambito.com/dolar/mep/variacion', { headers }),
      fetch('https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais')
    ]);

    console.log('MEP status:', mepResponse.status);
    console.log('Riesgo status:', riesgoResponse.status);

    if (mepResponse.status === 403) {
      return {
        mep: { precio: 'No disponible', variacion: '-' },
        riesgoPais: { valor: 'No disponible', fecha: '-' }
      };
    }

    const mepData = await mepResponse.json();
    const riesgoData = await riesgoResponse.json();
    const ultimoRiesgo = riesgoData[riesgoData.length - 1];

    return {
      mep: {
        precio: mepData.venta || mepData.compra || mepData.valor,
        variacion: mepData.variacion
      },
      riesgoPais: {
        valor: ultimoRiesgo.valor,
        fecha: ultimoRiesgo.fecha
      }
    };
  } catch (error) {
    console.error('Error scraper Ámbito Financiero:', error);
    throw error;
  }
}
