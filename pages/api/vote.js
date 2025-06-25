import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { filename, userId, voteType } = req.body;
  if (!filename || !userId || !['up', 'down'].includes(voteType)) {
    return res.status(400).json({ error: 'Parâmetros inválidos' });
  }

  const filePath = path.join(process.cwd(), 'data', filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Arquivo não encontrado' });
  }

  let data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (!Array.isArray(data.up_votes)) data.up_votes = [];
  if (!Array.isArray(data.down_votes)) data.down_votes = [];

  // Remove o userId de ambos os arrays
  data.up_votes = data.up_votes.filter(id => id !== userId);
  data.down_votes = data.down_votes.filter(id => id !== userId);

  // Adiciona o voto se for marcar
  if (voteType === 'up') {
    data.up_votes.push(userId);
  } else if (voteType === 'down') {
    data.down_votes.push(userId);
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  return res.status(200).json({ success: true, up_votes: data.up_votes, down_votes: data.down_votes });
} 