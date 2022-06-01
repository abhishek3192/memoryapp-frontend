import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  CircularProgress,
  Divider,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory, Link } from 'react-router-dom';

import useStyles from './styles.js';
import { timeAgo } from '../../../utils/helpers.js';
import { getPost, getPostBySearch } from '../../../actions/posts.js';
import CommentSection from './CommentSection.jsx';
import jwtDecode from 'jwt-decode';

const dummyImage =
  'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png';

const PostDetails = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { post, posts, isLoading } = useSelector((state) => state?.posts);
  const history = useHistory();
  const { id } = useParams();
  const [user, setUser] = useState('');

  useEffect(() => {
    dispatch(getPost(id));
  }, [id]);

  useEffect(() => {
    if (post) {
      dispatch(getPostBySearch({ search: 'none', tags: post?.tags.join(',') }));
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('token'))?.token;

    if (user) {
      setUser(jwtDecode(user));
    }
  }, []);

  const openPost = (_id) => history.push(`/posts/${_id}`);

  if (!post) return null;

  if (isLoading) {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  const recommendedPosts = posts.filter(({ _id }) => _id !== post?._id);

  return (
    <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">
            {post.title}
          </Typography>
          <Typography
            gutterBottom
            variant="h6"
            color="textSecondary"
            component="h2"
          >
            {post.tags.map((tag, index) => (
              <Link
                to={`/tags/${tag}`}
                style={{ textDecoration: 'none', color: '#3f51b5' }}
                key={index}
              >
                {` #${tag} `}
              </Link>
            ))}
          </Typography>
          <Typography gutterBottom variant="body1" component="p">
            {post.message}
          </Typography>
          <Typography variant="h6">
            Created by:
            <Link
              to={`/creators/${post.name}`}
              style={{ textDecoration: 'none', color: '#3f51b5' }}
            >
              {` ${post.name}`}
            </Link>
          </Typography>
          <Typography variant="body1">{timeAgo(post?.createdAt)}</Typography>
          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="body1">
            <strong>Realtime Chat - coming soon!</strong>
          </Typography>
          <Divider style={{ margin: '20px 0' }} />
          <CommentSection post={post} user={user} />
          <Divider style={{ margin: '20px 0' }} />
        </div>
        <div className={classes.imageSection}>
          <img
            className={classes.media}
            src={post.selectedFile || dummyImage}
            alt={post.title}
          />
        </div>
      </div>
      {!!recommendedPosts.length && (
        <div className={classes.section}>
          <Typography gutterBottom variant="h5">
            You might also like:
          </Typography>
          <Divider />
          <div className={classes.recommendedPosts}>
            {recommendedPosts.map(
              ({ title, name, message, likes, selectedFile, _id }) => (
                <div
                  style={{ margin: '20px', cursor: 'pointer' }}
                  onClick={() => openPost(_id)}
                  key={_id}
                >
                  <Typography gutterBottom variant="h6">
                    {title}
                  </Typography>
                  <Typography gutterBottom variant="subtitle2">
                    {name}
                  </Typography>
                  <Typography gutterBottom variant="subtitle2">
                    {message}
                  </Typography>
                  <Typography gutterBottom variant="subtitle1">
                    Likes: {likes.length}
                  </Typography>
                  <img src={selectedFile} width="200px" />
                </div>
              )
            )}
          </div>
        </div>
      )}
    </Paper>
  );
};

export default PostDetails;
