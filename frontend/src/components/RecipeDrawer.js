import { Drawer, Box, Typography, IconButton, Collapse, Divider, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

export default function RecipeDrawer({ open, onClose, recipe }) {
  const [expandTime, setExpandTime] = useState(false);
  if (!recipe) return null;

  const n = recipe.nutrients || {};

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 420, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6">{recipe.title}</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 2 }}>{recipe.cuisine || '—'}</Typography>

        <Typography variant="subtitle2">Description</Typography>
        <Typography sx={{ mb: 2 }}>{recipe.description || '—'}</Typography>

        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => setExpandTime((v) => !v)}>
          Total Time: {recipe.total_time ?? '—'} mins
        </Typography>
        <Collapse in={expandTime}>
          <Typography sx={{ pl: 1 }}>Prep Time: {recipe.prep_time ?? '—'} mins</Typography>
          <Typography sx={{ pl: 1, mb: 2 }}>Cook Time: {recipe.cook_time ?? '—'} mins</Typography>
        </Collapse>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Nutrition</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Metric</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              ['calories', n.calories],
              ['carbohydrateContent', n.carbohydrateContent],
              ['cholesterolContent', n.cholesterolContent],
              ['fiberContent', n.fiberContent],
              ['proteinContent', n.proteinContent],
              ['saturatedFatContent', n.saturatedFatContent],
              ['sodiumContent', n.sodiumContent],
              ['sugarContent', n.sugarContent],
              ['fatContent', n.fatContent]
            ].map(([k, v]) => (
              <TableRow key={k}>
                <TableCell>{k}</TableCell>
                <TableCell>{v ?? '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Drawer>
  );
}
