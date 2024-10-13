import express from 'express';
import pkg from 'pg';
const { Client } = pkg;

const app = express();
const port = 3000;

// Middleware para permitir el uso de JSON en las peticiones
app.use(express.json());

// Conectar a la base de datos PostgreSQL
const client = new Client({
    connectionString: 'postgresql://postgres.pyjyqizhoqvmsmawtsdt:nAdn1aHPKafvKdlXBnBz@aws-0-us-east-1.pooler.supabase.com:6543/postgres'
});

client.connect()
    .then(() => {
        console.log('Conectado a PostgreSQL');
    })
    .catch((error) => {
        console.error('Error conectando a PostgreSQL:', error);
    });

// Ruta para aumentar el número en 1
app.post('/incrementar', async (_, res) => {
    try {
        const query = `
            INSERT INTO contador (id, numero) VALUES (1, 1)
            ON CONFLICT (id) DO UPDATE SET numero = contador.numero + 1
            RETURNING numero;
        `;
        const result = await client.query(query);
        console.log('result: ', result)
        res.json({ numero: result.rows[0].numero });
    } catch (error) {
        console.log('error: ', error)
        res.status(500).json({ error: 'Error al incrementar el número' });
    }
});

// Ruta para mostrar el número actual
app.get('/numero', async (_, res) => {
    try {
        const result = await client.query('SELECT numero FROM contador LIMIT 1');
        console.log('result: ', result)
        res.json({ numero: result.rows.length ? result.rows[0].numero : 0 });
    } catch (error) {
        console.log('error: ', error)
        res.status(500).json({ error: 'Error al obtener el número' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

export default app;