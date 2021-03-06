import React, { useState } from 'react';
import {
  Container,
  Grid,
  Grow,
  Paper,
  AppBar,
  TextField,
  Button,
} from '@material-ui/core';

import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import { useDispatch } from 'react-redux';
import { getPostBySearch } from '../../actions/posts';
import { useLocation, useHistory } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';
import Paginate from '../../Pagination/Pagination';
import useStyles from './styles';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Home = () => {
  const dispatch = useDispatch();
  const query = useQuery();
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');
  const [currentId, setCurrentId] = useState(null);
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]);
  const classes = useStyles();
  const history = useHistory();

  const searchPost = () => {
    if (search.trim() || tags) {
      //dispatch some action
      dispatch(getPostBySearch({ search, tags: tags.join(',') }));
      history.push(
        `/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`
      );
    } else {
      history.push('/');
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPost();
    }
  };

  const handleAdd = (tag) => setTags([...tags, tag]);

  const handleDelete = (tagToDelete) =>
    setTags(tags.filter((tag) => tag !== tagToDelete));

  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid
          container
          justifyContent="space-between"
          alignItems="stretch"
          spacing={2}
          className={classes.gridContainer}
        >
          <Grid item xs={12} sm={7} md={9}>
            <Posts setCurrentId={setCurrentId} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBar
              className={classes.appBarSearch}
              position="static"
              color="inherit"
            >
              <TextField
                name="search"
                variant="outlined"
                label="Search Memories"
                fullWidth
                value={search}
                onKeyDown={handleKeyPress}
                onChange={(e) => setSearch(e.target.value)}
              />
              <ChipInput
                style={{ margin: '10px 0' }}
                value={tags}
                onAdd={(chip) => handleAdd(chip)}
                onDelete={handleDelete}
                label="Search Tags"
                variant="outlined"
              />
              <Button
                className={classes.searchButton}
                color="primary"
                onClick={searchPost}
                variant="contained"
              >
                Search
              </Button>
            </AppBar>
            <Form currentId={currentId} setCurrentId={setCurrentId} />
            {!searchQuery && !tags.length && (
              <Paper elevation={6} className={classes.pagination}>
                <Paginate page={page} />
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
