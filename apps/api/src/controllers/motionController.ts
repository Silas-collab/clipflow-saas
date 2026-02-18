import { Request, Response } from 'express';

export const getMotionTemplates = async (req: Request, res: Response) => {
  const templates = [
    { id: 'zoom-in', name: 'Zoom In', type: 'effect' },
    { id: 'zoom-out', name: 'Zoom Out', type: 'effect' },
    { id: 'pan-left', name: 'Pan Left', type: 'transition' },
    { id: 'pan-right', name: 'Pan Right', type: 'transition' },
    { id: 'fade', name: 'Fade', type: 'transition' }
  ];
  res.json({ success: true, data: templates });
};

export const applyMotion = async (req: Request, res: Response) => {
  const { clipId, motionType, intensity } = req.body;
  res.json({ success: true, message: 'Motion applied', clipId, motionType, intensity });
};
