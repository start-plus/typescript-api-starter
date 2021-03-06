import { Handler } from 'express';
import { authService } from '../services/AuthService';

export const register: Handler = async (req, res) => {
  const user = await authService.register(req.body);
  res.json(user);
};
