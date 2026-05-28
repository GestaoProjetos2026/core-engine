import { Pool } from 'pg';

const connectionString = 'postgresql://user_core_engine:SenhaCore123!@localhost:5432/infra_banco'; // Fake string for typing test
const pool = new Pool({
  connectionString,
  options: '-c search_path="core_engine"'
});
console.log('Options passed to pool');
