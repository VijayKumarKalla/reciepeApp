import { useState } from 'react';
import { Box, TextField, MenuItem, Button } from '@mui/material';

const cuisines = []; 

export default function SearchFilters({ onSearch }) {
  const [title, setTitle] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [rating, setRating] = useState('');       
  const [totalTime, setTotalTime] = useState(''); 
  const [calories, setCalories] = useState('');   

  const submit = (e) => {
    e.preventDefault();
    onSearch({
      title: title || undefined,
      cuisine: cuisine || undefined,
      rating: rating || undefined,
      total_time: totalTime || undefined,
      calories: calories || undefined
    });
  };

  const clear = () => {
    setTitle('');
    setCuisine('');
    setRating('');
    setTotalTime('');
    setCalories('');
    onSearch({});
  };

  return (
    <Box component="form" onSubmit={submit} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
      <TextField label="Title contains" value={title} onChange={(e) => setTitle(e.target.value)} size="small" />
      <TextField label="Cuisine" value={cuisine} onChange={(e) => setCuisine(e.target.value)} size="small" select>
        <MenuItem value="">Any</MenuItem>
        {cuisines.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
      </TextField>
      <TextField label="Rating (e.g. >=4.5)" value={rating} onChange={(e) => setRating(e.target.value)} size="small" />
      <TextField label="Total Time (e.g. <=60)" value={totalTime} onChange={(e) => setTotalTime(e.target.value)} size="small" />
      <TextField label="Calories (e.g. <=400)" value={calories} onChange={(e) => setCalories(e.target.value)} size="small" />
      <Button type="submit" variant="contained">Search</Button>
      <Button onClick={clear}>Clear</Button>
    </Box>
  );
}
