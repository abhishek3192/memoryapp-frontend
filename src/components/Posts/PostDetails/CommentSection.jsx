import React, { useState, useRef, useEffect } from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import useStyles from './styles.js';
import { commentPost } from '../../../actions/posts.js';

const CommentSection = ({ post, user }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [comments, setComments] = useState(post?.comments);
  const [comment, setComment] = useState('');
  const commentRef = useRef();

  const handleClick = async () => {
    const newComments = await dispatch(
      commentPost(`${user?.name}: ${comment}`, post._id)
    );
    setComment('');
    setComments(newComments);

    commentRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <div className={classes.commentsOuterContainer}>
        <div className={classes.commentsInnerContainer}>
          {' '}
          <Typography gutterBottom variant="h6">
            Comments
          </Typography>
          {comments?.map((c, i) => (
            <Typography key={i} gutterBottom variant="subtitle1">
              <strong>{c.split(': ')[0]}</strong> : {c.split(': ')[1]}
            </Typography>
          ))}
          <div ref={commentRef} />
        </div>

        {user?.name && (
          <div style={{ width: '70%' }}>
            <Typography gutterBottom variant="h6">
              Write a Comment
            </Typography>
            <TextField
              fullWidth
              maxRows={4}
              variant="outlined"
              label="Comment"
              multiline
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              style={{ marginTop: '10px' }}
              fullWidth
              disabled={!comment.length}
              variant="contained"
              onClick={handleClick}
              color="primary"
            >
              Comment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
