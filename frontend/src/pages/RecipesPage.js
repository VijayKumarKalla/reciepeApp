import { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import { fetchRecipes, searchRecipes } from '../api/recipeApi';
import SearchFilters from '../components/SearchFilters';
import RecipeTable from '../components/RecipeTable';
import RecipeDrawer from '../components/RecipeDrawer';

export default function RecipesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeFilters, setActiveFilters] = useState(null);

  const loadPage = async (p = page, l = limit) => {
    if (activeFilters) {
      const res = await searchRecipes(activeFilters);
      setRows(res.data || []);
      setTotal(res.data?.length || 0);
    } else {
      const res = await fetchRecipes(p, l);
      setRows(res.data || []);
      setTotal(res.total || 0);
    }
  };

  useEffect(() => { loadPage(); /* eslint-disable-next-line */ }, [page, limit, activeFilters]);

  const onSearch = async (filters) => {
    // If any filter is provided, switch to search mode
    const hasFilters = Object.values(filters).some((v) => v !== undefined && v !== '');
    setActiveFilters(hasFilters ? filters : null);
    setPage(1);
  };

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Recipes</Typography>
      <SearchFilters onSearch={onSearch} />
      <RecipeTable
        data={rows}
        total={total}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onRowClick={setSelected}
        minLimit={15}
        maxLimit={50}
      />
      <RecipeDrawer open={!!selected} onClose={() => setSelected(null)} recipe={selected} />
    </Container>
  );
}
