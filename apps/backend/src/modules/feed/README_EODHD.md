# EODHD Integration - Utilidad para Datos Históricos

Esta utilidad permite obtener datos históricos de la API de EODHD (End of Day Historical Data) para múltiples símbolos financieros.

## Configuración

### Variables de Entorno

Agregar la siguiente variable de entorno en tu archivo `.env`:

```env
EODHD_API_KEY=tu_api_key_aqui
```

Si no se proporciona la API key, se usará la clave de demostración (`demo`) que tiene limitaciones.

### Obtener API Key

1. Visita [EODHD.com](https://eodhd.com/financial-apis/api-for-historical-data-and-volumes)
2. Regístrate para obtener una API key gratuita (20 llamadas por día)
3. O actualiza a un plan de pago para mayor capacidad

## Endpoints Disponibles

### 1. Obtener Datos Históricos de un Símbolo

**GET** `/feed/eodhd/historical-data`

Obtiene N días de datos históricos para un símbolo específico.

**Parámetros de Query:**
- `symbol` (string, requerido): Símbolo del activo en formato `SYMBOL.EXCHANGE` (ej: `AAPL.US`)
- `days` (number, requerido): Número de días de datos históricos (1-3650)
- `period` (string, opcional): Período de los datos (`d`=daily, `w`=weekly, `m`=monthly). Default: `d`

**Ejemplo:**
```bash
GET /feed/eodhd/historical-data?symbol=AAPL.US&days=30&period=d
```

**Respuesta:**
```json
{
  "code": "AAPL.US",
  "exchange_short_name": "US",
  "exchange_long_name": "US",
  "name": "Apple Inc.",
  "type": "Common Stock",
  "country": "US",
  "currency": "USD",
  "data": [
    {
      "date": "2024-01-15",
      "open": 150.0,
      "high": 155.0,
      "low": 149.0,
      "close": 152.0,
      "adjusted_close": 152.0,
      "volume": 1000000
    }
  ]
}
```

### 2. Obtener Datos Históricos de Múltiples Símbolos

**POST** `/feed/eodhd/historical-data-multiple`

Obtiene N días de datos históricos para múltiples símbolos.

**Body:**
```json
{
  "symbols": ["AAPL.US", "TSLA.US", "MSFT.US"],
  "days": 30,
  "period": "d"
}
```

**Respuesta:**
```json
{
  "data": [
    {
      "code": "AAPL.US",
      "exchange_short_name": "US",
      "name": "Apple Inc.",
      "currency": "USD",
      "data": [...]
    }
  ],
  "total_symbols": 3,
  "successful_symbols": 2,
  "failed_symbols": 1
}
```

### 3. Obtener Último Precio de Cierre

**GET** `/feed/eodhd/last-price`

Obtiene el último precio de cierre de un símbolo.

**Parámetros de Query:**
- `symbol` (string, requerido): Símbolo del activo

**Ejemplo:**
```bash
GET /feed/eodhd/last-price?symbol=AAPL.US
```

**Respuesta:**
```json
{
  "symbol": "AAPL.US",
  "last_close_price": 152.50,
  "date": "2024-01-15"
}
```

### 4. Obtener Datos en Formato Interno

**GET** `/feed/eodhd/historical-data-internal`

Obtiene datos históricos convertidos al formato interno del sistema.

**Parámetros:** Igual que el endpoint de datos históricos individuales.

**Respuesta:**
```json
{
  "symbol": "AAPL.US",
  "exchange": "US",
  "name": "Apple Inc.",
  "currency": "USD",
  "data": [
    {
      "timestamp": 1705276800,
      "open": 150.0,
      "high": 155.0,
      "low": 149.0,
      "close": 152.0,
      "adjusted_close": 152.0,
      "volume": 1000000
    }
  ]
}
```

### 5. Obtener Datos Múltiples en Formato Interno

**POST** `/feed/eodhd/historical-data-multiple-internal`

Obtiene datos históricos de múltiples símbolos en formato interno.

**Body:** Igual que el endpoint de datos históricos múltiples.

### 6. Verificar Estado de la API

**GET** `/feed/eodhd/health`

Verifica si la API de EODHD está disponible.

**Respuesta:**
```json
{
  "status": "healthy",
  "message": "API de EODHD está funcionando correctamente",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Formatos de Símbolos Soportados

La API de EODHD soporta múltiples formatos de símbolos:

- **Acciones US**: `AAPL.US`, `TSLA.US`, `MSFT.US`
- **Criptomonedas**: `BTC-USD.CC`, `ETH-USD.CC`
- **Forex**: `EURUSD.FOREX`, `GBPUSD.FOREX`
- **Índices**: `GSPC.INDX` (S&P 500)
- **Commodities**: `GC.COMM` (Oro)

## Límites y Consideraciones

### Límites de API
- **Plan Gratuito**: 20 llamadas por día
- **Plan Básico**: 100,000 llamadas por día
- **Plan Avanzado**: Límites más altos

### Mejores Prácticas
1. **Cache**: Implementa caché para evitar llamadas repetitivas
2. **Rate Limiting**: Respeta los límites de la API
3. **Manejo de Errores**: Siempre maneja errores de red y API
4. **Validación**: Valida símbolos antes de hacer llamadas

### Ejemplo de Uso en Código

```typescript
// Inyectar el servicio
constructor(private readonly eodhdService: EODHDService) {}

// Obtener datos históricos
async getStockData(symbol: string, days: number) {
  try {
    const data = await this.eodhdService.getHistoricalData(symbol, days, 'd');
    return this.eodhdService.convertToInternalFormat(data);
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    throw error;
  }
}

// Obtener múltiples símbolos
async getMultipleStocks(symbols: string[], days: number) {
  try {
    const results = await this.eodhdService.getMultipleHistoricalData(symbols, days, 'd');
    return results.map(result => this.eodhdService.convertToInternalFormat(result));
  } catch (error) {
    console.error('Error obteniendo datos múltiples:', error);
    throw error;
  }
}
```

## Manejo de Errores

La utilidad maneja los siguientes tipos de errores:

- **401**: API key inválida
- **404**: Símbolo no encontrado
- **429**: Límite de API calls excedido
- **400**: Parámetros inválidos
- **500**: Error interno del servidor

Todos los errores se convierten en `BadRequestException` con mensajes descriptivos en español.

## Logging

La utilidad incluye logging detallado para:
- Llamadas a la API
- Errores de red
- Validaciones de parámetros
- Conversiones de formato

Los logs se pueden encontrar en los archivos de log del sistema con el prefijo `[EODHDService]` y `[GetEODHDHistoricalDataUseCase]`.
