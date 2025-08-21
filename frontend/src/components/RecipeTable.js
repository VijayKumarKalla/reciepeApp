import { useEffect, useState } from 'react';
import { Box, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Typography, Rating, Paper } from '@mui/material';

export default function RecipeTable({ data, total, page, limit, onPageChange, onLimitChange, onRowClick, minLimit=15, maxLimit=50 }) {
  const [rowsPerPageOptions, setRowsPerPageOptions] = useState([15, 20, 30, 40, 50]);

  useEffect(() => {
    const filtered = rowsPerPageOptions.filter(v => v >= minLimit && v <= maxLimit);
    setRowsPerPageOptions(filtered);
  }, [minLimit, maxLimit]);

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '40%' }}>Title</TableCell>
            <TableCell>Cuisine</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Total Time (min)</TableCell>
            <TableCell>Serves</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>
                <Typography align="center" sx={{ py: 3 }}>No results found</Typography>
              </TableCell>
            </TableRow>
          )}
          {data.map((r) => (
            <TableRow key={r.id} hover onClick={() => onRowClick(r)} sx={{ cursor: 'pointer' }}>
              <TableCell>
                <Typography noWrap title={r.title}>{r.title}</Typography>
              </TableCell>
              <TableCell>{r.cuisine || '—'}</TableCell>
              <TableCell>
                <Rating value={Number(r.rating) || 0} precision={0.1} readOnly />
              </TableCell>
              <TableCell>{r.total_time ?? '—'}</TableCell>
              <TableCell>{r.serves || '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={total}
        page={Math.max(0, page - 1)}
        onPageChange={(e, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={limit}
        onRowsPerPageChange={(e) => onLimitChange(Number(e.target.value))}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </Paper>
  );
}
