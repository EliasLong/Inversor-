import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [healthData, setHealthData] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);

  useEffect(() => {
    // Usamos la URL base proveniente de variables de entorno, o apuntamos directo a Railway como fallback
    const API_URL = import.meta.env.VITE_API_URL || 'https://inversor-production.up.railway.app';
    
    fetch(`${API_URL}/api/health`)
      .then(res => res.json())
      .then(data => {
        setHealthData(data);
        setLoadingHealth(false);
      })
      .catch(error => {
        console.error('Error al conectar con la API:', error);
        setHealthData({ error: 'No se pudo conectar al servidor' });
        setLoadingHealth(false);
      });
  }, []);

  const styles = {
    container: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px',
      color: '#333'
    },
    title: {
      borderBottom: '2px solid #eaeaea',
      paddingBottom: '10px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
      marginTop: '20px',
      marginBottom: '30px'
    },
    card: {
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
    },
    metricTitle: {
      margin: '0 0 10px 0',
      fontSize: '16px',
      color: '#666'
    },
    metricValue: {
      margin: '0',
      fontSize: '24px',
      fontWeight: 'bold'
    },
    signalsContainer: {
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: '#fff'
    },
    signalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #eee'
    },
    ticker: {
      fontWeight: 'bold',
      fontSize: '18px'
    },
    signalStats: {
      display: 'flex',
      gap: '15px',
      fontSize: '14px'
    },
    buy: { color: '#2ecc71', fontWeight: 'bold' },
    hold: { color: '#f1c40f', fontWeight: 'bold' },
    sell: { color: '#e74c3c', fontWeight: 'bold' },
    apiStatus: {
      marginTop: '30px',
      padding: '15px',
      backgroundColor: '#2c3e50',
      color: 'white',
      borderRadius: '8px',
      fontSize: '14px'
    }
  };

  // Mock de datos solicitados
  const mockMetrics = {
    merval: '1.250.000 pts',
    dolarMep: '$1.015,50',
    riesgoPais: '1.200 pb',
    senalGeneral: 'COMPRAR'
  };

  const mockTopSignals = [
    { ticker: 'GGAL', buy: 65, hold: 25, sell: 10 },
    { ticker: 'YPFD', buy: 55, hold: 30, sell: 15 },
    { ticker: 'PAMP', buy: 20, hold: 35, sell: 45 }
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard - InvAR</h1>
      
      {/* 4 Métricas Principales */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.metricTitle}>Merval</h3>
          <p style={styles.metricValue}>{mockMetrics.merval}</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.metricTitle}>Dólar MEP</h3>
          <p style={styles.metricValue}>{mockMetrics.dolarMep}</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.metricTitle}>Riesgo País</h3>
          <p style={styles.metricValue}>{mockMetrics.riesgoPais}</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.metricTitle}>Señal General</h3>
          <p style={{ ...styles.metricValue, ...styles.buy }}>{mockMetrics.senalGeneral}</p>
        </div>
      </div>

      {/* Top 3 Señales */}
      <h2 style={{marginTop: '30px'}}>Top 3 Señales del Día</h2>
      <div style={styles.signalsContainer}>
        {mockTopSignals.map((signal, index) => (
          <div key={index} style={{
              ...styles.signalRow, 
              borderBottom: index === mockTopSignals.length - 1 ? 'none' : '1px solid #eee'
            }}>
            <span style={styles.ticker}>{signal.ticker}</span>
            <div style={styles.signalStats}>
              <span style={styles.buy}>Comprar: {signal.buy}%</span>
              <span style={styles.hold}>Mantener: {signal.hold}%</span>
              <span style={styles.sell}>Vender: {signal.sell}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Estado del Backend (GET /api/health) */}
      <div style={styles.apiStatus}>
        <strong>Estado conexión Backend: </strong>
        {loadingHealth ? (
          <span>Cargando...</span>
        ) : (
          <pre style={{ margin: '10px 0 0 0', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(healthData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
