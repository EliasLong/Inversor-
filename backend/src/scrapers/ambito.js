export async function getMarketData() {
  try {
    const [mepResponse, riesgoResponse] = await Promise.all([
      fetch('https://mercados.ambito.com/dolar/mep/variacion'),
      fetch('https://mercados.ambito.com/riesgo/variacion')
    ]);

    if (!mepResponse.ok || !riesgoResponse.ok) {
      throw new Error('Error al consumir la API de Ámbito');
    }

    const mepData = await mepResponse.json();
    const riesgoData = await riesgoResponse.json();

    return {
      mep: {
        precio: mepData.venta || mepData.compra || mepData.valor,
        variacion: mepData.variacion
      },
      riesgoPais: {
        valor: riesgoData.valor,
        variacion: riesgoData.variacion
      }
    };
  } catch (error) {
    console.error('Error scraper Ámbito Financiero:', error);
    throw error;
  }
}
