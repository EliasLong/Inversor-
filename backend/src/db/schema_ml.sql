CREATE TABLE eventos_politicos (
  id                BIGSERIAL PRIMARY KEY,
  fecha_evento      TIMESTAMPTZ NOT NULL,
  titulo            VARCHAR(500) NOT NULL,
  texto_completo    TEXT,
  fuente            VARCHAR(100) NOT NULL,
  url               VARCHAR(1000),
  tipo_evento       VARCHAR(30) NOT NULL,
  sector            VARCHAR(30) NOT NULL,
  sentiment_score   NUMERIC(4,3) NOT NULL CHECK (sentiment_score BETWEEN -1 AND 1),
  sentiment_fuente  VARCHAR(20) NOT NULL DEFAULT 'claude_api',
  regimen_politico  VARCHAR(30) NOT NULL,
  peso_entrenamiento NUMERIC(3,2) NOT NULL DEFAULT 1.0,
  tickers_afectados VARCHAR(20)[],
  verificado        BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices principales
CREATE INDEX idx_ep_fecha    ON eventos_politicos (fecha_evento DESC);
CREATE INDEX idx_ep_sector   ON eventos_politicos (sector, fecha_evento DESC);
CREATE INDEX idx_ep_regimen  ON eventos_politicos (regimen_politico);
CREATE INDEX idx_ep_tipo     ON eventos_politicos (tipo_evento);
CREATE INDEX idx_ep_verif    ON eventos_politicos (verificado) WHERE verificado = FALSE;

CREATE TABLE impacto_precios (
  id              BIGSERIAL PRIMARY KEY,
  evento_id       BIGINT NOT NULL REFERENCES eventos_politicos(id),
  ticker          VARCHAR(20) NOT NULL,
  precio_t0       NUMERIC(18,4) NOT NULL,
  precio_t24      NUMERIC(18,4),
  precio_t48      NUMERIC(18,4),
  precio_t72      NUMERIC(18,4),
  var_pct_24h     NUMERIC(8,4) GENERATED ALWAYS AS
    (ROUND((precio_t24 - precio_t0) / precio_t0 * 100, 4)) STORED,
  var_pct_48h     NUMERIC(8,4) GENERATED ALWAYS AS
    (ROUND((precio_t48 - precio_t0) / precio_t0 * 100, 4)) STORED,
  var_pct_72h     NUMERIC(8,4) GENERATED ALWAYS AS
    (ROUND((precio_t72 - precio_t0) / precio_t0 * 100, 4)) STORED,
  etiqueta        VARCHAR(10) GENERATED ALWAYS AS (
    CASE WHEN (precio_t48-precio_t0)/precio_t0*100 > 2  THEN 'SUBE'
         WHEN (precio_t48-precio_t0)/precio_t0*100 < -2 THEN 'BAJA'
         ELSE 'NEUTRO' END) STORED,
  merval_var_48h  NUMERIC(8,4),
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(evento_id, ticker)
);

CREATE TABLE predicciones_ml (
  id              BIGSERIAL PRIMARY KEY,
  evento_id       BIGINT NOT NULL REFERENCES eventos_politicos(id),
  ticker          VARCHAR(20) NOT NULL,
  prob_sube       NUMERIC(5,4) NOT NULL,
  prob_baja       NUMERIC(5,4) NOT NULL,
  prob_neutro     NUMERIC(5,4) NOT NULL,
  señal           VARCHAR(10) NOT NULL,
  confianza       NUMERIC(5,4) NOT NULL,
  modelo_version  VARCHAR(20) NOT NULL,
  features_json   JSONB,
  resultado_real  VARCHAR(10),
  acerto          BOOLEAN,
  generada_en     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE VIEW ml_dataset AS
SELECT
  ep.id,
  ep.fecha_evento,
  ep.tipo_evento,
  ep.sector,
  ep.sentiment_score,
  ep.regimen_politico,
  ep.peso_entrenamiento,
  EXTRACT(HOUR FROM ep.fecha_evento) AS hora_evento,
  ep.fuente,
  ip.ticker,
  ip.precio_t0,
  ip.var_pct_24h,
  ip.var_pct_48h,
  ip.var_pct_72h,
  ip.etiqueta,
  ip.merval_var_48h
FROM eventos_politicos ep
JOIN impacto_precios ip ON ip.evento_id = ep.id
WHERE ep.verificado = TRUE
  AND ep.peso_entrenamiento > 0
ORDER BY ep.fecha_evento DESC;
