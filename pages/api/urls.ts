import redirects from '../../data/redirects.json';

export default function handler(req, res) {
  res.status(200).json(redirects);
}
